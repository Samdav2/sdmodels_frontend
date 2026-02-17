# Backend CORS Configuration Guide

## Quick Setup for Backend Developers

Your frontend is trying to connect but getting blocked by CORS. Here's how to fix it.

## FastAPI (Python) - RECOMMENDED

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add this BEFORE your routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Express (Node.js)

```bash
npm install cors
```

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

## Django

```bash
pip install django-cors-headers
```

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]
CORS_ALLOW_CREDENTIALS = True
```

## Test It

After adding CORS configuration:

1. Restart your backend server
2. Open `http://localhost:3001` in browser
3. Check browser console - CORS errors should be gone
4. API requests should work

## Production

For production, add your domain:

```python
allow_origins=[
    "https://sdmodels.com",
    "https://www.sdmodels.com",
]
```

That's it! 🚀
