import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useActivity } from "@/context/ActivityContext";
import { marketplaceAPI, type MarketplaceItemData } from "@/services/api";
import {
  Recycle,
  Plus,
  Camera,
  Leaf,
  Gift,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Trash2,
  ShoppingCart,
  Eye,
  Tag,
  Store,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface RecycleItem {
  id: string;
  name: string;
  category: string;
  condition: "excellent" | "good" | "fair" | "poor";
  description: string;
  ecoCredits: number;
  co2Impact: number;
  image?: string;
  dateAdded: string;
  status: "pending" | "approved" | "recycled";
}

const mockRecycleItems: RecycleItem[] = [
  {
    id: "recycle_1",
    name: "Plastic Water Bottles (5x)",
    category: "Plastic",
    condition: "good",
    description: "5 clean plastic water bottles ready for recycling",
    ecoCredits: 15,
    co2Impact: 0.2,
    dateAdded: "2024-01-30",
    status: "recycled",
  },
  {
    id: "recycle_2",
    name: "Old Smartphone",
    category: "Electronics",
    condition: "fair",
    description: "iPhone 12 with minor scratches, working condition",
    ecoCredits: 50,
    co2Impact: 2.1,
    dateAdded: "2024-01-28",
    status: "approved",
  },
];

export default function RecyclePage() {
  const { user, updateUserStats, isAuthenticated } = useAuth();
  const { addActivity } = useActivity();
  const [recycleItems, setRecycleItems] =
    useState<RecycleItem[]>(mockRecycleItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    condition: "good" as RecycleItem["condition"],
    description: "",
  });

  // Marketplace state
  const [activeTab, setActiveTab] = useState<"recycle" | "marketplace">(
    "recycle",
  );
  const [marketplaceItems, setMarketplaceItems] = useState<
    MarketplaceItemData[]
  >([]);
  const [showSellForm, setShowSellForm] = useState(false);
  const [newSellItem, setNewSellItem] = useState({
    name: "",
    category: "",
    condition: "good" as MarketplaceItemData["condition"],
    description: "",
    originalPrice: "",
    salePrice: "",
  });

  // Load marketplace items
  useEffect(() => {
    const loadMarketplaceItems = async () => {
      const items = await marketplaceAPI.getItems({ limit: 20 });
      setMarketplaceItems(items);
    };
    loadMarketplaceItems();
  }, []);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/recycle" />
        <main className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <Recycle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to access the recycling center.
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

  const calculateEcoCredits = (category: string, condition: string): number => {
    const baseCredits = {
      Plastic: 10,
      Electronics: 40,
      Paper: 5,
      Glass: 8,
      Metal: 15,
      Clothing: 12,
    };

    const conditionMultiplier = {
      excellent: 1.5,
      good: 1.2,
      fair: 1.0,
      poor: 0.7,
    };

    return Math.round(
      (baseCredits[category as keyof typeof baseCredits] || 10) *
        (conditionMultiplier[condition as keyof typeof conditionMultiplier] ||
          1),
    );
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) return;

    const ecoCredits = calculateEcoCredits(newItem.category, newItem.condition);
    const co2Impact = ecoCredits * 0.02; // Rough calculation

    const item: RecycleItem = {
      id: `recycle_${Date.now()}`,
      ...newItem,
      ecoCredits,
      co2Impact,
      dateAdded: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setRecycleItems([item, ...recycleItems]);
    setNewItem({ name: "", category: "", condition: "good", description: "" });
    setShowAddForm(false);

    // Add activity
    addActivity({
      type: "recycle",
      action: "Added for Recycling",
      item: newItem.name,
      co2Saved: co2Impact,
      ecoCredits: ecoCredits,
    });
  };

  const handleRecycleItem = (itemId: string) => {
    const item = recycleItems.find((i) => i.id === itemId);
    if (!item) return;

    // Update item status
    setRecycleItems(
      recycleItems.map((i) =>
        i.id === itemId ? { ...i, status: "recycled" } : i,
      ),
    );

    // Update user stats
    updateUserStats({
      ecoCredits: item.ecoCredits,
      co2Saved: item.co2Impact,
      price: 0,
    });

    // Add activity
    addActivity({
      type: "recycle",
      action: "Recycled",
      item: item.name,
      co2Saved: item.co2Impact,
      ecoCredits: item.ecoCredits,
    });
  };

  const handleSellItem = async () => {
    if (
      !newSellItem.name ||
      !newSellItem.category ||
      !newSellItem.originalPrice ||
      !newSellItem.salePrice ||
      !user
    )
      return;

    try {
      const itemData: MarketplaceItemData = {
        name: newSellItem.name,
        category: newSellItem.category,
        condition: newSellItem.condition,
        description: newSellItem.description,
        originalPrice: Number(newSellItem.originalPrice),
        salePrice: Number(newSellItem.salePrice),
        sellerName: user.name,
        sellerEmail: user.email,
      };

      await marketplaceAPI.createItem(itemData);

      // Refresh marketplace items
      const updatedItems = await marketplaceAPI.getItems({ limit: 20 });
      setMarketplaceItems(updatedItems);

      // Reset form
      setNewSellItem({
        name: "",
        category: "",
        condition: "good",
        description: "",
        originalPrice: "",
        salePrice: "",
      });
      setShowSellForm(false);

      // Add activity
      addActivity({
        type: "purchase", // Using purchase type for marketplace activity
        action: "Listed for Sale",
        item: newSellItem.name,
        ecoCredits: 5, // Small reward for listing items
      });
    } catch (error) {
      console.error("Error listing item:", error);
    }
  };

  const getStatusColor = (status: RecycleItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "approved":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "recycled":
        return "bg-eco-100 text-eco-700 border-eco-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const pendingItems = recycleItems.filter((item) => item.status === "pending");
  const approvedItems = recycleItems.filter(
    (item) => item.status === "approved",
  );
  const recycledItems = recycleItems.filter(
    (item) => item.status === "recycled",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/recycle" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ♻️ Recycling Center
          </h1>
          <p className="text-muted-foreground">
            Turn your unwanted items into EcoCredits and help the environment
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Items Recycled
                  </p>
                  <p className="text-2xl font-bold">{recycledItems.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-eco-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Credits Earned
                  </p>
                  <p className="text-2xl font-bold">
                    {recycledItems.reduce(
                      (sum, item) => sum + item.ecoCredits,
                      0,
                    )}
                  </p>
                </div>
                <Gift className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">CO₂ Impact</p>
                  <p className="text-2xl font-bold">
                    {recycledItems
                      .reduce((sum, item) => sum + item.co2Impact, 0)
                      .toFixed(1)}
                    kg
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-eco-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Item Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-eco-500 hover:bg-eco-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item for Recycling
          </Button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Item for Recycling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g., Plastic bottles, Old phone"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                  >
                    <option value="">Select category</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                    <option value="Metal">Metal</option>
                    <option value="Clothing">Clothing</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  className="w-full p-2 border rounded-md"
                  value={newItem.condition}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      condition: e.target.value as RecycleItem["condition"],
                    })
                  }
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item's condition and any relevant details"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
              </div>

              {newItem.category && (
                <div className="bg-eco-50 border border-eco-200 p-3 rounded-lg">
                  <p className="text-sm text-eco-600">
                    Estimated EcoCredits:{" "}
                    <span className="font-bold">
                      {calculateEcoCredits(newItem.category, newItem.condition)}
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleAddItem}
                  className="bg-eco-500 hover:bg-eco-600"
                >
                  Add Item
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Lists */}
        <div className="space-y-8">
          {/* Approved Items - Ready to Recycle */}
          {approvedItems.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Ready to Recycle ({approvedItems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm">
                          <Leaf className="h-3 w-3 inline mr-1" />+
                          {item.ecoCredits} Credits
                        </span>
                        <span className="text-sm text-eco-600">
                          -{item.co2Impact}kg CO₂
                        </span>
                      </div>
                      <Button
                        onClick={() => handleRecycleItem(item.id)}
                        className="w-full bg-eco-500 hover:bg-eco-600"
                        size="sm"
                      >
                        <Recycle className="h-4 w-4 mr-2" />
                        Recycle Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Recycle className="h-5 w-5 text-yellow-500" />
                Pending Review ({pendingItems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          <Gift className="h-3 w-3 inline mr-1" />+
                          {item.ecoCredits} Credits
                        </span>
                        <span className="text-sm text-eco-600">
                          -{item.co2Impact}kg CO₂
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recycled Items History */}
          {recycledItems.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-eco-500" />
                Recycling History ({recycledItems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recycledItems.map((item) => (
                  <Card key={item.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          ✓ {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Recycled on{" "}
                        {new Date(item.dateAdded).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-eco-600">
                          <Leaf className="h-3 w-3 inline mr-1" />+
                          {item.ecoCredits} Credits Earned
                        </span>
                        <span className="text-sm text-eco-600">
                          -{item.co2Impact}kg CO₂
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {recycleItems.length === 0 && (
          <Card className="text-center p-12">
            <Recycle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Start Recycling Today!
            </h3>
            <p className="text-muted-foreground mb-4">
              Add items you want to recycle and earn EcoCredits while helping
              the environment.
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-eco-500 hover:bg-eco-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
