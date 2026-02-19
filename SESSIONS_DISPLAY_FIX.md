# Sessions Display Issue - Fixed & Payment Methods Functional

## Problem 1: Sessions Not Displaying
The active sessions section in the user dashboard settings page was not displaying any data, even though the backend was sending it.

### Root Cause
Found a **duplicate function definition** in `lib/api/dashboard.ts`:
- The `getSessions()` function was defined TWICE
- The second definition (at the end of the file) was overwriting the first one
- The second definition used the old format: `response.data.data` instead of handling the correct backend format `response.data.sessions`
- This caused the function to always return an empty array

### Fix Applied
Removed the duplicate `getSessions()` and `revokeSession()` function definitions at the end of `lib/api/dashboard.ts`.

## Problem 2: Add Payment Method Button Not Working
The "Add Payment Method" button in the billing tab was just UI with no functionality.

### Fix Applied
Added complete payment method management functionality:

1. **Add Payment Method Modal**
   - Opens when clicking "+ Add Method" button
   - Supports two payment types: PayPal and Bank Account
   - PayPal: Requires email address
   - Bank: Requires account holder name, account number, routing number
   - Form validation before submission
   - Calls `dashboardApi.addPaymentMethod()` API

2. **Remove Payment Method**
   - "Remove" button now functional with confirmation
   - Calls `dashboardApi.removePaymentMethod(methodId)` API
   - Reloads billing data after removal

3. **Set Primary Payment Method**
   - "Set Primary" button now functional
   - Calls `dashboardApi.setPrimaryPaymentMethod(methodId)` API
   - Updates UI to show new primary method

### State Management
Added new state variables:
```typescript
const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
const [paymentMethodData, setPaymentMethodData] = useState({
  type: 'paypal',
  email: '',
  account_number: '',
  routing_number: '',
  account_holder_name: ''
});
```

### Handler Functions
```typescript
handleAddPaymentMethod() - Validates and adds payment method
handleRemovePaymentMethod(methodId) - Removes payment method with confirmation
handleSetPrimaryPaymentMethod(methodId) - Sets primary payment method
```

## Expected Backend Endpoints

### Sessions
- `GET /dashboard/settings/security/sessions`
- Response: `{ sessions: [...] }`

### Payment Methods
- `POST /dashboard/settings/billing/payment-methods` - Add payment method
- `DELETE /dashboard/settings/billing/payment-methods/{id}` - Remove payment method
- `PATCH /dashboard/settings/billing/payment-methods/{id}/primary` - Set primary

## Files Modified
- `lib/api/dashboard.ts` - Removed duplicate function definitions
- `app/dashboard/settings/page.tsx` - Added payment method modal and handlers

## Status
✅ Sessions display fixed
✅ Add payment method functional
✅ Remove payment method functional
✅ Set primary payment method functional
