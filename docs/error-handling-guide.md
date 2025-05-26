# Error Handling Guide

This guide explains how to use the professional error handling components in the restaurant UI application.

## Components Overview

### ErrorState (Main Component)
The main error state component that provides a professional error display with actionable options.

```tsx
import { ErrorState } from "@/components/ui/error-state";

<ErrorState
  title="Custom Error Title"
  message="Custom error message"
  onRetry={() => refetch()}
  showRetry={true}
  showGoHome={true}
  showGoBack={false}
  variant="default" // "default" | "minimal" | "fullscreen"
/>
```

### Specialized Error Components

#### NetworkError
For network connectivity issues:
```tsx
import { NetworkError } from "@/components/ui/error-state";

<NetworkError onRetry={() => refetch()} />
```

#### DataNotFoundError
For when data is not available:
```tsx
import { DataNotFoundError } from "@/components/ui/error-state";

<DataNotFoundError
  title="No Items Found"
  message="No menu items are available at this time."
  onRetry={() => refetch()}
/>
```

#### NotFoundError
For 404-style errors:
```tsx
import { NotFoundError } from "@/components/ui/error-state";

<NotFoundError
  title="Page Not Found"
  message="The page you're looking for doesn't exist."
/>
```

## Loading States

### ComponentLoading
For component-level loading:
```tsx
import { ComponentLoading } from "@/components/ui/loading-state";

<ComponentLoading message="Loading menu categories..." />
```

### PageLoading
For full-page loading:
```tsx
import { PageLoading } from "@/components/ui/loading-state";

<PageLoading message="Loading page..." />
```

### InlineLoading
For small inline loading indicators:
```tsx
import { InlineLoading } from "@/components/ui/loading-state";

<InlineLoading message="Saving..." />
```

## Usage Patterns

### With TanStack Query
```tsx
export function MyComponent() {
  const { data: result, error, isLoading, refetch } = useMyQuery();

  // Loading state
  if (isLoading) {
    return <ComponentLoading message="Loading data..." />;
  }

  // Network error
  if (error) {
    return <NetworkError onRetry={() => refetch()} />;
  }

  // API error response
  if (result?.error) {
    return (
      <ErrorState
        title="Failed to Load Data"
        message={result.message || "Something went wrong."}
        onRetry={() => refetch()}
      />
    );
  }

  // No data
  if (!result?.data || result.data.length === 0) {
    return (
      <DataNotFoundError
        title="No Data Available"
        message="No data is available at this time."
        onRetry={() => refetch()}
      />
    );
  }

  // Success state
  return <div>{/* Render your data */}</div>;
}
```

### Custom Actions
You can provide custom action buttons:
```tsx
<ErrorState
  title="Custom Error"
  message="Something specific went wrong."
  customActions={
    <div className="flex gap-3">
      <Button onClick={handleCustomAction} variant="outline">
        Custom Action
      </Button>
      <Button onClick={() => refetch()}>
        Try Again
      </Button>
    </div>
  }
/>
```

## Best Practices

1. **Always provide a retry mechanism** when possible
2. **Use specific error messages** that help users understand what went wrong
3. **Choose the appropriate variant** based on the context:
   - `minimal` for small components
   - `default` for standard components
   - `fullscreen` for page-level errors
4. **Provide navigation options** like "Go Home" or "Go Back" when appropriate
5. **Use the specialized components** (NetworkError, DataNotFoundError, etc.) when they fit your use case

## Error State Hierarchy

1. **Loading State** - Show while data is being fetched
2. **Network Error** - Show for connectivity issues
3. **API Error** - Show for server-side errors with specific messages
4. **No Data** - Show when the request succeeds but returns no data
5. **Success State** - Show the actual content

This hierarchy ensures users always see appropriate feedback for the current state of their request. 