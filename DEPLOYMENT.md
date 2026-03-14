# SDModels Deployment Guide

## Vercel Deployment

### 1. Environment Variables

In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_key
```

Replace `your-backend-domain.com` with your actual backend URL.

### 2. Backend CORS Configuration

Your backend MUST be configured to handle CORS properly. The backend needs to:

#### Handle OPTIONS Preflight Requests

```python
# Example FastAPI CORS configuration
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-domain.vercel.app",
        "http://localhost:3000"  # For local development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization"],
)
```

#### Required CORS Headers

Your backend must return these headers on ALL responses (including OPTIONS):

- `Access-Control-Allow-Origin: https://your-vercel-domain.vercel.app`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Allow-Credentials: true`

#### OPTIONS Request Handling

The browser sends OPTIONS requests before actual requests (preflight). Your backend must:

1. Return 200 status code for OPTIONS requests
2. Include all CORS headers in the response
3. NOT require authentication for OPTIONS requests

### 3. Common Issues

#### Issue: "OPTIONS requests failing"

**Cause**: Backend not handling OPTIONS preflight requests

**Solution**: 
- Add CORS middleware to your backend
- Ensure OPTIONS requests return 200 with CORS headers
- Don't require authentication for OPTIONS requests

#### Issue: "Authorization header missing"

**Cause**: CORS not allowing Authorization header

**Solution**: 
- Add `Authorization` to `Access-Control-Allow-Headers`
- Ensure `Access-Control-Allow-Credentials: true` is set

#### Issue: "Network error / CORS error"

**Cause**: Backend CORS origin doesn't match frontend domain

**Solution**: 
- Update backend CORS origins to include your Vercel domain
- Use exact domain (no wildcards for credentials)

### 4. Testing Deployment

After deploying:

1. Open browser DevTools → Network tab
2. Try logging in or making API calls
3. Check if OPTIONS requests return 200
4. Verify CORS headers are present in responses
5. Ensure Authorization headers are being sent

### 5. Backend Deployment Checklist

- [ ] CORS middleware configured with Vercel domain
- [ ] OPTIONS requests handled (return 200)
- [ ] All CORS headers present in responses
- [ ] Authorization header allowed
- [ ] Credentials enabled
- [ ] Backend URL is HTTPS (required for production)
- [ ] Backend is accessible from Vercel servers

### 6. Frontend Deployment Checklist

- [ ] `NEXT_PUBLIC_API_URL` set in Vercel environment variables
- [ ] Environment variable points to production backend (HTTPS)
- [ ] Build succeeds without errors
- [ ] No hardcoded localhost URLs in code

## Local Development

For local development, the Next.js proxy handles CORS automatically:

1. Backend runs on `http://localhost:8000`
2. Frontend runs on `http://localhost:3000`
3. Next.js rewrites `/api/v1/*` to backend (dev only)
4. No CORS issues in development

## Production Architecture

```
Browser → Vercel (Frontend) → Your Backend (API)
         HTTPS                 HTTPS + CORS
```

The frontend makes direct requests to your backend. There's no proxy in production, so CORS must be properly configured on the backend.
