# Frontend-Backend Integration Guide
## Complete Implementation Checklist for HWC3D

**Version:** 1.0  
**Last Updated:** February 16, 2024

---

## Overview

This document maps every frontend component, button, form, and feature to the required backend API endpoints. Use this as a checklist to ensure complete integration.

---

## 1. Authentication Pages

### `/app/auth/page.tsx` - Main Auth Page
**Components Used:**
- AuthForm.tsx
- AuthTerminal.tsx
- OTPInput.tsx
- SocialAuthButtons.tsx
- UserPathSelector.tsx

**Required API Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/oauth/google
POST /api/auth/oauth/github
POST /api/auth/oauth/discord
POST /api/auth/resend-verification
```

**Frontend Actions:**
1. Sign Up button → POST /api/auth/register
2. Login button → POST /api/auth/login
3. Google OAuth → POST /api/auth/oauth/google
4. GitHub OAuth → POST /api/auth/oauth/github
5. Discord OAuth → POST /api/auth/oauth/discord
6. OTP verification → POST /api/auth/verify-email
7. Resend OTP → POST /api/auth/resend-verification

---

### `/app/admin/login/page.tsx` - Admin Login
**Required API Endpoints:**
```
POST /api/auth/admin/login
POST /api/auth/admin/verify-otp
```

**Frontend Actions:**
1. Email/Password submit → POST /api/auth/admin/login
2. OTP verification → POST /api/auth/admin/verify-otp

---

### `/app/admin/forgot-password/page.tsx` - Admin Password Reset
**Required API Endpoints:**
```
POST /api/auth/admin/forgot-password
```

**Frontend Actions:**
1. Send reset link → POST /api/auth/admin/forgot-password

---

### `/app/admin/reset-password/page.tsx` - Admin Password Reset Confirmation
**Required API Endpoints:**
```
POST /api/auth/admin/reset-password
```

**Frontend Actions:**
1. Reset password → POST /api/auth/admin/reset-password

---

## 2. Homepage

### `/app/page.tsx` - Landing Page
**Required API Endpoints:**
```
GET /api/models/featured
GET /api/stats/platform
GET /api/testimonials
GET /api/creators/top
```

**Frontend Actions:**
1. Load featured models → GET /api/models/featured
2. Load platform stats → GET /api/stats/platform
3. Load testimonials → GET /api/testimonials
4. Load top creators → GET /api/creators/top
5. Search models → GET /api/models?search={query}
6. Newsletter signup → POST /api/newsletter/subscribe

---

## 3. Marketplace

### `/app/marketplace/page.tsx` - Marketplace
**Required API Endpoints:**
```
GET /api/models
GET /api/categories
POST /api/models/{id}/like
DELETE /api/models/{id}/like
POST /api/cart
```

**Frontend Actions:**
1. Load models → GET /api/models?page={page}&category={cat}&sort={sort}
2. Filter by category → GET /api/models?category={category}
3. Filter by price → GET /api/models?min_price={min}&max_price={max}
4. Sort models → GET /api/models?sort={newest|popular|price_low|price_high}
5. Search → GET /api/models?search={query}
6. Like model → POST /api/models/{id}/like
7. Unlike model → DELETE /api/models/{id}/like
8. Add to cart → POST /api/cart
9. View model → Navigate to /model/{id}

---

## 4. Model Detail Page

### `/app/model/[id]/page.tsx` - 3D Model Viewer & Purchase
**Required API Endpoints:**
```
GET /api/models/{id}
GET /api/models/{id}/creator
POST /api/models/{id}/like
POST /api/models/{id}/view
POST /api/cart
POST /api/checkout
POST /api/models/{id}/comments
GET /api/models/{id}/comments
GET /api/models/{id}/related
POST /api/models/{id}/download-specs
POST /api/models/{id}/record-video
POST /api/models/{id}/screenshot
```

**Frontend Actions:**
1. Load model data → GET /api/models/{id}
2. Load creator info → GET /api/models/{id}/creator
3. Increment view count → POST /api/models/{id}/view
4. Like model → POST /api/models/{id}/like
5. Add to cart → POST /api/cart
6. Buy now → POST /api/checkout
7. Add comment → POST /api/models/{id}/comments
8. Load comments → GET /api/models/{id}/comments
9. Load related models → GET /api/models/{id}/related
10. Download specs → POST /api/models/{id}/download-specs
11. Export video → POST /api/models/{id}/record-video
12. Capture screenshot → POST /api/models/{id}/screenshot
13. Material swapper → Update local state (no API)
14. Lighting changes → Update local state (no API)
15. Camera controls → Update local state (no API)

---

## 5. Public Model View

### `/app/view/[id]/page.tsx` - Public Model Viewer
**Required API Endpoints:**
```
GET /api/models/{id}/public
POST /api/models/{id}/like
POST /api/models/{id}/share
POST /api/models/{id}/comments
GET /api/models/{id}/comments
```

**Frontend Actions:**
1. Load model → GET /api/models/{id}/public
2. Like model → POST /api/models/{id}/like
3. Share model → POST /api/models/{id}/share (copy link)
4. Add comment → POST /api/models/{id}/comments
5. Load comments → GET /api/models/{id}/comments
6. Buy now → Navigate to /model/{id}

---

## 6. Upload Page

### `/app/upload/page.tsx` - Model Upload
**Required API Endpoints:**
```
POST /api/upload/model
POST /api/upload/image
POST /api/models
GET /api/categories
POST /api/models/analyze
```

**Frontend Actions:**
1. Upload model file → POST /api/upload/model
2. Upload thumbnail → POST /api/upload/image
3. Upload preview images → POST /api/upload/image (multiple)
4. Analyze model → POST /api/models/analyze
5. Get AI tags → POST /api/ai/generate-tags
6. Safety scan → POST /api/models/safety-scan
7. Submit model → POST /api/models
8. Load categories → GET /api/categories

---

## 7. User Dashboard

### `/app/dashboard/page.tsx` - Main Dashboard
**Required API Endpoints:**
```
GET /api/users/me/dashboard
GET /api/users/me/models
GET /api/users/me/sales
GET /api/users/me/analytics
```

**Frontend Actions:**
1. Load dashboard data → GET /api/users/me/dashboard
2. Load user models → GET /api/users/me/models
3. Load sales data → GET /api/users/me/sales
4. Load analytics → GET /api/users/me/analytics

---

### `/app/dashboard/inventory/page.tsx` - Inventory
**Required API Endpoints:**
```
GET /api/users/me/models
PUT /api/models/{id}
DELETE /api/models/{id}
POST /api/models/{id}/toggle-publish
```

**Frontend Actions:**
1. Load models → GET /api/users/me/models
2. Edit model → PUT /api/models/{id}
3. Delete model → DELETE /api/models/{id}
4. Toggle publish → POST /api/models/{id}/toggle-publish
5. View analytics → GET /api/models/{id}/analytics

---

### `/app/dashboard/financials/page.tsx` - Financials
**Required API Endpoints:**
```
GET /api/users/me/transactions
GET /api/users/me/revenue
POST /api/users/me/payout-request
GET /api/users/me/payout-methods
POST /api/users/me/payout-methods
```

**Frontend Actions:**
1. Load transactions → GET /api/users/me/transactions
2. Load revenue data → GET /api/users/me/revenue
3. Request payout → POST /api/users/me/payout-request
4. Load payout methods → GET /api/users/me/payout-methods
5. Add payout method → POST /api/users/me/payout-methods

---

### `/app/dashboard/messages/page.tsx` - Messages
**Required API Endpoints:**
```
GET /api/messages
GET /api/messages/{conversation_id}
POST /api/messages
PUT /api/messages/{id}/read
```

**Frontend Actions:**
1. Load conversations → GET /api/messages
2. Load messages → GET /api/messages/{conversation_id}
3. Send message → POST /api/messages
4. Mark as read → PUT /api/messages/{id}/read

---

### `/app/dashboard/social/page.tsx` - Social
**Required API Endpoints:**
```
GET /api/users/me/followers
GET /api/users/me/following
GET /api/users/me/notifications
PUT /api/notifications/{id}/read
```

**Frontend Actions:**
1. Load followers → GET /api/users/me/followers
2. Load following → GET /api/users/me/following
3. Load notifications → GET /api/users/me/notifications
4. Mark notification read → PUT /api/notifications/{id}/read

---

### `/app/dashboard/settings/page.tsx` - Settings
**Required API Endpoints:**
```
GET /api/users/me
PUT /api/users/me
PUT /api/users/me/password
POST /api/upload/avatar
DELETE /api/users/me/account
```

**Frontend Actions:**
1. Load profile → GET /api/users/me
2. Update profile → PUT /api/users/me
3. Change password → PUT /api/users/me/password
4. Upload avatar → POST /api/upload/avatar
5. Delete account → DELETE /api/users/me/account

---

## 8. Community Features

### `/app/community/page.tsx` - Community Hub
**Required API Endpoints:**
```
GET /api/communities
POST /api/communities
POST /api/communities/{id}/join
DELETE /api/communities/{id}/leave
GET /api/communities/messages
POST /api/communities/messages
```

**Frontend Actions:**
1. Load communities → GET /api/communities
2. Search communities → GET /api/communities?search={query}
3. Filter by category → GET /api/communities?category={cat}
4. Create community → POST /api/communities
5. Join community → POST /api/communities/{id}/join
6. Leave community → DELETE /api/communities/{id}/leave
7. Load chat messages → GET /api/communities/messages
8. Send chat message → POST /api/communities/messages

---

### `/app/community/[id]/page.tsx` - Community View
**Required API Endpoints:**
```
GET /api/communities/{id}
GET /api/communities/{id}/members
POST /api/communities/{id}/join
DELETE /api/communities/{id}/leave
GET /api/communities/{id}/posts
POST /api/communities/{id}/posts
POST /api/posts/{id}/react
DELETE /api/posts/{id}/react
POST /api/posts/{id}/comments
GET /api/posts/{id}/comments
POST /api/posts/{id}/share
POST /api/posts/{id}/report
POST /api/upload/image
POST /api/upload/model
```

**Frontend Actions:**
1. Load community → GET /api/communities/{id}
2. Load members → GET /api/communities/{id}/members
3. Join/Leave → POST/DELETE /api/communities/{id}/join
4. Load posts → GET /api/communities/{id}/posts?filter={recent|popular|media}
5. Create post → POST /api/communities/{id}/posts
6. Upload image → POST /api/upload/image
7. Upload 3D model → POST /api/upload/model
8. React to post → POST /api/posts/{id}/react
9. Remove reaction → DELETE /api/posts/{id}/react
10. Add comment → POST /api/posts/{id}/comments
11. Load comments → GET /api/posts/{id}/comments
12. Share post → POST /api/posts/{id}/share
13. Report post → POST /api/posts/{id}/report

---

## 9. Support System

### `/app/support/page.tsx` - Support Chat
**Required API Endpoints:**
```
GET /api/support/tickets
POST /api/support/tickets
GET /api/support/tickets/{id}
POST /api/support/tickets/{id}/messages
POST /api/upload/attachment
```

**Frontend Actions:**
1. Load tickets → GET /api/support/tickets
2. Create ticket → POST /api/support/tickets
3. Load ticket messages → GET /api/support/tickets/{id}
4. Send message → POST /api/support/tickets/{id}/messages
5. Upload attachment → POST /api/upload/attachment

---

## 10. Bounties

### `/app/bounties/page.tsx` - Bounties
**Required API Endpoints:**
```
GET /api/bounties
POST /api/bounties
GET /api/bounties/{id}
POST /api/bounties/{id}/apply
```

**Frontend Actions:**
1. Load bounties → GET /api/bounties
2. Filter bounties → GET /api/bounties?status={open|in_progress|completed}
3. Create bounty → POST /api/bounties
4. View bounty → GET /api/bounties/{id}
5. Apply to bounty → POST /api/bounties/{id}/apply

---

## 11. Learning Center

### `/app/learn/page.tsx` - Learning Center
**Required API Endpoints:**
```
GET /api/courses
GET /api/courses/{id}
POST /api/courses/{id}/enroll
GET /api/users/me/courses
```

**Frontend Actions:**
1. Load courses → GET /api/courses
2. Filter courses → GET /api/courses?difficulty={level}&category={cat}
3. View course → GET /api/courses/{id}
4. Enroll in course → POST /api/courses/{id}/enroll
5. Load enrolled courses → GET /api/users/me/courses

---

## 12. Leaderboard

### `/app/leaderboard/page.tsx` - Creator Leaderboard
**Required API Endpoints:**
```
GET /api/leaderboard
```

**Frontend Actions:**
1. Load leaderboard → GET /api/leaderboard?period={week|month|all_time}&metric={sales|downloads|rating}

---

## 13. Admin Dashboard

### `/app/admin/page.tsx` - Admin Overview
**Required API Endpoints:**
```
GET /api/admin/stats
GET /api/admin/recent-activity
GET /api/admin/alerts
```

**Frontend Actions:**
1. Load dashboard stats → GET /api/admin/stats
2. Load recent activity → GET /api/admin/recent-activity
3. Load system alerts → GET /api/admin/alerts

---

### `/app/admin/users/page.tsx` - User Management
**Required API Endpoints:**
```
GET /api/admin/users
GET /api/admin/users/{id}
PUT /api/admin/users/{id}
DELETE /api/admin/users/{id}
POST /api/admin/users/{id}/ban
POST /api/admin/users/{id}/unban
POST /api/admin/users/{id}/verify
```

**Frontend Actions:**
1. Load users → GET /api/admin/users?page={page}&search={query}&user_type={type}
2. View user details → GET /api/admin/users/{id}
3. Update user → PUT /api/admin/users/{id}
4. Delete user → DELETE /api/admin/users/{id}
5. Ban user → POST /api/admin/users/{id}/ban
6. Unban user → POST /api/admin/users/{id}/unban
7. Verify creator → POST /api/admin/users/{id}/verify

---

### `/app/admin/models/page.tsx` - Model Management
**Required API Endpoints:**
```
GET /api/admin/models
GET /api/admin/models/{id}
PUT /api/admin/models/{id}/approve
PUT /api/admin/models/{id}/reject
DELETE /api/admin/models/{id}
PUT /api/admin/models/{id}/feature
```

**Frontend Actions:**
1. Load models → GET /api/admin/models?status={pending|approved|rejected}
2. View model → GET /api/admin/models/{id}
3. Approve model → PUT /api/admin/models/{id}/approve
4. Reject model → PUT /api/admin/models/{id}/reject
5. Delete model → DELETE /api/admin/models/{id}
6. Feature model → PUT /api/admin/models/{id}/feature

---

### `/app/admin/communities/page.tsx` - Community Management
**Required API Endpoints:**
```
GET /api/admin/communities
GET /api/admin/communities/{id}
POST /api/admin/communities
PUT /api/admin/communities/{id}
DELETE /api/admin/communities/{id}
PUT /api/admin/communities/{id}/approve
GET /api/admin/reports
PUT /api/admin/reports/{id}/resolve
```

**Frontend Actions:**
1. Load communities → GET /api/admin/communities?status={all|pending|active}
2. View community → GET /api/admin/communities/{id}
3. Create community → POST /api/admin/communities
4. Update community → PUT /api/admin/communities/{id}
5. Delete community → DELETE /api/admin/communities/{id}
6. Approve community → PUT /api/admin/communities/{id}/approve
7. Load reports → GET /api/admin/reports
8. Resolve report → PUT /api/admin/reports/{id}/resolve

---

### `/app/admin/support/page.tsx` - Support Management
**Required API Endpoints:**
```
GET /api/admin/support/tickets
GET /api/admin/support/tickets/{id}
POST /api/admin/support/tickets/{id}/messages
PUT /api/admin/support/tickets/{id}/status
PUT /api/admin/support/tickets/{id}/assign
POST /api/admin/support/tickets/{id}/email
```

**Frontend Actions:**
1. Load tickets → GET /api/admin/support/tickets?status={active|pending|resolved}
2. View ticket → GET /api/admin/support/tickets/{id}
3. Send message → POST /api/admin/support/tickets/{id}/messages
4. Update status → PUT /api/admin/support/tickets/{id}/status
5. Assign ticket → PUT /api/admin/support/tickets/{id}/assign
6. Email user → POST /api/admin/support/tickets/{id}/email

---

### `/app/admin/revenue/page.tsx` - Revenue Management
**Required API Endpoints:**
```
GET /api/admin/revenue/stats
GET /api/admin/revenue/transactions
GET /api/admin/revenue/payouts
POST /api/admin/revenue/payouts/{id}/approve
POST /api/admin/revenue/payouts/{id}/reject
```

**Frontend Actions:**
1. Load revenue stats → GET /api/admin/revenue/stats
2. Load transactions → GET /api/admin/revenue/transactions
3. Load payout requests → GET /api/admin/revenue/payouts
4. Approve payout → POST /api/admin/revenue/payouts/{id}/approve
5. Reject payout → POST /api/admin/revenue/payouts/{id}/reject

---

### `/app/admin/analytics/page.tsx` - Analytics
**Required API Endpoints:**
```
GET /api/admin/analytics/overview
GET /api/admin/analytics/users
GET /api/admin/analytics/models
GET /api/admin/analytics/revenue
```

**Frontend Actions:**
1. Load overview → GET /api/admin/analytics/overview
2. Load user analytics → GET /api/admin/analytics/users
3. Load model analytics → GET /api/admin/analytics/models
4. Load revenue analytics → GET /api/admin/analytics/revenue

---

### `/app/admin/categories/page.tsx` - Category Management
**Required API Endpoints:**
```
GET /api/admin/categories
POST /api/admin/categories
PUT /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

