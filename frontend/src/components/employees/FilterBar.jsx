import React from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
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
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
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
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-300 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
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
            className="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
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
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
            >
              <option value="createdAt">Date Created</option>
              <option value="name">Name</option>
              <option value="department">Department</option>
              <option value="designation">Designation</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shrink-0 flex items-center justify-center"
            title={`Sort ${order === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filter Indicators & Clear Action */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium">Filtering by:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                Keyword: "{searchTerm}"
                <X
                  className="w-3 h-3 cursor-pointer hover:text-indigo-900"
                  onClick={() => setSearchTerm('')}
                />
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-100">
                Dept: {selectedDepartment}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-purple-900"
                  onClick={() => setSelectedDepartment('')}
                />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
