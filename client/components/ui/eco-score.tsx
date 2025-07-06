import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

interface EcoScoreProps {
  score: string; // A, B, C, D, F
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const scoreConfig = {
  A: {
    color: "text-eco-700 bg-eco-100 border-eco-300",
    bgGradient: "from-eco-500 to-eco-600",
    description: "Excellent",
  },
  B: {
    color: "text-eco-600 bg-eco-50 border-eco-200",
    bgGradient: "from-eco-400 to-eco-500",
    description: "Good",
  },
  C: {
    color: "text-yellow-700 bg-yellow-100 border-yellow-300",
    bgGradient: "from-yellow-400 to-yellow-500",
    description: "Fair",
  },
  D: {
    color: "text-orange-700 bg-orange-100 border-orange-300",
    bgGradient: "from-orange-400 to-orange-500",
    description: "Poor",
  },
  F: {
    color: "text-red-700 bg-red-100 border-red-300",
    bgGradient: "from-red-400 to-red-500",
    description: "Very Poor",
  },
};

const sizeConfig = {
  sm: {
    container: "w-8 h-8",
    text: "text-xs font-bold",
    icon: "h-3 w-3",
    label: "text-xs",
  },
  md: {
    container: "w-12 h-12",
    text: "text-sm font-bold",
    icon: "h-4 w-4",
    label: "text-sm",
  },
  lg: {
    container: "w-16 h-16",
    text: "text-lg font-bold",
    icon: "h-5 w-5",
    label: "text-base",
  },
};

export function EcoScore({
  score,
  className,
  size = "md",
  showLabel = false,
}: EcoScoreProps) {
  const config = scoreConfig[score as keyof typeof scoreConfig];
  const sizes = sizeConfig[size];

  if (!config) return null;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-2",
          sizes.container,
          config.color,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br opacity-10",
            config.bgGradient,
          )}
        />
        <span className={cn("relative z-10", sizes.text)}>{score}</span>
        {score === "A" && (
          <Leaf
            className={cn("absolute -top-1 -right-1 text-eco-600", sizes.icon)}
          />
        )}
      </div>
      {showLabel && (
        <div className="text-center">
          <div className={cn("font-medium text-foreground", sizes.label)}>
            EcoScore
          </div>
          <div
            className={cn(
              "text-muted-foreground",
              size === "sm" ? "text-xs" : "text-xs",
            )}
          >
            {config.description}
          </div>
        </div>
      )}
    </div>
  );
}
