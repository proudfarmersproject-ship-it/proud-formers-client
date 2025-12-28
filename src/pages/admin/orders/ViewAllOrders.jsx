import { useState, useMemo, useEffect } from "react";
import { Eye, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import { ordersData, usersData } from "../../../utils/admin/dummyData";
import Pagination from "../../../components/admin/Pagination";

const wrapperData = {
  title: "Orders",
  description: "Manage all customer orders",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "View All Orders", to: "/admin/orders" },
  ],
};

export default function ViewAllOrders() {
  const [status, setStatus] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const enriched = useMemo(() => {
    return ordersData.map((o) => {
      const user = usersData.find((u) => u.id === o.user_id);
      return { ...o, customer: user };
    });
  }, []);

  const filtered = useMemo(() => {
    if (status === "all") return enriched;
    return enriched.filter((o) => o.order_status === status);
  }, [status, enriched]);

  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  ///// order Analytics
  const totalOrders = ordersData.length;
  const pendingOrders = ordersData.filter(
    (o) => o.order_status === "pending"
  ).length;
  const shippedOrders = ordersData.filter(
    (o) => o.order_status === "shipped"
  ).length;
  const deliveredOrders = ordersData.filter(
    (o) => o.order_status === "delivered"
  ).length;

  return (
    <>
      <AdminHeaderWrapper {...wrapperData} />
      {/* Order Analytics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl shadow">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-semibold text-yellow-800">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl shadow">
          <p className="text-sm text-blue-700">Shipped</p>
          <p className="text-2xl font-semibold text-blue-800">
            {shippedOrders}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl shadow">
          <p className="text-sm text-green-700">Delivered</p>
          <p className="text-2xl font-semibold text-green-800">
            {deliveredOrders}
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow flex gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-2 px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-2 border-[var(--color-border-color)]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        {/* Orders Table */}
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-[var(--color-muted-bg)] text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((o) => (
                <tr
                  key={o.id}
                  className="border-b odd:bg-white even:bg-gray-50"
                >
                  <td className="p-3 font-medium">#{o.id}</td>
                  <td className="p-3 font-medium">{o.created_at}</td>
                  <td className="p-3 font-medium">
                    {o.customer
                      ? `${o.customer?.first_name} ${o.customer?.last_name}`
                      : "Unknown User"}{" "}
                  </td>
                  <td className="p-3">${o.total_amount.toFixed(2)}</td>
                  <td className="p-3 capitalize">{o.payment_status}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        o.order_status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : o.order_status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.order_status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="inline-flex border border-blue-400 text-blue-600 rounded-lg p-2 hover:bg-blue-50"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            totalItems={filtered.length}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={setCurrentPage} // Pass the setter function
            onPerPageChange={setPerPage} // pass the setter function
          />
        </div>
      </div>
    </>
  );
}
