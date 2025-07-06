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
  className,
  onAddToCart,
}: ProductCardProps) {
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
        <Button
          onClick={() => onAddToCart?.(id)}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>

        {priceHistory.length > 0 && (
          <PriceTracker
            productId={id}
            productName={name}
            currentPrice={price}
            priceHistory={priceHistory}
            className="w-full"
          />
        )}
      </CardFooter>
    </Card>
  );
}
