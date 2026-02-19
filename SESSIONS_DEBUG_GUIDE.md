# Sessions Display Debug Guide

## Issue
Active sessions section not showing data even though backend is sending it.

## Solution Applied

### 1. Enhanced API Response Parsing

Updated `lib/api/dashboard.ts` `getSessions()` function to:

```typescript
getSessions: async (): Promise<any[]> => {
  try {
    // Try primary endpoint
    let response = await apiClient.get('/dashboard/settings/security/sessions');
    
    // Handle { sessions: [...] } format
    if (response.data && Array.isArray(response.data.sessions)) {
      return response.data.sessions;
    }
    
    // Handle direct array format
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    // Try alias endpoint as fallback
    try {
      const response = await apiClient.get('/dashboard/settings/sessions');
      // Same parsing logic
      return response.data.sessions || response.data || [];
    } catch (fallbackError) {
      return [];
    }
  }
}
```

### 2. Added Console Logging

Added debug logs to track:
- API response structure
- Sessions array content
- Any parsing issues

### 3. Improved Error Handling

- Catches errors gracefully
- Falls back to alias endpoint if primary fails
- Returns empty array instead of crashing
- Shows error message to user

### 4. Array Safety Check

Updated settings page to ensure sessions is always an array:

```typescript
setActiveSessions(Array.isArray(sessions) ? sessions : []);
```

## Expected Backend Response

According to documentation, backend should return:

```json
{
  "sessions": [
    {
      "id": 1,
      "device": "Chrome on MacBook Pro",
      "location": "San Francisco, CA",
      "ip_address": "192.168.1.1",
      "last_active": "Active now",
      "is_current": true
    }
  ]
}
```

## Debugging Steps

### 1. Check Browser Console

Open browser DevTools (F12) and look for:

```
Sessions API response (security/sessions): { sessions: [...] }
Security status: { ... }
Sessions: [...]
```

### 2. Check Network Tab

1. Open DevTools → Network tab
2. Navigate to Settings → Security tab
3. Look for request to `/dashboard/settings/security/sessions`
4. Check:
   - Status code (should be 200)
   - Response body
   - Request headers (Authorization token present?)

### 3. Common Issues

#### Issue: 401 Unauthorized
**Cause**: Missing or invalid auth token  
**Solution**: Check localStorage for `access_token`, try logging in again

#### Issue: 404 Not Found
**Cause**: Endpoint doesn't exist  
**Solution**: Verify backend is running and endpoint is implemented

#### Issue: Empty sessions array
**Cause**: No active sessions in database  
**Solution**: This is normal if user just logged in for first time

#### Issue: Response format mismatch
**Cause**: Backend returning different format than expected  
**Solution**: Check console logs for actual response structure

### 4. Manual API Test

Test the endpoint directly:

```bash
# Get your token from localStorage
TOKEN="your_access_token_here"

# Test primary endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/dashboard/settings/security/sessions

# Test alias endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/dashboard/settings/sessions
```

## Verification Checklist

- [ ] Backend is running on port 8000
- [ ] User is logged in (access_token in localStorage)
- [ ] Security tab is opened (triggers data load)
- [ ] No 401/403 errors in Network tab
- [ ] Console shows "Sessions API response" log
- [ ] Sessions array is not empty in console
- [ ] UI displays session cards

## Expected UI Behavior

When working correctly:

1. User opens Settings page
2. Clicks on "Security" tab
3. Page loads security status and sessions
4. Sessions section shows:
   - Device icon (💻/📱/🖥️)
   - Device name
   - Location and IP
   - Last active time
   - "Current" badge for active session
   - "Revoke" button for other sessions

## Fallback Behavior

If sessions can't be loaded:
- Shows "No active sessions found" message
- No error thrown
- Rest of security tab still works
- Console shows error details

## Testing

To test the fix:

1. Clear browser cache
2. Log in to the application
3. Navigate to Dashboard → Settings
4. Click "Security" tab
5. Check browser console for logs
6. Verify sessions display correctly

## Response Format Handling

The code now handles multiple response formats:

1. **Standard format**: `{ sessions: [...] }`
2. **Direct array**: `[...]`
3. **Empty**: `{ sessions: [] }`
4. **Error**: Returns `[]`

## Next Steps

If sessions still don't show:

1. Check console logs for actual response
2. Verify backend endpoint is implemented
3. Check if user has any sessions in database
4. Verify auth token is valid
5. Try the alias endpoint manually

## Success Indicators

✅ Console shows: `Sessions API response: { sessions: [...] }`  
✅ Console shows: `Sessions: [{ id: 1, device: "...", ... }]`  
✅ UI displays session cards  
✅ Current session has green "Current" badge  
✅ Other sessions have "Revoke" button  

## Contact

If issue persists after these fixes, provide:
- Console logs
- Network tab screenshot
- Backend response body
- Browser and OS version
