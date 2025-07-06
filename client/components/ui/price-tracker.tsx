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
          {/* Current Price & Change */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-3xl font-bold">
                    ₹{currentPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={cn("flex items-center gap-1", getTrendColor())}
                  >
                    <TrendIcon className="h-4 w-4" />
                    <span className="font-medium">
                      {priceChange > 0 ? "+" : ""}₹{Math.abs(priceChange)}
                    </span>
                  </div>
                  <p className={cn("text-sm", getTrendColor())}>
                    {priceChangePercent > 0 ? "+" : ""}
                    {priceChangePercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Alerts */}
          {isLowestInThirtyDays && (
            <Card className="bg-eco-50 border-eco-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-eco-600" />
                  <h3 className="font-semibold text-eco-700">
                    Great Deal Alert!
                  </h3>
                </div>
                <p className="text-eco-600">
                  This is the lowest price we've seen in the last 30 days.
                  Consider buying now to save money!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Price Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Lowest Price</p>
                <p className="text-lg font-bold text-eco-600">
                  ₹{lowestPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Save ₹{(currentPrice - lowestPrice).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-lg font-bold">
                  ₹{Math.round(averagePrice).toLocaleString()}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    currentPrice < averagePrice
                      ? "text-eco-600"
                      : "text-red-600",
                  )}
                >
                  {currentPrice < averagePrice ? "Below" : "Above"} average
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Highest Price</p>
                <p className="text-lg font-bold text-red-600">
                  ₹{highestPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  You save ₹{(highestPrice - currentPrice).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

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

          {/* Price Alert Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Price Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Track Price Drops</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when price drops below current level
                  </p>
                </div>
                <Button
                  variant={isTracking ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsTracking(!isTracking)}
                >
                  {isTracking ? "Tracking" : "Track"}
                </Button>
              </div>

              {isTracking && (
                <div className="bg-eco-50 border border-eco-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-eco-600" />
                    <span className="text-sm text-eco-600 font-medium">
                      You'll be notified when price drops below ₹
                      {currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  Set Target Price
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Track for 30 days
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Historical Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {priceHistory
                  .slice(-5)
                  .reverse()
                  .map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{new Date(point.date).toLocaleDateString()}</span>
                      <span className="font-medium">
                        ₹{point.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
