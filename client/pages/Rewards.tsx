import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gift,
  TreePine,
  ShoppingBag,
  Truck,
  Award,
  Leaf,
  Coins,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useActivity } from "@/context/ActivityContext";

interface Reward {
  id: string;
  name: string;
  description: string;
  ecoCreditsRequired: number;
  type: "coupon" | "environmental" | "delivery" | "cart_credit";
  icon: React.ElementType;
  available: boolean;
  timeLeft?: string;
  popular?: boolean;
  minOrderValue?: number;
  creditValue?: number;
}

const mockRewards: Reward[] = [
  {
    id: "1",
    name: "₹50 Walmart Coupon",
    description: "Use on your next purchase of ₹500 or more",
    ecoCreditsRequired: 100,
    type: "coupon",
    icon: ShoppingBag,
    available: true,
    popular: true,
  },
  {
    id: "2",
    name: "₹20 Cart Credits",
    description: "Apply ₹20 off on orders above ₹500",
    ecoCreditsRequired: 50,
    type: "cart_credit",
    icon: Coins,
    available: true,
    popular: true,
    minOrderValue: 500,
    creditValue: 20,
  },
  {
    id: "3",
    name: "₹50 Cart Credits",
    description: "Apply ₹50 off on orders above ₹1000",
    ecoCreditsRequired: 120,
    type: "cart_credit",
    icon: Coins,
    available: true,
    minOrderValue: 1000,
    creditValue: 50,
  },
  {
    id: "4",
    name: "₹100 Cart Credits",
    description: "Apply ₹100 off on orders above ₹2000",
    ecoCreditsRequired: 250,
    type: "cart_credit",
    icon: Coins,
    available: true,
    minOrderValue: 2000,
    creditValue: 100,
  },
  {
    id: "5",
    name: "Plant a Tree",
    description: "We'll plant a tree in your name through our partner NGO",
    ecoCreditsRequired: 80,
    type: "environmental",
    icon: TreePine,
    available: true,
  },
  {
    id: "6",
    name: "Free Express Delivery",
    description: "Get free express delivery on your next 3 orders",
    ecoCreditsRequired: 150,
    type: "delivery",
    icon: Truck,
    available: true,
  },
  {
    id: "7",
    name: "Ocean Cleanup Donation",
    description: "Support ocean cleanup efforts with ₹100 donation",
    ecoCreditsRequired: 120,
    type: "environmental",
    icon: Award,
    available: true,
  },
  {
    id: "8",
    name: "₹250 Premium Credits",
    description: "Premium cart credits for dedicated eco-shoppers",
    ecoCreditsRequired: 500,
    type: "cart_credit",
    icon: Gift,
    available: true,
    minOrderValue: 3000,
    creditValue: 250,
  },
];

interface RedemptionHistory {
  id: string;
  rewardName: string;
  redeemedAt: string;
  ecoCreditsUsed: number;
  status: "completed" | "pending";
}

const mockRedemptionHistory: RedemptionHistory[] = [
  {
    id: "1",
    rewardName: "₹50 Walmart Coupon",
    redeemedAt: "2024-01-15",
    ecoCreditsUsed: 100,
    status: "completed",
  },
  {
    id: "2",
    rewardName: "Plant a Tree",
    redeemedAt: "2024-01-10",
    ecoCreditsUsed: 80,
    status: "completed",
  },
  {
    id: "3",
    rewardName: "Free Express Delivery",
    redeemedAt: "2024-01-08",
    ecoCreditsUsed: 150,
    status: "pending",
  },
];