**Frontend Actions:**
1. Load categories → GET /api/admin/categories
2. Create category → POST /api/admin/categories
3. Update category → PUT /api/admin/categories/{id}
4. Delete category → DELETE /api/admin/categories/{id}

---

### `/app/admin/bounties/page.tsx` - Bounty Management
**Required API Endpoints:**
```
GET /api/admin/bounties
PUT /api/admin/bounties/{id}
DELETE /api/admin/bounties/{id}
```

**Frontend Actions:**
1. Load bounties → GET /api/admin/bounties
2. Update bounty → PUT /api/admin/bounties/{id}
3. Delete bounty → DELETE /api/admin/bounties/{id}

---

### `/app/admin/learning/page.tsx` - Learning Management
**Required API Endpoints:**
```
GET /api/admin/courses
POST /api/admin/courses
PUT /api/admin/courses/{id}
DELETE /api/admin/courses/{id}
```

**Frontend Actions:**
1. Load courses → GET /api/admin/courses
2. Create course → POST /api/admin/courses
3. Update course → PUT /api/admin/courses/{id}
4. Delete course → DELETE /api/admin/courses/{id}

---

### `/app/admin/testimonials/page.tsx` - Testimonial Management
**Required API Endpoints:**
```
GET /api/admin/testimonials
POST /api/admin/testimonials
PUT /api/admin/testimonials/{id}
DELETE /api/admin/testimonials/{id}
PUT /api/admin/testimonials/{id}/approve
```

