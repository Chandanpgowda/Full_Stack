import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Spinner } from '../components/common/Spinner';

export const TasksPage = ({
  tasks = [],
  employees = [],
  isLoading = false,
  onRefresh,
  onOpenAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  // Calculate metrics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  // Filter tasks in-memory
  const filteredTasks = tasks.filter((task) => {
    // Search match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (task.title || '').toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchEmp = (task.assignedTo?.name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchEmp) return false;
    }

    // Status filter
    if (statusFilter !== 'All' && task.status !== statusFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }

    // Employee filter
    if (employeeFilter) {
      const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo?._id : task.assignedTo;
      if (assignedId !== employeeFilter) return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('');
    setEmployeeFilter('');
  };

  const isFiltered = searchTerm !== '' || statusFilter !== 'All' || priorityFilter !== '' || employeeFilter !== '';

  return (
    <div className="space-y-6 animate-modal">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight m-0">
            Workplace Task Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign deliverables, track progress, and manage project milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={onRefresh}
            isLoading={isLoading}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onOpenAddTask}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Task KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Tasks</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalTasks}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-700 font-semibold uppercase">Pending</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700 font-semibold uppercase">In Progress</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{inProgressTasks}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-700 font-semibold uppercase">Completed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedTasks}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
              {status === 'All' && ` (${totalTasks})`}
              {status === 'Pending' && ` (${pendingTasks})`}
              {status === 'In Progress' && ` (${inProgressTasks})`}
              {status === 'Completed' && ` (${completedTasks})`}
            </button>
          ))}
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title, description, or assignee..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          {/* Priority */}
          <div className="sm:col-span-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Employee */}
          <div className="sm:col-span-3">
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="">All Assignees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isFiltered && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">
              Showing <strong className="text-slate-900">{filteredTasks.length}</strong> matching tasks
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <Spinner size="lg" className="py-12" />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={isFiltered ? 'No matching tasks found' : 'No tasks created yet'}
          description={
            isFiltered
              ? 'Try clearing your search query or selecting a different status/priority filter.'
              : 'Keep your team productive by creating and assigning workplace deliverables.'
          }
          actionText={isFiltered ? 'Reset filters' : 'Create First Task'}
          onAction={isFiltered ? resetFilters : onOpenAddTask}
          isSearch={isFiltered}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
