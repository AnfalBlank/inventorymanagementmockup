# MIMS Architecture

Dokumen teknis tentang arsitektur frontend MIMS.

## Stack Overview

```
┌───────────────────────────────────────────────────┐
│                   Browser / PWA                   │
└───────────────────────────────────────────────────┘
                        │
┌───────────────────────────────────────────────────┐
│                 Next.js 16 (App Router)           │
│  ┌─────────────────────────────────────────────┐  │
│  │  Pages (Server Components → Client)         │  │
│  │  /dashboard, /inventory, /sales-orders, ... │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  Layout Components (AdminLayout, Sidebar)   │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │  UI Components (Card, Button, Modal, ...)   │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
                        │
┌───────────────────────────────────────────────────┐
│             Zustand Store (Global State)          │
│  • salesOrders, products, warehouses, ...         │
│  • notifications, auditLogs, dashboardStats       │
│  • UI state (sidebarOpen, theme, modals)          │
└───────────────────────────────────────────────────┘
                        │
                  Future: API Layer
                        │
┌───────────────────────────────────────────────────┐
│       Backend (NestJS / Laravel) — Phase 2        │
│  • REST API + WebSocket (Socket.IO)               │
│  • PostgreSQL + Redis cache                       │
│  • JWT Auth + RBAC                                │
└───────────────────────────────────────────────────┘
```

## Frontend Architecture

### Routing Strategy

MIMS menggunakan Next.js App Router (file-based routing):

- **Login flow**: `/` → redirect ke `/login` → `/dashboard`
- **Admin routes**: Wrapped dengan `<AdminLayout>` (Sidebar + Header + Content)
- **Operational routes** (no login): Standalone fullscreen, mobile-first
  - `/picker`
  - `/packing-queue`
  - `/packing-process`

### Page Composition Pattern

Setiap admin page mengikuti pola:

```tsx
"use client";

export default function MyPage() {
  // 1. State
  const [activeTab, setActiveTab] = useState(...);
  const { data } = useAppStore();

  // 2. Derived state
  const filtered = data.filter(...);

  // 3. Handlers
  const handleAction = () => {
    toast({ type: "success", title: "..." });
  };

  // 4. Render
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header section */}
        {/* Stats / Cards */}
        {/* Filters */}
        {/* Tabs (jika ada) */}
        {/* Main content (table / grid / dll) */}
        {/* Modals */}
      </div>
    </AdminLayout>
  );
}
```

### State Management Strategy

**Zustand** dipilih karena:
- Lebih ringan dari Redux
- Tidak perlu boilerplate (no actions/reducers separate)
- Type-safe out of the box
- Compatible dengan SSR

Store structure (`src/store/index.ts`):

```ts
interface AppState {
  // UI state
  theme: "light" | "dark";
  sidebarOpen: boolean;

  // Data (mock)
  salesOrders: SalesOrder[];
  products: Product[];
  warehouses: Warehouse[];
  // ... 20+ collections

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addSalesOrder: (order: SalesOrder) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  markNotificationRead: (id: string) => void;
  // ...
}
```

Saat backend integration, action handler akan diganti dengan API calls + revalidate cache.

### Toast Notification System

Custom toast system di `src/components/ui/Toast.tsx`:

```ts
// Trigger from anywhere:
import { toast } from "@/components/ui/Toast";

toast({
  type: "success" | "error" | "warning" | "info",
  title: "Title",
  description: "Optional description"
});
```

Stack-based, auto-dismiss 3.5s, animation slide-in dari kanan.

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── ToastContainer (always mounted)
└── Page Content
    ├── AdminLayout (untuk admin pages)
    │   ├── Sidebar (collapsible, grouped menu)
    │   ├── Header (search, theme, notifications, user menu)
    │   └── <main>{children}</main>
    └── Standalone Pages (login, picker, packing-*)
```

### UI Component Library

Reusable components di `src/components/ui/`:

| Component | Purpose | Props |
|-----------|---------|-------|
| `Button` | CTA dengan variants | variant, size, icon, loading |
| `Card` | Content container | padding, hover, onClick |
| `StatCard` | Dashboard stat | title, value, icon, trend, color |
| `Modal` | Overlay dialog | isOpen, onClose, title, size |
| `Input` | Text input dengan label | label, error, icon |
| `Select` | Dropdown select | label, error, options |
| `Textarea` | Multi-line input | label, error |
| `DataTable` | Generic table | columns, data, keyExtractor, onRowClick |
| `StatusBadge` | Order status badge | status |
| `PriorityBadge` | Priority indicator | priority |
| `Toast` | Notification | type, title, description |

### Layout Components

`src/components/layout/`:

| Component | Purpose |
|-----------|---------|
| `AdminLayout` | Wrapper untuk semua admin pages |
| `Sidebar` | Navigasi kiri (5 grup menu + operational links) |
| `Header` | Top bar (search, notifications, user) |

## Data Flow

### Read Flow

```
Page Component
  ↓ useAppStore()