**Frontend Actions:**
1. Load testimonials → GET /api/admin/testimonials
2. Create testimonial → POST /api/admin/testimonials
3. Update testimonial → PUT /api/admin/testimonials/{id}
4. Delete testimonial → DELETE /api/admin/testimonials/{id}
5. Approve testimonial → PUT /api/admin/testimonials/{id}/approve

---

### `/app/admin/slider/page.tsx` - Homepage Slider Management
**Required API Endpoints:**
```
GET /api/admin/slider
POST /api/admin/slider
PUT /api/admin/slider/{id}
DELETE /api/admin/slider/{id}
POST /api/upload/image
```

**Frontend Actions:**
1. Load slides → GET /api/admin/slider
2. Create slide → POST /api/admin/slider
3. Update slide → PUT /api/admin/slider/{id}
4. Delete slide → DELETE /api/admin/slider/{id}
5. Upload image → POST /api/upload/image

---

### `/app/admin/emails/page.tsx` - Email Management
**Required API Endpoints:**
```
GET /api/admin/emails/templates
POST /api/admin/emails/templates
PUT /api/admin/emails/templates/{id}
DELETE /api/admin/emails/templates/{id}
POST /api/admin/emails/send
GET /api/admin/emails/history
```

**Frontend Actions:**
1. Load templates → GET /api/admin/emails/templates
2. Create template → POST /api/admin/emails/templates
3. Update template → PUT /api/admin/emails/templates/{id}
4. Delete template → DELETE /api/admin/emails/templates/{id}
5. Send email → POST /api/admin/emails/send
6. View history → GET /api/admin/emails/history

