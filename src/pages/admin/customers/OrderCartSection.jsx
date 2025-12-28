// src/components/admin/orders/OrderCartSection.jsx
import { useState, useMemo } from "react";
import Pagination from "../../../components/admin/Pagination";

export default function OrderCartSection({
  cartData = [],
  onViewVariant,
}) {
  /* ---------------- FILTER & SORT ---------------- */
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price_desc");

  /* ---------------- PAGINATION ---------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredItems = useMemo(() => {
    let data = [...cartData];

    if (statusFilter !== "all") {
      data = data.filter((i) => i.status === statusFilter);
    }

    data.sort((a, b) => {
      const priceA = a.subtotal ?? 0;
      const priceB = b.subtotal ?? 0;

      if (sortBy === "price_desc") return priceB - priceA;
      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "qty_desc") return b.quantity - a.quantity;
      if (sortBy === "qty_asc") return a.quantity - b.quantity;
      return 0;
    });

    return data;
  }, [statusFilter, sortBy]);

  /* ---------------- PAGINATION LOGIC ---------------- */

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* ---------------- HANDLERS ---------------- */
  const resetPage = () => setCurrentPage(1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Cart Items</h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            resetPage();
          }}
          className="p-2 border-2 rounded-xl focus:ring-2 focus:ring-primary-light bg-white focus:outline-none border-[var(--color-border-color)]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            resetPage();
          }}
          className="p-2 border-2 rounded-xl focus:ring-2 focus:ring-primary-light bg-white focus:outline-none border-[var(--color-border-color)]"
        >
          <option value="price_desc">Price: High → Low</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="qty_desc">Quantity: High → Low</option>
          <option value="qty_asc">Quantity: Low → High</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">id</th>
              <th className="p-3 text-left">Variant</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No cart items found
                </td>
              </tr>
            )}

            {paginatedItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.variant_name ?? "N/A"}</td>
                <td className="p-3">{item.sku ?? "-"}</td>
                <td className="p-3">{item.unit ?? "-"}</td>
                <td className="p-3">₹{item.price ?? 0}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3 font-medium">
                  ₹{(item.price ?? 0) * item.quantity}
                </td>
                <td className="p-3 capitalize">{item.status ?? "-"}</td>
                <td className="p-3">
                  <button
                    onClick={() => onViewVariant?.(item.id)}
                    className="text-primary underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        totalItems={filteredItems.length}
        currentPage={currentPage}
        perPage={perPage}
        onPageChange={setCurrentPage} // Pass the setter function
        onPerPageChange={setPerPage} // pass the setter function
      />
    </div>
  );
}
