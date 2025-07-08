import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Leaf,
  Gift,
  ShoppingBag,
  TrendingDown,
  TreePine,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  const orderData = location.state || {
    orderTotal: 0,
    ecoCreditsEarned: 0,
    co2Saved: 0,
    paymentId: "demo_" + Date.now(),
  };

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/order-success" />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              {Math.random() > 0.5 ? "🌿" : "🎉"}
            </div>
          ))}
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-eco-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Successful! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for choosing sustainable shopping with EcoCreds!
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Total</span>
                <span className="text-xl font-bold">
                  ₹{orderData.orderTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono text-sm">{orderData.paymentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white">
              <CardContent className="p-6 text-center">
                <Leaf className="h-12 w-12 mx-auto mb-4" />
                <p className="text-3xl font-bold mb-2">
                  +{orderData.ecoCreditsEarned}
                </p>
                <p className="text-eco-100">EcoCredits Earned</p>
                <p className="text-sm text-eco-200 mt-2">
                  Use these for future rewards!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-earth-500 to-earth-600 text-white">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-12 w-12 mx-auto mb-4" />
                <p className="text-3xl font-bold mb-2">
                  {orderData.co2Saved.toFixed(1)}kg
                </p>
                <p className="text-earth-100">CO₂ Impact</p>
                <p className="text-sm text-earth-200 mt-2">
                  Great choice for the planet!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Unlocked */}
          <Card className="bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-eco-500 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-eco-700">
                    🎊 Achievement Unlocked!
                  </h3>
                  <p className="text-sm text-eco-600">
                    You're making a real difference for our planet
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Badge className="bg-eco-500 text-white mb-2">
                  🌿 Eco Warrior
                </Badge>
                <p className="text-sm text-eco-600">
                  Every sustainable purchase brings us closer to a greener
                  future
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="text-eco-700">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <TreePine className="h-8 w-8 text-eco-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Track Your Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    View your environmental dashboard
                  </p>
                </div>
                <div className="text-center p-4">
                  <Gift className="h-8 w-8 text-eco-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Redeem Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your EcoCredits for amazing rewards
                  </p>
                </div>
                <div className="text-center p-4">
                  <ShoppingBag className="h-8 w-8 text-eco-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Keep Shopping</h4>
                  <p className="text-sm text-muted-foreground">
                    Discover more sustainable products
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-eco-500 hover:bg-eco-600">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/rewards">
                <Gift className="h-4 w-4 mr-2" />
                View Rewards
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Thank You Message */}
          <div className="mt-12 p-6 bg-eco-50 rounded-lg border border-eco-200">
            <h3 className="text-lg font-semibold text-eco-700 mb-2">
              🌍 Thank You for Choosing Sustainability!
            </h3>
            <p className="text-eco-600">
              Your purchase supports eco-friendly practices and helps create a
              more sustainable future for everyone. Together, we're making a
              difference, one purchase at a time.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
