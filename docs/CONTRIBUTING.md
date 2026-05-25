# Contributing to MIMS

Terima kasih atas minat Anda untuk berkontribusi pada Manggala Inventory Management System (MIMS). Dokumen ini menjelaskan cara berkontribusi pada project ini.

## Workflow

1. **Fork** repository ini
2. **Clone** fork ke local machine
3. **Create branch** dari `main`: `git checkout -b feature/nama-fitur`
4. **Make changes** dan commit dengan pesan yang jelas
5. **Test** perubahan Anda (`npm run build` harus sukses)
6. **Push** branch ke fork Anda
7. **Open Pull Request** ke `main` branch

## Branch Naming

- `feature/nama-fitur` — fitur baru
- `fix/nama-bug` — perbaikan bug
- `docs/nama-dokumen` — perubahan dokumentasi
- `refactor/area-refactor` — refactoring tanpa perubahan fungsionalitas
- `style/nama-styling` — perubahan visual/styling

Contoh: `feature/picker-voice-feedback`, `fix/dashboard-stat-overflow`

## Commit Message Convention

Ikuti format [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` — fitur baru
- `fix` — bug fix
- `docs` — dokumentasi
- `style` — formatting, missing semicolons, dll
- `refactor` — refactoring code
- `test` — adding tests
- `chore` — maintenance, deps update

### Examples

```
feat(picker): add audio feedback on scan

Implements beep sound on successful scan and error tone on failure.
Configurable via Configuration > Barcode > Audio Feedback.

Closes #42
```

```
fix(inventory): correct stock calculation for damaged items

Damaged stock was incorrectly counted as available.

Fixes #38
```

## Code Style

### TypeScript

- Gunakan strict TypeScript types — hindari `any`
- Define interfaces di `src/types/index.ts` untuk shared types
- Component props pakai `interface ComponentProps`
- Hooks return type explicit untuk readability

### React Components

```tsx
"use client";

import { type ReactNode } from "react";

interface MyComponentProps {
  title: string;
  children: ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Styling

- Gunakan TailwindCSS classes (jangan tulis CSS terpisah kecuali untuk animations)
- Pakai design tokens dari `src/lib/design-tokens.ts`
- Color values sebagai inline `[#xxxxxx]` untuk konsistensi dengan design
- Gunakan `cn()` utility untuk conditional classes

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "p-4 rounded-lg",
  isActive ? "bg-[#003c33] text-white" : "bg-white text-[#212121]"
)}>
```

### File Organization

- Pages di `src/app/<route>/page.tsx`
- Reusable components di `src/components/ui/` atau `src/components/layout/`
- One component per file (kecuali sub-components yang erat related)
- Mock data di `src/store/index.ts` atau `src/store/extra-data.ts`

## Pull Request Checklist

Sebelum membuka PR, pastikan:

- [ ] `npm run build` sukses tanpa error
- [ ] TypeScript types lengkap (no `any`)
- [ ] Toast/feedback ditambahkan untuk action button baru
- [ ] Modal-modal close otomatis setelah action
- [ ] Mobile-responsive (test di DevTools responsive mode)
- [ ] Dokumentasi diupdate jika ada perubahan API/struktur
- [ ] Commit messages mengikuti convention
- [ ] No console.log/debugger yang tertinggal

## Reporting Bugs

Buka issue dengan template:

**Title**: Singkat dan deskriptif (e.g., "Picker scan tidak update qty di item kedua")

**Body**:

```markdown
## Steps to Reproduce
1. Buka /picker
2. Pilih task
3. Scan rak
4. Scan barang pertama (qty 5)
5. Saat di item kedua, qty tidak bertambah

## Expected Behavior
Qty harus bertambah +1 setiap scan sukses

## Actual Behavior
Qty tetap 0 di item kedua

## Environment
- Browser: Chrome 130
- OS: macOS 14
- Screen: Desktop 1440px

## Screenshots
[lampirkan jika ada]
```

## Suggesting Features

Buka issue dengan label `enhancement`:

- **Use case**: Masalah yang diselesaikan
- **Proposed solution**: Bagaimana fitur bekerja
- **Alternatives**: Solusi lain yang sudah dipertimbangkan
- **Mockup** (jika ada): Sketsa atau screenshot reference

## Development Tips

### Mock Data

Jika menambah halaman baru yang butuh data:

1. Tambah type di `src/types/index.ts`
2. Tambah mock data di `src/store/extra-data.ts`
3. Tambah ke store di `src/store/index.ts`
4. Import di halaman dengan `useAppStore()`

### Adding a New Page

1. Buat folder di `src/app/<nama-route>/`
2. Buat `page.tsx` dengan template:

```tsx
"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";

export default function MyPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Page Title</h1>
        {/* content */}
      </div>
    </AdminLayout>
  );
}
```

3. Tambah link ke `src/components/layout/Sidebar.tsx`

### Adding a Toast

```tsx
import { toast } from "@/components/ui/Toast";

toast({
  type: "success", // "success" | "error" | "warning" | "info"
  title: "Title singkat",
  description: "Deskripsi opsional"
});
```

## Questions?

Buka discussion atau issue di GitHub repo.
