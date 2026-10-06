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

  // Generate page numbers array with simple range
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 bg-white/50 backdrop-blur-xs rounded-2xl border border-slate-200/80 px-4">
      {/* Items count & Per-page selector */}
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <span>
          Showing <strong className="text-slate-900">{startIdx}</strong> to{' '}
          <strong className="text-slate-900">{endIdx}</strong> of{' '}
          <strong className="text-slate-900">{total}</strong> results
        </span>

        <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-slate-300 py-1 px-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page navigation buttons */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Number buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                p === page
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
