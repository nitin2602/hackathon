import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { userAPI, type UserData } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  ecoCredits: number;
  co2SavedTotal: number;
  co2SavedThisMonth: number;
  purchasesCount: number;
  recycledItems: number;
  treesPlanted: number;
  badgesEarned: string[];
  memberSince: string;
  currentLevel: string;
  nextLevel: string;
  progressToNext: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserStats: (purchase: {
    ecoCredits: number;
    co2Saved: number;
    price: number;
  }) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createNewUser = (name: string, email: string): User => ({
  id: `user_${Date.now()}`,
  name,
  email,
  ecoCredits: 0,
  co2SavedTotal: 0,
  co2SavedThisMonth: 0,
  purchasesCount: 0,
  recycledItems: 0,
  treesPlanted: 0,
  badgesEarned: [],
  memberSince: new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
  currentLevel: "Eco Starter",
  nextLevel: "Green Shopper",
  progressToNext: 0,
});

// Convert MongoDB user data to frontend User interface
const convertUserData = (userData: UserData): User => {
  const levelInfo = calculateLevel(userData.ecoCredits);
  return {
    id: userData.email, // Using email as id for simplicity
    name: userData.name,
    email: userData.email,
    ecoCredits: userData.ecoCredits,
    co2SavedTotal: userData.co2SavedTotal,
    co2SavedThisMonth: userData.co2SavedThisMonth,
    purchasesCount: userData.purchasesCount,
    recycledItems: 0, // Not tracked in MongoDB yet
    treesPlanted: Math.floor(userData.co2SavedTotal / 50), // Estimate based on CO2 saved
    badgesEarned: userData.badgesEarned,
    memberSince: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    currentLevel: levelInfo.currentLevel,
    nextLevel: levelInfo.nextLevel,
    progressToNext: levelInfo.progressToNext,
  };
};

const calculateLevel = (
  ecoCredits: number,
): { currentLevel: string; nextLevel: string; progressToNext: number } => {
  if (ecoCredits >= 5000) {
    return {
      currentLevel: "Planet Protector",
      nextLevel: "Eco Master",
      progressToNext: Math.min(((ecoCredits - 5000) / 5000) * 100, 100),
    };
  } else if (ecoCredits >= 2000) {
    return {
      currentLevel: "Eco Champion",
      nextLevel: "Planet Protector",
      progressToNext: ((ecoCredits - 2000) / 3000) * 100,
    };
  } else if (ecoCredits >= 500) {
    return {
      currentLevel: "Green Shopper",
      nextLevel: "Eco Champion",
      progressToNext: ((ecoCredits - 500) / 1500) * 100,
    };
  } else if (ecoCredits >= 100) {
    return {
      currentLevel: "Eco Explorer",
      nextLevel: "Green Shopper",
      progressToNext: ((ecoCredits - 100) / 400) * 100,
    };
  } else {
    return {
      currentLevel: "Eco Starter",
      nextLevel: "Eco Explorer",
      progressToNext: (ecoCredits / 100) * 100,
    };
  }
};

