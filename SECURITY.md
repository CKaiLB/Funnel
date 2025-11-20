# Security & Deployment Guide

## Environment Variables Security

### ⚠️ Important: VITE_ Prefix Variables
All environment variables prefixed with `VITE_` are **exposed to the client-side** in the browser. This means:
- ✅ Safe for: Public API keys, public configuration values
- ❌ Never use for: Secret keys, private tokens, database passwords

### Current VITE_ Variables
- `VITE_FIREBASE_API_KEY` - Firebase public API key (safe to expose)
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain (safe to expose)
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID (safe to expose)
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket (safe to expose)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID (safe to expose)
- `VITE_FIREBASE_APP_ID` - Firebase app ID (safe to expose)
- `VITE_FUNNEL_EMAIL_WEBHOOK_URL` - Public webhook URL (safe to expose)
- `VITE_BREVO_API_KEY` - Brevo API key (⚠️ This is a private key - consider moving to server-side)

### Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use `.env.example`** - Document required variables without values
3. **Vercel Environment Variables** - Set in Vercel dashboard under Project Settings → Environment Variables
4. **API Key Validation** - All API calls validate keys exist before use
5. **Error Handling** - API errors are logged but don't expose sensitive data

### Brevo API Key Security Note
The `VITE_BREVO_API_KEY` is currently client-side accessible. While Brevo API keys are designed to be used client-side, consider:
- Using rate limiting on your Brevo account
- Monitoring API usage for unusual activity
- Rotating keys periodically

## Deployment on Vercel

### Required Environment Variables
Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FUNNEL_EMAIL_WEBHOOK_URL=your_webhook_url
VITE_BREVO_API_KEY=your_brevo_key
```

### Vercel Configuration
- `vercel.json` is configured for SPA routing
- Security headers are set (X-Frame-Options, X-Content-Type-Options, etc.)
- Cache headers optimized for static assets

## Code Security Features

1. **Input Validation** - All user inputs are validated before API calls
2. **Error Handling** - Errors are caught and handled gracefully
3. **No Sensitive Data Logging** - Production builds don't log sensitive information
4. **Same-Window Redirects** - All redirects use same window (no target="_blank" for external links)

## SEO & Social Media Compatibility

- Meta tags optimized for search engines
- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags for Twitter
- Canonical URLs set
- Robots meta tag configured

