# 🔗 Complete Backend Integration Guide
## All 59 Pages - FastAPI + SQLModel + PostgreSQL

**Last Updated:** February 16, 2024  
**Status:** Complete mapping for all frontend pages  
**Backend Stack:** Python FastAPI, SQLModel, PostgreSQL, Redis, S3

---

## 📊 Overview

This document provides complete backend integration requirements for all 59 frontend pages, including:
- Database models (SQLModel schemas)
- API endpoints with request/response examples
- Real-time features (WebSocket)
- File upload handling
- Email notifications
- Authentication & authorization

---

## 🗄️ Database Models (SQLModel)

### 1. User & Authentication

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # User type
    user_type: str = Field(default="buyer")  # buyer, creator, admin
    is_verified: bool = Field(default=False)
    is_active: bool = Field(default=True)
    
    # OAuth
    google_id: Optional[str] = None
    github_id: Optional[str] = None
    discord_id: Optional[str] = None
    
    # Creator stats
    total_sales: float = Field(default=0.0)
    total_models: int = Field(default=0)
    rating: float = Field(default=0.0)
    followers_count: int = Field(default=0)
    following_count: int = Field(default=0)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

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

### 2. 3D Models

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
    preview_images: str = Field(default="[]")  # JSON array
    file_size: int  # bytes
    file_formats: str = Field(default="[]")  # ["GLB", "FBX", "OBJ"]
    
    # Model specs
    poly_count: int
    vertex_count: int
    texture_resolution: Optional[str] = None
    has_animations: bool = Field(default=False)
    has_rigging: bool = Field(default=False)
    has_materials: bool = Field(default=True)
    has_textures: bool = Field(default=True)
    
    # Engagement
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

### 3. Blog System

```python
class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="user.id")
    title: str = Field(index=True)
    content: str  # Markdown content
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    category: str = Field(index=True)  # tutorials, news, updates
    tags: str = Field(default="[]")  # JSON array
    
    # Engagement
    views: int = Field(default=0)
    likes: int = Field(default=0)
    comment_count: int = Field(default=0)
    read_time: int = Field(default=5)  # minutes
    
    # Status
    status: str = Field(default="draft")  # draft, published
    is_featured: bool = Field(default=False)
    
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BlogComment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="blogpost.id")
    author_id: int = Field(foreign_key="user.id")
    content: str
    parent_id: Optional[int] = Field(default=None, foreign_key="blogcomment.id")
    likes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlogLike(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    post_id: int = Field(foreign_key="blogpost.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 4. Collections

```python
class Collection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    name: str
    description: Optional[str] = None
    is_public: bool = Field(default=True)
    
    # Stats
    model_count: int = Field(default=0)
    views: int = Field(default=0)
    followers: int = Field(default=0)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CollectionModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    collection_id: int = Field(foreign_key="collection.id")
    model_id: int = Field(foreign_key="model.id")
    order: int = Field(default=0)
    added_at: datetime = Field(default_factory=datetime.utcnow)

