import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form);
      navigate(from, { replace: true }); // kembali ke halaman asal
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Gagal masuk");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="page login-form" onSubmit={handleSubmit}>
      <h1>Masuk</h1>
      <p className="status">
        Demo: <code>admin@shop.test</code> / <code>admin123</code>
      </p>
      <label>
        Email
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </label>
      <button className="button button--primary" type="submit" disabled={submitting}>
        {submitting ? "Memproses…" : "Masuk"}
      </button>
      {error && <p className="status error">{error}</p>}
    </form>
  );
}

export default Login;
