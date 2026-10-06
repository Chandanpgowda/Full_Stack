import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { EmployeeDetailModal } from './components/employees/EmployeeDetailModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { ApiDocsModal } from './components/common/ApiDocsModal';
import { ToastProvider, useToast } from './context/ToastContext';
import { employeeService } from './services/employeeService';
import { useDebounce } from './hooks/useDebounce';
import { exportEmployeesToCSV } from './utils/exportToCsv';

const MainApp = () => {
  const { showToast } = useToast();

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Employee data & pagination state
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]); // For accurate dashboard metrics
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('connecting');

  // Modal Dialog states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Check backend server health
  const checkHealth = useCallback(async () => {
    try {
      const data = await employeeService.checkHealth();
      if (data.success && data.status === 'healthy') {
        setServerStatus('healthy');
      } else {
        setServerStatus('unhealthy');
      }
    } catch {
      setServerStatus('unhealthy');
    }
  }, []);

  // Fetch employees list for Directory page
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await employeeService.getEmployees({
        search: debouncedSearch,
        department: selectedDepartment,
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        order
      });

      if (response.success) {
        setEmployees(response.data || []);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            ...response.pagination
          }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve employee records from the server.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedDepartment, pagination.page, pagination.limit, sortBy, order]);

  // Fetch all employees for Dashboard metrics
  const fetchAllForDashboard = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees({ limit: 0, sortBy: 'createdAt', order: 'desc' });
      if (response.success) {
        setAllEmployees(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    }
  }, []);

  // Initial load and Health Check
  useEffect(() => {
    checkHealth();
    fetchAllForDashboard();
  }, [checkHealth, fetchAllForDashboard]);

  // Refetch when filters or pagination change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Reset page to 1 when search or department changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, selectedDepartment]);

  // Handler: Open Add Modal
  const handleOpenAddModal = () => {
    setEmployeeToEdit(null);
    setIsFormModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditModal = (employee) => {
    setEmployeeToEdit(employee);
    setIsFormModalOpen(true);
  };

  // Handler: Open View Detail Modal
  const handleOpenDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  // Handler: Open Delete Confirmation Modal
  const handleOpenDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  // Handler: Submit Form (Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (employeeToEdit) {
        // Update existing employee
        const response = await employeeService.updateEmployee(employeeToEdit._id, formData);
        showToast(
          response.message || `Updated details for ${formData.name}`,
          'success'
        );
      } else {
        // Create new employee
        const response = await employeeService.createEmployee(formData);
        showToast(
          response.message || `Successfully created profile for ${formData.name}`,
          'success'
        );
      }

      // Refresh data
      await Promise.all([fetchEmployees(), fetchAllForDashboard()]);
      setIsFormModalOpen(false);
      setEmployeeToEdit(null);
    } catch (err) {
      // Re-throw so modal can display inline error
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Confirm Delete
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await employeeService.deleteEmployee(employeeToDelete._id);
      showToast(
        response.message || `Deleted employee ${employeeToDelete.name}`,
        'success'
      );
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);

      // Refresh data
      await Promise.all([fetchEmployees(), fetchAllForDashboard()]);
    } catch (err) {
      showToast(err.message || 'Failed to delete employee profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSortBy('createdAt');
    setOrder('desc');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    try {
      exportEmployeesToCSV(employees, `employees_export_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${employees.length} records to CSV successfully!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to export CSV', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenDocs={() => setIsDocsOpen(true)}
        serverStatus={serverStatus}
        totalCount={allEmployees.length || pagination.total}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' ? (
          <DashboardPage
            employees={allEmployees.length > 0 ? allEmployees : employees}
            totalCount={allEmployees.length || pagination.total}
            onOpenAddModal={handleOpenAddModal}
            onViewEmployee={handleOpenDetailModal}
            onEditEmployee={handleOpenEditModal}
            onNavigateToEmployees={() => setActiveTab('employees')}
            onFilterByDepartment={(dept) => {
              setSelectedDepartment(dept);
              setActiveTab('employees');
            }}
          />
        ) : (
          <EmployeesPage
            employees={employees}
            pagination={pagination}
            isLoading={isLoading}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            sortBy={sortBy}
            setSortBy={setSortBy}
            order={order}
            setOrder={setOrder}
            onResetFilters={handleResetFilters}
            onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
            onLimitChange={(newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))}
            onRefresh={() => {
              fetchEmployees();
              fetchAllForDashboard();
              checkHealth();
            }}
            onExportCSV={handleExportCSV}
            onOpenAddModal={handleOpenAddModal}
            onViewEmployee={handleOpenDetailModal}
            onEditEmployee={handleOpenEditModal}
            onDeleteEmployee={handleOpenDeleteModal}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Create / Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        employeeToEdit={employeeToEdit}
        isLoading={isSubmitting}
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEdit={(emp) => handleOpenEditModal(emp)}
        onDelete={(emp) => handleOpenDeleteModal(emp)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Record"
        message={
          <span>
            Are you sure you want to permanently delete the profile for{' '}
            <strong className="text-slate-900">{employeeToDelete?.name}</strong> (
            {employeeToDelete?.email})? This action cannot be undone.
          </span>
        }
        confirmText="Yes, Delete Record"
        cancelText="Keep Record"
        isDestructive={true}
        isLoading={isSubmitting}
      />

      {/* REST API Documentation Modal */}
      <ApiDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
