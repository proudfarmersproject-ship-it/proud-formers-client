// import AdminLayout from "../layouts/AdminLayout";
import Layout from "../layouts/admin/layout";
import Dashboard from "../pages/admin/Dashboard";
import Admin from "../pages/admin/Admin";
export const adminRoutes = {
  path: "/admin",
  element: <Layout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "products", element: <Admin /> },
  ],
};
