import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EcoScore } from "@/components/ui/eco-score";
import { useAuth } from "@/context/AuthContext";
import { useActivity } from "@/context/ActivityContext";
import {
  Plus,
  Search,
  Filter,
  ShoppingCart,
  User,
  Heart,
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  Camera,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: "new" | "like-new" | "good" | "fair";
  category: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    location: string;
  };
  images: string[];
  ecoScore: number;
  sustainabilityFeatures: string[];
  datePosted: string;
  isEcoFriendly: boolean;
  tags: string[];
}

const mockProducts: MarketplaceProduct[] = [
  {
    id: "mp_1",
    name: "Barely Used Bamboo Water Bottle",
    description:
      "Premium bamboo water bottle, used only a few times. Perfect for eco-conscious buyers!",
    price: 450,
    originalPrice: 650,
    condition: "like-new",
    category: "Kitchen",
    seller: {
      id: "seller_1",
      name: "Sarah Green",
      rating: 4.8,
      location: "Mumbai, Maharashtra",
    },
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    ],
    ecoScore: 92,
    sustainabilityFeatures: [
      "Made from renewable bamboo",
      "BPA-free",
      "Biodegradable",
    ],
    datePosted: "2024-01-29",
    isEcoFriendly: true,
    tags: ["bamboo", "water bottle", "sustainable", "reusable"],
  },
  {
    id: "mp_2",
    name: "Organic Cotton Tote Bag Set",
    description:
      "Set of 3 organic cotton tote bags in excellent condition. Great for grocery shopping!",
    price: 280,
    originalPrice: 400,
    condition: "good",
    category: "Accessories",
    seller: {
      id: "seller_2",
      name: "Raj Patel",
      rating: 4.9,
      location: "Delhi, NCR",
    },
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    ],
    ecoScore: 88,
    sustainabilityFeatures: [
      "Organic cotton",
      "Fair trade certified",
      "Reusable",
    ],
    datePosted: "2024-01-28",
    isEcoFriendly: true,
    tags: ["organic", "cotton", "tote bag", "reusable"],
  },
  {
    id: "mp_3",
    name: "Solar Power Bank",
    description:
      "Portable solar power bank with 20,000mAh capacity. Charge your devices with clean energy!",
    price: 1200,
    originalPrice: 1800,
    condition: "good",
    category: "Electronics",
    seller: {
      id: "seller_3",
      name: "Eco Tech Store",
      rating: 4.7,
      location: "Bangalore, Karnataka",
    },
    images: [
      "https://images.unsplash.com/photo-1593642532871-8b12e02d091c?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    ],
    ecoScore: 85,
    sustainabilityFeatures: [
      "Solar powered",
      "Renewable energy",
      "Long lasting",
    ],
    datePosted: "2024-01-27",
    isEcoFriendly: true,
    tags: ["solar", "power bank", "renewable", "tech"],
  },
];

export default function Marketplace() {
  const { user, isAuthenticated } = useAuth();
  const { addActivity } = useActivity();
  const [products, setProducts] = useState<MarketplaceProduct[]>(mockProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    condition: "good" as MarketplaceProduct["condition"],
    category: "",
    sustainabilityFeatures: "",
    tags: "",
  });

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
        <Navbar currentPath="/marketplace" />
        <main className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to access the marketplace.
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

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    const product: MarketplaceProduct = {
      id: `mp_${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      price: parseInt(newProduct.price),
      originalPrice: newProduct.originalPrice
        ? parseInt(newProduct.originalPrice)
        : undefined,
      condition: newProduct.condition,
      category: newProduct.category,
      seller: {
        id: user.id,
        name: user.name,
        rating: 4.5, // Default rating
        location: "Your Location", // Could be from user profile
      },
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
      ],
      ecoScore: Math.floor(Math.random() * 40) + 60, // Random eco score between 60-100
      sustainabilityFeatures: newProduct.sustainabilityFeatures
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
      datePosted: new Date().toISOString().split("T")[0],
      isEcoFriendly: true,
      tags: newProduct.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };

    setProducts([product, ...products]);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      condition: "good",
      category: "",
      sustainabilityFeatures: "",
      tags: "",
    });
    setShowAddForm(false);

    // Add activity
    addActivity({
      type: "badge",
      action: "Listed Product",
      item: newProduct.name,
      ecoCredits: 10, // Bonus for listing eco-friendly products
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "Kitchen",
    "Electronics",
    "Accessories",
    "Clothing",
    "Home",
    "Personal Care",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/marketplace" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🏪 EcoMarketplace
          </h1>
          <p className="text-muted-foreground">
            Buy and sell sustainable products with the EcoCreds community
          </p>
        </div>

        {/* Search and Add Product Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search eco-friendly products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                className="w-full md:w-40 p-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-eco-500 hover:bg-eco-600 w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Sell Product
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>List Your Eco-Friendly Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Bamboo Water Bottle"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="500"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="original-price">Original Price (₹)</Label>
                  <Input
                    id="original-price"
                    type="number"
                    placeholder="800 (optional)"
                    value={newProduct.originalPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    id="condition"
                    className="w-full p-2 border rounded-md"
                    value={newProduct.condition}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        condition: e.target
                          .value as MarketplaceProduct["condition"],
                      })
                    }
                  >
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product, its condition, and sustainability features..."
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="sustainability">
                  Sustainability Features (comma-separated)
                </Label>
                <Input
                  id="sustainability"
                  placeholder="e.g., Made from bamboo, BPA-free, Biodegradable"
                  value={newProduct.sustainabilityFeatures}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      sustainabilityFeatures: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., eco-friendly, reusable, organic"
                  value={newProduct.tags}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, tags: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddProduct}
                  className="bg-eco-500 hover:bg-eco-600"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  List Product
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <EcoScore
                    score={Math.floor(product.ecoScore / 10)}
                    size="sm"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-eco-500 text-white">
                    {product.condition}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline">
                    {Math.round(
                      (1 -
                        product.price /
                          (product.originalPrice || product.price)) *
                        100,
                    )}
                    % off
                  </Badge>
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{product.seller.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.seller.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">{product.seller.location}</span>
                  </div>
                </div>

                {/* Sustainability Features */}
                {product.sustainabilityFeatures.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {product.sustainabilityFeatures
                        .slice(0, 2)
                        .map((feature, index) => (
                          <Badge
                            key={index}
                            className="bg-eco-100 text-eco-700 text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      {product.sustainabilityFeatures.length > 2 && (
                        <Badge className="bg-eco-100 text-eco-700 text-xs">
                          +{product.sustainabilityFeatures.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-eco-500 hover:bg-eco-600"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Posted {new Date(product.datePosted).toLocaleDateString()}
                  </span>
                  <span>#{product.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card className="text-center p-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No products match "${searchQuery}". Try a different search term.`
                : "Be the first to list a sustainable product in this category!"}
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-eco-500 hover:bg-eco-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              List Your Product
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
