import React from 'react';
import { UserPlus, RefreshCw, AlertCircle, Download, Users } from 'lucide-react';
import { FilterBar } from '../components/employees/FilterBar';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeCard } from '../components/employees/EmployeeCard';
import { EmployeePagination } from '../components/employees/EmployeePagination';
import { TableSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

export const EmployeesPage = ({
  employees = [],
  pagination = {},
  isLoading = false,
  error = null,
  searchTerm = '',
  setSearchTerm,
  selectedDepartment = '',
  setSelectedDepartment,
  sortBy = 'createdAt',
  setSortBy,
  order = 'desc',
  setOrder,
  onResetFilters,
  onPageChange,
  onLimitChange,
  onRefresh,
  onExportCSV,
  onOpenAddModal,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee
}) => {
  const isFiltered = searchTerm.trim() !== '' || selectedDepartment !== '';

  return (
    <div className="space-y-6 animate-modal">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <Users className="w-4 h-4" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Employee Directory
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, and maintain organizational personnel records with live database synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={onExportCSV}
            disabled={employees.length === 0}
            title="Export filtered records to CSV"
          >
            Export CSV
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={onRefresh}
            isLoading={isLoading}
            title="Refresh list from server"
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-none shadow-lg shadow-violet-500/20"
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        onReset={onResetFilters}
        totalResults={pagination.total || 0}
      />

      {/* Error Alert View */}
      {error && !isLoading && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-4 animate-slide-down">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-rose-200">Failed to load employees</h4>
              <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onRefresh}>
            Try Again
          </Button>
        </div>
      )}

      {/* Content Display: Loading / Empty / Data Table */}
      {isLoading ? (
        <TableSkeleton rows={pagination.limit || 5} />
      ) : employees.length === 0 ? (
        <EmptyState
          isSearch={isFiltered}
          title={isFiltered ? 'No matching employees found' : 'No employees in directory yet'}
          description={
            isFiltered
              ? `We couldn't find any employees matching your current search criteria. Try adjusting keywords or resetting filters.`
              : 'Your employee directory is currently empty. Start by adding your first team member.'
          }
          actionText={isFiltered ? 'Reset all filters' : 'Add First Employee'}
          onAction={isFiltered ? onResetFilters : onOpenAddModal}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block">
            <EmployeeTable
              employees={employees}
              onView={onViewEmployee}
              onEdit={onEditEmployee}
              onDelete={onDeleteEmployee}
            />
          </div>

          {/* Mobile Card Grid View (< 768px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee._id}
                employee={employee}
                onView={onViewEmployee}
                onEdit={onEditEmployee}
                onDelete={onDeleteEmployee}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <EmployeePagination
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        </div>
      )}
    </div>
  );
};
