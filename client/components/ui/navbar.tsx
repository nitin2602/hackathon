import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  ShoppingCart,
  User,
  Search,
  Gift,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface NavbarProps {
  currentPath?: string;
  className?: string;
}

export function Navbar({ currentPath = "/", className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getTotalItems();

  const navItems = [
    { href: "/", label: "Home", icon: BarChart3 },
    { href: "/products", label: "Products", icon: ShoppingCart },
    { href: "/rewards", label: "Rewards", icon: Gift },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-eco-500 to-eco-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">
                EcoCreds
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Sustainable Shopping
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* EcoCredits - only show if authenticated */}
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-eco-100 rounded-full">
                <Leaf className="h-4 w-4 text-eco-600" />
                <span className="text-sm font-medium text-eco-700">
                  {user.ecoCredits.toLocaleString()}
                </span>
                <span className="text-xs text-eco-600">EcoCredits</span>
              </div>
            )}

            {/* Cart */}
            <Button variant="outline" size="sm" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    <span className="sr-only">User profile</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile EcoCredits */}
              {isAuthenticated && user && (
                <div className="flex items-center justify-between px-3 py-2 mt-4 bg-eco-100 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-eco-600" />
                    <span className="text-sm font-medium text-eco-700">
                      EcoCredits
                    </span>
                  </div>
                  <span className="text-sm font-bold text-eco-700">
                    {user.ecoCredits.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
