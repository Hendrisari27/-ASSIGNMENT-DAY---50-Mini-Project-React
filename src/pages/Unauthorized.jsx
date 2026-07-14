import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="page">
      <h1>403 — Tidak berhak akses 🚫</h1>
      <p>Role kamu tidak diizinkan membuka halaman itu.</p>
      <Link to="/" className="button">
        Kembali ke Home
      </Link>
    </div>
  );
}

export default Unauthorized;