const getBadges = (user: User): string[] => {
  const badges: string[] = [];

  if (user.purchasesCount >= 10) badges.push("EcoShopper");
  if (user.co2SavedTotal >= 50) badges.push("Offset Champion");
  if (user.treesPlanted >= 1) badges.push("Tree Planter");
  if (user.recycledItems >= 10) badges.push("Recycler");
  if (user.ecoCredits >= 100) badges.push("Green Starter");

  return badges;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUserEmail = localStorage.getItem("ecocreds_user_email");
    const fallbackUserData = localStorage.getItem("ecocreds_user_fallback");

    if (savedUserEmail) {
      // Try to load user data from MongoDB, fallback to localStorage
      userAPI
        .getUser(savedUserEmail)
        .then((userData) => {
          if (userData) {
            const convertedUser = convertUserData(userData);
            setUser(convertedUser);
            setIsAuthenticated(true);
            // Cache user data for offline access
            localStorage.setItem(
              "ecocreds_user_fallback",
              JSON.stringify(userData),
            );
          } else {
            localStorage.removeItem("ecocreds_user_email");
          }
        })
        .catch((error) => {
          console.warn("API unavailable, using fallback data:", error);
          // Use cached data if API is unavailable
          if (fallbackUserData) {
            try {
              const userData = JSON.parse(fallbackUserData);
              const convertedUser = convertUserData(userData);
              setUser(convertedUser);
              setIsAuthenticated(true);
            } catch (e) {
              console.error("Failed to parse fallback data:", e);
              localStorage.removeItem("ecocreds_user_email");
              localStorage.removeItem("ecocreds_user_fallback");
            }
          }
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if user exists in MongoDB
      const userData = await userAPI.getUser(email);

      if (userData && userData.password === password) {
        const convertedUser = convertUserData(userData);
        setUser(convertedUser);
        setIsAuthenticated(true);
        localStorage.setItem("ecocreds_user_email", email);
        localStorage.setItem(
          "ecocreds_user_fallback",
          JSON.stringify(userData),
        );
        return true;
      }

      return false;
    } catch (error) {
      console.warn("API unavailable, using fallback authentication:", error);

      // Demo user fallback for alex@example.com when API is unavailable
      if (email === "alex@example.com" && password === "password") {
        const demoUser: UserData = {
          email: "alex@example.com",
          password: "password",
          name: "Alex Johnson",
          ecoCredits: 1245,
          co2SavedThisMonth: 12.4,
          co2SavedTotal: 156.8,
          purchasesCount: 42,
          level: "Eco Champion",
          progressToNext: 75,
          badgesEarned: ["EcoShopper", "Offset Champion", "Tree Planter"],
        };

        const convertedUser = convertUserData(demoUser);
        setUser(convertedUser);
        setIsAuthenticated(true);
        localStorage.setItem("ecocreds_user_email", email);
        localStorage.setItem(
          "ecocreds_user_fallback",
          JSON.stringify(demoUser),
        );
        return true;
      }

      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = await userAPI.getUser(email);
      if (existingUser) {
        return false; // User already exists
      }

      // Create new user in MongoDB
      const newUserData: UserData = {
        email,
        password,
        name,
        ecoCredits: 0,
        co2SavedThisMonth: 0,
        co2SavedTotal: 0,
        purchasesCount: 0,
        level: "Eco Starter",
        progressToNext: 0,
        badgesEarned: [],
      };

      await userAPI.saveUser(newUserData);
      const convertedUser = convertUserData(newUserData);

      setUser(convertedUser);
      setIsAuthenticated(true);
      localStorage.setItem("ecocreds_user_email", email);
      localStorage.setItem(
        "ecocreds_user_fallback",
        JSON.stringify(newUserData),
      );
      return true;
    } catch (error) {
      console.warn("API unavailable, using offline signup:", error);

      // Fallback: create user locally when API is unavailable
      const newUserData: UserData = {
        email,
        password,
        name,
        ecoCredits: 0,
        co2SavedThisMonth: 0,
        co2SavedTotal: 0,
        purchasesCount: 0,
        level: "Eco Starter",
        progressToNext: 0,
        badgesEarned: [],
      };

      const convertedUser = convertUserData(newUserData);
      setUser(convertedUser);
      setIsAuthenticated(true);
      localStorage.setItem("ecocreds_user_email", email);
      localStorage.setItem(
        "ecocreds_user_fallback",
        JSON.stringify(newUserData),
      );
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("ecocreds_user_email");
  };

  const updateUserStats = async (purchase: {
    ecoCredits: number;
    co2Saved: number;
    price: number;
  }) => {
    if (!user) return;

    try {
      // Update user stats in MongoDB
      await userAPI.updateUserStats(user.email, {
        ecoCredits: purchase.ecoCredits,
        co2SavedTotal: purchase.co2Saved,
        co2SavedThisMonth: purchase.co2Saved,
        purchasesCount: 1,
      });

      // Update local state
      const updatedUser: User = {
        ...user,
        ecoCredits: user.ecoCredits + purchase.ecoCredits,
        co2SavedTotal: user.co2SavedTotal + purchase.co2Saved,
        co2SavedThisMonth: user.co2SavedThisMonth + purchase.co2Saved,
        purchasesCount: user.purchasesCount + 1,
      };

      // Update level based on new EcoCredits
      const levelInfo = calculateLevel(updatedUser.ecoCredits);
      updatedUser.currentLevel = levelInfo.currentLevel;
      updatedUser.nextLevel = levelInfo.nextLevel;
      updatedUser.progressToNext = levelInfo.progressToNext;

      // Update badges
      updatedUser.badgesEarned = getBadges(updatedUser);

      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUserStats,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
