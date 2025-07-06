import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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

// Mock user data - in a real app this would come from a database
const mockUsers: Record<string, User> = {
  "alex@example.com": {
    id: "alex_1",
    name: "Alex Johnson",
    email: "alex@example.com",
    ecoCredits: 1245,
    co2SavedTotal: 156.8,
    co2SavedThisMonth: 12.4,
    purchasesCount: 42,
    recycledItems: 18,
    treesPlanted: 3,
    badgesEarned: ["EcoShopper", "Offset Champion", "Tree Planter"],
    memberSince: "January 2024",
    currentLevel: "Eco Champion",
    nextLevel: "Planet Protector",
    progressToNext: 75,
  },
};

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
    const savedUser = localStorage.getItem("ecocreds_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user exists
    if (mockUsers[email]) {
      const userData = mockUsers[email];
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("ecocreds_user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    if (mockUsers[email]) {
      return false; // User already exists
    }

    // Create new user with 0 stats
    const newUser = createNewUser(name, email);
    mockUsers[email] = newUser;

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("ecocreds_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("ecocreds_user");
  };

  const updateUserStats = (purchase: {
    ecoCredits: number;
    co2Saved: number;
    price: number;
  }) => {
    if (!user) return;

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

    // Update mock data and localStorage
    mockUsers[user.email] = updatedUser;
    setUser(updatedUser);
    localStorage.setItem("ecocreds_user", JSON.stringify(updatedUser));
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
