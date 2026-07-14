import { QueryClient } from "@tanstack/react-query";

// Cache "server state" untuk seluruh aplikasi. Dipasang sebagai
// <QueryClientProvider client={queryClient}> di main.jsx.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 menit data dianggap masih segar
      gcTime: 1000 * 60 * 5, // 5 menit disimpan di memori setelah tak dipakai
      refetchOnWindowFocus: false,
    },
  },
});
