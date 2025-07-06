import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Award,
  TrendingUp,
  Settings,
  Bell,
  Shield,
  CreditCard,
  TreePine,
  Recycle,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sustainability: true,
    rewards: true,
  });

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/profile" />
        <main className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to view your profile.
              </p>
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const profile = {
    name: user.name,
    email: user.email,
    phone: "+91 98765 43210", // Default for now
    location: "Mumbai, Maharashtra", // Default for now
    memberSince: user.memberSince,
  };

  const userStats = user;

  const recentBadges = [
    {
      name: "EcoShopper",
      icon: "🌿",
      description: "Made 10 sustainable purchases",
      earnedDate: "2024-01-20",
    },
    {
      name: "Offset Champion",
      icon: "🚴",
      description: "Offset delivery carbon 5 times",
      earnedDate: "2024-01-15",
    },
    {
      name: "Tree Planter",
      icon: "🌳",
      description: "Planted 3 trees through rewards",
      earnedDate: "2024-01-10",
    },
    {
      name: "Recycler",
      icon: "♻️",
      description: "Recycled 15+ items",
      earnedDate: "2024-01-05",
    },
    {
      name: "Green Starter",
      icon: "🌱",
      description: "Completed first eco purchase",
      earnedDate: "2024-01-01",
    },
  ];

  const sustainabilityGoals = [
    {
      title: "Reduce Carbon Footprint",
      current: 156.8,
      target: 200,
      unit: "kg CO₂ saved",
      icon: TrendingUp,
    },
    {
      title: "Plant Trees",
      current: 3,
      target: 5,
      unit: "trees planted",
      icon: TreePine,
    },
    {
      title: "Recycle Items",
      current: 18,
      target: 25,
      unit: "items recycled",
      icon: Recycle,
    },
    {
      title: "Earn EcoCredits",
      current: 1245,
      target: 2000,
      unit: "credits earned",
      icon: Leaf,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/profile" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            👤 Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account and track your sustainability journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{profile.name}</h2>
                <p className="text-muted-foreground mb-2">{profile.email}</p>
                <Badge className="bg-eco-500 text-white">
                  {userStats.currentLevel}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Member since {profile.memberSince}
                </p>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Current: {userStats.currentLevel}
                  </span>
                  <span className="text-sm font-medium">
                    {userStats.progressToNext}%
                  </span>
                </div>
                <Progress value={userStats.progressToNext} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Next level: {userStats.nextLevel}
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{userStats.ecoCredits}</p>
                    <p className="text-eco-100 text-sm">EcoCredits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userStats.co2SavedTotal}kg
                    </p>
                    <p className="text-eco-100 text-sm">CO₂ Saved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userStats.purchasesCount}
                    </p>
                    <p className="text-eco-100 text-sm">Purchases</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userStats.badgesEarned}
                    </p>
                    <p className="text-eco-100 text-sm">Badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={profile.name} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={profile.email} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={profile.phone} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          readOnly
                        />
                      </div>
                    </div>
                    <Button>Edit Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-eco-500" />
                      Sustainability Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-eco-50 rounded-lg">
                        <TreePine className="h-8 w-8 text-eco-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-eco-600">
                          {userStats.treesPlanted}
                        </p>
                        <p className="text-sm text-eco-600">Trees Planted</p>
                      </div>
                      <div className="text-center p-4 bg-earth-50 rounded-lg">
                        <Recycle className="h-8 w-8 text-earth-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-earth-600">
                          {userStats.recycledItems}
                        </p>
                        <p className="text-sm text-earth-600">Items Recycled</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {userStats.co2SavedThisMonth}kg
                        </p>
                        <p className="text-sm text-blue-600">CO₂ This Month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, push: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sustainability Tips</p>
                        <p className="text-sm text-muted-foreground">
                          Weekly eco-friendly suggestions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.sustainability}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            sustainability: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reward Updates</p>
                        <p className="text-sm text-muted-foreground">
                          New rewards and achievements
                        </p>
                      </div>
                      <Switch
                        checked={notifications.rewards}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            rewards: checked,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Goals Tab */}
              <TabsContent value="goals" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-eco-500" />
                      Sustainability Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {sustainabilityGoals.map((goal, index) => {
                      const Icon = goal.icon;
                      const progress = (goal.current / goal.target) * 100;
                      return (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-eco-500" />
                              <div>
                                <p className="font-medium">{goal.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {goal.current} / {goal.target} {goal.unit}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={progress >= 100 ? "default" : "outline"}
                            >
                              {progress.toFixed(0)}%
                            </Badge>
                          </div>
                          <Progress
                            value={Math.min(progress, 100)}
                            className="h-2"
                          />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Badges Tab */}
              <TabsContent value="badges" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Your Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recentBadges.map((badge, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-eco-50 rounded-lg border border-eco-200"
                        >
                          <div className="text-3xl">{badge.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-eco-700">
                              {badge.name}
                            </h3>
                            <p className="text-sm text-eco-600">
                              {badge.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Earned on{" "}
                              {new Date(badge.earnedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-eco-500">
                            <Award className="h-3 w-3 mr-1" />
                            Earned
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
