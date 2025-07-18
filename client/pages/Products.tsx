import { Navbar } from "@/components/ui/navbar";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
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
    // Water Bottles
    "Plastic Water Bottle":
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Stainless Steel Bottle":
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Copper Bottle":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Straws
    "Plastic Straw":
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Metal Straw":
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Bamboo Straw":
      "https://images.unsplash.com/photo-1616481870046-c13e2c8e24c9?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Shopping Bags
    "Plastic Shopping Bag":
      "https://images.unsplash.com/photo-1573160813959-df05c1b1b5a4?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Cotton Tote Bag":
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Hemp Grocery Bag":
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Razors
    "Disposable Razor":
      "https://images.unsplash.com/photo-1631730453615-7cb5b1834d28?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Metal Razor with Replaceable Blades":
      "https://images.unsplash.com/photo-1499196737800-6026dfe88d3a?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Bamboo Razor":
      "https://images.unsplash.com/photo-1616081180580-a3d30a0c6cc9?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Toilet Paper
    "Regular Toilet Paper":
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Recycled Toilet Paper":
      "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Bamboo Toilet Paper":
      "https://images.unsplash.com/photo-1616182010067-52fb7929ee37?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Cutlery
    "Plastic Cutlery Set":
      "https://images.unsplash.com/photo-1578509493706-8029e17c1a6f?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Steel Cutlery Set":
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Bamboo Cutlery Set":
      "https://images.unsplash.com/photo-1591884735890-1dd7ac1b1777?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Detergent
    "Conventional Detergent":
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Eco-Friendly Liquid Detergent":
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Detergent Sheets":
      "https://images.unsplash.com/photo-1611946240103-e0b8cd1d1bb2?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Loofah
    "Synthetic Loofah":
      "https://images.unsplash.com/photo-1556909114-d6da3b98c35a?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Natural Loofah":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Bamboo Fiber Loofah":
      "https://images.unsplash.com/photo-1616081080072-7b653a0ba829?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Food Wrap
    "Plastic Food Wrap":
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Beeswax Wrap":
      "https://images.unsplash.com/photo-1616081180580-a3d30a0c6cc9?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Silicone Stretch Lids":
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Batteries
    "Non-rechargeable Batteries":
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Rechargeable Batteries":
      "https://images.unsplash.com/photo-1593642532871-8b12e02d091c?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Solar Batteries":
      "https://images.unsplash.com/photo-1593642532871-8b12e02d091c?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Toothbrush
    "Plastic Toothbrush":
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Bamboo Toothbrush":
      "https://images.unsplash.com/photo-1616081080072-7b653a0ba829?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Compostable Corn-Based Brush":
      "https://images.unsplash.com/photo-1616081080072-7b653a0ba829?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Coffee Cup
    "Plastic Coffee Cup":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Reusable Coffee Cup":
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Insulated Stainless Cup":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // LED Bulb
    "LED Bulb (Old Gen)":
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Energy-Efficient LED Bulb":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Smart LED Bulb":
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Lunch Box
    "Plastic Lunch Box":
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Glass Lunch Box":
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Stainless Steel Tiffin":
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Pan
    "Non-stick Pan (Teflon)":
      "https://images.unsplash.com/photo-1556909114-d6da3b98c35a?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Cast Iron Pan":
      "https://images.unsplash.com/photo-1544985361-b420d7a77043?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Ceramic Pan":
      "https://images.unsplash.com/photo-1556909125-7e0d2ab8430c?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Cleaner
    "Chemical Cleaner Spray":
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Eco Surface Cleaner":
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Vinegar-Based Multi-Cleaner":
      "https://images.unsplash.com/photo-1611946240103-e0b8cd1d1bb2?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Hair Comb
    "Plastic Hair Comb":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Wooden Comb":
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Bamboo Comb":
      "https://images.unsplash.com/photo-1616081080072-7b653a0ba829?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Shampoo
    "Conventional Shampoo":
      "https://images.unsplash.com/photo-1556909114-d6da3b98c35a?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Refillable Shampoo Bottle":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Solid Shampoo Bar":
      "https://images.unsplash.com/photo-1616081080072-7b653a0ba829?w=500&h=500&fit=crop&crop=center&auto=format&q=80",

    // Aluminum Foil
    "Aluminum Foil":
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Silicone Baking Mat":
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
    "Compostable Parchment Paper":
      "https://images.unsplash.com/photo-1616081080072-7b653a0ba829?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
  };

  return (
    imageMap[name] ||
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop&crop=center&auto=format&q=80"
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

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  // Filter products by search only
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddToCart = (product: Product | string) => {
    if (typeof product === "string") {
      // Legacy support: if product ID is passed, find the product
      const foundProduct = filteredProducts.find((p) => p.id === product);
      if (foundProduct) {
        addToCart(foundProduct);
      }
    } else {
      // New way: product object is passed directly
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-earth-50">
      <Navbar currentPath="/products" />

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

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for eco-friendly products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
              Try adjusting your search or browse our eco-friendly products
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
              }}
            >
              Clear search
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
