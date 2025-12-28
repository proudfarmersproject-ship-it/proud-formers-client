import { useState, useMemo, useEffect } from "react";
import { Plus, Search, ChevronDown, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/admin/Pagination";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
const wrapperData = {
  title: "List Category",
  description: "These are the List of categories",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Categories List", to: "/admin/categories" },
  ],
};
import { useAdminProductStore } from "../../../store/admin/AdminProductStore";

export default function ViewAllCategories() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { fetchCategories, categoriesData } = useAdminProductStore();

  const loadData = async () => {
    try {
      await fetchCategories();
    } catch (err) {
      console.log("Error while Fetching data ", err);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  // Filtering
  const filtered = useMemo(() => {
    return categoriesData.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categoriesData, search]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "latest") return b.id - a.id;
      return 0;
    });
  }, [filtered, sort]);

  // Pagination Logic

  const start = useMemo(() => {
    return (currentPage - 1) * perPage;
  }, [currentPage, perPage]);

  const paginated = useMemo(() => {
    return sorted.slice(start, start + Number(perPage));
  }, [sorted, start, perPage]);

  // Handle the events
  // const handlePerPage = (e) => {
  //   setPerPage(e.target.value);
  // };
  // const handlePage = (num) => {
  //   setPage(num);
  // };
  const handleSort = (e) => {
    setSort(e.target.value);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleDelete = (categorie) => {
    alert(`Delete ID ${categorie.id}`);

    /// Remove the sorted Data
  };
  return (
    <>
      <AdminHeaderWrapper
        title={wrapperData.title}
        description={wrapperData.description}
        breadcrumb={wrapperData.breadcrumb}
      />
      <div className="w-full space-y-6">
        {/* Filters + Create Button */}
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Filters */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary bg-white"
              />
            </div>

            {/* Sort Filter */}
            <select
              value={sort}
              onChange={handleSort}
              className="border cursor-pointer px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="latest">Latest First</option>
            </select>
          </div>

          {/* Right Add New */}
          <Link
            to="/admin/categories/new"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={18} /> Add New Category
          </Link>
        </div>

        {/* Categories Table */}
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow">
          <div className="overflow-x-auto py-2">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left bg-[var(--color-muted-bg)]">
                  {/* <th className="p-3">Image</th> */}
                  <th className="p-3">Id</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td className="col-span-full text-center py-8 text-text-muted">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  paginated.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="p-3 font-medium">{cat.id}</td>
                      <td className="p-3 font-medium">{cat.name}</td>
                      <td className="p-3 text-gray-600">{cat.description}</td>
                      <td className="p-3 text-gray-600">{cat.createdAt}</td>
                      <td>
                        <div className="p-3 flex items-center justify-center gap-3">
                          {/* View */}
                          <Link
                            to={`/admin/categories/${cat.id}`}
                            className="border border-blue-400 text-blue-600 hover:bg-blue-50 
                 rounded-lg p-2 flex items-center justify-center"
                          >
                            <Eye size={20} />
                          </Link>

                          {/* Delete */}
                          <button
                            className="border border-red-400 cursor-pointer text-red-600 hover:bg-red-50
                 rounded-lg p-2 flex items-center justify-center"
                            onClick={() => handleDelete(cat)}
                            type="button"
                          >
                            <Trash2 size={20} />
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
            totalItems={sorted.length}
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
