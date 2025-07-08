import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { userAPI, type ActivityData } from "../services/api";
import { useAuth } from "./AuthContext";

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Load activities from MongoDB when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      userAPI
        .getUserActivities(user.email, 50)
        .then((mongoActivities) => {
          const convertedActivities: Activity[] = mongoActivities.map(
            (activity) => ({
              id: activity.timestamp.toString(),
              type: activity.type,
              action: activity.action,
              item: activity.item,
              co2Saved: activity.co2Saved,
              ecoCredits: activity.ecoCredits,
              date: new Date(activity.timestamp).toISOString(),
              timestamp: activity.timestamp,
            }),
          );
          setActivities(convertedActivities);
          // Cache activities for offline access
          localStorage.setItem(
            "ecocreds_activities",
            JSON.stringify(convertedActivities),
          );
        })
        .catch((error) => {
          console.warn("API unavailable, using cached activities:", error);
          // Fallback to localStorage
          const saved = localStorage.getItem("ecocreds_activities");
          if (saved) {
            try {
              const cachedActivities = JSON.parse(saved);
              setActivities(cachedActivities);
            } catch (e) {
              console.error("Failed to parse cached activities:", e);
              setActivities([]);
            }
          }
        });
    } else {
      setActivities([]);
    }
  }, [isAuthenticated, user?.email]);

  const addActivity = async (
    activityData: Omit<Activity, "id" | "date" | "timestamp">,
  ) => {
    if (!user?.email) return;

    const newActivity: Activity = {
      ...activityData,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Add to MongoDB
    try {
      const mongoActivity: ActivityData = {
        action: activityData.action,
        item: activityData.item,
        co2Saved: activityData.co2Saved,
        ecoCredits: activityData.ecoCredits,
        timestamp: Date.now(),
        type: activityData.type,
      };

      await userAPI.addActivity(user.email, mongoActivity);

      // Update local state
      const updatedActivities = [newActivity, ...activities].slice(0, 50);
      setActivities(updatedActivities);
    } catch (error) {
      console.error("Error adding activity:", error);
      // Fallback to localStorage for offline support
      const saved = localStorage.getItem("ecocreds_activities");
      const localActivities = saved ? JSON.parse(saved) : [];
      const updatedActivities = [newActivity, ...localActivities].slice(0, 50);
      setActivities(updatedActivities);
      localStorage.setItem(
        "ecocreds_activities",
        JSON.stringify(updatedActivities),
      );
    }
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