---

### `/app/admin/settings/page.tsx` - Platform Settings
**Required API Endpoints:**
```
GET /api/admin/settings
PUT /api/admin/settings
```

**Frontend Actions:**
1. Load settings → GET /api/admin/settings
2. Update settings → PUT /api/admin/settings

---

## 14. Real-time Features (WebSocket)

### Support Chat
**WebSocket Connection:**
```
WS /ws/support/{ticket_id}
```

**Events to Handle:**
- `message_received` - New message from user/admin
- `typing_indicator` - User is typing
- `ticket_status_changed` - Status updated

---

### Community Chat
**WebSocket Connection:**
```
WS /ws/community/{community_id}
```

**Events to Handle:**
- `new_post` - New post created
- `new_comment` - New comment added
- `new_reaction` - New reaction added
- `member_joined` - New member joined

---

### Notifications
**WebSocket Connection:**
```
WS /ws/notifications
```

**Events to Handle:**
- `new_follower` - Someone followed you
- `model_liked` - Your model was liked
- `model_purchased` - Your model was purchased
- `comment_received` - Someone commented on your model
- `bounty_application` - Someone applied to your bounty

---

## 15. File Upload Requirements

### Model Files
**Endpoint:** POST /api/upload/model  
**Accepted Formats:** .glb, .gltf, .fbx, .obj, .blend  
**Max Size:** 100MB  
**Response:**
```json
{
  "file_url": "https://cdn.hwc3d.com/models/abc123.glb",
  "file_size": 15728640,
  "file_format": "GLB",
  "poly_count": 45000,
  "vertex_count": 23000
}
```

