import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
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

export default function Index() {
  // Mock user data - in a real app this would come from auth context
  const userStats = {
    name: "Alex Johnson",
    ecoCredits: 1245,
    co2SavedThisMonth: 12.4,
    co2SavedLifetime: 156.8,
    recentPurchases: 8,
    nextRewardProgress: 75,
    nextReward: "₹50 Walmart Coupon",
    badges: [
      { name: "EcoShopper", icon: "🌿", earned: true },
      { name: "Offset Champion", icon: "🚴", earned: true },
      { name: "Tree Planter", icon: "🌳", earned: false },
    ],
  };

  const recentActivity = [
    {
      id: 1,
      action: "Purchased",
      item: "Recycled Notebook",
      co2Saved: 0.4,
      ecoCredits: 25,
      date: "2 hours ago",
    },
    {
      id: 2,
      action: "Offset Delivery",
      item: "Eco-friendly cleaning supplies",
      co2Saved: 0.8,
      ecoCredits: 5,
      date: "1 day ago",
    },
    {
      id: 3,
      action: "Recycled",
      item: "Plastic bottles x5",
      co2Saved: 0.2,
      ecoCredits: 15,
      date: "3 days ago",
    },
  ];

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
      <Navbar currentPath="/" ecoCredits={userStats.ecoCredits} cartCount={2} />

      <main className="container mx-auto px-4 py-8">
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
                    {userStats.co2SavedThisMonth}kg
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
                    {userStats.co2SavedLifetime}kg
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
              <Button className="w-full" variant="outline">
                <Gift className="h-4 w-4 mr-2" />
                View All Rewards
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
                    <a href={action.href}>
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
                    </a>
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
