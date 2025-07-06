import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  Truck,
  TreePine,
  Leaf,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { cartItems, getTotalPrice, getTotalCO2, clearCart } = useCart();
  const { user, updateUserStats, isAuthenticated } = useAuth();
  const [deliveryOffset, setDeliveryOffset] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/checkout" />
        <main className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to continue with checkout.
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/checkout" />
        <main className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No items to checkout
              </h2>
              <p className="text-muted-foreground mb-4">
                Add some products to your cart first.
              </p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Calculations
  const subtotal = getTotalPrice();
  const totalCO2 = getTotalCO2();
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const offsetFee = deliveryOffset ? 5 : 0;
  const ecoCreditsEarned =
    Math.floor(subtotal / 100) * 5 + (deliveryOffset ? 5 : 0);
  const total = subtotal + deliveryFee + offsetFee;

  const handlePayment = async () => {
    setIsProcessing(true);

    // Development mode - simulate payment without actual Razorpay
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      // Simulate payment processing
      setTimeout(() => {
        // Update user stats
        updateUserStats({
          ecoCredits: ecoCreditsEarned,
          co2Saved: totalCO2,
          price: total,
        });

        // Clear cart
        clearCart();

        setIsProcessing(false);

        // Redirect to success page
        navigate("/order-success", {
          state: {
            orderTotal: total,
            ecoCreditsEarned,
            co2Saved: totalCO2,
          },
        });
      }, 2000);
      return;
    }

    // Production Razorpay integration
    try {
      const options = {
        key: "rzp_test_your_key_here", // Replace with actual Razorpay key
        amount: total * 100, // Razorpay expects amount in paisa
        currency: "INR",
        name: "EcoCreds",
        description: "Sustainable Shopping Purchase",
        image: "/logo.png",
        handler: function (response: any) {
          console.log("Payment successful:", response);

          // Update user stats
          updateUserStats({
            ecoCredits: ecoCreditsEarned,
            co2Saved: totalCO2,
            price: total,
          });

          // Clear cart
          clearCart();

          // Redirect to success page
          navigate("/order-success", {
            state: {
              orderTotal: total,
              ecoCreditsEarned,
              co2Saved: totalCO2,
              paymentId: response.razorpay_payment_id,
            },
          });
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: "9999999999",
        },
        notes: {
          address: "EcoCreds Office",
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.log("Payment failed:", response.error);
        setIsProcessing(false);
        alert("Payment failed! Please try again.");
      });

      rzp.open();
      setIsProcessing(false);
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      alert("Payment initialization failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/checkout" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🛒 Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your sustainable purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {((item.co2 || 0) * item.quantity).toFixed(1)}kg CO₂
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card className="bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eco-700">
                  <Leaf className="h-5 w-5" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-eco-600">
                      +{ecoCreditsEarned}
                    </p>
                    <p className="text-sm text-eco-600">EcoCredits Earned</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-eco-600">
                      {totalCO2.toFixed(1)}kg
                    </p>
                    <p className="text-sm text-eco-600">Carbon Footprint</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
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

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Development Mode Notice */}
            {process.env.NODE_ENV === "development" && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">
                      Development Mode
                    </span>
                  </div>
                  <p className="text-sm text-yellow-600">
                    This is a demo checkout. No real payment will be processed.
                    Your order will be simulated and EcoCredits will be added to
                    your account.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-eco-500 hover:bg-eco-600 text-white h-12 text-lg"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  {process.env.NODE_ENV === "development"
                    ? `Complete Demo Order - ₹${total.toLocaleString()}`
                    : `Pay ₹${total.toLocaleString()}`}
                </>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              <p>
                🔒 Secure checkout powered by{" "}
                {process.env.NODE_ENV === "development"
                  ? "Demo Mode"
                  : "Razorpay"}
              </p>
              <p className="mt-1">
                Your personal and payment information is safe with us.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
