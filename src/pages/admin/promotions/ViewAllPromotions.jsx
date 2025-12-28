import { useState, useMemo } from "react";
import { Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import Pagination from "../../../components/admin/Pagination";

// ---- Dummy Data (based on Promo DB schema) ----
const promotionsData = [
  {
    id: 1,
    name: "Rice Festival Offer",
    promotion_type: "CATEGORY",
    discount_type: "PERCENTAGE",
    discount_value: 10,
    start_date: "2025-01-01",
    end_date: "2025-01-10",
    is_active: true,
  },
  {
    id: 2,
    name: "Basmati Special",
    promotion_type: "PRODUCT",
    discount_type: "PERCENTAGE",
    discount_value: 20,
    start_date: "2025-01-05",
    end_date: "2025-01-20",
    is_active: true,
  },
  {
    id: 3,
    name: "Cart ₹200 OFF",
    promotion_type: "CART",
    discount_type: "FLAT",
    discount_value: 200,
    start_date: "2025-01-01",
    end_date: "2025-01-31",
    is_active: false,
  },
  {
    id: 4,
    name: "Free Shipping Above ₹999",
    promotion_type: "SHIPPING",
    discount_type: "FLAT",
    discount_value: 80,
    start_date: "2025-01-01",
    end_date: "2025-01-31",
    is_active: true,
  },
];

const wrapperData = {
  title: "Promotions & Coupons",
  description: "View and manage all promotions and promo codes",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Promotions", to: "/admin/promotions" },
  ],
};

export default function ViewAllPromotions() {
  const [type, setType] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (type === "all") return promotionsData;
    return promotionsData.filter((p) => p.promotion_type === type);
  }, [type]);

  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <>
      <AdminHeaderWrapper {...wrapperData} />

      {/* Analytics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        {["PRODUCT", "CATEGORY", "CART", "SHIPPING"].map((t) => (
          <div key={t} className="bg-white p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500">{t} Promotions</p>
            <p className="text-2xl font-semibold">
              {promotionsData.filter((p) => p.promotion_type === t).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow flex justify-between items-center">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-3 py-2 rounded-xl bg-white"
        >
          <option value="all">All Types</option>
          <option value="PRODUCT">Product</option>
          <option value="CATEGORY">Category</option>
          <option value="CART">Cart</option>
          <option value="SHIPPING">Shipping</option>
        </select>

        <Link
          to="/admin/promotions/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} /> Create Promotion
        </Link>
      </div>

      {/* Promotions Table */}
      <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow overflow-x-auto mt-6">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-[var(--color-muted-bg)] text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Start</th>
              <th className="p-3">End</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-b odd:bg-white even:bg-gray-50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.promotion_type}</td>
                <td className="p-3">
                  {p.discount_type === "PERCENTAGE"
                    ? `${p.discount_value}%`
                    : `₹${p.discount_value}`}
                </td>
                <td className="p-3">{p.start_date}</td>
                <td className="p-3">{p.end_date}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      p.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <Link
                    to={`/admin/promotions/${p.id}`}
                    className="inline-flex border border-blue-400 text-blue-600 rounded-lg p-2 hover:bg-blue-50"
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          totalItems={filtered.length}
          currentPage={currentPage}
          perPage={perPage}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </>
  );
}
