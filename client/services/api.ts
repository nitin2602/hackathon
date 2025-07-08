const API_BASE_URL = "/api";

// Check if API is available
const isAPIAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn("API health check failed:", error);
    return false;
  }
};

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

export interface MarketplaceItemData {
  _id?: string;
  sellerId?: string;
  sellerName: string;
  sellerEmail: string;
  name: string;
  category: string;
  condition: "excellent" | "good" | "fair" | "poor";
  description: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage?: number;
  ecoScore?: number;
  images?: string[];
  status?: "available" | "sold" | "removed";
  views?: number;
  createdAt?: string;
  updatedAt?: string;
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

// Marketplace API functions
export const marketplaceAPI = {
  // Get all marketplace items with optional filters
  getItems: async (filters?: {
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit?: number;
  }): Promise<MarketplaceItemData[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.condition) params.append("condition", filters.condition);
      if (filters?.minPrice)
        params.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
      if (filters?.search) params.append("search", filters.search);
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/marketplace?${params.toString()}`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(
          `Failed to fetch marketplace items: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
      return [];
    }
  },

  // Get items by seller email
  getSellerItems: async (email: string): Promise<MarketplaceItemData[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/seller/${encodeURIComponent(email)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch seller items");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching seller items:", error);
      return [];
    }
  },

  // Create new marketplace item
  createItem: async (
    itemData: MarketplaceItemData,
  ): Promise<MarketplaceItemData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error("Failed to create marketplace item");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating marketplace item:", error);
      throw error;
    }
  },

  // Update marketplace item
  updateItem: async (
    itemId: string,
    updates: Partial<MarketplaceItemData>,
  ): Promise<MarketplaceItemData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update marketplace item");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating marketplace item:", error);
      throw error;
    }
  },

  // Delete marketplace item
  deleteItem: async (itemId: string, sellerEmail: string): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/${itemId}?sellerEmail=${encodeURIComponent(sellerEmail)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete marketplace item");
      }
    } catch (error) {
      console.error("Error deleting marketplace item:", error);
      throw error;
    }
  },

  // Increment view count
  incrementViews: async (itemId: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/marketplace/${itemId}/view`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  },
};
