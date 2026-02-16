# 🔗 Backend Integration Guide - FastAPI + SQLModel

## Quick Start for Backend Development

### 1. Project Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlmodel psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart boto3 sendgrid
```

### 2. Basic FastAPI Structure

```
backend/
├── main.py
├── database.py
├── models/
│   ├── __init__.py
│   ├── user.py
│   ├── model.py
│   ├── transaction.py
│   └── ...
├── routers/
│   ├── __init__.py
│   ├── admin.py
│   ├── models.py
│   ├── users.py
│   └── ...
├── services/
│   ├── __init__.py
│   ├── email.py
│   ├── storage.py
│   └── ...
└── requirements.txt
```

---

## 3. Database Models (SQLModel)

### User Model
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: Optional[str] = None
    is_verified: bool = False
    is_admin: bool = False
    creator_level: str = "Bronze"  # Bronze, Silver, Gold, Platinum
    total_revenue: float = 0.0
    total_models: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    models: List["Model3D"] = Relationship(back_populates="creator")
    transactions: List["Transaction"] = Relationship(back_populates="buyer")
```

### 3D Model
```python
class Model3D(SQLModel, table=True):
    __tablename__ = "models"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    price: float
    poly_count: int
    category: str = Field(index=True)
    subcategory: Optional[str] = None
    
    # File info
    file_url: str
    thumbnail_url: Optional[str] = None
    formats: str  # JSON string: ["glb", "fbx", "obj"]
    
    # Metadata
    is_rigged: bool = False
    is_animated: bool = False
    texture_resolution: str = "2K"
    
    # Stats
    downloads: int = 0
    likes: int = 0
    views: int = 0
    rating: float = 0.0
    
    # Status
    status: str = "pending"  # pending, approved, rejected
    is_trending: bool = False
    is_featured: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign Keys
    creator_id: int = Field(foreign_key="user.id")
    
    # Relationships
    creator: User = Relationship(back_populates="models")
    transactions: List["Transaction"] = Relationship(back_populates="model")
```

### Transaction
```python
class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    platform_fee: float  # 7.5% of amount
    seller_revenue: float  # amount - platform_fee
    
    # Foreign Keys
    buyer_id: int = Field(foreign_key="user.id")
    seller_id: int = Field(foreign_key="user.id")
    model_id: int = Field(foreign_key="models.id")
    
    # Status
    status: str = "completed"  # pending, completed, refunded
    payment_method: str = "stripe"
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    buyer: User = Relationship(back_populates="transactions")
    model: Model3D = Relationship(back_populates="transactions")
```

### Category
```python
class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    icon: str = "📦"
    enabled: bool = True
    model_count: int = 0
    order: int = 0
```

### Bounty
```python
class Bounty(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    budget: float
    status: str = "Open"  # Open, In Progress, Completed, Closed
    applicants: int = 0
    
    # Foreign Keys
    creator_id: int = Field(foreign_key="user.id")
    winner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    deadline: Optional[datetime] = None
```

