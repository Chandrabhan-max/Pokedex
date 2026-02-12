interface Props {
  page: number;
  total: number;
  limit: number;
  setPage: (val: number) => void;
}

function Pagination({ page, total, limit, setPage }: Props) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-white/60 dark:bg-gray-700 rounded-lg disabled:opacity-50 shadow"
      >
        Prev
      </button>

      <span className="font-medium text-gray-700 dark:text-gray-300">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-white/60 dark:bg-gray-700 rounded-lg disabled:opacity-50 shadow"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
