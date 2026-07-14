import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUsersApi } from "../api/mockApi";

export default function UserDetail() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);

        let token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token || !token.startsWith("mock-token-")) {
          token = "mock-token-admin-YWRtaW5Ac2hvcC50ZXN0"; // Bypass token
        }

        // Ambil semua user lalu cari yang ID-nya cocok
        const allUsers = await fetchUsersApi(token);
        const foundUser = allUsers.find((u) => u.id === id || String(u.id) === String(id));

        if (!foundUser) {
          throw new Error("Pengguna tidak ditemukan.");
        }

        setUser(foundUser);
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat detail pengguna.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

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
        <p style={{ marginTop: "16px", color: "#6b7280", fontWeight: "500" }}>Memuat detail pengguna...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "500px", margin: "80px auto", padding: "24px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "12px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h3 style={{ color: "#991b1b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Terjadi Kesalahan</h3>
        <p style={{ color: "#b91c1c", marginBottom: "20px" }}>{error}</p>
        <button 
          onClick={() => navigate("/admin")} 
          style={{ padding: "10px 20px", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          Kembali ke Daftar Admin
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Back Link */}
      <button 
        onClick={() => navigate("/admin")}
        style={{ background: "none", border: "none", color: "#8b5cf6", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", padding: 0 }}
      >
        ← Kembali ke Daftar Pengguna
      </button>

      {/* Card Detail */}
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)", border: "1px solid #f3f4f6" }}>
        
        {/* Profile Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: "24px", marginBottom: "24px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: user.role === 'admin' ? '#f3e8ff' : '#e0f2fe', color: user.role === 'admin' ? '#6b21a8' : '#0369a1', display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "28px", marginBottom: "16px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
            {getInitials(user.name)}
          </div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "700", color: "#111827" }}>{user.name}</h3>
          <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", ...getRoleBadgeStyle(user.role) }}>
            {user.role}
          </span>
        </div>

        {/* Information Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "600", color: "#9ca3af", display: "block", marginBottom: "6px" }}>User ID</label>
            <div style={{ fontSize: "14px", color: "#1f2937", backgroundColor: "#f9fafb", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
              <code>{user.id}</code>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "600", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Alamat Email</label>
            <div style={{ fontSize: "14px", color: "#1f2937", backgroundColor: "#f9fafb", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
              {user.email}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "600", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Status Akun</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#1f2937", backgroundColor: "#f9fafb", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
              <span>Aktif & Terverifikasi</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}