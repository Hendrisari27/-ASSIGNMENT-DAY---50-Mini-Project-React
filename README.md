# React Routing — Practice Repo

Repo latihan mentoring **React Routing** (Dibimbing). Sebuah aplikasi **Shop/Admin** yang tumbuh topik demi topik — **satu Git branch per topik**. Kerjakan berurutan dari `01` sampai `05`.

## Stack

- React 19 + Vite
- `react-router-dom` v7 (BrowserRouter + Routes)
- `axios` (branch 03)
- `@tanstack/react-query` v5 (branch 04)
- CSS murni (tanpa framework UI)

## Cara memulai (untuk peserta)

```bash
npm install                 # install dependency
git switch 01-basic-routing # pilih topik yang ingin dikerjakan
npm run dev                 # jalankan dev server
```

Lalu buka **`HINTS.md`** di branch tersebut: berisi tujuan latihan + petunjuk **bertingkat** (Level 1 → 2 → 3). Kerjakan semua `// TODO` yang ditandai di kode.

## Daftar branch (kumulatif)

Setiap branch sudah berisi topik sebelumnya yang **selesai**. Jadi solusi topik N bisa kamu lihat di branch N+1.

| Branch | Topik yang dikerjakan | Solusi ada di |
|---|---|---|
| `main` | Fondasi (mock API, halaman, styling) — **tanpa routing** | `01-basic-routing` |
| `01-basic-routing` | Routing dasar, params, query string, nested route, `Outlet` | `02-protecting-routes` |
| `02-protecting-routes` | `ProtectedRoute`, role-based, `PublicOnlyRoute` | `03-auth-routing` |
| `03-auth-routing` | `AuthProvider`, login/logout, token, interceptor 401 | `04-caching` |
| `04-caching` | TanStack Query, `useQuery`, prefetch | `05-complete` |
| `05-complete` | Aplikasi lengkap (studi kasus gabungan) | — |

## Akun demo (mock)

| Email | Password | Role |
|---|---|---|
| `admin@shop.test` | `admin123` | admin |
| `editor@shop.test` | `editor123` | editor |
| `user@shop.test` | `user123` | user |

## Catatan

- Tidak ada backend nyata — semua data ada di `src/api/mockApi.js` (in-memory + delay artifisial agar caching terasa).
- Semua petunjuk ditulis dalam **Bahasa Indonesia**.
