import { Navbar } from "@/components/ui/navbar";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Leaf, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  co2?: number;
  ecoScore: number;
  isSustainable: boolean;
  image?: string;
  category: string;
  priceHistory?: { date: string; price: number }[];
  layer1Alternative?: Product;
  layer2Alternative?: Product;
}

const getEcoScoreGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
};

const getCO2FromEcoScore = (score: number, price: number): number => {
  // Lower ecoScore means higher CO2 emissions
  const baseCO2 = (100 - score) / 20; // Scale 0-5kg
  return Math.max(0.1, baseCO2 * (price / 10)); // Factor in price
};

const getCategory = (name: string): string => {
  if (
    name.includes("Bottle") ||
    name.includes("Cup") ||
    name.includes("Pan") ||
    name.includes("Cutlery") ||
    name.includes("Lunch Box") ||
    name.includes("Food Wrap")
  )
    return "Kitchen";
  if (name.includes("Bulb") || name.includes("Batteries")) return "Electronics";
  if (
    name.includes("Bag") ||
    name.includes("Straw") ||
    name.includes("Toilet Paper") ||
    name.includes("Detergent") ||
    name.includes("Loofah") ||
    name.includes("Cleaner") ||
    name.includes("Foil")
  )
    return "Home";
  if (
    name.includes("Razor") ||
    name.includes("Toothbrush") ||
    name.includes("Shampoo") ||
    name.includes("Comb")
  )
    return "Personal Care";
  return "Household";
};

const getProductImage = (name: string): string => {
  const imageMap: Record<string, string> = {
    "Plastic Water Bottle":
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop",
    "Stainless Steel Bottle":
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop",
    "Copper Bottle":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    "Plastic Straw":
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=400&fit=crop",
    "Metal Straw":
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=400&fit=crop",
    "Bamboo Straw":
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
    "Plastic Shopping Bag":
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    "Cotton Tote Bag":
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    "Hemp Grocery Bag":
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    "Disposable Razor":
      "https://images.unsplash.com/photo-1499196737800-6026dfe88d3a?w=400&h=400&fit=crop",
    "Metal Razor with Replaceable Blades":
      "https://images.unsplash.com/photo-1499196737800-6026dfe88d3a?w=400&h=400&fit=crop",
    "Bamboo Razor":
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
    "Regular Toilet Paper":
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
    "Recycled Toilet Paper":
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
    "Bamboo Toilet Paper":
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
  };

  return (
    imageMap[name] ||
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
  );
};

const createProductFromData = (data: any, id: string): Product => {
  return {
    id,
    name: data.name,
    price: Math.round(data.price * 100), // Convert to cents for display
    co2: getCO2FromEcoScore(data.ecoScore, data.price),
    ecoScore: data.ecoScore,
    isSustainable: data.isSustainable,
    image: getProductImage(data.name),
    category: getCategory(data.name),
    priceHistory: [
      { date: "2024-01-01", price: Math.round(data.price * 110) },
      { date: "2024-01-15", price: Math.round(data.price * 105) },
      { date: "2024-01-30", price: Math.round(data.price * 100) },
    ],
    layer1Alternative: data.layer1Alternative
      ? createProductFromData(data.layer1Alternative, `${id}_alt1`)
      : undefined,
    layer2Alternative: data.layer1Alternative?.layer2Alternative
      ? createProductFromData(
          data.layer1Alternative.layer2Alternative,
          `${id}_alt2`,
        )
      : undefined,
  };
};

