---
description: Error Handling - Basic Patterns
globs: src/**/*.{ts,tsx}
---

# Basic Error Handling Patterns

<rule>
name: error_handling_basic
description: Basic patterns for error handling in the application
filters:
  - type: file_extension
    pattern: "\\.(ts|tsx)$"
  - type: intent
    pattern: "error_handling|api_errors"

actions:
  - type: suggest
    message: |
      ## Basic Error Handling Patterns

      ### ActionResult Pattern
      All server actions must return a consistent result type:
      ```typescript
      export type ActionResult<T> =
        | { success: true; data: T }
        | { success: false; error: string; code?: string; status?: number };
      ```

      ### API Error Structure
      The backend should return errors in this format:
      ```json
      {
        "message": "Human-readable error message",
        "code": "ERROR_CODE",
        "status": 400
      }
      ```

      ### Basic Error Handling
      - Always check `result.success` before accessing `result.data`
      - Use TypeScript type guards for type safety
      - Include error boundaries around components that might throw
      - Use meaningful error messages that can be shown to users

      ### Error Propagation
      - Let errors bubble up to the nearest error boundary
      - Log errors at their source
      - Transform technical errors into user-friendly messages

metadata:
  priority: high
  version: 1.0
</rule>
