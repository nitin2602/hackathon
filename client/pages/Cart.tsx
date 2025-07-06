import { Navbar } from "@/components/ui/navbar";
import { AlternativesSystem } from "@/components/ui/alternatives-system";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Leaf,
  TrendingDown,
  Trash2,
  Plus,
  Minus,
  Truck,
  CreditCard,
  TreePine,
  Gift,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    addToCart,
    getTotalItems,
    getTotalPrice,
    getTotalCO2,
  } = useCart();
  const [showAlternatives, setShowAlternatives] = useState<string | null>(null);
  const [deliveryOffset, setDeliveryOffset] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Calculations
  const subtotal = getTotalPrice();
  const totalCO2 = getTotalCO2();
  const totalItems = getTotalItems();
  const averageEcoScore =
    totalItems > 0
      ? cartItems.reduce(
          (sum, item) => sum + (item.sustainabilityScore || 50) * item.quantity,
          0,
        ) / totalItems
      : 0;

  const deliveryFee = subtotal > 500 ? 0 : 49;
  const offsetFee = deliveryOffset ? 5 : 0;
  const ecoCreditsEarned = Math.floor(subtotal / 100) * 5;
  const total = subtotal + deliveryFee + offsetFee;

  const getEcoScoreColor = (score: number) => {
    if (score >= 80) return "text-eco-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCO2Level = (co2: number) => {
    if (co2 < 2) return { level: "Low", color: "text-eco-600" };
    if (co2 < 4) return { level: "Medium", color: "text-yellow-600" };
    return { level: "High", color: "text-red-600" };
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/cart" ecoCredits={1245} cartCount={0} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-4">
                  Start shopping for eco-friendly products!
                </p>
                <Button asChild>
                  <a href="/products">Browse Products</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar
        currentPath="/cart"
        ecoCredits={1245}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🛒 Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            Review your items and track their environmental impact
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Environmental Impact Summary */}
            <Card className="bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eco-700">
                  <Leaf className="h-5 w-5" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-eco-600">
                      {totalCO2.toFixed(1)}kg
                    </p>
                    <p className="text-sm text-eco-600">Total CO₂</p>
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-bold ${getEcoScoreColor(averageEcoScore)}`}
                    >
                      {averageEcoScore.toFixed(0)}/100
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Eco Score
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-eco-600">
                      +{ecoCreditsEarned}
                    </p>
                    <p className="text-sm text-eco-600">EcoCredits Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const co2Level = getCO2Level(item.co2 * item.quantity);
                return (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">
                              {item.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge
                              variant={
                                item.isSustainable ? "default" : "secondary"
                              }
                            >
                              {item.isSustainable ? "Eco-Friendly" : "Standard"}
                            </Badge>
                            <span className={`text-sm ${co2Level.color}`}>
                              CO₂: {(item.co2 * item.quantity).toFixed(1)}kg (
                              {co2Level.level})
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-muted-foreground">
                                  ₹{item.price.toLocaleString()} each
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Alternatives Button */}
                          {!item.isSustainable && (
                            <div className="mt-3 pt-3 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setShowAlternatives(
                                    showAlternatives === item.id
                                      ? null
                                      : item.id,
                                  )
                                }
                                className="w-full bg-eco-50 border-eco-200 text-eco-700 hover:bg-eco-100"
                              >
                                <TrendingDown className="h-4 w-4 mr-2" />
                                {showAlternatives === item.id
                                  ? "Hide Eco Alternatives"
                                  : "🌱 View Eco Alternatives"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Alternatives System */}
                      {showAlternatives === item.id && (
                        <div className="mt-6 pt-6 border-t">
                          <AlternativesSystem
                            originalProduct={item}
                            onAddToCart={addToCart}
                            onClose={() => setShowAlternatives(null)}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <Badge className="bg-eco-500">FREE</Badge>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {/* Carbon Offset Option */}
                <div className="flex items-center justify-between p-3 bg-eco-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TreePine className="h-4 w-4 text-eco-600" />
                    <span className="text-sm font-medium">
                      Offset Delivery Carbon
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">+₹5</span>
                    <Button
                      variant={deliveryOffset ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDeliveryOffset(!deliveryOffset)}
                    >
                      {deliveryOffset ? "Added" : "Add"}
                    </Button>
                  </div>
                </div>

                {deliveryOffset && (
                  <div className="text-xs text-eco-600 bg-eco-50 p-2 rounded">
                    🌱 +5 EcoCredits for choosing carbon-neutral delivery!
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                {/* EcoCredits Earned */}
                <div className="bg-eco-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-eco-600">You'll earn</p>
                  <p className="text-lg font-bold text-eco-600">
                    +{ecoCreditsEarned + (deliveryOffset ? 5 : 0)} EcoCredits
                  </p>
                  <p className="text-xs text-eco-600">On successful purchase</p>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Gift className="h-4 w-4 mr-2" />
                    Use EcoCredits (1245 available)
                  </Button>
                </div>

                {/* Free Shipping Progress */}
                {deliveryFee > 0 && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Free shipping progress</span>
                      <span>₹{subtotal}/₹500</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-eco-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((subtotal / 500) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Add ₹{500 - subtotal} more for free shipping
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sustainability Score */}
            <Card className="bg-gradient-to-br from-eco-50 to-earth-50 border-eco-200">
              <CardHeader>
                <CardTitle className="text-eco-700">Cart Eco Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p
                    className={`text-3xl font-bold ${getEcoScoreColor(averageEcoScore)}`}
                  >
                    {averageEcoScore.toFixed(0)}/100
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {averageEcoScore >= 80
                      ? "Excellent eco choices! 🌟"
                      : averageEcoScore >= 60
                        ? "Good progress! 🌱"
                        : "Consider eco alternatives 📈"}
                  </p>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-eco-500 to-eco-600 h-3 rounded-full"
                      style={{ width: `${averageEcoScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
