import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check API availability
    const checkAPI = async () => {
      try {
        const response = await fetch("/api/ping", {
          signal: AbortSignal.timeout(3000),
        });
        setApiAvailable(response.ok);
      } catch (error) {
        setApiAvailable(false);
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && apiAvailable) {
    return null;
  }

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        {!isOnline
          ? "You're offline. Some features may not work properly."
          : "Backend services are temporarily unavailable. Using cached data where possible."}
      </AlertDescription>
    </Alert>
  );
}
