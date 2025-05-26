"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  variant?: "default" | "minimal" | "fullscreen";
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  message = "Loading...",
  variant = "default",
  size = "md",
}: LoadingStateProps) {
  const containerClasses = {
    default: "flex items-center justify-center p-8",
    minimal: "flex items-center justify-center p-4",
    fullscreen: "min-h-screen flex items-center justify-center",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={containerClasses[variant]}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${iconSizes[size]} animate-spin text-primary`} />
        <p className={`${textSizes[size]} text-gray-600 font-medium`}>
          {message}
        </p>
      </div>
    </div>
  );
}

// Specific loading variants for common use cases
export function PageLoading({
  message = "Loading page...",
}: {
  message?: string;
}) {
  return <LoadingState message={message} variant="fullscreen" size="lg" />;
}

export function ComponentLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return <LoadingState message={message} variant="minimal" size="md" />;
}

export function InlineLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return <LoadingState message={message} variant="minimal" size="sm" />;
}
