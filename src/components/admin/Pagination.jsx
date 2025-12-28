const getVisiblePages = (currentPage, totalPages, windowSize = 1) => {
  const pages = [];
  const start = Math.max(2, currentPage - windowSize);
  const end = Math.min(totalPages - 1, currentPage + windowSize);
  pages.push(1); // we will always show the page 1
  if (start > 2) {
    pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    // range pushing
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("...");
  }

  if (totalPages > 1) {
    // if the total pages is more than one we will place the last page number as a static
    pages.push(totalPages);
  }
  return pages;
};

const Pagination = ({
  totalItems,
  perPage,
  currentPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [2, 5, 10, 20, 50],
  windowSize = 1,
}) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const pageNumbersToRender = getVisiblePages(
    currentPage,
    totalPages,
    windowSize
  );
  // if (totalPages <= 1) {
  //   return null;
  // }
  /// Handle Events ////
  const handlePerPageChange = (e) => {
    onPerPageChange(+e.target.value);
    onPageChange(1);
  };
  const handlePageChange = (value) => {
    onPageChange(value);
  };

  return (
    <div className="md:flex md:justify-between items-center mt-4">
      {/* ... Page Info and Prev Button are the same ... */}
      <p className="text-sm text-gray-500 mb-4 md:mb-0">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap gap-2">
        <div>
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className="border-2 px-3 h-9 rounded-xl focus:ring-1 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
          >
            {perPageOptions.map((o, i) => (
              <option key={i} value={o}>{`${o} per Page`}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* PREV BUTTON */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange((p) => p - 1)}
            className="px-3 h-9 border rounded-full hover:bg-primary hover:text-white disabled:opacity-50"
          >
            Prev
          </button>

          {pageNumbersToRender.map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-3 py-1 text-gray-500 cursor-default">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => handlePageChange(p)}
                className={`min-w-[36px] h-9 border rounded-full ${
                  currentPage === p
                    ? "bg-primary text-white text-white border-blue-600" // Highlight color
                    : "hover:bg-primary hover:text-white flex items-center justify-center"
                }`}
              >
                {p}
              </button>
            )
          )}
          {/* NEXT BUTTON */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange((p) => p + 1)}
            className="px-3 h-9 border rounded-full hover:bg-primary hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
