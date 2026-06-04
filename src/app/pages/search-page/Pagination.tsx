interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-12 h-12 rounded-xl bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        ‹
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        // sliding window centred on current page
        let p: number
        if (totalPages <= 7) {
          p = i + 1
        } else if (page <= 4) {
          p = i + 1
        } else if (page >= totalPages - 3) {
          p = totalPages - 6 + i
        } else {
          p = page - 3 + i
        }
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-12 h-12 rounded-xl transition-all ${
              p === page
                ? 'bg-[#3A6EA5] text-white shadow-lg shadow-[#3A6EA5]/30'
                : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white'
            }`}
          >
            {p}
          </button>
        )
      })}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-12 h-12 rounded-xl bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        ›
      </button>
    </div>
  )
}
