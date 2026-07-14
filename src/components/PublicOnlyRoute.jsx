import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Kebalikan ProtectedRoute: untuk halaman yang hanya boleh diakses user
// yang BELUM login (mis. /login).
function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <p className="status">Memuat…</p>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default PublicOnlyRoute;