### Testimonial
```python
class Testimonial(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    author: str
    company: Optional[str] = None
    text: str
    rating: int = 5
    verified: bool = False
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Tutorial
```python
class Tutorial(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str  # Markdown content
    category: str  # Beginner, Intermediate, Advanced
    views: int = 0
    published: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Email Campaign
```python
class EmailCampaign(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    subject: str
    content: str  # HTML content
    segment: str  # all, creators, buyers
    
    # Stats
    sent: int = 0
    opened: int = 0
    clicked: int = 0
    
    status: str = "draft"  # draft, sent, scheduled
    scheduled_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## 4. API Endpoints Structure

### Admin Endpoints (`routers/admin.py`)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Stats
@router.get("/stats")
async def get_admin_stats(session: Session = Depends(get_session)):
    """Get live platform statistics"""
    total_users = session.exec(select(User)).count()
    total_models = session.exec(select(Model3D)).count()
    pending_models = session.exec(select(Model3D).where(Model3D.status == "pending")).count()
    
    # Calculate revenue
    transactions = session.exec(select(Transaction)).all()
    total_revenue = sum(t.amount for t in transactions)
    platform_fees = sum(t.platform_fee for t in transactions)
    
    return {
        "totalRevenue": total_revenue,
        "platformFees": platform_fees,
        "activeUsers": total_users,
        "pendingModels": pending_models,
        "totalModels": total_models,
        "serverLoad": 34  # Get from system monitoring
    }

# Models Management
@router.get("/models/pending")
async def get_pending_models(session: Session = Depends(get_session)):
    """Get all pending models for review"""
    models = session.exec(
        select(Model3D).where(Model3D.status == "pending")
    ).all()
    return models

@router.post("/models/{model_id}/approve")
async def approve_model(model_id: int, session: Session = Depends(get_session)):
    """Approve a pending model"""
    model = session.get(Model3D, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    model.status = "approved"
    session.add(model)
    session.commit()
    
    # Send email to creator
    # await send_email(model.creator.email, "model_approved", {...})
    
    return {"message": "Model approved successfully"}

@router.post("/models/{model_id}/reject")
async def reject_model(model_id: int, reason: str, session: Session = Depends(get_session)):
    """Reject a pending model"""
    model = session.get(Model3D, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    model.status = "rejected"
    session.add(model)
    session.commit()
    
    # Send email to creator with reason
    # await send_email(model.creator.email, "model_rejected", {"reason": reason})
    
    return {"message": "Model rejected"}

# User Management
@router.get("/users")
async def get_all_users(session: Session = Depends(get_session)):
    """Get all users"""
    users = session.exec(select(User)).all()
    return users

@router.post("/users/{user_id}/verify")
async def verify_user(user_id: int, session: Session = Depends(get_session)):
    """Verify a creator"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    session.add(user)
    session.commit()
    
    return {"message": "User verified successfully"}

@router.post("/users/{user_id}/ban")
async def ban_user(user_id: int, session: Session = Depends(get_session)):
    """Ban a user"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Implement ban logic (add is_banned field to User model)
    # user.is_banned = True
    session.add(user)
    session.commit()
    
    return {"message": "User banned successfully"}

# Homepage Management
@router.get("/homepage")
async def get_homepage_content(session: Session = Depends(get_session)):
    """Get homepage content"""
    # Implement homepage content storage
    pass

@router.put("/homepage")
async def update_homepage_content(content: dict, session: Session = Depends(get_session)):
    """Update homepage content"""
    # Implement homepage content update
    pass

# Slider Management
@router.get("/slider")
async def get_slider_models(session: Session = Depends(get_session)):
    """Get current slider models"""
    # Implement slider storage (could be a separate table)
    pass

@router.put("/slider")
async def update_slider(model_ids: List[int], session: Session = Depends(get_session)):
    """Update slider models"""
    # Implement slider update
    pass

# Revenue
@router.get("/revenue")
async def get_revenue_data(session: Session = Depends(get_session)):
    """Get revenue analytics"""
    transactions = session.exec(select(Transaction)).all()
    
    total_revenue = sum(t.amount for t in transactions)
    platform_fees = sum(t.platform_fee for t in transactions)
    avg_transaction = total_revenue / len(transactions) if transactions else 0
    
    return {
        "totalRevenue": total_revenue,
        "platformFees": platform_fees,
        "avgTransaction": avg_transaction,
        "transactions": transactions[-10:]  # Last 10 transactions
    }

# Email System
@router.post("/emails/send")
async def send_bulk_email(
    subject: str,
    content: str,
    segment: str,
    session: Session = Depends(get_session)
):
    """Send bulk email to user segment"""
    # Get users based on segment
    if segment == "all":
        users = session.exec(select(User)).all()
    elif segment == "creators":
        users = session.exec(select(User).where(User.total_models > 0)).all()
    elif segment == "buyers":
        users = session.exec(select(User).where(User.id.in_(
            select(Transaction.buyer_id)
        ))).all()
    
    # Send emails (implement with SendGrid/AWS SES)
    # for user in users:
    #     await send_email(user.email, subject, content)
    
    return {"message": f"Email sent to {len(users)} users"}

# Analytics
@router.get("/analytics")
async def get_analytics(session: Session = Depends(get_session)):
    """Get platform analytics"""
    # Top models by sales
    top_models = session.exec(
        select(Model3D).order_by(Model3D.downloads.desc()).limit(10)
    ).all()
    
    # Top creators by revenue
    top_creators = session.exec(
        select(User).order_by(User.total_revenue.desc()).limit(10)
    ).all()
    
    return {
        "topModels": top_models,
        "topCreators": top_creators
    }
```

### Marketplace Endpoints (`routers/models.py`)

```python
from fastapi import APIRouter, Query
from sqlmodel import Session, select, or_

router = APIRouter(prefix="/api/models", tags=["models"])

@router.get("/")
async def get_all_models(
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None,
    search: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """Get all approved models"""
    query = select(Model3D).where(Model3D.status == "approved")
    
    if category:
        query = query.where(Model3D.category == category)
    
    if search:
        query = query.where(
            or_(
                Model3D.name.contains(search),
                Model3D.description.contains(search)
            )
        )
    
    models = session.exec(query.offset(skip).limit(limit)).all()
    return models

@router.get("/{model_id}")
async def get_model_details(model_id: int, session: Session = Depends(get_session)):
    """Get detailed model information"""
    model = session.get(Model3D, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Increment view count
    model.views += 1
    session.add(model)
    session.commit()
    
    return model

@router.post("/{model_id}/like")
async def like_model(model_id: int, session: Session = Depends(get_session)):
    """Like a model"""
    model = session.get(Model3D, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    model.likes += 1
    session.add(model)
    session.commit()
    
    return {"likes": model.likes}

@router.post("/{model_id}/purchase")
async def purchase_model(
    model_id: int,
    buyer_id: int,
    session: Session = Depends(get_session)
):
    """Purchase a model"""
    model = session.get(Model3D, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Calculate fees
    platform_fee = model.price * 0.075  # 7.5%
    seller_revenue = model.price - platform_fee
    
    # Create transaction
    transaction = Transaction(
        amount=model.price,
        platform_fee=platform_fee,
        seller_revenue=seller_revenue,
        buyer_id=buyer_id,
        seller_id=model.creator_id,
        model_id=model_id,
        status="completed"
    )
    
    session.add(transaction)
    
    # Update model stats
    model.downloads += 1
    session.add(model)
    
    # Update creator revenue
    creator = session.get(User, model.creator_id)
    creator.total_revenue += seller_revenue
    session.add(creator)
    
    session.commit()
    
    # Send emails
    # await send_email(creator.email, "sale_notification", {...})
    # await send_email(buyer.email, "purchase_confirmation", {...})
    
    return {"message": "Purchase successful", "transaction_id": transaction.id}
```

---

## 5. Email Service (`services/email.py`)

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = "noreply@nexusmodels.com"

async def send_email(to_email: str, template: str, data: dict):
    """Send email using SendGrid"""
    
    templates = {
        "welcome": {
            "subject": "Welcome to Nexus Models!",
            "content": f"<h1>Welcome {data.get('name')}!</h1><p>Start exploring premium 3D models...</p>"
        },
        "model_approved": {
            "subject": "Your Model Has Been Approved!",
            "content": f"<h1>Congratulations!</h1><p>Your model '{data.get('model_name')}' has been approved and is now live on the marketplace.</p>"
        },
        "model_rejected": {
            "subject": "Model Review Update",
            "content": f"<h1>Model Review</h1><p>Your model '{data.get('model_name')}' needs some improvements. Reason: {data.get('reason')}</p>"
        },
        "sale_notification": {
            "subject": "You Made a Sale!",
            "content": f"<h1>Congratulations!</h1><p>Your model '{data.get('model_name')}' was purchased for ${data.get('amount')}. You earned ${data.get('revenue')} (after 7.5% platform fee).</p>"
        },
        "purchase_confirmation": {
            "subject": "Purchase Confirmation",
            "content": f"<h1>Thank you for your purchase!</h1><p>You can now download '{data.get('model_name')}'.</p>"
        }
    }
    
    template_data = templates.get(template)
    if not template_data:
        raise ValueError(f"Template '{template}' not found")
    
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject=template_data["subject"],
        html_content=template_data["content"]
    )
    
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code
    except Exception as e:
        print(f"Error sending email: {e}")
        raise
