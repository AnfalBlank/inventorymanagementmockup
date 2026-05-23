# MIMS Frontend

Frontend Next.js 16 untuk Manggala Inventory Management System (MIMS).

## Tech Stack

- **Next.js 16** (App Router) dengan Turbopack
- **TypeScript 5**
- **TailwindCSS 4**
- **Zustand** untuk state management
- **Lucide React** untuk icons

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Project Structure

```
src/
├── app/                  # Next.js App Router (22 pages)
├── components/
│   ├── layout/          # AdminLayout, Sidebar, Header
│   └── ui/              # Reusable UI components
├── store/               # Zustand store + mock data
├── lib/                 # Utilities & design tokens
└── types/               # TypeScript definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build untuk production |
| `npm start` | Start production server |
| `npm run lint` | Lint dengan ESLint |

## Documentation

- **[../README.md](../README.md)** — Project overview
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** — Technical architecture
- **[../CONTRIBUTING.md](../CONTRIBUTING.md)** — Contribution guidelines
- **[DEMO-GUIDE.md](DEMO-GUIDE.md)** — Demo presentation guide

## Pages Available

### Admin (Login Required)
- `/dashboard` — Main dashboard
- `/notifications` — Notification center
- `/inventory`, `/stock-transfer`, `/stock-opname`, `/batch-tracking` — Inventory management
- `/sales-orders`, `/purchase-orders`, `/shipments`, `/returns` — Transactions
- `/monitoring`, `/transfer-queue`, `/barcode` — Operations
- `/master-data`, `/reporting`, `/configuration`, `/settings` — Configuration

### Operational (No Login)
- `/picker` — Mobile picker interface
- `/packing-queue` — Display monitor
- `/packing-process` — Packer interface

## Demo Credentials

Login page sudah pre-filled:
- Email: `admin@manggala.co.id`
- Password: `admin123`

Klik "Masuk" untuk lanjut ke dashboard.

## License

Proprietary — PT. Manggala Utama Indonesia
