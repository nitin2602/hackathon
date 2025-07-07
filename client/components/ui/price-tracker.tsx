import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Bell,
  Eye,
  Calendar,
  DollarSign,
  Mail,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

interface PricePoint {
  date: string;
  price: number;
}

interface PriceTrackerProps {
  productId: string;
  productName: string;
  currentPrice: number;
  priceHistory: PricePoint[];
  className?: string;
}

export function PriceTracker({
  productId,
  productName,
  currentPrice,
  priceHistory,
  className,
}: PriceTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState({
    enabled: false,
    email: "",
    targetPrice: "",
    frequency: "daily",
  });
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Calculate price statistics
  const prices = priceHistory.map((p) => p.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice =
    prices.reduce((sum, price) => sum + price, 0) / prices.length;

  // Calculate price change from last period
  const lastPrice =
    priceHistory.length > 1
      ? priceHistory[priceHistory.length - 2].price
      : currentPrice;
  const priceChange = currentPrice - lastPrice;
  const priceChangePercent =
    lastPrice > 0 ? (priceChange / lastPrice) * 100 : 0;

  // Check if it's lowest in 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentPrices = priceHistory.filter(
    (p) => new Date(p.date) >= thirtyDaysAgo,
  );
  const lowestInThirtyDays = Math.min(
    ...recentPrices.map((p) => p.price),
    currentPrice,
  );
  const isLowestInThirtyDays = currentPrice === lowestInThirtyDays;

  // Simple chart representation
  const maxPrice = Math.max(...prices, currentPrice);
  const minPrice = Math.min(...prices, currentPrice);
  const priceRange = maxPrice - minPrice;

  const getChartHeight = (price: number) => {
    if (priceRange === 0) return 50;
    return ((price - minPrice) / priceRange) * 80 + 10;
  };

  const getTrendIcon = () => {
    if (priceChange > 0) return TrendingUp;
    if (priceChange < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (priceChange > 0) return "text-red-500";
    if (priceChange < 0) return "text-eco-500";
    return "text-muted-foreground";
  };

  const TrendIcon = getTrendIcon();

  const handleEmailAlert = () => {
    if (!emailAlerts.email) {
      setShowEmailSetup(true);
      return;
    }

    // Simulate API call to set up email alerts
    setTimeout(() => {
      setEmailAlerts({ ...emailAlerts, enabled: true });
      setEmailSubmitted(true);
      setTimeout(() => setEmailSubmitted(false), 3000);
    }, 1000);
  };

  const handleEmailSetup = () => {
    if (emailAlerts.email && emailAlerts.targetPrice) {
      setEmailAlerts({ ...emailAlerts, enabled: true });
      setShowEmailSetup(false);
      setEmailSubmitted(true);
      setTimeout(() => setEmailSubmitted(false), 3000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("flex items-center gap-2", className)}
        >
          <Eye className="h-4 w-4" />
          Price History
          {isLowestInThirtyDays && (
            <Badge className="bg-eco-500 text-white ml-1">Lowest 30d</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Price Tracker - {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Simple Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Price Trend (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-32 bg-muted/30 rounded-lg p-4">
                <div className="flex items-end justify-between h-full">
                  {priceHistory.slice(-10).map((point, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className="w-full bg-eco-500 rounded-t-sm min-h-[4px] relative group cursor-pointer"
                        style={{ height: `${getChartHeight(point.price)}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                            ₹{point.price.toLocaleString()}
                            <br />
                            {new Date(point.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(point.date).getDate()}
                      </span>
                    </div>
                  ))}
                  {/* Current price */}
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-primary rounded-t-sm min-h-[4px] relative group cursor-pointer"
                      style={{ height: `${getChartHeight(currentPrice)}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          ₹{currentPrice.toLocaleString()}
                          <br />
                          Today
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-primary font-medium mt-1">
                      Now
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>₹{minPrice.toLocaleString()}</span>
                <span>₹{maxPrice.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Email Alert Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Email Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">Email Price Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get price updates delivered to your inbox
                  </p>
                </div>
                <Button
                  variant={emailAlerts.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={handleEmailAlert}
                  disabled={emailSubmitted}
                >
                  {emailSubmitted ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Subscribed!
                    </>
                  ) : emailAlerts.enabled ? (
                    <>
                      <Mail className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <Mail className="h-3 w-3 mr-1" />
                      Set Up
                    </>
                  )}
                </Button>
              </div>

              {emailAlerts.enabled && !showEmailSetup && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">
                      Email alerts active for {emailAlerts.email}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Target price: ₹{emailAlerts.targetPrice || currentPrice} •{" "}
                    {emailAlerts.frequency} updates
                  </p>
                </div>
              )}

              {/* Email Setup Dialog */}
              {showEmailSetup && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium">Set Up Email Alerts</h4>
                    <div className="space-y-2">
                      <Label htmlFor="alert-email">Email Address</Label>
                      <Input
                        id="alert-email"
                        type="email"
                        placeholder="your@email.com"
                        value={emailAlerts.email}
                        onChange={(e) =>
                          setEmailAlerts({
                            ...emailAlerts,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-price">Target Price (₹)</Label>
                      <Input
                        id="target-price"
                        type="number"
                        placeholder={currentPrice.toString()}
                        value={emailAlerts.targetPrice}
                        onChange={(e) =>
                          setEmailAlerts({
                            ...emailAlerts,
                            targetPrice: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Alert Frequency</Label>
                      <select
                        id="frequency"
                        className="w-full p-2 border rounded-md"
                        value={emailAlerts.frequency}
                        onChange={(e) =>
                          setEmailAlerts({
                            ...emailAlerts,
                            frequency: e.target.value,
                          })
                        }
                      >
                        <option value="instant">Instant</option>
                        <option value="daily">Daily Summary</option>
                        <option value="weekly">Weekly Summary</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEmailSetup}
                        size="sm"
                        className="flex-1"
                      >
                        Subscribe to Alerts
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowEmailSetup(false)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
