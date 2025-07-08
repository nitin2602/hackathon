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

  // Load activities from localStorage or create demo data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      // First try to load from localStorage
      const saved = localStorage.getItem(`ecocreds_activities_${user.email}`);
      if (saved) {
        try {
          const cachedActivities = JSON.parse(saved);
          setActivities(cachedActivities);
          return;
        } catch (e) {
          console.error("Failed to parse cached activities:", e);
        }
      }

      // Create some demo activities for new users or when cache is empty
      const demoActivities: Activity[] = [
        {
          id: "demo_1",
          type: "purchase",
          action: "Purchased",
          item: "Organic Cotton T-shirt",
          co2Saved: 2.3,
          ecoCredits: 45,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        },
        {
          id: "demo_2",
          type: "recycle",
          action: "Recycled",
          item: "Plastic Bottles (x5)",
          co2Saved: 0.8,
          ecoCredits: 15,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        },
        {
          id: "demo_3",
          type: "badge",
          action: "Earned badge",
          item: "EcoShopper",
          ecoCredits: 100,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        },
      ];

      setActivities(demoActivities);
      localStorage.setItem(
        `ecocreds_activities_${user.email}`,
        JSON.stringify(demoActivities),
      );

      // Try to load from MongoDB if API is available (but don't block the UI)
      userAPI
        .getUserActivities(user.email, 50)
        .then((mongoActivities) => {
          if (mongoActivities.length > 0) {
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
            localStorage.setItem(
              `ecocreds_activities_${user.email}`,
              JSON.stringify(convertedActivities),
            );
          }
        })
        .catch((error) => {
          console.warn("API unavailable, using local activities:", error);
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

    // Update local state first
    const updatedActivities = [newActivity, ...activities].slice(0, 50);
    setActivities(updatedActivities);

    // Save to localStorage immediately
    localStorage.setItem(
      `ecocreds_activities_${user.email}`,
      JSON.stringify(updatedActivities),
    );

    // Try to add to MongoDB if API is available (but don't block the UI)
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
    } catch (error) {
      console.warn("API unavailable, activity saved locally:", error);
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
