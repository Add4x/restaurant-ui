---
description: Error Handling - Client Side
globs: src/{hooks,components}/**/*.{ts,tsx}
---

# Client-Side Error Handling

<rule>
name: error_handling_client_side
description: Standards for client-side error handling
filters:
  - type: file_extension
    pattern: "\\.(ts|tsx)$"
  - type: file_path
    pattern: "src/(hooks|components)/.*"
  - type: intent
    pattern: "react_query|error_handling|form_handling"

actions:
  - type: suggest
    message: |
      ## Client-Side Error Handling

      ### React Query Hooks
      ```typescript
      // src/hooks/use-menu-items.ts
      import { useQuery } from '@tanstack/react-query';
      import { getMenuItems } from '@/actions/menu';
      import { useToast } from '@/components/ui/use-toast';
      
      export function useMenuItems() {
        const { toast } = useToast();
        
        return useQuery({
          queryKey: ['menu-items'],
          queryFn: async () => {
            const result = await getMenuItems();
            if (!result.success) {
              throw new Error(result.error);
            }
            return result.data;
          },
          onError: (error) => {
            toast({
              title: 'Error loading menu',
              description: error.message,
              variant: 'destructive',
            });
          },
        });
      }
      ```

      ### Form Error Handling
      ```tsx
      // src/components/menu/AddMenuItemForm.tsx
      'use client';
      
      import { useState } from 'react';
      import { useToast } from '@/components/ui/use-toast';
      import { createMenuItem } from '@/actions/menu';
      
      export function AddMenuItemForm() {
        const { toast } = useToast();
        const [pending, setPending] = useState(false);
        const [error, setError] = useState<string | null>(null);
        
        async function handleSubmit(formData: FormData) {
          setPending(true);
          setError(null);
          
          try {
            const result = await createMenuItem(formData);
            
            if (result.success) {
              toast({
                title: 'Success',
                description: 'Menu item created successfully',
              });
              // Reset form or redirect
            } else {
              setError(result.error);
              toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
              });
            }
          } catch (e) {
            const message = e instanceof Error ? e.message : 'An unknown error occurred';
            setError(message);
            toast({
              title: 'Error',
              description: message,
              variant: 'destructive',
            });
          } finally {
            setPending(false);
          }
        }
        
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}>
            {/* Form fields */}
            {error && <div className="text-red-500">{error}</div>}
            <button type="submit" disabled={pending}>
              {pending ? 'Saving...' : 'Save Menu Item'}
            </button>
          </form>
        );
      }
      ```

      ### Error Boundary
      ```tsx
      // src/components/ErrorBoundary.tsx
      'use client';
      
      import { Component, ErrorInfo, ReactNode } from 'react';
      
      interface Props {
        children: ReactNode;
        fallback?: ReactNode;
      }
      
      interface State {
        hasError: boolean;
        error: Error | null;
      }
      
      export class ErrorBoundary extends Component<Props, State> {
        public state: State = {
          hasError: false,
          error: null,
        };
      
        public static getDerivedStateFromError(error: Error): State {
          return { hasError: true, error };
        }
      
        public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
          console.error('Uncaught error:', error, errorInfo);
        }
      
        public render() {
          if (this.state.hasError) {
            return this.props.fallback || (
              <div className="p-4 bg-red-50 text-red-700 rounded">
                <h2 className="font-bold">Something went wrong</h2>
                <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
                <button 
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
                >
                  Try again
                </button>
              </div>
            );
          }
      
          return this.props.children;
        }
      }
      ```

      ### Best Practices
      - Use error boundaries to catch React rendering errors
      - Show user-friendly error messages
      - Provide recovery options when possible
      - Log errors to your error tracking service
      - Disable interactive elements during async operations
      - Show loading states during async operations

metadata:
  priority: high
  version: 1.0
</rule>