```

---

## 6. Main Application (`main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session
from contextlib import asynccontextmanager

# Import routers
from routers import admin, models, users

# Database
DATABASE_URL = "postgresql://user:password@localhost/nexusmodels"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown
    pass

app = FastAPI(title="Nexus Models API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin.router)
app.include_router(models.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Nexus Models API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 7. Frontend API Integration

### Example: Fetching Admin Stats

```typescript
// In your Next.js app
const fetchAdminStats = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setLiveStats(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};
```

### Example: Approving a Model

```typescript
const approveModel = async (modelId: number) => {
  try {
    const response = await fetch(`http://localhost:8000/api/admin/models/${modelId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    alert(data.message);
    // Refresh pending models list
    fetchPendingModels();
  } catch (error) {
    console.error('Error approving model:', error);
  }
};
```

---

## 8. Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/nexusmodels

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email
SENDGRID_API_KEY=your-sendgrid-api-key

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=nexusmodels-assets

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 9. Running the Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Run FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API will be available at:
# http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## 10. Testing API Endpoints

Use the automatic interactive API docs at `http://localhost:8000/docs`

Or use curl:

```bash
# Get admin stats
curl http://localhost:8000/api/admin/stats

# Get all models
curl http://localhost:8000/api/models

# Get pending models (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/admin/models/pending
```

---

## Next Steps

1. ✅ Set up PostgreSQL database
2. ✅ Create all SQLModel models
3. ✅ Implement authentication (JWT)
4. ✅ Create all API endpoints
5. ✅ Set up email service
6. ✅ Implement file upload (AWS S3)
7. ✅ Connect frontend to backend
8. ✅ Test all features
9. ✅ Deploy to production

---

**Your frontend is ready - now build the backend to bring it to life!**
