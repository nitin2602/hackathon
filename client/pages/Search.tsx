import { Navbar } from "@/components/ui/navbar";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Leaf,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  priceHistory: { date: string; price: number }[];
  tags: string[];
  layer1Alternative?: Product;
  layer2Alternative?: Product;
}

// Helper functions
const getCO2FromEcoScore = (score: number, price: number): number => {
  const baseCO2 = (100 - score) / 20;
  return Math.max(0.1, baseCO2 * (price / 100));
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
  };
  return (
    imageMap[name] ||
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
  );
};

const generateTags = (name: string): string[] => {
  const baseTags = name.toLowerCase().split(" ");
  const extraTags: Record<string, string[]> = {
    "Plastic Water Bottle": ["plastic", "disposable", "cheap"],
    "Stainless Steel Bottle": ["metal", "durable", "reusable"],
    "Copper Bottle": ["copper", "antimicrobial", "premium"],
    "Plastic Straw": ["disposable", "cheap", "single-use"],
    "Metal Straw": ["reusable", "durable", "eco-friendly"],
    "Bamboo Straw": ["natural", "biodegradable", "sustainable"],
  };
  return [...baseTags, ...(extraTags[name] || [])];
};

const createProductFromData = (data: any, id: string): Product => {
  return {
    id,
    name: data.name,
    price: Math.round(data.price * 100),
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
    tags: generateTags(data.name),
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

// Use first 8 products from the data
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
];

const mockProducts: Product[] = rawProductData.map((data, index) =>
  createProductFromData(data, `search_product_${index + 1}`),
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
  { value: "relevance", label: "Relevance" },
  { value: "name", label: "Name" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "eco-score", label: "EcoScore" },
  { value: "co2", label: "Carbon Footprint" },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [showSustainableOnly, setShowSustainableOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const { addToCart } = useCart();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Advanced search logic with scoring
  const getSearchScore = (product: Product, query: string) => {
    if (!query) return 1;

    const lowerQuery = query.toLowerCase();
    let score = 0;

    // Name match (highest priority)
    if (product.name.toLowerCase().includes(lowerQuery)) {
      score += 10;
    }

    // Category match
    if (product.category.toLowerCase().includes(lowerQuery)) {
      score += 5;
    }

    // Tags match
    product.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }
    });

    // Exact word matches
    const queryWords = lowerQuery.split(" ");
    queryWords.forEach((word) => {
      if (product.name.toLowerCase().includes(word)) {
        score += 2;
      }
    });

    return score;
  };

  // Filter and sort products
  const filteredProducts = mockProducts
    .map((product) => ({
      ...product,
      searchScore: getSearchScore(product, searchQuery),
    }))
    .filter((product) => {
      const matchesSearch = !searchQuery || product.searchScore > 0;
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSustainable = !showSustainableOnly || product.isSustainable;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return (
        matchesSearch && matchesCategory && matchesSustainable && matchesPrice
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          return b.searchScore - a.searchScore;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "eco-score":
          return a.ecoScore.localeCompare(b.ecoScore);
        case "co2":
          return a.co2 - b.co2;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = filteredProducts.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  const getPriceChange = (product: Product) => {
    if (product.priceHistory.length < 2) return 0;
    const current = product.price;
    const previous =
      product.priceHistory[product.priceHistory.length - 2].price;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/search" ecoCredits={1245} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🔍 Search Products
          </h1>
          <p className="text-muted-foreground">
            Find eco-friendly products with intelligent search and filtering
          </p>
        </div>

        {/* Advanced Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Main Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for products, categories, or features..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>

              {/* Search Suggestions */}
              {searchQuery && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">
                    Popular searches:
                  </span>
                  {[
                    "eco-friendly",
                    "bamboo",
                    "recyclable",
                    "organic",
                    "sustainable",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

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
                        onClick={() => handleSearch("")}
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

        {/* Results Count and Actions */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const priceChange = getPriceChange(product);
              return (
                <div key={product.id} className="relative">
                  <ProductCard {...product} onAddToCart={handleAddToCart} />
                  {/* Price Trend Indicator */}
                  {priceChange !== 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge
                        className={`${
                          priceChange < 0
                            ? "bg-eco-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {priceChange > 0 ? "+" : ""}
                        {priceChange.toFixed(1)}%
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
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
                handleSearch("");
                setSelectedCategory("All");
                setShowSustainableOnly(false);
              }}
            >
              Clear all filters
            </Button>
          </Card>
        )}

        {/* Search Suggestions */}
        {filteredProducts.length === 0 && searchQuery && (
          <Card className="mt-8 bg-gradient-to-r from-eco-50 to-earth-50 border-eco-200">
            <CardHeader>
              <CardTitle className="text-eco-700">Search Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "bamboo",
                  "recycled",
                  "organic",
                  "solar",
                  "steel",
                  "cotton",
                  "LED",
                  "reusable",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch(suggestion)}
                    className="justify-start"
                  >
                    <Search className="h-3 w-3 mr-2" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
