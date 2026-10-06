import React from 'react';
import { Search, Filter, X, ArrowUpDown, RotateCcw } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/constants';

export const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  sortBy,
  setSortBy,
  order,
  setOrder,
  onReset,
  totalResults = 0,
  departments = DEPARTMENTS
}) => {
  const hasActiveFilters = searchTerm.trim() !== '' || selectedDepartment !== '';

  return (
    <div className="glass-card p-4 sm:p-5 border border-white/10 flex flex-col gap-4 relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input (Name or Email) */}
        <div className="md:col-span-5 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department Filter Dropdown */}
        <div className="md:col-span-4 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="" style={{ background: '#131326', color: '#fff' }}>All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept} style={{ background: '#131326', color: '#fff' }}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Sort & Order Dropdowns */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="createdAt" style={{ background: '#131326', color: '#fff' }}>Date Created</option>
              <option value="name" style={{ background: '#131326', color: '#fff' }}>Name</option>
              <option value="department" style={{ background: '#131326', color: '#fff' }}>Department</option>
              <option value="designation" style={{ background: '#131326', color: '#fff' }}>Designation</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 text-slate-300 hover:text-white transition-all shrink-0 flex items-center justify-center active:scale-95"
            title={`Sort ${order === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filter Indicators & Clear Action */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Filtering by:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                Keyword: "{searchTerm}"
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                  onClick={() => setSearchTerm('')}
                />
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                Dept: {selectedDepartment}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                  onClick={() => setSelectedDepartment('')}
                />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