---

### Images
**Endpoint:** POST /api/upload/image  
**Accepted Formats:** .jpg, .jpeg, .png, .webp  
**Max Size:** 10MB  
**Response:**
```json
{
  "image_url": "https://cdn.hwc3d.com/images/xyz789.jpg",
  "width": 1920,
  "height": 1080
}
```

---

### Avatars
**Endpoint:** POST /api/upload/avatar  
**Accepted Formats:** .jpg, .jpeg, .png  
**Max Size:** 2MB  
**Response:**
```json
{
  "avatar_url": "https://cdn.hwc3d.com/avatars/user123.jpg"
}
```

---

## 16. Payment Integration

### Checkout Flow
1. User adds items to cart → POST /api/cart
2. User proceeds to checkout → GET /api/cart
3. User enters payment details → POST /api/checkout
4. Backend processes payment (Stripe/PayPal)
5. On success → Create transaction, purchase records
6. Send confirmation email
7. Return success response with download links

**Endpoint:** POST /api/checkout  
**Request:**
```json
{
  "model_ids": [123, 456],
  "payment_method": "card",
  "payment_details": {
    "card_token": "tok_xxx",
    "billing_address": {...}
  }
}
```

**Response:**
```json
{
  "transaction_id": "TXN-2024-001234",
  "total_amount": 59.98,
  "platform_fee": 4.50,
  "purchases": [
    {
      "model_id": 123,
      "download_url": "https://cdn.hwc3d.com/downloads/secure/abc123"
    }
  ]
}
```

