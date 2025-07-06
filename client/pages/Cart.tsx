import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function Cart() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/cart" ecoCredits={1245} cartCount={2} />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Shopping Cart</h2>
              <p className="text-muted-foreground">
                Cart functionality coming soon! This will include carbon
                footprint tracking and eco swap suggestions.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
