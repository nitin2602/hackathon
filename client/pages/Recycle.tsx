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

// No static data - users start with empty recycle list

export default function RecyclePage() {
  const { user, updateUserStats, isAuthenticated } = useAuth();
  const { addActivity } = useActivity();
  const [recycleItems, setRecycleItems] = useState<RecycleItem[]>(() => {
    // Load from localStorage on initialization
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(
        `ecocreds_recycle_items_${user?.email || "anonymous"}`,
      );
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    condition: "good" as RecycleItem["condition"],
    description: "",
  });

  // Marketplace state
  const [activeTab, setActiveTab] = useState<
    "recycle" | "marketplace" | "my-listings"
  >("recycle");
  const [marketplaceItems, setMarketplaceItems] = useState<
    MarketplaceItemData[]
  >([]);
  const [myListedItems, setMyListedItems] = useState<MarketplaceItemData[]>([]);
  const [showSellForm, setShowSellForm] = useState(false);
  const [newSellItem, setNewSellItem] = useState({
    name: "",
    category: "",
    condition: "good" as MarketplaceItemData["condition"],
    description: "",
    originalPrice: "",
    salePrice: "",
  });

  // Load marketplace items (excluding current user's items)
  useEffect(() => {
    const loadMarketplaceItems = async () => {
      try {
        const allItems = await marketplaceAPI.getItems({ limit: 50 });
        // Filter out current user's own items
        const otherUsersItems = allItems.filter(
          (item) => item.sellerEmail !== user?.email,
        );
        setMarketplaceItems(otherUsersItems);
        // Cache for offline access
        localStorage.setItem(
          "ecocreds_marketplace_items",
          JSON.stringify(otherUsersItems),
        );
      } catch (error) {
        console.warn("API unavailable, using cached marketplace items:", error);
        // Fallback to localStorage
        const cached = localStorage.getItem("ecocreds_marketplace_items");
        if (cached) {
          try {
            const cachedItems = JSON.parse(cached);
            // Filter cached items too
            const otherUsersItems = cachedItems.filter(
              (item: MarketplaceItemData) => item.sellerEmail !== user?.email,
            );
            setMarketplaceItems(otherUsersItems);
          } catch (e) {
            console.error("Failed to parse cached marketplace items:", e);
            setMarketplaceItems([]);
          }
        }
      }
    };

    if (user?.email) {
      loadMarketplaceItems();
    }
  }, [user?.email]);

  // Load user's own listed items
  useEffect(() => {
    const loadMyListedItems = async () => {
      if (!user?.email) return;

      try {
        const myItems = await marketplaceAPI.getSellerItems(user.email);
        setMyListedItems(myItems);
      } catch (error) {
        console.warn("Failed to load my listed items:", error);
        // Fallback to localStorage for offline support
        const allItems = JSON.parse(
          localStorage.getItem("ecocreds_marketplace_items") || "[]",
        );
        const myItems = allItems.filter(
          (item: MarketplaceItemData) => item.sellerEmail === user.email,
        );
        setMyListedItems(myItems);
      }
    };

    loadMyListedItems();
  }, [user?.email, recycleItems]); // Reload when recycle items change

  // Save recycle items to localStorage whenever they change
  useEffect(() => {
    if (user?.email && recycleItems.length > 0) {
      localStorage.setItem(
        `ecocreds_recycle_items_${user.email}`,
        JSON.stringify(recycleItems),
      );
    }
  }, [recycleItems, user?.email]);

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

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || !user) return;

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

    const updatedItems = [item, ...recycleItems];
    setRecycleItems(updatedItems);

    // Save to localStorage
    if (user?.email) {
      localStorage.setItem(
        `ecocreds_recycle_items_${user.email}`,
        JSON.stringify(updatedItems),
      );
    }

    // Automatically create marketplace listing for recycled item
    // Set a reasonable sale price based on condition
    const getMarketPrice = (condition: string) => {
      const basePrices: { [key: string]: number } = {
        Electronics: 2000,
        Clothing: 500,
        Home: 1000,
        Books: 200,
        Sports: 800,
        Plastic: 50,
        Glass: 100,
        Metal: 300,
        Paper: 30,
      };

      const basePrice = basePrices[newItem.category] || 500;
      const conditionMultiplier = {
        excellent: 0.8,
        good: 0.6,
        fair: 0.4,
        poor: 0.2,
      };

      const salePrice = Math.round(
        basePrice *
          (conditionMultiplier[condition as keyof typeof conditionMultiplier] ||
            0.5),
      );
      const originalPrice = Math.round(salePrice * 1.5); // Assume original was 50% higher

      return { salePrice, originalPrice };
    };

    const { salePrice, originalPrice } = getMarketPrice(newItem.condition);

    // Create marketplace item
    const marketplaceItem: MarketplaceItemData = {
      name: newItem.name,
      category:
        newItem.category === "Plastic" ||
        newItem.category === "Glass" ||
        newItem.category === "Metal" ||
        newItem.category === "Paper"
          ? "Other"
          : newItem.category,
      condition: newItem.condition,
      description: `${newItem.description} | Recycled item - helping reduce waste! 🌱`,
      originalPrice,
      salePrice,
      sellerName: user.name,
      sellerEmail: user.email,
    };

    try {
      // Add to marketplace
      await marketplaceAPI.createItem(marketplaceItem);
      console.log(
        "✅ Item automatically listed in marketplace for other users!",
      );
    } catch (error) {
      console.warn(
        "Failed to list in marketplace, will try again later:",
        error,
      );
      // Store locally for retry
      const pendingListings = JSON.parse(
        localStorage.getItem("pending_marketplace_listings") || "[]",
      );
      pendingListings.push(marketplaceItem);
      localStorage.setItem(
        "pending_marketplace_listings",
        JSON.stringify(pendingListings),
      );
    }

    setNewItem({ name: "", category: "", condition: "good", description: "" });
    setShowAddForm(false);

    // Add activity
    addActivity({
      type: "recycle",
      action: "Added for Recycling & Listed in Marketplace",
      item: newItem.name,
      co2Saved: co2Impact,
      ecoCredits: ecoCredits,
    });
  };

  const handleRecycleItem = (itemId: string) => {
    const item = recycleItems.find((i) => i.id === itemId);
    if (!item) return;

    // Update item status
    const updatedItems = recycleItems.map((i) =>
      i.id === itemId ? { ...i, status: "recycled" } : i,
    );
    setRecycleItems(updatedItems);

    // Save to localStorage
    if (user?.email) {
      localStorage.setItem(
        `ecocreds_recycle_items_${user.email}`,
        JSON.stringify(updatedItems),
      );
    }

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

      try {
        await marketplaceAPI.createItem(itemData);
        // Refresh marketplace items
        const updatedItems = await marketplaceAPI.getItems({ limit: 20 });
        setMarketplaceItems(updatedItems);
        localStorage.setItem(
          "ecocreds_marketplace_items",
          JSON.stringify(updatedItems),
        );
      } catch (apiError) {
        console.warn("API unavailable, adding item locally:", apiError);
        // Fallback: add item locally
        const localItem: MarketplaceItemData = {
          ...itemData,
          _id: `local_${Date.now()}`,
          discountPercentage: Math.round(
            ((itemData.originalPrice - itemData.salePrice) /
              itemData.originalPrice) *
              100,
          ),
          ecoScore: 85,
          views: 0,
          status: "available",
          createdAt: new Date().toISOString(),
        };

        const updatedItems = [localItem, ...marketplaceItems];
        setMarketplaceItems(updatedItems);
        localStorage.setItem(
          "ecocreds_marketplace_items",
          JSON.stringify(updatedItems),
        );
      }

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
          <h1 className="text-3xl font-bold text-foreground mb-4">
            ♻️ Recycling Center & Marketplace
          </h1>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-4 max-w-2xl">
            <button
              onClick={() => setActiveTab("recycle")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "recycle"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Recycle className="h-4 w-4 inline mr-1" />
              Recycle Items
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "marketplace"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="h-4 w-4 inline mr-1" />
              Buy from Others
            </button>
            <button
              onClick={() => setActiveTab("my-listings")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "my-listings"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-4 w-4 inline mr-1" />
              My Listings ({myListedItems.length})
            </button>
          </div>

          <p className="text-muted-foreground">
            {activeTab === "recycle"
              ? "Turn your unwanted items into EcoCredits and automatically list them for others to buy"
              : activeTab === "marketplace"
                ? "Buy eco-friendly recycled items from other EcoCreds users"
                : "View and manage items you've listed for sale to other users"}
          </p>
        </div>

        {/* Stats Cards - Only show for recycle tab */}
        {activeTab === "recycle" && (
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
        )}

        {/* Action Buttons */}
        <div className="mb-8">
          {activeTab === "recycle" ? (
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-eco-500 hover:bg-eco-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item for Recycling
            </Button>
          ) : activeTab === "marketplace" ? (
            <Button
              onClick={() => setShowSellForm(!showSellForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Tag className="h-4 w-4 mr-2" />
              Sell an Item Directly
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab("recycle")}
                className="bg-eco-500 hover:bg-eco-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add More Items
              </Button>
              <Button
                onClick={() => setShowSellForm(!showSellForm)}
                variant="outline"
              >
                <Tag className="h-4 w-4 mr-2" />
                Direct Sell
              </Button>
            </div>
          )}
        </div>

        {/* Sell Item Form */}
        {showSellForm && activeTab === "marketplace" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>List Item for Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sell-item-name">Item Name</Label>
                  <Input
                    id="sell-item-name"
                    placeholder="e.g., iPhone 12, Winter Jacket"
                    value={newSellItem.name}
                    onChange={(e) =>
                      setNewSellItem({ ...newSellItem, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sell-category">Category</Label>
                  <select
                    id="sell-category"
                    className="w-full p-2 border rounded-md"
                    value={newSellItem.category}
                    onChange={(e) =>
                      setNewSellItem({
                        ...newSellItem,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Books">Books</option>
                    <option value="Sports">Sports & Fitness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sell-condition">Condition</Label>
                  <select
                    id="sell-condition"
                    className="w-full p-2 border rounded-md"
                    value={newSellItem.condition}
                    onChange={(e) =>
                      setNewSellItem({
                        ...newSellItem,
                        condition: e.target
                          .value as MarketplaceItemData["condition"],
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
                  <Label htmlFor="original-price">Original Price (₹)</Label>
                  <Input
                    id="original-price"
                    type="number"
                    placeholder="1000"
                    value={newSellItem.originalPrice}
                    onChange={(e) =>
                      setNewSellItem({
                        ...newSellItem,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sale-price">Sale Price (₹)</Label>
                  <Input
                    id="sale-price"
                    type="number"
                    placeholder="750"
                    value={newSellItem.salePrice}
                    onChange={(e) =>
                      setNewSellItem({
                        ...newSellItem,
                        salePrice: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sell-description">Description</Label>
                <Textarea
                  id="sell-description"
                  placeholder="Describe the item's condition, features, and why you're selling it"
                  value={newSellItem.description}
                  onChange={(e) =>
                    setNewSellItem({
                      ...newSellItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {newSellItem.originalPrice && newSellItem.salePrice && (
                <div className="bg-eco-50 border border-eco-200 p-3 rounded-lg">
                  <p className="text-sm text-eco-600">
                    Discount:{" "}
                    <span className="font-bold">
                      {Math.round(
                        ((Number(newSellItem.originalPrice) -
                          Number(newSellItem.salePrice)) /
                          Number(newSellItem.originalPrice)) *
                          100,
                      )}
                      % off
                    </span>
                    {" • "}
                    <span className="text-eco-800">
                      Eco-friendly second-hand purchase!
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSellItem}
                  className="bg-primary hover:bg-primary/90"
                >
                  List Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSellForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Item Form */}
        {showAddForm && activeTab === "recycle" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Item for Recycling</CardTitle>
              <div className="p-3 bg-eco-50 rounded-lg border border-eco-200">
                <p className="text-sm text-eco-700">
                  🔄 When you add an item for recycling, it will automatically
                  be listed in the marketplace for other users to buy!
                </p>
              </div>
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

        {/* Main Content */}
        {activeTab === "recycle" ? (
          /* Recycle Items Lists */
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
                            -{item.co2Impact.toFixed(2)}kg CO₂
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
                            -{item.co2Impact.toFixed(2)}kg CO₂
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
                            -{item.co2Impact.toFixed(2)}kg CO₂
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {recycleItems.length === 0 && (
              <Card className="text-center p-12">
                <Recycle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Start Recycling Today!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add items you want to recycle and earn EcoCredits while
                  helping the environment.
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
          </div>
        ) : activeTab === "marketplace" ? (
          /* Marketplace Items from Other Users */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Items from Other Users</h2>
              <p className="text-sm text-muted-foreground">
                {marketplaceItems.length} items available to buy
              </p>
            </div>

            {marketplaceItems.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  🛒 These are recycled items listed by other EcoCreds users.
                  Buy them to support sustainable shopping!
                </p>
              </div>
            )}

            {marketplaceItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceItems.map((item) => (
                  <Card
                    key={item._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <Badge variant="secondary">{item.condition}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">
                            ₹{item.salePrice.toLocaleString()}
                          </span>
                          {item.discountPercentage &&
                            item.discountPercentage > 0 && (
                              <Badge className="bg-eco-100 text-eco-700">
                                {item.discountPercentage}% off
                              </Badge>
                            )}
                        </div>
                        {item.originalPrice &&
                          item.originalPrice > item.salePrice && (
                            <p className="text-sm text-muted-foreground">
                              <span className="line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                              {" • "}
                              Save ₹
                              {(
                                item.originalPrice - item.salePrice
                              ).toLocaleString()}
                            </p>
                          )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views || 0} views
                        </span>
                        <span>by {item.sellerName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Leaf className="h-3 w-3 text-eco-500" />
                          <span className="text-xs text-eco-600">
                            Eco Score: {item.ecoScore || 85}%
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-12">
                <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Items from Other Users Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Other users haven't listed any items yet. Add items to recycle
                  - they'll automatically become available for others to buy!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setActiveTab("recycle")}
                    className="bg-eco-500 hover:bg-eco-600"
                  >
                    <Recycle className="h-4 w-4 mr-2" />
                    Add Items to Recycle
                  </Button>
                  <Button
                    onClick={() => setShowSellForm(true)}
                    variant="outline"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Direct Sell
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* My Listed Items */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Listed Items</h2>
              <p className="text-sm text-muted-foreground">
                {myListedItems.length} items listed for sale
              </p>
            </div>

            {myListedItems.length > 0 ? (
              <div>
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    📈 These items are visible to other users and can be
                    purchased from the marketplace.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListedItems.map((item) => (
                    <Card
                      key={item._id}
                      className="border-2 border-eco-200 bg-eco-50/30"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Badge variant="secondary">{item.condition}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-primary">
                              ₹{item.salePrice.toLocaleString()}
                            </span>
                            {item.discountPercentage &&
                              item.discountPercentage > 0 && (
                                <Badge className="bg-eco-100 text-eco-700">
                                  {item.discountPercentage}% off
                                </Badge>
                              )}
                          </div>
                          {item.originalPrice &&
                            item.originalPrice > item.salePrice && (
                              <p className="text-sm text-muted-foreground">
                                <span className="line-through">
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                                {" • "}
                                Save ₹
                                {(
                                  item.originalPrice - item.salePrice
                                ).toLocaleString()}
                              </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views || 0} views
                          </span>
                          <span className="text-green-600 font-medium">
                            Listed by you
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Leaf className="h-3 w-3 text-eco-500" />
                            <span className="text-xs text-eco-600">
                              Eco Score: {item.ecoScore || 85}%
                            </span>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            Available for Purchase
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="text-center p-12">
                <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Items Listed Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  You haven't listed any items for sale yet. Add items to
                  recycle or sell directly to start earning!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setActiveTab("recycle")}
                    className="bg-eco-500 hover:bg-eco-600"
                  >
                    <Recycle className="h-4 w-4 mr-2" />
                    Add Items to Recycle
                  </Button>
                  <Button
                    onClick={() => setShowSellForm(true)}
                    variant="outline"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Sell Directly
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
