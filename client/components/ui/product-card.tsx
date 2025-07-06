import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcoScore } from "@/components/ui/eco-score";
import { PriceTracker } from "@/components/ui/price-tracker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Leaf,
  TrendingDown,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

interface Alternative {
  id?: string;
  name: string;
  price: number;
  ecoScore: string | number;
  isSustainable: boolean;
  image?: string;
  category: string;
  layer2Alternative?: Alternative;
}

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  co2?: number;
  ecoScore: string | number;
  isSustainable: boolean;
  image?: string;
  category: string;
  priceHistory?: { date: string; price: number }[];
  layer1Alternative?: Alternative;
  layer2Alternative?: Alternative;
  className?: string;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  co2 = 0,
  ecoScore,
  isSustainable,
  image,
  category,
  priceHistory = [],
  layer1Alternative,
  layer2Alternative,
  className,
  onAddToCart,
}: ProductCardProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  // Convert numeric ecoScore to letter grade
  const getEcoScoreGrade = (score: string | number): string => {
    if (typeof score === "string") return score;
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 60) return "C";
    if (score >= 40) return "D";
    return "F";
  };

  const ecoGrade = getEcoScoreGrade(ecoScore);
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="flex items-center justify-center w-full h-full bg-gradient-to-br from-muted to-muted/80"
          style={{ display: image ? "none" : "flex" }}
        >
          <div className="text-muted-foreground text-4xl">
            {category === "Kitchen"
              ? "🍽️"
              : category === "Electronics"
                ? "📱"
                : category === "Clothing"
                  ? "👕"
                  : category === "Home"
                    ? "🏠"
                    : category === "Stationery"
                      ? "📝"
                      : "📦"}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isSustainable && (
            <Badge className="bg-eco-500 text-white hover:bg-eco-600">
              <Leaf className="h-3 w-3 mr-1" />
              Eco-Friendly
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>

        {/* EcoScore */}
        <div className="absolute top-2 right-2">
          <EcoScore score={ecoGrade} size="sm" />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-foreground">
              ₹{price.toLocaleString()}
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Carbon Impact</div>
              <div className="flex items-center gap-1 text-sm font-medium text-carbon">
                <TrendingDown className="h-3 w-3" />
                {co2}kg CO₂
              </div>
            </div>
          </div>

          {/* Carbon Impact Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Carbon Footprint</span>
              <span>{co2 < 2 ? "Low" : co2 < 4 ? "Medium" : "High"}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  co2 < 2
                    ? "bg-eco-500"
                    : co2 < 4
                      ? "bg-yellow-500"
                      : "bg-red-500",
                )}
                style={{ width: `${Math.min((co2 / 5) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <div className="flex gap-2 w-full">
          <Button
            onClick={() => onAddToCart?.(id)}
            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>

          {layer1Alternative && !isSustainable && (
            <Dialog open={showAlternatives} onOpenChange={setShowAlternatives}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-eco-50 border-eco-300 text-eco-700 hover:bg-eco-100"
                >
                  <Leaf className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-eco-500" />
                    🌱 Green Alternatives Available
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="bg-eco-50 border border-eco-200 p-4 rounded-lg">
                    <p className="text-eco-700 font-medium mb-2">
                      💡 Consider these eco-friendly alternatives instead:
                    </p>
                    <p className="text-sm text-eco-600">
                      Making sustainable choices helps reduce environmental
                      impact and often provides better long-term value!
                    </p>
                  </div>

                  {/* Layer 1 Alternative */}
                  <Card className="border-eco-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {layer1Alternative.image && (
                          <img
                            src={layer1Alternative.image}
                            alt={layer1Alternative.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {layer1Alternative.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xl font-bold text-primary">
                              ₹{layer1Alternative.price.toLocaleString()}
                            </span>
                            <Badge className="bg-eco-500 text-white">
                              Score:{" "}
                              {typeof layer1Alternative.ecoScore === "number"
                                ? layer1Alternative.ecoScore
                                : layer1Alternative.ecoScore}
                              /100
                            </Badge>
                            <span className="text-sm text-eco-600">
                              +₹{layer1Alternative.price - price} vs original
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            onAddToCart?.(layer1Alternative.id || `${id}_alt1`);
                            setShowAlternatives(false);
                          }}
                          className="bg-eco-500 hover:bg-eco-600"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add This
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Layer 2 Alternative */}
                  {layer1Alternative.layer2Alternative && (
                    <Card className="border-eco-300 bg-eco-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-eco-600 text-white">
                            BEST CHOICE
                          </Badge>
                          <span className="text-sm text-eco-600">
                            Top 10% sustainability rating
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {layer1Alternative.layer2Alternative.image && (
                            <img
                              src={layer1Alternative.layer2Alternative.image}
                              alt={layer1Alternative.layer2Alternative.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {layer1Alternative.layer2Alternative.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xl font-bold text-primary">
                                ₹
                                {layer1Alternative.layer2Alternative.price.toLocaleString()}
                              </span>
                              <Badge className="bg-eco-600 text-white">
                                Score:{" "}
                                {typeof layer1Alternative.layer2Alternative
                                  .ecoScore === "number"
                                  ? layer1Alternative.layer2Alternative.ecoScore
                                  : layer1Alternative.layer2Alternative
                                      .ecoScore}
                                /100
                              </Badge>
                              <span className="text-sm text-eco-600">
                                +₹
                                {layer1Alternative.layer2Alternative.price -
                                  price}{" "}
                                vs original
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              onAddToCart?.(
                                layer1Alternative.layer2Alternative?.id ||
                                  `${id}_alt2`,
                              );
                              setShowAlternatives(false);
                            }}
                            className="bg-eco-600 hover:bg-eco-700"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add Best
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        onAddToCart?.(id);
                        setShowAlternatives(false);
                      }}
                    >
                      Add Original Anyway
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowAlternatives(false)}
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex gap-2">
          {priceHistory.length > 0 && (
            <PriceTracker
              productId={id}
              productName={name}
              currentPrice={price}
              priceHistory={priceHistory}
              className="flex-1"
            />
          )}

          {/* Quick Price Alert Button */}
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => {
              // Quick alert setup - in real app would show modal
              alert(
                `Price alert set for ${name}! You'll be notified when the price drops below ₹${price.toLocaleString()}.`,
              );
            }}
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