class CollectionFollower(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    collection_id: int = Field(foreign_key="collection.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 5. E-commerce

```python
class Cart(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="model.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Coupon(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True)
    discount_percent: float
    max_uses: int
    used_count: int = Field(default=0)
    expires_at: datetime
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    buyer_id: int = Field(foreign_key="user.id")
    seller_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="model.id")
    
    amount: float
    platform_fee: float  # 7.5%
    seller_amount: float
    coupon_code: Optional[str] = None
    discount_amount: float = Field(default=0.0)
    
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
```

### 6. Community

```python
class Community(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: str
    icon: str  # emoji or URL
    banner_gradient: str
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
    image_url: Optional[str] = None
    model_url: Optional[str] = None
    
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

### 7. Support System

```python
class SupportTicket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    subject: str
    category: str  # Payment, Technical, Account, Refund
    priority: str = Field(default="medium")  # low, medium, high
    status: str = Field(default="pending")  # pending, active, resolved
    assigned_to: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class SupportMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="supportticket.id")
    sender_id: int = Field(foreign_key="user.id")
    sender_type: str  # user, admin
    content: str
    attachments: str = Field(default="[]")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 8. Notifications

```python
class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    type: str  # like, comment, purchase, follow, etc.
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 9. Additional Models

```python
class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    icon: str = "📦"
    enabled: bool = True
    model_count: int = 0
    order: int = 0

class Bounty(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="user.id")
    title: str
    description: str
    requirements: str
    budget: float
    deadline: datetime
    status: str = Field(default="open")
    winner_id: Optional[int] = None
    applicants: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Testimonial(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    author: str
    company: Optional[str] = None
    text: str
    rating: int = 5
    verified: bool = False
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Course(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    instructor_id: int = Field(foreign_key="user.id")
    thumbnail_url: str
    video_url: str
    duration: int  # minutes
    difficulty: str  # beginner, intermediate, advanced
    is_free: bool = Field(default=True)
    price: float = Field(default=0.0)
    views: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## 📡 API Endpoints by Page

### Homepage (`/`)
```
GET /api/stats/homepage
- Returns: featured models, trending models, top creators, platform stats
```

### Marketplace (`/marketplace`)
```
GET /api/models?page=1&limit=20&category=&search=&sort=
- Returns: paginated models with filters
```

### Model Detail (`/model/[id]`)
```
GET /api/models/:id
POST /api/models/:id/like
POST /api/models/:id/comment
GET /api/models/:id/comments
POST /api/models/:id/view (increment view count)
```

### Model View (`/view/[id]`)
```
GET /api/models/:id/public
POST /api/models/:id/comments
GET /api/models/:id/comments
```

### Upload (`/upload`)
```
POST /api/models/upload (multipart form data)
POST /api/upload/image
POST /api/upload/model-file
```

### Blog Listing (`/blog`)
```
GET /api/blog/posts?page=1&limit=10&category=&search=
GET /api/blog/categories
GET /api/blog/featured
```

### Blog Post (`/blog/[id]`)
```
GET /api/blog/posts/:id
POST /api/blog/posts/:id/like
DELETE /api/blog/posts/:id/like
POST /api/blog/posts/:id/comments
GET /api/blog/posts/:id/comments
POST /api/blog/posts/:id/share
```

### User Profile (`/profile/[username]`)
```
GET /api/users/:username
GET /api/users/:username/models
GET /api/users/:username/stats
POST /api/users/:username/follow
DELETE /api/users/:username/follow
```

### Followers (`/profile/[username]/followers`)
```
GET /api/users/:username/followers?page=1&limit=20
GET /api/users/:username/following?page=1&limit=20
```

### Search (`/search`)
```
GET /api/search?q=query&type=models&page=1&limit=20
- Types: models, users, communities, courses
```

### Collections Listing (`/collections`)
```
GET /api/collections?user_id=&page=1&limit=20
POST /api/collections
```

### Collection Detail (`/collections/[id]`)
```
GET /api/collections/:id
PUT /api/collections/:id
DELETE /api/collections/:id
POST /api/collections/:id/follow
GET /api/collections/:id/models
POST /api/collections/:id/add-model
DELETE /api/collections/:id/remove-model/:model_id
```

### Notifications (`/notifications`)
```
GET /api/notifications?page=1&limit=20&filter=all
PUT /api/notifications/:id/read
PUT /api/notifications/read-all
DELETE /api/notifications/:id
```

### Cart (`/cart`)
```
GET /api/cart
POST /api/cart (add item)
DELETE /api/cart/:model_id
POST /api/cart/apply-coupon
```

### Checkout (`/checkout`)
```
POST /api/checkout
GET /api/checkout/payment-methods
POST /api/checkout/process-payment
```

### Purchase Success (`/purchase/success`)
```
GET /api/purchases/:transaction_id
GET /api/purchases/:transaction_id/download-link
```

### Dashboard (`/dashboard`)
```
GET /api/dashboard/stats
GET /api/dashboard/recent-activity
GET /api/dashboard/sales-chart
```

### Dashboard Inventory (`/dashboard/inventory`)
```
GET /api/dashboard/models?status=&page=1
PUT /api/models/:id
DELETE /api/models/:id
```

### Dashboard Financials (`/dashboard/financials`)
```
GET /api/dashboard/revenue
GET /api/dashboard/transactions?page=1
GET /api/dashboard/payouts
POST /api/dashboard/request-payout
```

### Dashboard Messages (`/dashboard/messages`)
```
GET /api/messages/conversations
GET /api/messages/:conversation_id
POST /api/messages/:conversation_id/send
```

### Dashboard Social (`/dashboard/social`)
```
GET /api/dashboard/followers
GET /api/dashboard/notifications
GET /api/dashboard/activity
```

### Dashboard Settings (`/dashboard/settings`)
```
GET /api/users/me
PUT /api/users/me
PUT /api/users/me/password
POST /api/users/me/avatar
```

### Community Listing (`/community`)
```
GET /api/communities?page=1&category=&search=
POST /api/communities
```

### Community Detail (`/community/[id]`)
```
GET /api/communities/:id
POST /api/communities/:id/join
DELETE /api/communities/:id/leave
GET /api/communities/:id/posts?filter=recent
POST /api/communities/:id/posts
```

### Support (`/support`)
```
GET /api/support/tickets
POST /api/support/tickets
GET /api/support/tickets/:id
POST /api/support/tickets/:id/messages
```

### Admin Pages (`/admin/*`)
```
GET /api/admin/stats
GET /api/admin/models?status=pending
POST /api/admin/models/:id/approve
POST /api/admin/models/:id/reject
GET /api/admin/users
PUT /api/admin/users/:id
GET /api/admin/communities
PUT /api/admin/communities/:id/approve
GET /api/admin/support/tickets
PUT /api/admin/support/tickets/:id/assign
GET /api/admin/revenue
GET /api/admin/analytics
POST /api/admin/emails/send
```

### Pricing (`/pricing`)
```
GET /api/pricing/plans
POST /api/subscriptions/subscribe
PUT /api/subscriptions/cancel
```

### Help (`/help`)
```
GET /api/help/faqs?category=&search=
GET /api/help/categories
```

### Docs (`/docs`)
```
GET /api/docs/sections
GET /api/docs/:section
```

---

## 🔐 Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
POST /api/auth/oauth/google
POST /api/auth/oauth/github
POST /api/auth/oauth/discord
```

---

## 📤 File Upload Endpoints

```
POST /api/upload/model (3D files)
POST /api/upload/image (thumbnails, previews)
POST /api/upload/avatar
POST /api/upload/document
DELETE /api/upload/:file_id
```

---

## 🔔 WebSocket Endpoints

```
WS /ws/support/:ticket_id (real-time chat)
WS /ws/community/:community_id (live updates)
WS /ws/notifications (real-time notifications)
```

---

## 📧 Email Templates

1. Welcome email
2. Email verification
3. Password reset
4. Model approved
5. Model rejected
6. Sale notification
7. Purchase confirmation
8. New follower
9. Comment notification
10. Support ticket update

---

**Next:** Implement these endpoints in FastAPI to connect with your frontend!
