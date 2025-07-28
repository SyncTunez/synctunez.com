# WorkOS Authentication Setup

This project now uses WorkOS for authentication. Follow these steps to set up WorkOS:

## 1. Create a WorkOS Account

1. Go to [WorkOS Dashboard](https://dashboard.workos.com/)
2. Sign up for a free account
3. Create a new project

## 2. Configure SSO Connection

1. In your WorkOS dashboard, go to "SSO" in the sidebar
2. Click "Add Connection"
3. Choose your SSO provider (Google, Microsoft, etc.)
4. Configure the connection with your provider's settings
5. Note down the Connection ID

## 3. Create an Application

1. In your WorkOS dashboard, go to "Applications"
2. Click "Add Application"
3. Choose "Web Application"
4. Set the following:
   - **Name**: SyncTuneZ
   - **Redirect URIs**: 
     - Development: `http://localhost:3000/api/auth/callback`
     - Production: `https://yourdomain.com/api/auth/callback`
5. Note down the Client ID

## 4. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# WorkOS Configuration (Server-side)
WORKOS_API_KEY=your_workos_api_key_here
WORKOS_CLIENT_ID=your_workos_client_id_here
WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback

# WorkOS Configuration (Client-side - for URL generation)
NEXT_PUBLIC_WORKOS_CLIENT_ID=your_workos_client_id_here
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback

# For production, update the redirect URIs to your domain
# WORKOS_REDIRECT_URI=https://yourdomain.com/api/auth/callback
# NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://yourdomain.com/api/auth/callback
```

## 5. Get Your API Key

1. In your WorkOS dashboard, go to "API Keys"
2. Copy your API key
3. Add it to your `.env.local` file

## 6. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Login" to test the authentication flow
4. You should be redirected to your SSO provider and then back to the onboarding page

## 7. Production Deployment

When deploying to production:

1. Update the `WORKOS_REDIRECT_URI` to your production domain
2. Ensure your WorkOS application has the correct production redirect URI
3. Set `NODE_ENV=production` in your environment

## Troubleshooting

- **"WORKOS_API_KEY environment variable is required"**: Make sure your `.env.local` file exists and has the correct API key
- **"WORKOS_CLIENT_ID environment variable is required"**: Make sure your `.env.local` file has the correct client ID
- **Redirect URI mismatch**: Ensure the redirect URI in your WorkOS application matches exactly what you have in your environment variables

## Security Notes

- Never commit your `.env.local` file to version control
- Use different API keys for development and production
- Regularly rotate your API keys
- Monitor your WorkOS dashboard for any suspicious activity 