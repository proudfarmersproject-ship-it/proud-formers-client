import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/admin/Pagination";
import StatusModal from "../../../components/admin/StatusModal";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import { useAdminProductStore } from "../../../store/admin/AdminProductStore";

const wrapperData = {
  title: "List Products",
  description: "These are the list of all products",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Products", to: "/admin/products" },
  ],
};

export default function ViewAllProducts() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    fetchProducts,
    fetchCategories,
    productsData,
    categoriesData,
    deleteProduct,
    successMessage,
    loading,
    error,
    clearStatus,
  } = useAdminProductStore();
  const loadData = async () => {
    try {
      await fetchCategories();
      await fetchProducts();
    } catch (err) {
      console.log("Error while fetching data :", err);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- Filter ---------------- */
  const filtered = useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return [];

    return productsData.filter((p) => {
      const name = p?.name || "";
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const catId = p?.categorie_details?.id || p?.category_id;
      const matchesCategory =
        categoryFilter === "all" || catId === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [productsData, search, categoryFilter]);

  /* ---------------- Sort ---------------- */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "latest") return b.id - a.id;
      return 0;
    });
  }, [filtered, sort]);

  /* ---------------- Pagination ---------------- */
  const start = (currentPage - 1) * perPage;
  const paginated = sorted.slice(start, start + perPage);

  /* ---------------- Handlers ---------------- */
  const handleDelete = async (product) => {
    if (window.confirm(`Delete Product: ${product.name}?`)) {
      // call delete logic here
      try {
        await deleteProduct(product.id);
        setTimeout(() => {
          clearStatus();
        }, 1500);
      } catch (err) {
        console.log("Error while deleting :", err);
      }
    }
  };
  useEffect(() => {
    console.log("success Message :", successMessage);
  }, [successMessage]);

  return (
    <>
      {successMessage && (
        <StatusModal
          message={successMessage}
          type={"success"}
          onClose={clearStatus}
        />
      )}
      <AdminHeaderWrapper {...wrapperData} />

      <div className="w-full space-y-6">
        {/* Filters Section */}
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none border-2 border-[var(--color-border-color)]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary bg-white border-2 border-[var(--color-border-color)]"
            >
              <option value="all">All Categories</option>
              {categoriesData?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary bg-white border-2 border-[var(--color-border-color)]"
            >
              <option value="latest">Latest</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
            </select>
          </div>

          <Link
            to="/admin/products/new"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 justify-center"
          >
            <Plus size={18} /> Add New Product
          </Link>
        </div>

        {/* Products Table Container */}
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow">
          <div className="overflow-x-auto py-2">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[var(--color-muted-bg)] text-left">
                  <th className="p-3">Id</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* 1. ERROR STATE */}
                {error ? (
                  <tr>
                    <td colSpan={7} className="py-20">
                      <div className="flex flex-col items-center justify-center text-red-500 gap-2">
                        <AlertCircle size={48} />
                        <p className="font-semibold">{error}</p>
                        <button
                          onClick={() => loadData()}
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
                    <td colSpan={7} className="py-20">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-gray-500 animate-pulse">
                          Fetching inventory data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : /* 3. NO RECORDS FOUND */
                paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Search size={48} className="opacity-20" />
                        <p className="text-lg">
                          No products found matching your criteria
                        </p>
                        <button
                          onClick={() => {
                            setSearch("");
                            setCategoryFilter("all");
                          }}
                          className="text-primary text-medium underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* 4. SUCCESS STATE (DATA LIST) */
                  paginated.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="p-3 text-gray-500 text-sm">#{p.id}</td>
                      <td className="p-3">
                        <img
                          src={
                            p?.product_images?.[0]?.image_path ||
                            "https://via.placeholder.com/64"
                          }
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                      </td>
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wider">
                          {p?.categorie_details?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {p.stock_quantity}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase">
                            {p.stock_unit}
                          </span>
                        </div>
                      </td>
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
                      <td className="p-3">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/admin/products/${p.id}`}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg border border-blue-100"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg border border-red-100"
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
          {/* Pagination (Only show if we have data) */}
          {!loading && !error && filtered.length > 0 && (
            <Pagination
              totalItems={filtered.length}
              currentPage={currentPage}
              perPage={perPage}
              onPageChange={setCurrentPage}
              onPerPageChange={setPerPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
