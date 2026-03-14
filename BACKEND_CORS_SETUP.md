# Backend CORS Configuration for SDModels

## Quick Fix for OPTIONS Request Issue

The frontend is sending OPTIONS requests (CORS preflight) that are failing. Here's how to fix it:

## FastAPI Example

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-domain.vercel.app",  # Production frontend
        "http://localhost:3000",                   # Local development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    max_age=3600,  # Cache preflight requests for 1 hour
)
```

## Django Example

```python
# settings.py

CORS_ALLOWED_ORIGINS = [
    "https://your-vercel-domain.vercel.app",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
```

## Express.js Example

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-vercel-domain.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
```

## Testing CORS

### Test with curl:

```bash
# Test OPTIONS request
curl -X OPTIONS https://your-backend.com/api/v1/auth/login \
  -H "Origin: https://your-vercel-domain.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Expected response:
# HTTP/1.1 200 OK
# Access-Control-Allow-Origin: https://your-vercel-domain.vercel.app
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
# Access-Control-Allow-Headers: Content-Type, Authorization
# Access-Control-Allow-Credentials: true
```

### Test with browser:

1. Open DevTools → Network tab
2. Try logging in from frontend
3. Look for OPTIONS request before POST request
4. Check if OPTIONS returns 200
5. Verify CORS headers are present

## Common Mistakes

### ❌ Wrong: Using wildcard with credentials

```python
allow_origins=["*"],  # Don't use * with credentials
allow_credentials=True,
```

### ✅ Correct: Specific origins with credentials

```python
allow_origins=[
    "https://your-vercel-domain.vercel.app",
    "http://localhost:3000"
],
allow_credentials=True,
```

### ❌ Wrong: Not handling OPTIONS

```python
# Missing OPTIONS in allowed methods
allow_methods=["GET", "POST", "PUT", "DELETE"],
```

### ✅ Correct: Include OPTIONS

```python
allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
```

### ❌ Wrong: Missing Authorization header

```python
allow_headers=["Content-Type"],  # Missing Authorization
```

### ✅ Correct: Include Authorization

```python
allow_headers=["Content-Type", "Authorization"],
```

## Debugging

### Check if CORS middleware is active:

Add logging to see if requests are hitting CORS middleware:

```python
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Request: {request.method} {request.url}")
    print(f"Origin: {request.headers.get('origin')}")
    response = await call_next(request)
    print(f"Response headers: {response.headers}")
    return response
```

### Verify CORS headers in response:

```bash
curl -I https://your-backend.com/api/v1/auth/login \
  -H "Origin: https://your-vercel-domain.vercel.app"
```

Should see:
```
Access-Control-Allow-Origin: https://your-vercel-domain.vercel.app
Access-Control-Allow-Credentials: true
```

## Production Checklist

- [ ] CORS middleware installed and configured
- [ ] Frontend Vercel domain added to allowed origins
- [ ] `allow_credentials=True` set
- [ ] OPTIONS method included in allowed methods
- [ ] Authorization header included in allowed headers
- [ ] Backend is using HTTPS (required for production)
- [ ] Tested OPTIONS requests return 200
- [ ] Tested actual API requests work from frontend

## Need Help?

If CORS is still not working:

1. Check backend logs for CORS errors
2. Check browser console for CORS errors
3. Use browser DevTools Network tab to inspect requests/responses
4. Verify the Origin header matches your allowed origins exactly
5. Ensure backend is accessible from Vercel servers (not localhost!)
