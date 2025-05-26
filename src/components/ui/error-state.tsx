"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showGoHome?: boolean;
  showGoBack?: boolean;
  onRetry?: () => void;
  customActions?: React.ReactNode;
  variant?: "default" | "minimal" | "fullscreen";
}

export function ErrorState({
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again.",
  showRetry = true,
  showGoHome = true,
  showGoBack = false,
  onRetry,
  customActions,
  variant = "default",
}: ErrorStateProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const containerClasses = {
    default: "flex items-center justify-center p-8",
    minimal: "flex items-center justify-center p-4",
    fullscreen: "min-h-screen flex items-center justify-center",
  };

  const contentClasses = {
    default: "max-w-md mx-auto text-center",
    minimal: "max-w-sm mx-auto text-center",
    fullscreen: "max-w-lg mx-auto text-center p-6",
  };

  return (
    <div className={containerClasses[variant]}>
      <div className={contentClasses[variant]}>
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        {customActions ? (
          customActions
        ) : (
          <div className="flex gap-3 justify-center flex-wrap">
            {showGoBack && (
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
            {showGoHome && (
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            )}
            {showRetry && (
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Specific error state variants for common use cases
export function DataNotFoundError({
  title = "No data found",
  message = "The information you're looking for is not available at the moment.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <ErrorState
      title={title}
      message={message}
      onRetry={onRetry}
      showGoBack={false}
      variant="minimal"
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to our servers. Please check your internet connection and try again."
      onRetry={onRetry}
      showGoHome={false}
      variant="minimal"
    />
  );
}

export function NotFoundError({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <ErrorState
      title={title}
      message={message}
      showRetry={false}
      showGoBack={true}
      variant="default"
    />
  );
}