Zustand Store
  ↓ returns slice
Component re-renders dengan data
```

### Write Flow

```
User Action (button click)
  ↓
Handler function
  ├─ store.action() → updates store
  └─ toast({ ... }) → shows feedback
```

### Future: API Integration Pattern

Saat backend siap:

```tsx
// Before (mock):
const { addSalesOrder } = useAppStore();
addSalesOrder(newOrder);

// After (real):
const handleSubmit = async (data) => {
  try {
    const response = await fetch('/api/sales-orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const newOrder = await response.json();
    useAppStore.setState((s) => ({
      salesOrders: [newOrder, ...s.salesOrders]
    }));
    toast({ type: "success", title: "Order created" });
  } catch (error) {
    toast({ type: "error", title: "Failed to create order" });
  }
};
```

## Realtime Architecture (Planned)

PRD mengamanatkan WebSocket + Socket.IO + Firebase Push. Implementasi:

```tsx
// src/lib/socket.ts (future)
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_WS_URL);

socket.on("new_order", (order) => {
  useAppStore.setState((s) => ({
    salesOrders: [order, ...s.salesOrders]
  }));
  toast({ type: "info", title: `Order baru: ${order.orderNumber}` });
});

socket.on("ready_packing", (taskId) => {
  // Update packing queue
});

socket.on("low_stock", (item) => {
  // Show alert
});
```

Events sesuai PRD section 10:

| Event | Trigger |
|-------|---------|
| `new_order` | Sales create SO |
| `ready_picking` | Auto generated picking task |
| `ready_packing` | Picking complete |
| `low_stock` | Stock <= minimum |
| `return_created` | Customer/supplier return |

## Mobile-First Operational UI

Picker dan Packing Process didesain mobile-first:

- **Fullscreen layout** (no header/sidebar)
- **Large touch targets** (min 60px tinggi)
- **Big typography** (40px+ untuk lokasi rak)
- **Color feedback** (green = sukses, red = error)
- **Single action focus** per screen
- **Swipe-friendly spacing**

## Design System

Detail di `DESIGN (1).md`. Highlights:

### Color Tokens

```ts
// src/lib/design-tokens.ts
export const colors = {
  primary: "#17171c",     // Near-black untuk CTA
  "deep-green": "#003c33", // Brand accent
  canvas: "#ffffff",       // Page background
  ink: "#212121",          // Body text
  muted: "#93939f",        // Secondary text
  // ...
};
```

### Spacing & Radius

- Spacing 8px base (xs: 6, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32)
- Radius scale: xs (4) → sm (8) → md (16) → lg (22) → pill (32) → full (9999)

### Typography Hierarchy

- Hero Display: 96px, tight tracking
- Section: 48-60px
- Card heading: 32px
- Feature heading: 24px
- Body: 16px (default), 14px (UI), 12px (micro)
- Mono labels: CohereMono untuk technical info

## Performance Considerations

### Static Generation

Saat ini semua page adalah `○ Static` (prerendered):

```
Route (app)
┌ ○ /
├ ○ /dashboard
├ ○ /inventory
└ ... (22 routes total)
```

### Code Splitting

Next.js otomatis code-split per page. Bundle size optimal karena:
- Lucide icons di-tree-shake
- Tailwind purge unused classes
- Modal content lazy-rendered (hidden saat closed)

### Future Optimizations

- React Server Components untuk data fetching
- Image optimization dengan next/image
- ISR (Incremental Static Regeneration) untuk reporting
- Service worker untuk offline picker/packer

## Security Considerations (Future)

### Admin Area
- JWT dengan refresh token (httpOnly cookies)
- RBAC enforcement di middleware
- HTTPS only
- Rate limiting per route

### Operational (No Login)
- Device whitelist via MAC address / device ID
- Local session token (encrypted)
- Restricted access — operational endpoints only
- Auto-lock setelah inactive 30 menit

## Testing Strategy (Planned)

- **Unit tests**: Vitest untuk utilities & store
- **Component tests**: Testing Library untuk UI
- **E2E tests**: Playwright untuk critical flows (login → create order → picker → packer)
- **Visual regression**: Chromatic / Percy

## Deployment

Saat ini dapat di-deploy ke:
- **Vercel** (recommended untuk Next.js)
- **Netlify** dengan adapter
- **Self-hosted** dengan Docker

Production build:
```bash
cd frontend
npm run build
npm start
```

## Future Considerations

- **Internationalization**: Saat ini hardcoded Bahasa Indonesia. Bisa di-extract ke `next-intl`.
- **Theme**: Dark mode toggle ada tapi belum implemented dark variants di semua komponen
- **Accessibility**: ARIA labels minimal — perlu audit lengkap untuk WCAG AA compliance
- **PWA**: Picker dan Packer harusnya jadi PWA installable di mobile devices
