---
description: Client Credentials - Environment Setup
globs: .env*, src/**/*.{ts,tsx}
---

# Client Credentials Flow - Environment Setup

<rule>
name: client_credentials_env_setup
description: Environment setup for client credentials flow
filters:
  - type: file_extension
    pattern: "\\.(ts|tsx|env)$"
  - type: intent
    pattern: "oauth_setup|client_credentials"

actions:
  - type: suggest
    message: |
      ## Client Credentials Flow - Environment Setup

      ### Environment Variables

      Store client credentials securely in environment variables:

      ```env
      # .env.local (never commit this file)
      NEXT_PUBLIC_API_URL=http://localhost:8080
      CLIENT_ID=restaurant_app
      CLIENT_SECRET=your_client_secret
      ```

      For server-side authentication, use regular environment variables (not NEXT_PUBLIC):

      ```env
      # .env.local
      API_URL=http://localhost:8080
      CLIENT_ID=restaurant_app
      CLIENT_SECRET=your_client_secret
      ```

      ### Security Best Practices

      - Never commit `.env.local` to version control
      - Use different credentials for development, staging, and production
      - Rotate credentials regularly
      - Use environment-specific configuration files
      - Set appropriate file permissions for environment files

      ### Accessing Environment Variables

      In Next.js, environment variables are accessed differently based on where they're used:
      
      - Client-side: Use `process.env.NEXT_PUBLIC_*`
      - Server-side: Use `process.env.*`
      - API routes: Use `process.env.*`

      ### Example Usage

      ```typescript
      // Client-side component
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Server component or API route
      const clientId = process.env.CLIENT_ID;
      const clientSecret = process.env.CLIENT_SECRET;
      ```

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using client credentials flow"
</rule>
