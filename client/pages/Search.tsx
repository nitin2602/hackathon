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

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Recycled Paper Notebook Set",
    price: 120,
    co2: 0.4,
    ecoScore: "A",
    isSustainable: true,
    category: "Stationery",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 140 },
      { date: "2024-01-15", price: 130 },
      { date: "2024-01-30", price: 120 },
    ],
    tags: ["recycled", "paper", "notebook", "eco-friendly"],
  },
  {
    id: "2",
    name: "Stainless Steel Water Bottle",
    price: 899,
    co2: 1.2,
    ecoScore: "A",
    isSustainable: true,
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 999 },
      { date: "2024-01-15", price: 950 },
      { date: "2024-01-30", price: 899 },
    ],
    tags: ["stainless steel", "water bottle", "reusable", "durable"],
  },
  {
    id: "3",
    name: "Imported Electric Kettle",
    price: 2499,
    co2: 4.2,
    ecoScore: "C",
    isSustainable: false,
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1544985361-b420d7a77043?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 2699 },
      { date: "2024-01-15", price: 2599 },
      { date: "2024-01-30", price: 2499 },
    ],
    tags: ["electric", "kettle", "kitchen", "imported"],
  },
  {
    id: "4",
    name: "Bamboo Smartphone Case",
    price: 649,
    co2: 0.3,
    ecoScore: "A",
    isSustainable: true,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 699 },
      { date: "2024-01-15", price: 679 },
      { date: "2024-01-30", price: 649 },
    ],
    tags: ["bamboo", "phone case", "biodegradable", "natural"],
  },
  {
    id: "5",
    name: "Organic Cotton T-Shirt",
    price: 799,
    co2: 2.1,
    ecoScore: "B",
    isSustainable: true,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 849 },
      { date: "2024-01-15", price: 829 },
      { date: "2024-01-30", price: 799 },
    ],
    tags: ["organic", "cotton", "t-shirt", "clothing", "fair trade"],
  },
  {
    id: "6",
    name: "LED Desk Lamp",
    price: 1299,
    co2: 1.8,
    ecoScore: "B",
    isSustainable: true,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 1399 },
      { date: "2024-01-15", price: 1349 },
      { date: "2024-01-30", price: 1299 },
    ],
    tags: ["LED", "desk lamp", "energy efficient", "adjustable"],
  },
  {
    id: "7",
    name: "Plastic Storage Containers",
    price: 399,
    co2: 3.5,
    ecoScore: "D",
    isSustainable: false,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 449 },
      { date: "2024-01-15", price: 429 },
      { date: "2024-01-30", price: 399 },
    ],
    tags: ["plastic", "storage", "containers", "home", "cheap"],
  },
  {
    id: "8",
    name: "Solar-Powered Charger",
    price: 1899,
    co2: 0.8,
    ecoScore: "A",
    isSustainable: true,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1593642532871-8b12e02d091c?w=400&h=400&fit=crop",
    priceHistory: [
      { date: "2024-01-01", price: 1999 },
      { date: "2024-01-15", price: 1949 },
      { date: "2024-01-30", price: 1899 },
    ],
    tags: ["solar", "charger", "renewable", "portable", "green energy"],
  },
];

const categories = [
  "All",
  "Stationery",
  "Kitchen",
  "Electronics",
  "Clothing",
  "Home",
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
    console.log("Adding product to cart:", productId);
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
      <Navbar currentPath="/search" ecoCredits={1245} cartCount={2} />

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
