import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE_OPTIONS } from '../../utils/constants';

export const EmployeePagination = ({
  pagination = {},
  onPageChange,
  onLimitChange
}) => {
  const {
    total = 0,
    page = 1,
    limit = 10,
    totalPages = 1,
    hasNextPage = false,
    hasPrevPage = false
  } = pagination;

  if (total === 0) return null;

  const startIdx = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-4 glass-card border border-white/10">
      {/* Items count & Per-page selector */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>
          Showing <strong className="text-white font-semibold">{startIdx}</strong> to{' '}
          <strong className="text-white font-semibold">{endIdx}</strong> of{' '}
          <strong className="text-white font-semibold">{total}</strong> results
        </span>

        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-xl border border-white/10 py-1 px-2.5 text-xs font-semibold text-white bg-white/5 focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} style={{ background: '#131326', color: '#fff' }}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page navigation buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                p === page
                  ? 'grad-purple-pink text-white shadow-md glow-purple scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
