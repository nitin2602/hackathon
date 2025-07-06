import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcoScore } from "@/components/ui/eco-score";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Leaf,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  co2: number;
  ecoScore: string;
  isSustainable: boolean;
  image?: string;
  category: string;
  sustainabilityScore: number; // 0-100
}

interface Alternative {
  product: Product;
  reason: string;
  improvement: string;
  priceDiff: number;
}

interface AlternativesSystemProps {
  originalProduct: Product;
  onAddToCart: (productId: string) => void;
  onClose?: () => void;
}

// Mock alternatives data - in real app this would come from AI/algorithm
const getAlternatives = (product: Product): Alternative[] => {
  // Layer 1 alternatives
  const layer1Alternatives: Record<string, Alternative[]> = {
    "7": [
      // Plastic Storage Containers
      {
        product: {
          id: "alt1",
          name: "Glass Storage Containers",
          price: 599,
          co2: 2.1,
          ecoScore: "B",
          isSustainable: true,
          category: "Home",
          sustainabilityScore: 75,
          image:
            "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
        },
        reason: "Glass is recyclable and doesn't contain harmful chemicals",
        improvement: "Better for food safety and environment",
        priceDiff: 200,
      },
    ],
    alt1: [
      // Glass Storage -> Bamboo Fiber
      {
        product: {
          id: "alt2",
          name: "Bamboo Fiber Storage Set",
          price: 849,
          co2: 1.2,
          ecoScore: "A",
          isSustainable: true,
          category: "Home",
          sustainabilityScore: 92,
          image:
            "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
        },
        reason: "Bamboo is rapidly renewable and biodegradable",
        improvement:
          "Top 10% sustainability - naturally antimicrobial and compostable",
        priceDiff: 250,
      },
    ],
    "3": [
      // Electric Kettle
      {
        product: {
          id: "alt3",
          name: "Energy-Efficient Glass Kettle",
          price: 1899,
          co2: 2.8,
          ecoScore: "B",
          isSustainable: true,
          category: "Kitchen",
          sustainabilityScore: 68,
          image:
            "https://images.unsplash.com/photo-1544985361-b420d7a77043?w=400&h=400&fit=crop",
        },
        reason: "50% more energy efficient than standard kettles",
        improvement: "Reduces electricity consumption and carbon footprint",
        priceDiff: -600,
      },
    ],
    alt3: [
      {
        product: {
          id: "alt4",
          name: "Solar-Powered Kettle",
          price: 2299,
          co2: 0.5,
          ecoScore: "A",
          isSustainable: true,
          category: "Kitchen",
          sustainabilityScore: 95,
          image:
            "https://images.unsplash.com/photo-1593642532871-8b12e02d091c?w=400&h=400&fit=crop",
        },
        reason: "Uses renewable solar energy for heating",
        improvement:
          "Top 5% sustainability - zero electricity consumption after setup",
        priceDiff: 400,
      },
    ],
  };

  return layer1Alternatives[product.id] || [];
};