const rawProductData = [
  {
    name: "Plastic Water Bottle",
    price: 2.5,
    ecoScore: 40,
    isSustainable: false,
    layer1Alternative: {
      name: "Stainless Steel Bottle",
      price: 5.5,
      ecoScore: 80,
      isSustainable: true,
      layer2Alternative: {
        name: "Copper Bottle",
        price: 8.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Straw",
    price: 0.5,
    ecoScore: 20,
    isSustainable: false,
    layer1Alternative: {
      name: "Metal Straw",
      price: 2.0,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Bamboo Straw",
        price: 2.5,
        ecoScore: 95,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Shopping Bag",
    price: 0.2,
    ecoScore: 10,
    isSustainable: false,
    layer1Alternative: {
      name: "Cotton Tote Bag",
      price: 3.0,
      ecoScore: 80,
      isSustainable: true,
      layer2Alternative: {
        name: "Hemp Grocery Bag",
        price: 4.5,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Disposable Razor",
    price: 1.5,
    ecoScore: 30,
    isSustainable: false,
    layer1Alternative: {
      name: "Metal Razor with Replaceable Blades",
      price: 6.0,
      ecoScore: 75,
      isSustainable: true,
      layer2Alternative: {
        name: "Bamboo Razor",
        price: 8.0,
        ecoScore: 88,
        isSustainable: true,
      },
    },
  },
  {
    name: "Regular Toilet Paper",
    price: 1.0,
    ecoScore: 35,
    isSustainable: false,
    layer1Alternative: {
      name: "Recycled Toilet Paper",
      price: 1.3,
      ecoScore: 75,
      isSustainable: true,
      layer2Alternative: {
        name: "Bamboo Toilet Paper",
        price: 2.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Cutlery Set",
    price: 1.0,
    ecoScore: 25,
    isSustainable: false,
    layer1Alternative: {
      name: "Steel Cutlery Set",
      price: 3.5,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Bamboo Cutlery Set",
        price: 4.5,
        ecoScore: 95,
        isSustainable: true,
      },
    },
  },
  {
    name: "Conventional Detergent",
    price: 4.0,
    ecoScore: 40,
    isSustainable: false,
    layer1Alternative: {
      name: "Eco-Friendly Liquid Detergent",
      price: 5.5,
      ecoScore: 75,
      isSustainable: true,
      layer2Alternative: {
        name: "Detergent Sheets",
        price: 7.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Synthetic Loofah",
    price: 2.0,
    ecoScore: 20,
    isSustainable: false,
    layer1Alternative: {
      name: "Natural Loofah",
      price: 2.8,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Bamboo Fiber Loofah",
        price: 3.2,
        ecoScore: 92,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Food Wrap",
    price: 1.5,
    ecoScore: 30,
    isSustainable: false,
    layer1Alternative: {
      name: "Beeswax Wrap",
      price: 4.0,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Silicone Stretch Lids",
        price: 5.0,
        ecoScore: 92,
        isSustainable: true,
      },
    },
  },
  {
    name: "Non-rechargeable Batteries",
    price: 3.0,
    ecoScore: 20,
    isSustainable: false,
    layer1Alternative: {
      name: "Rechargeable Batteries",
      price: 6.0,
      ecoScore: 75,
      isSustainable: true,
      layer2Alternative: {
        name: "Solar Batteries",
        price: 9.0,
        ecoScore: 95,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Toothbrush",
    price: 1.0,
    ecoScore: 25,
    isSustainable: false,
    layer1Alternative: {
      name: "Bamboo Toothbrush",
      price: 2.5,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Compostable Corn-Based Brush",
        price: 3.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Coffee Cup",
    price: 1.0,
    ecoScore: 30,
    isSustainable: false,
    layer1Alternative: {
      name: "Reusable Coffee Cup",
      price: 4.0,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Insulated Stainless Cup",
        price: 6.5,
        ecoScore: 92,
        isSustainable: true,
      },
    },
  },
  {
    name: "LED Bulb (Old Gen)",
    price: 3.0,
    ecoScore: 45,
    isSustainable: false,
    layer1Alternative: {
      name: "Energy-Efficient LED Bulb",
      price: 4.0,
      ecoScore: 80,
      isSustainable: true,
      layer2Alternative: {
        name: "Smart LED Bulb",
        price: 7.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Lunch Box",
    price: 3.0,
    ecoScore: 35,
    isSustainable: false,
    layer1Alternative: {
      name: "Glass Lunch Box",
      price: 5.5,
      ecoScore: 80,
      isSustainable: true,
      layer2Alternative: {
        name: "Stainless Steel Tiffin",
        price: 6.5,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Non-stick Pan (Teflon)",
    price: 8.0,
    ecoScore: 30,
    isSustainable: false,
    layer1Alternative: {
      name: "Cast Iron Pan",
      price: 12.0,
      ecoScore: 75,
      isSustainable: true,
      layer2Alternative: {
        name: "Ceramic Pan",
        price: 14.0,
        ecoScore: 85,
        isSustainable: true,
      },
    },
  },
  {
    name: "Chemical Cleaner Spray",
    price: 3.5,
    ecoScore: 30,
    isSustainable: false,
    layer1Alternative: {
      name: "Eco Surface Cleaner",
      price: 4.5,
      ecoScore: 80,
      isSustainable: true,
      layer2Alternative: {
        name: "Vinegar-Based Multi-Cleaner",
        price: 5.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Plastic Hair Comb",
    price: 1.0,
    ecoScore: 30,
    isSustainable: false,
    layer1Alternative: {
      name: "Wooden Comb",
      price: 2.5,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Bamboo Comb",
        price: 3.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Conventional Shampoo",
    price: 3.5,
    ecoScore: 35,
    isSustainable: false,
    layer1Alternative: {
      name: "Refillable Shampoo Bottle",
      price: 4.5,
      ecoScore: 80,
      isSustainable: true,
      layer2Alternative: {
        name: "Solid Shampoo Bar",
        price: 5.0,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
  {
    name: "Aluminum Foil",
    price: 2.0,
    ecoScore: 30,
    isSustainable: false,
    layer1Alternative: {
      name: "Silicone Baking Mat",
      price: 4.0,
      ecoScore: 85,
      isSustainable: true,
      layer2Alternative: {
        name: "Compostable Parchment Paper",
        price: 4.5,
        ecoScore: 90,
        isSustainable: true,
      },
    },
  },
];

const mockProducts: Product[] = rawProductData.map((data, index) =>
  createProductFromData(data, `product_${index + 1}`),
);

const categories = [
  "All",
  "Kitchen",
  "Electronics",
  "Home",
  "Personal Care",
  "Household",
];
const sortOptions = [
  { value: "name", label: "Name" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "eco-score", label: "EcoScore" },
  { value: "co2", label: "Carbon Footprint" },
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showSustainableOnly, setShowSustainableOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSustainable = !showSustainableOnly || product.isSustainable;
      return matchesSearch && matchesCategory && matchesSustainable;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "eco-score":
          return b.ecoScore - a.ecoScore;
        case "co2":
          return a.co2 - b.co2;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (productId: string) => {
    console.log("Adding product to cart:", productId);
    // In a real app, this would update cart state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/products" ecoCredits={1245} cartCount={2} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sustainable Products
          </h1>
          <p className="text-muted-foreground">
            Discover eco-friendly alternatives and track their environmental
            impact
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for eco-friendly products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={showSustainableOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSustainableOnly(!showSustainableOnly)}
                  className="flex items-center gap-2"
                >
                  <Leaf className="h-4 w-4" />
                  Eco-Friendly Only
                </Button>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== "All" ||
                showSustainableOnly ||
                searchQuery) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {selectedCategory !== "All" && (
                    <Badge variant="secondary">
                      Category: {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className="ml-2 hover:bg-muted-foreground/20 rounded-full"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {showSustainableOnly && (
                    <Badge
                      variant="secondary"
                      className="bg-eco-100 text-eco-700"
                    >
                      <Leaf className="h-3 w-3 mr-1" />
                      Eco-Friendly
                      <button
                        onClick={() => setShowSustainableOnly(false)}
                        className="ml-2 hover:bg-eco-200 rounded-full"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-2 hover:bg-muted-foreground/20 rounded-full"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse our eco-friendly
              categories
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setShowSustainableOnly(false);
              }}
            >
              Clear all filters
            </Button>
          </Card>
        )}

        {/* Eco Impact Summary */}
        {filteredProducts.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-eco-700">
                  Environmental Impact Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-eco-600">
                      {filteredProducts.filter((p) => p.isSustainable).length}
                    </p>
                    <p className="text-sm text-eco-600">
                      Eco-Friendly Products
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-eco-600">
                      {(
                        filteredProducts.reduce((sum, p) => sum + p.co2, 0) /
                        filteredProducts.length
                      ).toFixed(1)}
                      kg
                    </p>
                    <p className="text-sm text-eco-600">Average CO₂ Impact</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-eco-600">
                      {
                        filteredProducts.filter((p) => p.ecoScore === "A")
                          .length
                      }
                    </p>
                    <p className="text-sm text-eco-600">A-Rated Products</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
