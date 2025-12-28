// src/pages/admin/coupons/ViewAllCoupons.jsx
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/admin/Pagination";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import { fetchAllCoupons } from "../../../utils/admin/coupons";

const wrapperData = {
  title: "List Coupons",
  description: "These are all available promo codes",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Coupons", to: "/admin/coupons" },
  ],
};

export default function ViewAllCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  // Pagination
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const data = await fetchAllCoupons();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCoupons();
  }, []);

  /* ---------------- Filter ---------------- */
  const filtered = useMemo(() => {
    return coupons.filter((c) => {
      const text = `${c.code} ${c.description ?? ""}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesType = type === "all" || c.discount_type === type;
      return matchesSearch && matchesType;
    });
  }, [coupons, search, type]);

  /* ---------------- Pagination ---------------- */
  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const handleDelete = (coupon) => {
    if (!confirm(`Delete coupon ${coupon.code}?`)) return;
    console.log("Delete coupon", coupon.id);
  };

  return (
    <>
      <AdminHeaderWrapper {...wrapperData} />

      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search coupon code"
                className="pl-10 pr-3 py-2 border-2 rounded-xl w-64 focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
              />
            </div>

            {/* Discount Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border-2 px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            >
              <option value="all">All Types</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FLAT">Flat</option>
            </select>
          </div>

          <Link
            to="/admin/coupons/new"
            className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Add Coupon
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[var(--color-muted-bg)] text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Usage</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Loading coupons...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No Coupons found
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="p-3 font-medium">{c.id}</td>
                    <td className="p-3 font-semibold">{c.code}</td>
                    <td className="p-3">{c.discount_type}</td>
                    <td className="p-3">
                      {c.discount_type === "PERCENTAGE"
                        ? `${c.discount_value}%`
                        : `₹${c.discount_value}`}
                    </td>
                    <td className="p-3">
                      {c.used_count}/{c.usage_limit ?? "∞"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          c.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/coupons/${c.id}`}
                          className="border border-blue-400 text-blue-600 p-2 rounded-lg"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(c)}
                          className="border border-red-400 text-red-600 p-2 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            totalItems={filtered.length}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
          />
        </div>
      </div>
    </>
  );
}