export function AlternativesSystem({
  originalProduct,
  onAddToCart,
  onClose,
}: AlternativesSystemProps) {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [productHistory, setProductHistory] = useState<Product[]>([
    originalProduct,
  ]);
  const [alternativeHistory, setAlternativeHistory] = useState<Alternative[]>(
    [],
  );

  const currentProduct = productHistory[currentLayer];
  const alternatives = getAlternatives(currentProduct);
  const hasAlternatives = alternatives.length > 0;
  const isMaxLayer = currentLayer >= 2;

  const handleViewAlternative = (alternative: Alternative) => {
    if (currentLayer < 2) {
      setProductHistory([...productHistory, alternative.product]);
      setAlternativeHistory([...alternativeHistory, alternative]);
      setCurrentLayer(currentLayer + 1);
    }
  };

  const handleGoBack = () => {
    if (currentLayer > 0) {
      setCurrentLayer(currentLayer - 1);
      setProductHistory(productHistory.slice(0, -1));
      setAlternativeHistory(alternativeHistory.slice(0, -1));
    }
  };

  const getSustainabilityMessage = (score: number) => {
    if (score >= 90) return "Top 10% in sustainability! 🌟";
    if (score >= 80) return "Excellent sustainability choice! 🌿";
    if (score >= 70) return "Good sustainable option 🌱";
    if (score >= 60) return "Better than average 📊";
    return "Room for improvement 📈";
  };

  return (
    <div className="space-y-6">
      {/* Layer Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Layer:</span>
          {[0, 1, 2].map((layer) => (
            <Badge
              key={layer}
              variant={layer === currentLayer ? "default" : "outline"}
              className={cn(
                layer <= currentLayer ? "opacity-100" : "opacity-50",
              )}
            >
              {layer}
            </Badge>
          ))}
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Current Product */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-eco-500 to-eco-600" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {currentLayer === 0 && "🛍️ Original Choice"}
              {currentLayer === 1 && "♻️ Better Alternative"}
              {currentLayer === 2 && "🌿 Best Option"}
            </CardTitle>
            <EcoScore score={currentProduct.ecoScore} size="sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {currentProduct.image && (
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{currentProduct.name}</h3>
              <p className="text-2xl font-bold text-primary">
                ₹{currentProduct.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  CO₂: {currentProduct.co2}kg
                </span>
                <Badge
                  variant={currentProduct.isSustainable ? "default" : "outline"}
                >
                  {currentProduct.isSustainable ? "Eco-Friendly" : "Standard"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Sustainability Score */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sustainability Score</span>
              <span className="text-lg font-bold text-eco-600">
                {currentProduct.sustainabilityScore}/100
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-eco-500 to-eco-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${currentProduct.sustainabilityScore}%`,
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {getSustainabilityMessage(currentProduct.sustainabilityScore)}
            </p>
          </div>

          {/* Improvement Info */}
          {currentLayer > 0 && (
            <div className="bg-eco-50 border border-eco-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-eco-600 mt-0.5" />
                <div>
                  <p className="font-medium text-eco-700">
                    Why this is better:
                  </p>
                  <p className="text-sm text-eco-600">
                    {alternativeHistory[currentLayer - 1]?.reason}
                  </p>
                  <p className="text-sm text-eco-600 mt-1">
                    {alternativeHistory[currentLayer - 1]?.improvement}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {currentLayer > 0 && (
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
            <Button
              onClick={() => onAddToCart(currentProduct.id)}
              className="flex-1"
            >
              Add to Cart - ₹{currentProduct.price.toLocaleString()}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alternatives or Final Message */}
      {!isMaxLayer && hasAlternatives ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-eco-500" />
              Consider This Alternative
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alternatives.map((alternative, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
              >
                {alternative.product.image && (
                  <img
                    src={alternative.product.image}
                    alt={alternative.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{alternative.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {alternative.reason}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-medium">
                      ₹{alternative.product.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm ${
                        alternative.priceDiff > 0
                          ? "text-red-600"
                          : "text-eco-600"
                      }`}
                    >
                      {alternative.priceDiff > 0 ? "+" : ""}₹
                      {alternative.priceDiff}
                    </span>
                    <Badge className="bg-eco-100 text-eco-700">
                      Score: {alternative.product.sustainabilityScore}/100
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewAlternative(alternative)}
                  className="flex items-center gap-2"
                >
                  View Alternative
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : isMaxLayer ? (
        <Card className="bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-eco-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-eco-700 mb-2">
              ✅ This is the best we could find!
            </h3>
            <p className="text-eco-600 mb-4">
              You've reached our top sustainability recommendation. This product
              is in the top 10% for environmental impact.
            </p>
            <Badge className="bg-eco-500 text-white">
              <Leaf className="h-3 w-3 mr-1" />
              Maximum Eco-Optimization Reached
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200">
          <CardContent className="p-6 text-center">
            <Leaf className="h-12 w-12 text-eco-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-eco-700 mb-2">
              Great Choice!
            </h3>
            <p className="text-eco-600">
              No better alternatives available at this time. This product
              already meets our sustainability standards.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
