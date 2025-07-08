import { Navbar } from "@/components/ui/navbar";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useActivity } from "@/context/ActivityContext";
import {
  Leaf,
  TrendingUp,
  Award,
  ShoppingBag,
  TreePine,
  Recycle,
  BarChart3,
  Target,
  Star,
  Gift,
} from "lucide-react";

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  const { getRecentActivities } = useActivity();

  // If not authenticated, redirect to login or show public page
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/" />
        <main className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to EcoCreds! 🌱
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Start your sustainable shopping journey today. Track your carbon
              footprint, earn EcoCredits, and make a positive impact on the
              planet.
            </p>

            {/* Demo Credentials */}
            <Card className="mb-8 bg-eco-50 border-eco-200">
              <CardHeader>
                <CardTitle className="text-eco-700">Try the Demo</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="text-sm text-muted-foreground mb-4">
                  Use these demo credentials to explore the app:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <strong>Email:</strong> alex@example.com
                    <br />
                    <strong>Password:</strong> password
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <strong>Email:</strong> demo@example.com
                    <br />
                    <strong>Password:</strong> demo
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const userStats = {
    name: user.name,
    ecoCredits: user.ecoCredits,
    co2SavedThisMonth: user.co2SavedThisMonth,
    co2SavedLifetime: user.co2SavedTotal,
    recentPurchases: user.purchasesCount,
    nextRewardProgress: user.progressToNext,
    nextReward: "₹50 Walmart Coupon",
    badges: user.badgesEarned.map((badge) => ({
      name: badge,
      icon:
        badge === "EcoShopper"
          ? "🌿"
          : badge === "Offset Champion"
            ? "🚴"
            : badge === "Tree Planter"
              ? "🌳"
              : badge === "Recycler"
                ? "♻️"
                : "🌱",
      earned: true,
    })),
  };

  const recentActivity = getRecentActivities(5).map((activity) => ({
    id: activity.id,
    action: activity.action,
    item: activity.item,
    co2Saved: activity.co2Saved || 0,
    ecoCredits: activity.ecoCredits,
    date: getTimeAgo(activity.timestamp),
  }));

  const quickActions = [
    {
      title: "Browse Products",
      description: "Find eco-friendly alternatives",
      icon: ShoppingBag,
      color: "bg-eco-500",
      href: "/products",
    },
    {
      title: "Recycle Items",
      description: "Return items for EcoCredits",
      icon: Recycle,
      color: "bg-earth-500",
      href: "/recycle",
    },
    {
      title: "View Rewards",
      description: "Redeem your EcoCredits",
      icon: Gift,
      color: "bg-reward",
      href: "/rewards",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/" />

      <main className="container mx-auto px-4 py-8">
        <OfflineBanner />
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userStats.name}! 🌱
          </h1>
          <p className="text-muted-foreground">
            You've made a real difference this month. Keep up the great work!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-eco-100 text-sm">EcoCredits</p>
                  <p className="text-2xl font-bold">
                    {userStats.ecoCredits.toLocaleString()}
                  </p>
                </div>
                <Leaf className="h-8 w-8 text-eco-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    CO₂ Saved This Month
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.co2SavedThisMonth.toFixed(2)}kg
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-eco-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Lifetime CO₂ Saved
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.co2SavedLifetime.toFixed(2)}kg
                  </p>
                </div>
                <TreePine className="h-8 w-8 text-earth-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Recent Purchases
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.recentPurchases}
                  </p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress to Next Reward */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Progress to Next Reward
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {userStats.nextReward}
                </span>
                <span className="text-sm font-medium">
                  {userStats.nextRewardProgress}%
                </span>
              </div>
              <Progress value={userStats.nextRewardProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Earn {100 - userStats.nextRewardProgress} more EcoCredits to
                unlock your reward!
              </p>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/rewards">
                  <Gift className="h-4 w-4 mr-2" />
                  View All Rewards
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-4"
                    asChild
                  >
                    <Link to={action.href}>
                      <div
                        className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {userStats.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg border-2 transition-all ${
                      badge.earned
                        ? "border-eco-300 bg-eco-50"
                        : "border-muted bg-muted/30"
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <p
                      className={`text-sm font-medium ${
                        badge.earned ? "text-eco-700" : "text-muted-foreground"
                      }`}
                    >
                      {badge.name}
                    </p>
                    {badge.earned && (
                      <Badge className="mt-2 bg-eco-500">
                        <Star className="h-3 w-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {activity.action} {activity.item}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-eco-600">
                      +{activity.ecoCredits} EcoCredits
                    </p>
                    <p className="text-xs text-muted-foreground">
                      -{activity.co2Saved}kg CO₂
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