export default function Rewards() {
  const { user, isAuthenticated } = useAuth();
  const { addActivity } = useActivity();
  const [showHistory, setShowHistory] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [availableCartCredits, setAvailableCartCredits] = useState<any[]>([]);

  const currentEcoCredits = user?.ecoCredits || 0;

  // Load available cart credits
  useEffect(() => {
    const cartCredits = JSON.parse(
      localStorage.getItem("ecocreds_cart_credits") || "[]",
    );
    const unusedCredits = cartCredits.filter((credit: any) => !credit.used);
    setAvailableCartCredits(unusedCredits);
  }, [redeemedRewards]);

  const handleRedeem = (reward: Reward) => {
    if (currentEcoCredits >= reward.ecoCreditsRequired && user) {
      // Store redeemed cart credits in localStorage for cart to use
      if (reward.type === "cart_credit") {
        const cartCredits = JSON.parse(
          localStorage.getItem("ecocreds_cart_credits") || "[]",
        );
        const newCredit = {
          id: `credit_${Date.now()}`,
          name: reward.name,
          value: reward.creditValue,
          minOrderValue: reward.minOrderValue,
          redeemed: new Date().toISOString(),
          used: false,
        };
        cartCredits.push(newCredit);
        localStorage.setItem(
          "ecocreds_cart_credits",
          JSON.stringify(cartCredits),
        );
      }

      // Add to redeemed list
      setRedeemedRewards([...redeemedRewards, reward.id]);

      // Add activity
      addActivity({
        type: "reward",
        action: "Redeemed",
        item: reward.name,
        ecoCredits: -reward.ecoCreditsRequired, // Negative because it's spent
      });

      // Show success message
      alert(
        reward.type === "cart_credit"
          ? `✅ Cart credits redeemed! ₹${reward.creditValue} has been added to your available credits. Use them at checkout.`
          : `✅ ${reward.name} redeemed successfully!`,
      );
    }
  };

  const canAfford = (required: number) => currentEcoCredits >= required;
  const isRedeemed = (rewardId: string) => redeemedRewards.includes(rewardId);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/rewards" />
        <main className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to view and redeem your EcoCredits rewards.
              </p>
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/rewards" />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🎁 EcoCredits Rewards
          </h1>
          <p className="text-muted-foreground">
            Redeem your EcoCredits for exciting rewards and make an even bigger
            environmental impact
          </p>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 bg-gradient-to-r from-eco-500 to-eco-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Your EcoCredits Balance
                </h2>
                <p className="text-4xl font-bold">
                  {currentEcoCredits.toLocaleString()}
                </p>
                <p className="text-eco-100 mt-2">
                  Earned through sustainable shopping choices
                </p>
              </div>
              <div className="text-right">
                <Coins className="h-16 w-16 text-eco-200 mb-2" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? "Hide" : "View"} History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Cart Credits */}
        {availableCartCredits.length > 0 && (
          <Card className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Coins className="h-5 w-5" />
                Your Available Cart Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCartCredits.map((credit, index) => (
                  <div
                    key={credit.id}
                    className="p-4 bg-white rounded-lg border border-purple-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-500">
                        ₹{credit.value} OFF
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Unused
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{credit.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Min order: ₹{credit.minOrderValue}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      💡 Will be auto-applied at checkout
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  💰 Total Credits Available: ₹
                  {availableCartCredits.reduce(
                    (sum, credit) => sum + credit.value,
                    0,
                  )}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  These credits will be automatically applied to eligible orders
                  during checkout.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Redemption History */}
        {showHistory && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Redemption History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockRedemptionHistory.length > 0 ? (
                <div className="space-y-3">
                  {mockRedemptionHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-eco-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">{item.rewardName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.redeemedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">
                          -{item.ecoCreditsUsed} EcoCredits
                        </p>
                        <Badge
                          variant={
                            item.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No redemptions yet. Start earning EcoCredits to unlock
                  rewards!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Rewards Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-background">
              All Rewards
            </Badge>
            <Badge variant="outline">
              <Coins className="h-3 w-3 mr-1" />
              Cart Credits
            </Badge>
            <Badge variant="outline">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Coupons
            </Badge>
            <Badge variant="outline">
              <TreePine className="h-3 w-3 mr-1" />
              Environmental
            </Badge>
            <Badge variant="outline">
              <Truck className="h-3 w-3 mr-1" />
              Delivery
            </Badge>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockRewards.map((reward) => {
            const Icon = reward.icon;
            const affordable = canAfford(reward.ecoCreditsRequired);

            return (
              <Card
                key={reward.id}
                className={`relative overflow-hidden transition-all duration-200 ${
                  affordable && reward.available
                    ? "hover:shadow-lg hover:-translate-y-1"
                    : "opacity-60"
                }`}
              >
                {reward.popular && (
                  <div className="absolute top-0 right-0 bg-reward text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg ${
                        reward.type === "environmental"
                          ? "bg-eco-100 text-eco-600"
                          : reward.type === "coupon"
                            ? "bg-blue-100 text-blue-600"
                            : reward.type === "cart_credit"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {reward.ecoCreditsRequired}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        EcoCredits
                      </p>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                    {reward.type === "cart_credit" &&
                      reward.minOrderValue &&
                      reward.creditValue && (
                        <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-xs text-purple-700 font-medium">
                            💰 Get ₹{reward.creditValue} off • Min order: ₹
                            {reward.minOrderValue}
                          </p>
                          <p className="text-xs text-purple-600">
                            Credits will be applied to your cart automatically
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Progress bar for affordability */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>
                        {Math.min(
                          (currentEcoCredits / reward.ecoCreditsRequired) * 100,
                          100,
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        (currentEcoCredits / reward.ecoCreditsRequired) * 100,
                        100,
                      )}
                      className="h-2"
                    />
                  </div>

                  <Button
                    onClick={() => handleRedeem(reward)}
                    disabled={
                      !affordable || !reward.available || isRedeemed(reward.id)
                    }
                    className="w-full"
                    variant={
                      isRedeemed(reward.id)
                        ? "secondary"
                        : affordable && reward.available
                          ? "default"
                          : "outline"
                    }
                  >
                    {isRedeemed(reward.id)
                      ? "✅ Redeemed"
                      : !reward.available
                        ? reward.timeLeft || "Unavailable"
                        : !affordable
                          ? `Need ${reward.ecoCreditsRequired - currentEcoCredits} more`
                          : "Redeem Now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How to Earn More */}
        <Card className="bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-eco-700">
              <Leaf className="h-5 w-5" />
              How to Earn More EcoCredits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <ShoppingBag className="h-8 w-8 text-eco-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Shop Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Earn credits for every sustainable product you purchase
                </p>
              </div>
              <div className="text-center p-4">
                <TreePine className="h-8 w-8 text-eco-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Recycle Items</h3>
                <p className="text-sm text-muted-foreground">
                  Return items to earn credits and reduce waste
                </p>
              </div>
              <div className="text-center p-4">
                <Truck className="h-8 w-8 text-eco-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Offset Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Choose carbon-neutral delivery options
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
