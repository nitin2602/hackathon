import React, { createContext, useContext, useState, ReactNode } from "react";

interface Activity {
  id: string;
  type: "purchase" | "recycle" | "offset" | "reward" | "signup" | "badge";
  action: string;
  item: string;
  co2Saved?: number;
  ecoCredits: number;
  date: string;
  timestamp: number;
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "date" | "timestamp">) => void;
  getRecentActivities: (limit?: number) => Activity[];
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined,
);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem("ecocreds_activities");
    return saved ? JSON.parse(saved) : [];
  });

  const addActivity = (
    activityData: Omit<Activity, "id" | "date" | "timestamp">,
  ) => {
    const newActivity: Activity = {
      ...activityData,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 50); // Keep only last 50 activities
    setActivities(updatedActivities);
    localStorage.setItem(
      "ecocreds_activities",
      JSON.stringify(updatedActivities),
    );
  };

  const getRecentActivities = (limit = 10) => {
    return activities.slice(0, limit);
  };

  const clearActivities = () => {
    setActivities([]);
    localStorage.removeItem("ecocreds_activities");
  };

  const value: ActivityContextType = {
    activities,
    addActivity,
    getRecentActivities,
    clearActivities,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
