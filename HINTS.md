# HINTS — 04 Caching

> Autentikasi sungguhan sudah jalan di branch ini (AuthProvider, login form,
> interceptor 401). Sekarang singkirkan fetch berulang dengan **caching**.
> Kerjakan `// TODO` **(branch 04)**. **Solusi ada di branch `05-complete`.**

## Tujuan

Memakai **TanStack Query** sebagai cache "server state": pindah route lalu balik
lagi idealnya tidak fetch ulang selama data masih segar. Plus **prefetch** agar
halaman detail terasa instan.

Library: `@tanstack/react-query` (sudah terpasang). Konsep inti: `queryKey`
(alamat cache), `staleTime` (kapan dianggap basi), `gcTime` (kapan dibuang dari
memori).

`src/lib/queryClient.js` sudah ada (dengan default `staleTime`/`gcTime`). Kamu
tinggal **memasang providernya** lalu memakai `useQuery`.

---

## 1. Pasang `QueryClientProvider` (main.jsx)

**Level 1 — Konsep.** TanStack Query butuh satu provider di atas aplikasi yang
membagikan cache ke semua komponen.

**Level 2 — API.** Impor `QueryClientProvider` dan `queryClient` (sudah dibuat di
`src/lib/queryClient.js`), lalu bungkus `<App>`.

**Level 3 — Sketsa.**
```jsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

createRoot(...).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

---

## 2. Ganti `useEffect` → `useQuery` (ProductDetail.jsx)

**Level 1 — Konsep.** Pattern lama fetch-then-setState di `useEffect` refetch tiap
mount walau data belum berubah (slide 41 — anti-pattern). `useQuery` mengelola
loading/error/cache otomatis.

**Level 2 — API.** `useQuery({ queryKey, queryFn })`. `queryKey` adalah "alamat"
cache — key yang sama → data dipakai ulang selama masih segar.

**Level 3 — Sketsa.**
```jsx
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchProduct, formatRupiah } from "../api/mockApi";

function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  if (isLoading) return <p className="status">Memuat produk…</p>;
  if (isError || !product) return <p className="status error">Gagal memuat produk.</p>;

  return ( /* ...tampilan sama seperti sebelumnya... */ );
}
```
Buka dua produk bergantian, lalu balik — perhatikan Network tab: tidak ada request
ulang selama masih dalam `staleTime` (1 menit).

---

## 3. `queryKey`, `staleTime`, `gcTime`

- **`queryKey`** → identitas cache. `["product", "p-01"]` ≠ `["product", "p-02"]`.
- **`staleTime`** → berapa lama data dianggap masih segar (tidak refetch otomatis).
  Default di repo ini: 1 menit.
- **`gcTime`** (dulu `cacheTime`) → berapa lama data bertahan di memori setelah
  tidak ada komponen yang memakainya. Default di repo ini: 5 menit.

---

## 4. 🧪 Latihan slide 49 — Prefetch on hover (ProductCard.jsx)

**Tugas:** saat kartu produk di-hover, prefetch detailnya. Saat diklik, halaman
detail muncul instan (data sudah di cache).

**Level 1 — Konsep.** `prefetchQuery` mengisi cache sebelum komponen butuh —
berguna saat kita bisa menebak data yang akan dipakai (mis. user meng-hover).

**Level 2 — API.** Ambil instance cache via `useQueryClient()`, lalu panggil
`queryClient.prefetchQuery({ queryKey, queryFn })` di `onMouseEnter`.

**Level 3 — Sketsa.** (di Products.jsx, bungkus kartu)
```jsx
import { useQueryClient } from "@tanstack/react-query";
import { fetchProduct } from "../api/mockApi";
// ...
const queryClient = useQueryClient();

<div
  onMouseEnter={() =>
    queryClient.prefetchQuery({
      queryKey: ["product", p.id],
      queryFn: () => fetchProduct(p.id),
    })
  }
>
  <Link to={`/products/${p.id}`} className="card-link">
    <ProductCard product={p} />
  </Link>
</div>
```
Bandingkan Network tab dengan vs tanpa prefetch: saat klik, data sudah ada (tidak
ada request baru selama masih segar).

---

## 5. (Opsional) Loader-based caching

> Tidak wajib. Hanya pengenalan — JANGAN ganti seluruh app ke `createBrowserRouter`.

React Router v6.4+ bisa menyiapkan data lewat `loader` SEBELUM komponen render:
```jsx
const router = createBrowserRouter([
  {
    path: "/products/:productId",
    element: <ProductDetail />,
    loader: ({ params }) =>
      queryClient.ensureQueryData({
        queryKey: ["product", params.productId],
        queryFn: () => fetchProduct(params.productId),
      }),
  },
]);
```
Mengurangi spinner karena data sudah siap. Karena app ini memakai
`<BrowserRouter>+<Routes>`, biarkan sebagai catatan — jangan refactor seluruh
router di branch ini.

---

## ✅ Ceklis selesai

- [ ] `QueryClientProvider` membalut `<App>` di main.jsx.
- [ ] ProductDetail memakai `useQuery` (bukan `useEffect`).
- [ ] Pindah-pindah halaman tidak refetch selama masih segar (cek Network tab).
- [ ] Hover kartu produk → prefetch → klik terasa instan.
- [ ] (Opsional) pahami ide `loader` + `ensureQueryData`.

## Solusi

```bash
git switch 05-complete   # caching sudah jalan + aplikasi lengkap
```
