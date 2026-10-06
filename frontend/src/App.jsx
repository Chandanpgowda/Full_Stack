import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { TasksPage } from './pages/TasksPage';
import { AuthPage } from './pages/AuthPage';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { EmployeeDetailModal } from './components/employees/EmployeeDetailModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { ApiDocsModal } from './components/common/ApiDocsModal';
import { ToastProvider, useToast } from './context/ToastContext';
import { employeeService } from './services/employeeService';
import { taskService } from './services/taskService';
import { useDebounce } from './hooks/useDebounce';
import { exportEmployeesToCSV } from './utils/exportToCsv';
import Dock from './components/effects/Dock';
import GradientWaves from './components/effects/GradientWaves';
import {
  LayoutDashboard,
  Users2,
  CheckSquare,
  UserPlus,
  Plus,
  Code2,
  LogOut
} from 'lucide-react';

const MainApp = ({ authUser, onSignOut }) => {
  const { showToast } = useToast();

  // Navigation state: 'dashboard' | 'employees' | 'tasks'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Employee state
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Task state
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  // Filter & Search states for Employees
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

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isTaskDeleteDialogOpen, setIsTaskDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  // Fetch employees list
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

  // Fetch all employees for Dashboard & Assignee dropdowns
  const fetchAllForDashboard = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees({ limit: 0, sortBy: 'createdAt', order: 'desc' });
      if (response.success) {
        setAllEmployees(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load employee directory:', err);
    }
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsTasksLoading(true);
    try {
      const response = await taskService.getTasks({ limit: 0, sortBy: 'createdAt', order: 'desc' });
      if (response.success) {
        setTasks(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsTasksLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchAllForDashboard();
    fetchTasks();
  }, [checkHealth, fetchAllForDashboard, fetchTasks]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, selectedDepartment]);

  // Handlers for Employee Modals
  const handleOpenAddModal = () => {
    setEmployeeToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEmployeeToEdit(employee);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (employeeToEdit) {
        const response = await employeeService.updateEmployee(employeeToEdit._id, formData);
        showToast(response.message || `Updated details for ${formData.name}`, 'success');
      } else {
        const response = await employeeService.createEmployee(formData);
        showToast(response.message || `Successfully created profile for ${formData.name}`, 'success');
      }

      await Promise.all([fetchEmployees(), fetchAllForDashboard()]);
      setIsFormModalOpen(false);
      setEmployeeToEdit(null);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await employeeService.deleteEmployee(employeeToDelete._id);
      showToast(response.message || `Deleted employee ${employeeToDelete.name}`, 'success');
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);

      await Promise.all([fetchEmployees(), fetchAllForDashboard(), fetchTasks()]);
    } catch (err) {
      showToast(err.message || 'Failed to delete employee profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for Task Modals
  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsTaskDeleteDialogOpen(true);
  };

  const handleTaskFormSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (taskToEdit) {
        const response = await taskService.updateTask(taskToEdit._id, taskData);
        showToast(response.message || 'Task updated successfully', 'success');
      } else {
        const response = await taskService.createTask(taskData);
        showToast(response.message || 'Task assigned successfully', 'success');
      }

      await fetchTasks();
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      showToast(`Task status updated to ${newStatus}`, 'info');
      await fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await taskService.deleteTask(taskToDelete._id);
      showToast(response.message || 'Task deleted successfully', 'success');
      setIsTaskDeleteDialogOpen(false);
      setTaskToDelete(null);
      await fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSortBy('createdAt');
    setOrder('desc');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleExportCSV = () => {
    try {
      exportEmployeesToCSV(employees, `employees_export_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${employees.length} records to CSV successfully!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to export CSV', 'error');
    }
  };

  // Dock navigation items (used for the floating bottom dock)
  const dockItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      onClick: () => setActiveTab('dashboard'),
      className: activeTab === 'dashboard' ? 'dock-item-active' : ''
    },
    {
      icon: <Users2 size={20} />,
      label: 'Directory',
      onClick: () => setActiveTab('employees'),
      className: activeTab === 'employees' ? 'dock-item-active' : ''
    },
    {
      icon: <CheckSquare size={20} />,
      label: 'Tasks',
      onClick: () => setActiveTab('tasks'),
      className: activeTab === 'tasks' ? 'dock-item-active' : ''
    },
    {
      icon: <UserPlus size={20} />,
      label: 'Add Employee',
      onClick: handleOpenAddModal
    },
    {
      icon: <Plus size={20} />,
      label: 'Add Task',
      onClick: handleOpenAddTask
    },
    {
      icon: <Code2 size={20} />,
      label: 'API Docs',
      onClick: () => setIsDocsOpen(true)
    },
    {
      icon: <LogOut size={20} />,
      label: 'Sign Out',
      onClick: onSignOut
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a1a] text-slate-100 selection:bg-violet-600 selection:text-white relative overflow-x-hidden">
      {/* ── WebGL Wave Background ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', opacity: 0.18
      }}>
        <GradientWaves
          horizonColor="#3b0764"
          waveColor="#7c3aed"
          crestColor="#c084fc"
          speed={0.25}
          amplitude={2.0}
          waveScale={0.5}
          waveRatio={0.85}
          swell={25}
          turbulence={15}
          tilt={1.18}
          zoom={1.0}
          height={5.0}
          fogDepth={12}
          detail="medium"
          brightness={1.2}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.3}
          grain={true}
          grainIntensity={0.04}
        />
      </div>


      {/* Ambient orbs (still layered on top of waves) */}
      <div className="bg-orb w-96 h-96 bg-violet-600/10 -top-20 -left-20 animate-float" style={{ zIndex: 1 }} />
      <div className="bg-orb w-[30rem] h-[30rem] bg-pink-600/8 top-1/3 -right-32 animate-float" style={{ animationDelay: '2s', zIndex: 1 }} />
      <div className="bg-orb w-80 h-80 bg-cyan-600/8 bottom-10 left-1/4 animate-float" style={{ animationDelay: '4s', zIndex: 1 }} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenAddTaskModal={handleOpenAddTask}
        onOpenDocs={() => setIsDocsOpen(true)}
        serverStatus={serverStatus}
        totalCount={allEmployees.length || pagination.total}
        taskCount={tasks.length}
        authUser={authUser}
        onSignOut={onSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-36 relative z-10">
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
        ) : activeTab === 'employees' ? (
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
        ) : (
          <TasksPage
            tasks={tasks}
            employees={allEmployees}
            isLoading={isTasksLoading}
            onRefresh={fetchTasks}
            onOpenAddTask={handleOpenAddTask}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleOpenDeleteTask}
            onUpdateStatus={handleTaskStatusChange}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* ── Floating Dock ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 998, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'center' }}>
          <Dock
            items={dockItems}
            panelHeight={62}
            baseItemSize={46}
            magnification={66}
            distance={180}
            dockHeight={240}
          />
        </div>
      </div>

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

      {/* Create / Edit Task Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleTaskFormSubmit}
        employees={allEmployees}
        taskToEdit={taskToEdit}
        isLoading={isSubmitting}
      />

      {/* Delete Employee Confirmation Dialog */}
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
            <strong className="text-white">{employeeToDelete?.name}</strong> (
            {employeeToDelete?.email})? This action cannot be undone.
          </span>
        }
        confirmText="Yes, Delete Record"
        cancelText="Keep Record"
        isDestructive={true}
        isLoading={isSubmitting}
      />

      {/* Delete Task Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isTaskDeleteDialogOpen}
        onClose={() => {
          setIsTaskDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task"
        message={
          <span>
            Are you sure you want to delete the task{' '}
            <strong className="text-white">"{taskToDelete?.title}"</strong>?
          </span>
        }
        confirmText="Yes, Delete Task"
        cancelText="Cancel"
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
  // ── Auth gate ──────────────────────────────────────────────
  const [authUser, setAuthUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ems_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleAuthenticated = (user) => setAuthUser(user);

  const handleSignOut = () => {
    localStorage.removeItem('ems_user');
    setAuthUser(null);
  };

  if (!authUser) {
    return (
      <ToastProvider>
        <AuthPage onAuthenticated={handleAuthenticated} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <MainApp authUser={authUser} onSignOut={handleSignOut} />
    </ToastProvider>
  );
}
