// src/pages/admin/customers/ViewAllCustomers.jsx
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Eye,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/admin/Pagination";
import StatusModal from "../../../components/admin/StatusModal";
import { useAdminCustomerStore } from "../../../store/admin/AdminCustomerStore";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";

const wrapperData = {
  title: "List Customers",
  description: "These are the list of all registered users",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Customers", to: "/admin/customers" },
  ],
};

export default function ViewAllCustomers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  // --- STATE AND CORE LOGIC ---
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    customersData,
    successMessage,
    fetchCustomers,
    deleteCustomer,
    error,
    loading,
    clearStatus,
  } = useAdminCustomerStore();
  const loadData = async () => {
    try {
      await fetchCustomers();
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- Filter ---------------- */
  // FIX 2: Safe Filter Logic
  const filtered = useMemo(() => {
    // Ensure customersData is an array before filtering
    if (!customersData || !Array.isArray(customersData)) return [];

    return customersData.filter((u) => {
      // Use fallback empty strings to prevent "toLowerCase of undefined" errors
      const firstName = u?.first_name || "";
      const lastName = u?.last_name || "";
      const email = u?.email || "";
      const phone = u?.phone || "";

      const text = `${firstName} ${lastName} ${email} ${phone}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesRole = role === "all" || u.role === role;

      return matchesSearch && matchesRole;
    });
  }, [customersData, search, role]);

  /* ---------------- Pagination ---------------- */

  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const handleDelete = (user) => {
    if (!confirm(`Delete user ${user.first_name}?`)) return;
    console.log("Delete user", user.id);
  };
  const resetFilters = () => {
    setRole("all");
    setSearch("");
  };

  return (
    <>
      {/* {successMessage && (
            <StatusModal
              message={successMessage}
              type={"success"}
              onClose={clearStatus}
            />
          )} */}
      <AdminHeaderWrapper {...wrapperData} />

      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search name / email / phone"
                className="pl-10 pr-3 py-2 border-2 rounded-xl w-64 focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
              />
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border-2 px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Link
            to="/admin/customers/new"
            className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Add Customer
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded-2xl shadow ">
          <div className="overflow-x-auto py-2">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[var(--color-muted-bg)] text-left">
                  <th className="p-3">Id</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* 1. ERROR STATE */}
                {error ? (
                  <tr>
                    <td colSpan={6} className="py-20">
                      <div className="flex flex-col items-center justify-center text-red-500 gap-2">
                        <AlertCircle size={48} />
                        <p className="font-semibold">{error}</p>
                        <button
                          onClick={() => loadData()} // Calls the customer specific fetch
                          className="mt-2 flex items-center gap-2 text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                        >
                          <RefreshCw size={16} /> Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : /* 2. LOADING STATE */
                loading ? (
                  <tr>
                    <td colSpan={6} className="py-20">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-gray-500 animate-pulse font-medium">
                          Loading customer database...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : /* 3. NO RECORDS FOUND (EMPTY STATE) */
                paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Search size={48} className="opacity-20" />
                        <p className="text-lg">
                          No customers found matching your search
                        </p>
                        <button
                          onClick={resetFilters}
                          className="text-primary font-medium underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* 4. SUCCESS STATE (DATA LIST) */
                  paginated.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-600">#{u.id}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">
                            {u.first_name} {u.last_name}
                          </span>
                          <span className="text-xs text-gray-400 uppercase tracking-tighter">
                            {u.role}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{u.email}</td>
                      <td className="p-3 text-gray-600">{u.phone}</td>
                      <td className="p-3 text-gray-500">
                        {/* Formats date nicely if it's a valid string */}
                        {u.created_at || "N/A"}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/admin/customers/${u.id}`}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg border border-blue-100 transition shadow-sm"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(u)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg border border-red-100 transition shadow-sm"
                            title="Delete Customer"
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
          </div>
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
