interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  setPage: (val: number) => void;
}

function Pagination({ page, total, limit, setPage }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-center items-center gap-6 mt-12">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-6 py-2 bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl disabled:opacity-40 shadow-md hover:shadow-lg active:scale-95 transition-all font-semibold"
      >
        Prev
      </button>

      <div className="flex flex-col items-center">
        <span className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">
          Page
        </span>
        <span className="text-xl font-black text-gray-900 dark:text-white">
          {page} <span className="text-gray-400 font-medium">/</span> {totalPages}
        </span>
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-6 py-2 bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl disabled:opacity-40 shadow-md hover:shadow-lg active:scale-95 transition-all font-semibold"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;