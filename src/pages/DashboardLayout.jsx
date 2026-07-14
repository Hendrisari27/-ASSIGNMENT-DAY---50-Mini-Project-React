import { NavLink, Outlet } from "react-router-dom";

function DashboardLayout() {
  const linkClass = ({ isActive }) =>
    isActive ? "navbar__link active" : "navbar__link";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2>Dashboard</h2>
        <nav className="dashboard-nav">
          <NavLink to="/dashboard" end className={linkClass}>
            Ringkasan
          </NavLink>
          <NavLink to="/dashboard/orders" className={linkClass}>
            Orders
          </NavLink>
        </nav>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