---

## 17. Search & Filtering

### Global Search
**Endpoint:** GET /api/search  
**Query Parameters:**
- q: search query
- type: models, users, communities, courses
- page, limit

**Example:**
```
GET /api/search?q=cyberpunk&type=models&page=1&limit=20
```

---

### Advanced Filters
**Models:**
- category, tags, price_range, poly_count_range, has_animations, has_rigging, is_free

**Users:**
- user_type, is_verified, country, skills

**Communities:**
- category, member_count_range, status

---

## 18. Notification System

### Get Notifications
**Endpoint:** GET /api/notifications  
**Response:**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "model_liked",
      "title": "Someone liked your model",
      "message": "Alex Chen liked 'Cyberpunk Character'",
      "is_read": false,
      "created_at": "2024-02-16T10:30:00Z",
      "action_url": "/model/123"
    }
  ],
  "unread_count": 5
}
```

### Mark as Read
**Endpoint:** PUT /api/notifications/{id}/read

### Mark All as Read
**Endpoint:** PUT /api/notifications/read-all

---

## 19. Error Handling

All API endpoints should return consistent error responses:

```json
{
  "detail": "Error message here",
  "error_code": "INVALID_CREDENTIALS",
  "field_errors": {
    "email": ["Invalid email format"],
    "password": ["Password too weak"]
  }
}
```

**Common Error Codes:**
- `INVALID_CREDENTIALS` - Login failed
- `EMAIL_ALREADY_EXISTS` - Registration failed
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - No permission
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Input validation failed
- `PAYMENT_FAILED` - Payment processing failed
- `FILE_TOO_LARGE` - Upload size exceeded
- `INVALID_FILE_TYPE` - Unsupported file format

---

## 20. Authentication Flow

### JWT Token Management
1. User logs in → Receive access_token (15 min) and refresh_token (7 days)
2. Store access_token in memory
3. Store refresh_token in httpOnly cookie
4. Include access_token in Authorization header: `Bearer {token}`
5. On 401 error → Use refresh_token to get new access_token
6. If refresh fails → Redirect to login

### Protected Routes
All routes under `/dashboard`, `/admin`, `/upload` require authentication.

**Frontend Implementation:**
```typescript
// Add to all API calls
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

