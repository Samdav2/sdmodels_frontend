# Admin Page Templates

## Quick Reference
All admin pages follow this structure and are located in `app/admin/[section]/page.tsx`

### Created Pages:
✅ `/admin` - Overview (main dashboard)
✅ `/admin/models` - Model Review Queue
✅ `/admin/users` - User Management
✅ `/admin/emails` - Email System

### Remaining Pages to Create:

Use the template below for each remaining section. Just copy, paste, and modify the content.

---

## Template for Remaining Pages

```tsx
"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function [SectionName]Page() {
  // Add your state here
  const [data, setData] = useState([]);

  return (
    <AdminLayout title="[Section Title]">
      {/* Your content here */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">[Subsection Title]</h3>
        {/* Add your UI components */}
      </div>
    </AdminLayout>
  );
}
```

---

## 1. Homepage Editor (`app/admin/homepage/page.tsx`)

**Purpose**: Edit hero section, featured categories, stats ticker, CTAs

**Key Features**:
- Hero title/subtitle inputs
- Featured categories toggle
- Stats ticker numbers
- CTA button editor
- Publish button

---

## 2. Slider Manager (`app/admin/slider/page.tsx`)

**Purpose**: Manage homepage slider (3 slots)

**Key Features**:
- Current slider slots display
- Available models library
- Drag-and-drop interface
- Auto-select trending button
- Deploy button

---

## 3. Bounty Board (`app/admin/bounties/page.tsx`)

**Purpose**: Manage bounties

**Key Features**:
- List all bounties (Open, In Progress, Completed)
- Create new bounty button
- Close/manage bounties
- Bounty settings (min amount, platform fee)

---

## 4. Leaderboard (`app/admin/leaderboard/page.tsx`)

**Purpose**: Manage rankings and Season Pass

**Key Features**:
- Current rankings table
- Adjust points button
- Reset rankings
- Season Pass settings
- Start new season button

---

## 5. Testimonials (`app/admin/testimonials/page.tsx`)

**Purpose**: Manage testimonials

**Key Features**:
- Add/edit/delete testimonials
- Feature/unfeature toggle
- Verify testimonials
- Rating display

---

## 6. Learning Center (`app/admin/learning/page.tsx`)

**Purpose**: Manage tutorials

**Key Features**:
- Create/edit tutorials
- Category selection (Beginner, Intermediate, Advanced)
- Publish/unpublish toggle
- View count display

---

## 7. Categories (`app/admin/categories/page.tsx`)

**Purpose**: Manage model categories

**Key Features**:
- Add/edit/delete categories
- Enable/disable toggle
- Icon selector
- Model count display
- Reorder categories

---

## 8. Revenue Vault (`app/admin/revenue/page.tsx`)

**Purpose**: Track platform fees (7.5%)

**Key Features**:
- Total platform fees display
- Monthly revenue breakdown
- Recent transactions list
- Revenue chart
- Export data button

---

## 9. Content CMS (`app/admin/content/page.tsx`)

**Purpose**: Create platform updates/announcements

**Key Features**:
- Rich text editor
- Markdown support
- Image/3D model embed
- Draft/publish workflow
- Existing posts management

---

## 10. Analytics (`app/admin/analytics/page.tsx`)

**Purpose**: View platform analytics

**Key Features**:
- Top performing models
- Top creators
- Traffic analytics
- User engagement metrics
- Export analytics button

---

## 11. Settings (`app/admin/settings/page.tsx`)

**Purpose**: Platform configuration

**Key Features**:
- General settings (platform name, fee %)
- Security settings (2FA, API rate limiting)
- Email notifications
- Backup & export tools

---

## Common UI Components to Use

### Card Container
```tsx
<div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
  {/* Content */}
</div>
```

### Button Styles
```tsx
// Primary Action
<button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold">
  Save
</button>

// Secondary Action
<button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition">
  Edit
</button>

// Danger Action
<button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition">
  Delete
</button>
```

### Input Field
```tsx
<div>
  <label className="text-gray-400 text-sm mb-2 block">Label</label>
  <input
    type="text"
    className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
  />
</div>
```

### Table
```tsx
<div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl overflow-hidden">
  <table className="w-full">
    <thead className="bg-slate-800/50">
      <tr>
        <th className="text-left p-4 text-gray-400 font-semibold">Column</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t border-slate-800 hover:bg-slate-800/30 transition">
        <td className="p-4 text-white">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## API Integration Points

Each page should connect to FastAPI backend:

```typescript
// Example API call structure
const handleAction = async () => {
  try {
    const response = await fetch('/api/admin/[endpoint]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

---

## File Structure

```
app/admin/
├── page.tsx (Overview - ✅ Created)
├── layout.tsx (Optional: Add auth check here)
├── models/
│   └── page.tsx (✅ Created)
├── users/
│   └── page.tsx (✅ Created)
├── emails/
│   └── page.tsx (✅ Created)
├── homepage/
│   └── page.tsx (TODO)
├── slider/
│   └── page.tsx (TODO)
├── bounties/
│   └── page.tsx (TODO)
├── leaderboard/
│   └── page.tsx (TODO)
├── testimonials/
│   └── page.tsx (TODO)
├── learning/
│   └── page.tsx (TODO)
├── categories/
│   └── page.tsx (TODO)
├── revenue/
│   └── page.tsx (TODO)
├── content/
│   └── page.tsx (TODO)
├── analytics/
│   └── page.tsx (TODO)
└── settings/
    └── page.tsx (TODO)

components/admin/
└── AdminLayout.tsx (✅ Created - Shared layout)
```

---

## Benefits of This Structure

1. **Maintainability**: Each section is isolated
2. **Scalability**: Easy to add new sections
3. **Performance**: Code splitting per route
4. **Team Collaboration**: Multiple developers can work on different sections
5. **Backend Integration**: Each page can have its own API calls
6. **Testing**: Easier to test individual sections

---

## Next Steps

1. Create remaining admin pages using the template
2. Connect each page to FastAPI backend
3. Add authentication middleware
4. Implement real-time updates with WebSockets
5. Add form validation
6. Implement error handling
7. Add loading states
8. Create admin-specific components library

---

**All admin pages are now modular, maintainable, and ready for backend integration!**
