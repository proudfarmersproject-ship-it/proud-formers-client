import { Outlet, Link } from "react-router-dom";
import useThemeLoader from "../../hooks/common/useThemeLoader";

export default function Layout() {
  useThemeLoader();
  return (
    <div>
      <nav className="p-4 bg-primary-dark text-white flex gap-4">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/">User</Link>
      </nav>

      <Outlet />
    </div>
  );
}