## 21. Rate Limiting

**Limits:**
- Authentication endpoints: 5 requests/minute
- Upload endpoints: 10 requests/hour
- General API: 100 requests/minute
- Admin API: 1000 requests/minute

**Response when rate limited:**
```json
{
  "detail": "Rate limit exceeded. Try again in 60 seconds.",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60
}
```

---

## 22. Pagination

All list endpoints support pagination:

**Query Parameters:**
- page: int (default: 1)
- limit: int (default: 20, max: 100)

**Response Format:**
```json
{
  "items": [...],
  "total": 1234,
  "page": 1,
  "limit": 20,
  "pages": 62
}
```

---

## 23. Testing Checklist

### Authentication
- [ ] User registration works
- [ ] Email verification works
- [ ] Login works
- [ ] OAuth login works (Google, GitHub, Discord)
- [ ] Password reset works
- [ ] Admin login with 2FA works

### Models
- [ ] Upload model works
- [ ] View model works
- [ ] Like/unlike works
- [ ] Comment works
- [ ] Purchase works
- [ ] Download works

### Community
- [ ] Create community works
- [ ] Join/leave works
- [ ] Create post works
- [ ] React to post works
- [ ] Comment on post works
- [ ] Report post works

### Support
- [ ] Create ticket works
- [ ] Send message works
- [ ] Admin can respond
- [ ] Status updates work

### Admin
- [ ] All CRUD operations work
- [ ] Approval workflows work
- [ ] Analytics load correctly
- [ ] Reports work

### Real-time
- [ ] WebSocket connections work
- [ ] Messages arrive in real-time
- [ ] Notifications work

---

## 24. Environment Setup

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_CDN_URL=https://cdn.hwc3d.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost/hwc3d
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key
S3_BUCKET_NAME=hwc3d-models
STRIPE_SECRET_KEY=sk_test_xxx
SMTP_HOST=smtp.gmail.com
```

---

**End of Integration Guide**

Use this document as a complete checklist to ensure every frontend feature is properly connected to the backend API.
