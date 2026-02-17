# HWC3D Backend API Documentation
## Complete FastAPI + SQLModel Implementation Guide

**Version:** 1.0  
**Last Updated:** February 16, 2024  
**Tech Stack:** Python FastAPI, SQLModel, PostgreSQL, Redis, S3/CloudFlare R2

---

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Model Management](#model-management)
4. [Marketplace & Transactions](#marketplace--transactions)
5. [Community Features](#community-features)
6. [Support System](#support-system)
7. [Admin Dashboard](#admin-dashboard)
8. [File Upload & Storage](#file-upload--storage)
9. [Real-time Features](#real-time-features)
10. [Analytics & Reporting](#analytics--reporting)

---

## 1. Authentication & Authorization

### Database Models

```python
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    full_name: Optional[str] = None
    user_type: str = Field(default="buyer")  # buyer, creator, admin
    is_verified: bool = Field(default=False)
    is_active: bool = Field(default=True)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    # OAuth fields
    google_id: Optional[str] = None
    github_id: Optional[str] = None
    discord_id: Optional[str] = None
    
    # Creator specific
    is_verified_creator: bool = Field(default=False)
    total_sales: float = Field(default=0.0)
    total_models: int = Field(default=0)
    rating: float = Field(default=0.0)
    
class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    role: str = Field(default="admin")  # admin, superadmin, moderator
    permissions: str = Field(default="[]")  # JSON array of permissions
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

#### POST /api/auth/register
**Description:** Register new user account  
**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "user_type": "buyer"
}
```
**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "user_type": "buyer"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### POST /api/auth/login
**Description:** User login  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### POST /api/auth/admin/login
**Description:** Admin login with additional verification  
**Request Body:**
```json
{
  "email": "admin@hwc3d.com",
  "password": "AdminPass123!",
  "otp_code": "123456"
}
```

#### POST /api/auth/forgot-password
**Description:** Request password reset  
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/reset-password
**Description:** Reset password with token  
**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "NewSecurePass123!"
}
```

#### POST /api/auth/verify-email
**Description:** Verify email with token  
**Request Body:**
```json
{
  "token": "verification_token"
}
```

#### POST /api/auth/oauth/{provider}
**Description:** OAuth login (Google, GitHub, Discord)  
**Providers:** google, github, discord

#### POST /api/auth/refresh
**Description:** Refresh access token  
**Headers:** Authorization: Bearer {refresh_token}

---

## 2. User Management

### Database Models

```python
class UserProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    website: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    portfolio_url: Optional[str] = None
    skills: str = Field(default="[]")  # JSON array
    software: str = Field(default="[]")  # JSON array
    
class UserFollower(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    follower_id: int = Field(foreign_key="user.id")
    following_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

#### GET /api/users/me
**Description:** Get current user profile  
**Headers:** Authorization: Bearer {token}

#### PUT /api/users/me
**Description:** Update user profile  
**Request Body:**
```json
{
  "full_name": "John Doe",
  "bio": "3D Artist specializing in game assets",
  "avatar_url": "https://cdn.hwc3d.com/avatars/user1.jpg",
  "country": "Nigeria",
  "skills": ["Blender", "Substance Painter", "ZBrush"]
}
```

#### GET /api/users/{user_id}
**Description:** Get public user profile

#### POST /api/users/{user_id}/follow
**Description:** Follow a user

#### DELETE /api/users/{user_id}/follow
**Description:** Unfollow a user

#### GET /api/users/{user_id}/followers
**Description:** Get user followers list

#### GET /api/users/{user_id}/following
**Description:** Get users being followed

---

## 3. Model Management

### Database Models

```python
class Model(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="user.id")
    title: str = Field(index=True)
    description: str
    price: float = Field(default=0.0)
    is_free: bool = Field(default=False)
    category: str = Field(index=True)
    tags: str = Field(default="[]")  # JSON array
    
    # File information
    file_url: str  # Main model file (GLB/GLTF)
    thumbnail_url: str
    preview_images: str = Field(default="[]")  # JSON array of image URLs
    file_size: int  # in bytes
    file_formats: str = Field(default="[]")  # ["GLB", "FBX", "OBJ"]
    
    # Model specifications
    poly_count: int
    vertex_count: int
    texture_resolution: Optional[str] = None
    has_animations: bool = Field(default=False)
    has_rigging: bool = Field(default=False)
    has_materials: bool = Field(default=True)
    has_textures: bool = Field(default=True)
    
    # Engagement metrics
    views: int = Field(default=0)
    likes: int = Field(default=0)
    downloads: int = Field(default=0)
    rating: float = Field(default=0.0)
    rating_count: int = Field(default=0)
    
    # Status
    status: str = Field(default="pending")  # pending, approved, rejected
    is_featured: bool = Field(default=False)
    is_published: bool = Field(default=True)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ModelLike(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="model.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ModelComment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="model.id")
    content: str
    parent_id: Optional[int] = Field(default=None, foreign_key="modelcomment.id")
    likes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

#### POST /api/models
**Description:** Upload new 3D model  
**Request:** Multipart form data
```
title: "Cyberpunk Character"
description: "High-quality cyberpunk character..."
price: 29.99
category: "Characters"
tags: ["cyberpunk", "character", "game-ready"]
file: <binary>
thumbnail: <binary>
preview_images: [<binary>, <binary>]
```

#### GET /api/models
**Description:** Get models list with filters  
**Query Parameters:**
- page: int (default: 1)
- limit: int (default: 20)
- category: str
- min_price: float
- max_price: float
- sort: str (newest, popular, price_low, price_high)
- search: str
- is_free: bool

#### GET /api/models/{model_id}
**Description:** Get model details

#### PUT /api/models/{model_id}
**Description:** Update model (creator only)

#### DELETE /api/models/{model_id}
**Description:** Delete model (creator only)

#### POST /api/models/{model_id}/like
**Description:** Like a model

#### DELETE /api/models/{model_id}/like
**Description:** Unlike a model

#### POST /api/models/{model_id}/comments
**Description:** Add comment to model
```json
{
  "content": "Amazing work!",
  "parent_id": null
}
```

#### GET /api/models/{model_id}/comments
**Description:** Get model comments

#### POST /api/models/{model_id}/view
**Description:** Increment view count

---

## 4. Marketplace & Transactions

### Database Models

```python
class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    buyer_id: int = Field(foreign_key="user.id")
    seller_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="model.id")
    
    amount: float
    platform_fee: float  # 7.5%
    seller_amount: float  # amount - platform_fee
    
    payment_method: str  # card, paypal, crypto
    payment_status: str  # pending, completed, failed, refunded
    transaction_id: str = Field(unique=True)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class Purchase(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="model.id")
    transaction_id: int = Field(foreign_key="transaction.id")
    download_count: int = Field(default=0)
    download_limit: int = Field(default=10)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Cart(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="model.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

#### POST /api/cart
**Description:** Add model to cart
```json
{
  "model_id": 123
}
```

#### GET /api/cart
**Description:** Get user's cart items

#### DELETE /api/cart/{model_id}
**Description:** Remove from cart

#### POST /api/checkout
**Description:** Process checkout
```json
{
  "model_ids": [123, 456],
  "payment_method": "card",
  "payment_details": {
    "card_token": "tok_xxx"
  }
}
```

#### GET /api/purchases
**Description:** Get user's purchased models

#### GET /api/purchases/{model_id}/download
**Description:** Get download link for purchased model

#### POST /api/transactions/{transaction_id}/refund
**Description:** Request refund (admin only)

---

## 5. Community Features

### Database Models

```python
class Community(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: str
    icon: str  # emoji or image URL
    banner_gradient: str  # CSS gradient
    category: str
    creator_id: int = Field(foreign_key="user.id")
    
    member_count: int = Field(default=0)
    post_count: int = Field(default=0)
    
    status: str = Field(default="pending")  # pending, active, suspended
    is_private: bool = Field(default=False)
    require_approval: bool = Field(default=False)
    
    rules: str = Field(default="[]")  # JSON array
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CommunityMember(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    community_id: int = Field(foreign_key="community.id")
    user_id: int = Field(foreign_key="user.id")
    role: str = Field(default="member")  # member, moderator, admin
    joined_at: datetime = Field(default_factory=datetime.utcnow)

class CommunityPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    community_id: int = Field(foreign_key="community.id")
    author_id: int = Field(foreign_key="user.id")
    content: str
    
    # Media attachments
    image_url: Optional[str] = None
    model_url: Optional[str] = None
    
    # Engagement
    reactions: str = Field(default='{"like":0,"love":0,"wow":0,"fire":0}')
    comment_count: int = Field(default=0)
    share_count: int = Field(default=0)
    
    is_pinned: bool = Field(default=False)
    is_deleted: bool = Field(default=False)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PostReaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="communitypost.id")
    user_id: int = Field(foreign_key="user.id")
    reaction_type: str  # like, love, wow, fire
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PostComment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="communitypost.id")
    author_id: int = Field(foreign_key="user.id")
    content: str
    parent_id: Optional[int] = Field(default=None, foreign_key="postcomment.id")
    likes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

#### GET /api/communities
**Description:** Get all communities
**Query Parameters:**
- page, limit, category, search, status

#### POST /api/communities
**Description:** Create new community
```json
{
  "name": "3D Game Assets",
  "description": "Share and discuss game-ready models",
  "icon": "🎮",
  "category": "Gaming",
  "rules": ["Be respectful", "Share original work"]
}
```

#### GET /api/communities/{community_id}
**Description:** Get community details

#### PUT /api/communities/{community_id}
**Description:** Update community (admin/moderator only)

#### DELETE /api/communities/{community_id}
**Description:** Delete community (admin only)

#### POST /api/communities/{community_id}/join
**Description:** Join community

#### DELETE /api/communities/{community_id}/leave
**Description:** Leave community

#### GET /api/communities/{community_id}/members
**Description:** Get community members

#### POST /api/communities/{community_id}/posts
**Description:** Create post in community
```json
{
  "content": "Check out my new model!",
  "image_url": "https://...",
  "model_url": "https://..."
}
```

#### GET /api/communities/{community_id}/posts
**Description:** Get community posts
**Query Parameters:**
- filter: recent, popular, media
- page, limit

#### PUT /api/posts/{post_id}
**Description:** Update post (author only)

#### DELETE /api/posts/{post_id}
**Description:** Delete post (author/moderator only)

#### POST /api/posts/{post_id}/react
**Description:** React to post
```json
{
  "reaction_type": "fire"
}
```

#### DELETE /api/posts/{post_id}/react
**Description:** Remove reaction

#### POST /api/posts/{post_id}/comments
**Description:** Comment on post
```json
{
  "content": "Great work!",
  "parent_id": null
}
```

#### GET /api/posts/{post_id}/comments
**Description:** Get post comments

#### POST /api/posts/{post_id}/share
**Description:** Share post

#### POST /api/posts/{post_id}/report
**Description:** Report post
```json
{
  "reason": "Spam/Self-promotion"
}
```

---

## 6. Support System

### Database Models

```python
class SupportTicket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    subject: str
    category: str  # Payment, Technical, Account, Refund
    priority: str = Field(default="medium")  # low, medium, high
    status: str = Field(default="pending")  # pending, active, resolved
    assigned_to: Optional[str] = None  # Admin Team, Support Team, etc.
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class SupportMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="supportticket.id")
    sender_id: int = Field(foreign_key="user.id")
    sender_type: str  # user, admin
    content: str
    attachments: str = Field(default="[]")  # JSON array of URLs
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

#### POST /api/support/tickets
**Description:** Create support ticket
```json
{
  "subject": "Payment Issue",
  "category": "Payment",
  "priority": "high",
  "message": "My payment failed but money was deducted"
}
```

#### GET /api/support/tickets
**Description:** Get user's tickets

#### GET /api/support/tickets/{ticket_id}
**Description:** Get ticket details with messages

#### POST /api/support/tickets/{ticket_id}/messages
**Description:** Send message in ticket
```json
{
  "content": "Here is the transaction ID: TXN-123",
  "attachments": ["https://..."]
}
```

#### PUT /api/support/tickets/{ticket_id}/status
**Description:** Update ticket status (admin only)
```json
{
  "status": "resolved"
}
```

#### PUT /api/support/tickets/{ticket_id}/assign
**Description:** Assign ticket (admin only)
```json
{
  "assigned_to": "Support Team"
}
```

---

## 7. Admin Dashboard

### Database Models

```python
class AdminAction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    admin_id: int = Field(foreign_key="user.id")
    action_type: str  # model_approved, user_banned, etc.
    target_type: str  # model, user, community, etc.
    target_id: int
    details: str = Field(default="{}")  # JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentReport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    reporter_id: int = Field(foreign_key="user.id")
    content_type: str  # post, model, comment
    content_id: int
    reason: str
    status: str = Field(default="pending")  # pending, resolved, dismissed
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

#### GET /api/admin/stats
**Description:** Get dashboard statistics
**Response:**
```json
{
  "total_users": 15234,
  "total_models": 8921,
  "total_revenue": 125000.50,
  "active_users_today": 1234,
  "new_users_today": 45,
  "pending_models": 12,
  "pending_tickets": 5
}
```

#### GET /api/admin/users
**Description:** Get all users with filters
**Query Parameters:**
- page, limit, search, user_type, is_verified, status

#### PUT /api/admin/users/{user_id}
**Description:** Update user (ban, verify, etc.)
```json
{
  "is_active": false,
  "is_verified_creator": true
}
```

#### GET /api/admin/models
**Description:** Get all models for moderation
**Query Parameters:**
- status: pending, approved, rejected

#### PUT /api/admin/models/{model_id}/approve
**Description:** Approve model

#### PUT /api/admin/models/{model_id}/reject
**Description:** Reject model
```json
{
  "reason": "Does not meet quality standards"
}
```

#### GET /api/admin/communities
**Description:** Get all communities

#### PUT /api/admin/communities/{community_id}/approve
**Description:** Approve community

#### DELETE /api/admin/communities/{community_id}
**Description:** Delete community

#### GET /api/admin/reports
**Description:** Get content reports

#### PUT /api/admin/reports/{report_id}/resolve
**Description:** Resolve report
```json
{
  "action": "remove",
  "notes": "Content removed for violating guidelines"
}
```

#### GET /api/admin/transactions
**Description:** Get all transactions

#### GET /api/admin/analytics
**Description:** Get detailed analytics
**Query Parameters:**
- start_date, end_date, metric_type

#### POST /api/admin/announcements
**Description:** Send announcement to users
```json
{
  "title": "New Feature Launch",
  "message": "We've added community features!",
  "target": "all"
}
```

---

## 8. File Upload & Storage

### API Endpoints

#### POST /api/upload/model
**Description:** Upload 3D model file
**Request:** Multipart form data
**Response:**
```json
{
  "file_url": "https://cdn.hwc3d.com/models/abc123.glb",
  "file_size": 15728640,
  "file_format": "GLB"
}
```

#### POST /api/upload/image
**Description:** Upload image (thumbnail, preview)
**Response:**
```json
{
  "image_url": "https://cdn.hwc3d.com/images/xyz789.jpg"
}
```

#### POST /api/upload/avatar
**Description:** Upload user avatar

#### DELETE /api/upload/{file_id}
**Description:** Delete uploaded file

---

## 9. Real-time Features

### WebSocket Endpoints

#### WS /ws/support/{ticket_id}
**Description:** Real-time support chat
**Events:**
- message_received
- typing_indicator
- ticket_status_changed

#### WS /ws/community/{community_id}
**Description:** Real-time community updates
**Events:**
- new_post
- new_comment
- new_reaction
- member_joined

#### WS /ws/notifications
**Description:** Real-time notifications
**Events:**
- new_follower
- model_liked
- model_purchased
- comment_received

---

## 10. Analytics & Reporting

### API Endpoints

#### GET /api/analytics/dashboard
**Description:** Get creator dashboard analytics
**Response:**
```json
{
  "total_views": 15234,
  "total_likes": 892,
  "total_downloads": 456,
  "total_revenue": 5420.50,
  "top_models": [...],
  "revenue_chart": [...]
}
```

#### GET /api/analytics/models/{model_id}
**Description:** Get model-specific analytics

#### GET /api/leaderboard
**Description:** Get creator leaderboard
**Query Parameters:**
- period: week, month, all_time
- metric: sales, downloads, rating

---

## Additional Features

### Bounties System

```python
class Bounty(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="user.id")
    title: str
    description: str
    requirements: str
    budget: float
    deadline: datetime
    status: str = Field(default="open")  # open, in_progress, completed, cancelled
    winner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### GET /api/bounties
#### POST /api/bounties
#### GET /api/bounties/{bounty_id}
#### POST /api/bounties/{bounty_id}/apply
#### PUT /api/bounties/{bounty_id}/select-winner

### Learning Center

```python
class Course(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    instructor_id: int = Field(foreign_key="user.id")
    thumbnail_url: str
    video_url: str
    duration: int  # in minutes
    difficulty: str  # beginner, intermediate, advanced
    is_free: bool = Field(default=True)
    price: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### GET /api/courses
#### GET /api/courses/{course_id}
#### POST /api/courses/{course_id}/enroll

---

## Security & Best Practices

### Authentication
- Use JWT tokens with 15-minute expiry
- Refresh tokens with 7-day expiry
- Store refresh tokens in httpOnly cookies
- Implement rate limiting on auth endpoints

### File Upload
- Validate file types and sizes
- Scan for malware
- Generate unique filenames
- Use CDN for delivery
- Implement signed URLs for downloads

### Database
- Use connection pooling
- Implement database migrations
- Regular backups
- Index frequently queried fields

### Caching
- Use Redis for:
  - Session storage
  - Rate limiting
  - Frequently accessed data
  - Real-time features

### API Rate Limiting
- 100 requests/minute for authenticated users
- 20 requests/minute for unauthenticated
- 1000 requests/minute for admin

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/hwc3d
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# File Storage
S3_BUCKET_NAME=hwc3d-models
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
CDN_URL=https://cdn.hwc3d.com

# Payment
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@hwc3d.com
SMTP_PASSWORD=your-password

# OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Admin
ADMIN_EMAIL=admin@hwc3d.com
ADMIN_PASSWORD=SecureAdminPass123!
```

---

## Testing Endpoints

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

Error response format:
```json
{
  "detail": "Error message here",
  "error_code": "INVALID_CREDENTIALS"
}
```

---

**End of Backend API Documentation**
