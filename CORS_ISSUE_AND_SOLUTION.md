# CORS Issue and Solutions

## 🔴 The Problem

You're seeing this error in the browser console:

```
Access to XMLHttpRequest at 'http://localhost:8000/api/v1/models?page=1&limit=50&sort=popular' 
from origin 'http://localhost:3001' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 📋 What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature in browsers that blocks web pages from making requests to a different domain than the one serving the web page.

In your case:
- **Frontend**: Running on `http://localhost:3001` (Next.js)
- **Backend**: Running on `http://localhost:8000` (FastAPI/Django/Express)
- **Problem**: Browser blocks the request because they're different origins

## ✅ Solution 1: Configure Backend CORS (RECOMMENDED)

This is the proper solution. The backend needs to explicitly allow requests from your frontend.

### For FastAPI (Python):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        # Add your production domain here
        # "https://sdmodels.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Your routes here
@app.get("/api/v1/models")
async def get_models():
    return {"models": []}
```

### For Express (Node.js):

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    // Add your production domain here
    // 'https://sdmodels.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Your routes here
app.get('/api/v1/models', (req, res) => {
  res.json({ models: [] });
});
```

### For Django (Python):

Install django-cors-headers:
```bash
pip install django-cors-headers
```

Then in `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    # ...
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    # Add your production domain here
    # "https://sdmodels.com"
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

## ✅ Solution 2: Next.js Proxy (ALREADY IMPLEMENTED)

I've already configured a Next.js proxy as a temporary workaround. This makes the frontend act as a middleman, so the browser thinks it's making requests to the same origin.

### What I Changed:

1. **next.config.mjs** - Added proxy configuration:
```javascript
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:8000/api/v1/:path*',
    },
  ];
}
```

2. **lib/api/client.ts** - Updated to use relative URLs in development:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'development' ? '/api/v1' : 'http://localhost:8000/api/v1');
```

### How It Works:

- Frontend makes request to: `http://localhost:3001/api/v1/models`
- Next.js proxy forwards to: `http://localhost:8000/api/v1/models`
- Browser sees same origin, no CORS error!

### To Apply This Fix:

1. **Restart your Next.js dev server**:
```bash
# Stop the current server (Ctrl+C)
npm run dev
# or
yarn dev
```

2. The proxy will now handle all API requests automatically

## 🎯 Recommended Approach

**For Development:**
- Use the Next.js proxy (already configured) ✅
- OR configure backend CORS for localhost

**For Production:**
- MUST configure backend CORS properly
- Add your production domain to allowed origins
- Remove the proxy or configure it for production API URL

## 🔧 Testing the Fix

After restarting your Next.js server, the CORS error should be gone. You can verify by:

1. Open browser console (F12)
2. Navigate to any page that loads models (homepage, marketplace)
3. Check Network tab - requests to `/api/v1/models` should succeed
4. No CORS errors in console

## 📝 Environment Variables

For production, set this in your `.env.local`:

```bash
# Production API URL
NEXT_PUBLIC_API_URL=https://api.sdmodels.com/api/v1
```

This will override the proxy and use the direct URL (backend must have CORS configured).

## 🚨 Important Notes

1. **The proxy is for development only** - In production, you MUST configure backend CORS
2. **Restart required** - Changes to `next.config.mjs` require restarting the dev server
3. **Backend still needed** - The proxy just forwards requests; backend must be running on port 8000
4. **Credentials** - The proxy preserves cookies and auth headers automatically

## ✅ Current Status

- ✅ Next.js proxy configured
- ✅ API client updated to use proxy in development
- ⏳ Restart Next.js dev server to apply changes
- ⏳ Backend CORS configuration (recommended for production)

## 🎉 After Restart

Your frontend should now successfully communicate with the backend without CORS errors!

---

**Need Help?**
- Make sure backend is running on `http://localhost:8000`
- Check that Next.js is running on `http://localhost:3001`
- Verify the proxy is working by checking Network tab in browser DevTools
