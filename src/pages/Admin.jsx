import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsersApi } from "../api/mockApi";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate(); // Hook untuk berpindah halaman

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);

        let token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        if (!token || !token.startsWith("mock-token-")) {
          token = "mock-token-admin-YWRtaW5Ac2hvcC50ZXN0"; // Bypass token
        }

        const data = await fetchUsersApi(token);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Gagal memuat data pengguna.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Helper inisial nama
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.split(" ");
    return words.map((w) => w[0]).join("").substring(0, 2).toUpperCase();
  };

  // Helper warna badge role
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" };
      case "editor":
        return { backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" };
      default:
        return { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontFamily: "sans-serif" }}>
        <div style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #8b5cf6", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }} />
        <p style={{ marginTop: "16px", color: "#6b7280", fontWeight: "500" }}>Memuat data pengguna...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "12px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h3 style={{ color: "#991b1b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Terjadi Kesalahan</h3>
        <p style={{ color: "#b91c1c", marginBottom: "16px" }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ padding: "10px 20px", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", fontFamily: "Inter, system-ui, sans-serif", color: "#1f2937" }}>
      
      {/* Header Panel */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#111827", letterSpacing: "-0.5px" }}>Daftar Pengguna</h2>
          <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>Kelola informasi akses akun terdaftar di sistem.</p>
        </div>
        <span style={{ backgroundColor: "#f3e8ff", color: "#6b21a8", fontSize: "12px", fontWeight: "600", padding: "6px 14px", borderRadius: "9999px" }}>
          Total: {users.length} User
        </span>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pengguna</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>ID Akun</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Peran (Role)</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, idx) => (
                <tr key={user.id} style={{ borderBottom: idx === currentUsers.length - 1 ? "none" : "1px solid #f3f4f6", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  {/* Avatar & Name */}
                  <td style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: user.role === 'admin' ? '#f3e8ff' : '#e0f2fe', color: user.role === 'admin' ? '#6b21a8' : '#0369a1', display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px" }}>
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}>{user.name}</div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>Aktif</div>
                    </div>
                  </td>
                  
                  {/* ID */}
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>
                    <code>{user.id}</code>
                  </td>

                  {/* Email */}
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563" }}>
                    {user.email}
                  </td>

                  {/* Role Badge */}
                  <td style={{ padding: "16px 24px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize", ...getRoleBadgeStyle(user.role) }}>
                      {user.role}
                    </span>
                  </td>

                  {/* Action Button (Pindah Halaman) */}
                  <td style={{ padding: "16px 24px", textAlign: "center" }}>
                    <button
                      onClick={() => navigate(`/admin/user/${user.id}`)} // Diarahkan ke Halaman Detail baru
                      style={{ padding: "6px 14px", fontSize: "12px", fontWeight: "600", border: "1px solid #8b5cf6", borderRadius: "6px", backgroundColor: "white", color: "#8b5cf6", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#8b5cf6"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#8b5cf6"; }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Menampilkan halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
          </span>
          
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: "8px 14px", fontSize: "13px", fontWeight: "500", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "white", color: currentPage === 1 ? "#9ca3af" : "#374151", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
            >
              Sebelumnya
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{ padding: "8px 14px", fontSize: "13px", fontWeight: "600", border: "1px solid", borderColor: currentPage === page ? "#8b5cf6" : "#e5e7eb", borderRadius: "8px", backgroundColor: currentPage === page ? "#8b5cf6" : "white", color: currentPage === page ? "white" : "#374151", cursor: "pointer" }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: "8px 14px", fontSize: "13px", fontWeight: "500", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "white", color: currentPage === totalPages ? "#9ca3af" : "#374151", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}