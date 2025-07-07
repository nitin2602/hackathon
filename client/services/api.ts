const API_BASE_URL = "/api";

export interface UserData {
  email: string;
  password: string;
  name: string;
  ecoCredits: number;
  co2SavedThisMonth: number;
  co2SavedTotal: number;
  purchasesCount: number;
  level: string;
  progressToNext: number;
  badgesEarned: string[];
}

export interface ActivityData {
  action: string;
  item: string;
  co2Saved?: number;
  ecoCredits: number;
  timestamp: number;
  type: "purchase" | "recycle" | "offset" | "reward" | "badge";
}

// User API functions
export const userAPI = {
  // Get user by email
  getUser: async (email: string): Promise<UserData | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${encodeURIComponent(email)}`,
      );
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  // Create or update user
  saveUser: async (userData: UserData): Promise<UserData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  },

  // Update user stats (incremental updates)
  updateUserStats: async (
    email: string,
    updates: Partial<
      Pick<
        UserData,
        "ecoCredits" | "co2SavedThisMonth" | "co2SavedTotal" | "purchasesCount"
      >
    >,
  ): Promise<UserData> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${encodeURIComponent(email)}/stats`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user stats:", error);
      throw error;
    }
  },

  // Add activity for user
  addActivity: async (email: string, activity: ActivityData): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${encodeURIComponent(email)}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activity),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add activity");
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      throw error;
    }
  },

  // Get user activities
  getUserActivities: async (
    email: string,
    limit = 10,
  ): Promise<ActivityData[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${encodeURIComponent(email)}/activities?limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  },
};
