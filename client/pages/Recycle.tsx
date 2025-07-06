import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle } from "lucide-react";

export default function RecyclePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/recycle" ecoCredits={1245} />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <Recycle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Recycle Items</h2>
              <p className="text-muted-foreground">
                Recycle functionality coming soon! Return items to earn
                EcoCredits and reduce environmental impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
