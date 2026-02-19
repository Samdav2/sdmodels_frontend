# Backend Response Format - Profile Update

## ✅ Confirmed Response Structure

Based on the actual backend response, here's the correct format:

### Profile Update Response

**Endpoint**: `PATCH /api/v1/dashboard/settings/profile`

**Request Body**:
```json
{
  "full_name": "Dawodu Samuel",
  "username": "adoxop1",
  "bio": "Professional 3D artist",
  "location": "Lagos, Nigeria",
  "website": "https://example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "email": "adoxop1@gmail.com",
    "username": "adoxop1",
    "full_name": "Dawodu Samuel",
    "id": 3,
    "user_type": "buyer",
    "is_verified": false,
    "is_active": true,
    "avatar_url": null,
    "bio": null,
    "created_at": "2026-02-19T02:52:02.002334",
    "is_verified_creator": false,
    "total_sales": 0.0,
    "total_models": 0,
    "rating": 0.0
  }
}
```

## 📊 Response Structure

The backend returns:
- `message`: Success message string
- `user`: Complete updated user object

This is different from the standard `{ data: {...} }` wrapper used in some other endpoints.

## 🔄 Frontend Handling

### Updated Implementation

```typescript
// lib/api/dashboard.ts
updateProfile: async (data: any): Promise<any> => {
  const response = await apiClient.patch<any>('/dashboard/settings/profile', data);
  
  // Backend returns { message, user }
  if (response.data.user) {
    // Update localStorage with new user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data.user;
  }
  return response.data;
}
```

### Settings Page Handler

```typescript
const handleSaveProfile = async () => {
  try {
    setSaving(true);
    const updatedUser = await updateProfile(profileData);
    
    // Update local state with new user data
    if (updatedUser) {
      setProfileData({
        full_name: updatedUser.full_name || '',
        username: updatedUser.username || '',
        bio: updatedUser.bio || '',
        location: updatedUser.location || '',
        website: updatedUser.website || '',
        avatar_url: updatedUser.avatar_url || ''
      });
    }
    
    showSuccess('Profile updated successfully!');
  } catch (err: any) {
    showError(err.response?.data?.detail || 'Failed to update profile');
  } finally {
    setSaving(false);
  }
};
```

## 🎯 Key Points

1. **Response Format**: `{ message: string, user: User }`
2. **Not Wrapped**: No `data` wrapper like some other endpoints
3. **Full User Object**: Returns complete user data after update
4. **LocalStorage Update**: Frontend automatically updates cached user data
5. **State Refresh**: Local component state is updated with new values

## 📝 Other Expected Responses

### Security Update
```json
{
  "message": "Security settings updated",
  "user": {
    // Updated user object with security settings
  }
}
```

### Notifications Update
```json
{
  "message": "Notification preferences updated",
  "settings": {
    "email_enabled": true,
    "push_enabled": false,
    "types": {
      "sales": true,
      "reviews": true,
      "followers": true,
      "messages": true,
      "updates": false,
      "marketing": false
    }
  }
}
```

### Password Change
```json
{
  "message": "Password changed successfully"
}
```

## ✅ Implementation Status

- [x] Profile update handles `{ message, user }` format
- [x] LocalStorage automatically updated
- [x] Component state refreshed after update
- [x] Success message displayed
- [x] Error handling implemented
- [x] Loading states working

## 🚀 Testing

To test the profile update:

1. Login to the dashboard
2. Navigate to Settings > Profile
3. Update any field (name, username, bio, etc.)
4. Click "Save Changes"
5. Verify success message appears
6. Check that the updated data persists
7. Refresh page to confirm localStorage was updated

## 📋 User Object Fields

From the backend response, the user object includes:

```typescript
{
  id: number;
  email: string;
  username: string;
  full_name: string;
  user_type: 'buyer' | 'creator' | 'admin';
  is_verified: boolean;
  is_active: boolean;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  is_verified_creator: boolean;
  total_sales: number;
  total_models: number;
  rating: number;
}
```

Additional fields that may be included:
- `location?: string | null`
- `website?: string | null`
- `social_links?: object`
- `updated_at?: string`

## 🔧 Frontend Updates Made

1. **dashboard.ts**: Updated `updateProfile()` to handle `{ message, user }` response
2. **settings/page.tsx**: Updated handler to refresh local state with returned user data
3. **types.ts**: Added optional `location` and `website` fields to User interface
4. **localStorage**: Automatically updated after successful profile update

All changes are backward compatible and handle both response formats gracefully.
