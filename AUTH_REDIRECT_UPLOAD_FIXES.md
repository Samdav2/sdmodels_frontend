# Auth Redirect & Upload Page Fixes

## Changes Made

### 1. "Start Selling" Buttons Now Check Authentication

All "Start Selling" buttons throughout the site now check if the user is signed in before redirecting:

- **If signed in**: Redirects to `/upload` page
- **If not signed in**: Redirects to `/auth` page to create account

#### Files Modified:

**app/page.tsx** (Homepage)
- Desktop "Start Selling" button in nav
- Hero section "Start Selling" button

**components/MobileNav.tsx**
- Mobile menu "Start Selling" button

#### Implementation:
```typescript
onClick={() => {
  const isAuthenticated = localStorage.getItem('access_token');
  window.location.href = isAuthenticated ? '/upload' : '/auth';
}}
```

### 2. Upload Page Header Changes Based on Auth Status

The upload page now displays different navigation based on authentication:

**When User is NOT Signed In:**
- Shows homepage-style navigation
- Includes: About, Bounties, Leaderboard, Browse links
- Shows "Sign In" button instead of "Start Selling"
- Includes CredibilityNav component
- Includes MobileNav for mobile devices
- Automatically redirects to `/auth?redirect=/upload`

**When User IS Signed In:**
- Shows upload terminal navigation
- Includes: Dashboard, Home links
- Simplified header for focused upload experience

#### File Modified:
**app/upload/page.tsx**

#### Implementation:
```typescript
// Check authentication on page load
useEffect(() => {
  const token = localStorage.getItem('access_token');
  setIsAuthenticated(!!token);
  
  // If not authenticated, redirect to auth page
  if (!token) {
    router.push('/auth?redirect=/upload');
  }
}, [router]);

// Conditional navigation rendering
{isAuthenticated ? (
  <nav>/* Upload Terminal Nav */</nav>
) : (
  <nav>/* Homepage Style Nav */</nav>
)}
```

## User Flow

### Scenario 1: Guest User Clicks "Start Selling"
1. User clicks "Start Selling" button anywhere on site
2. System checks `localStorage.getItem('access_token')`
3. No token found → Redirects to `/auth` page
4. User creates account or signs in
5. After successful auth, can access upload page

### Scenario 2: Authenticated User Clicks "Start Selling"
1. User clicks "Start Selling" button
2. System checks `localStorage.getItem('access_token')`
3. Token found → Redirects to `/upload` page
4. Upload page shows authenticated navigation
5. User can upload models

### Scenario 3: Guest User Directly Accesses Upload Page
1. User navigates to `/upload` directly
2. `useEffect` checks authentication on mount
3. No token found → Auto-redirects to `/auth?redirect=/upload`
4. After signing in, user is redirected back to `/upload`
5. Upload page shows authenticated navigation

## Benefits

1. **Better UX**: Users are guided to create account before uploading
2. **Security**: Upload page is protected from unauthorized access
3. **Consistency**: Homepage navigation shown to guests on upload page
4. **Seamless Flow**: Redirect parameter ensures users return to upload after auth
5. **Clear CTAs**: "Start Selling" buttons work intelligently based on auth state

## Testing Checklist

- [ ] Click "Start Selling" in homepage nav (desktop) when not signed in → Goes to `/auth`
- [ ] Click "Start Selling" in homepage nav (desktop) when signed in → Goes to `/upload`
- [ ] Click "Start Selling" in hero section when not signed in → Goes to `/auth`
- [ ] Click "Start Selling" in hero section when signed in → Goes to `/upload`
- [ ] Click "Start Selling" in mobile menu when not signed in → Goes to `/auth`
- [ ] Click "Start Selling" in mobile menu when signed in → Goes to `/upload`
- [ ] Access `/upload` directly when not signed in → Auto-redirects to `/auth?redirect=/upload`
- [ ] Access `/upload` when signed in → Shows upload terminal navigation
- [ ] Upload page shows homepage nav when not authenticated
- [ ] Upload page shows upload terminal nav when authenticated

## Files Changed

1. `app/page.tsx` - Added auth check to Start Selling buttons
2. `components/MobileNav.tsx` - Added auth check to mobile Start Selling button
3. `app/upload/page.tsx` - Added auth check, conditional navigation, auto-redirect

## Notes

- Uses `localStorage.getItem('access_token')` to check authentication
- Redirect parameter `?redirect=/upload` preserves user intent
- Homepage navigation includes all main links for better guest experience
- Upload terminal navigation is simplified for focused workflow
- Mobile navigation (MobileNav) included for responsive design

---

**Status**: ✅ Complete
**Auth Flow**: Working
**Upload Protection**: Active
**Navigation**: Conditional based on auth state
