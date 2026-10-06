import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  Flame,
  AlertTriangle,
  SlidersHorizontal
} from 'lucide-react';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Spinner } from '../components/common/Spinner';
import { formatDate, getInitials, getAvatarBg } from '../utils/formatters';
import { STATUS_STYLES, PRIORITY_STYLES } from '../components/tasks/TaskCard';

// ────────────────────────────────────────────────────────────
// Stat card
// ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, bgColor, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 w-full text-left transition-all duration-150 ${
      active
        ? `${bgColor} border-current shadow-sm scale-[1.02]`
        : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-sm'
    }`}
  >
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-widest ${active ? color : 'text-slate-500'}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold mt-0.5 ${active ? color : 'text-slate-900'}`}>{value}</p>
    </div>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/50' : bgColor}`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
  </button>
);

// ────────────────────────────────────────────────────────────
// List row view of a task
// ────────────────────────────────────────────────────────────
const TaskListRow = ({ task, onEdit, onDelete, onStatusChange, onView }) => {
  const overdue = task.status !== 'Completed' && task.dueDate && new Date(task.dueDate) < new Date();
  const statusStyle = STATUS_STYLES[task.status] || STATUS_STYLES.Pending;
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const assigned = task.assignedTo || {};
  const avatarBg = getAvatarBg(assigned.name || 'UA');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-sm transition-all flex items-center gap-4 px-4 py-3">
      {/* Status bar */}
      <div className={`w-1 h-10 rounded-full shrink-0 ${statusStyle.bar}`} />

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-sm truncate cursor-pointer hover:text-indigo-600 transition-colors ${
            task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'
          }`}
          onClick={() => onView && onView(task)}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{task.description}</p>
        )}
      </div>

      {/* Assignee */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[9px] ${avatarBg}`}>
          {getInitials(assigned.name || 'UA')}
        </div>
        <span className="text-xs text-slate-600 max-w-[80px] truncate">{assigned.name || '—'}</span>
      </div>

      {/* Priority badge */}
      <span className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${priorityStyle.badge}`}>
        {task.priority}
      </span>

      {/* Due date */}
      <span className={`hidden lg:block text-[11px] font-medium shrink-0 ${overdue ? 'text-rose-600' : 'text-slate-500'}`}>
        {task.dueDate ? formatDate(task.dueDate) : '—'}
        {overdue && ' ⚠'}
      </span>

      {/* Status select */}
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className={`px-2 py-1 rounded-lg text-[10px] font-semibold border cursor-pointer focus:outline-none shrink-0 ${statusStyle.badge}`}
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button onClick={() => onView && onView(task)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="View">
          <CheckSquare className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit">
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Main TasksPage
// ────────────────────────────────────────────────────────────
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
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Task detail modal
  const [viewTask, setViewTask] = useState(null);

  // ── Computed metrics ──────────────────────────────────────
  const metrics = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const overdue = tasks.filter(
      (t) => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, pending, inProgress, completed, overdue, completionRate };
  }, [tasks]);

  // ── Filtered + sorted tasks ───────────────────────────────
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q) ||
          (t.assignedTo?.name || '').toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter === 'Overdue') {
      result = result.filter(
        (t) => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < new Date()
      );
    } else if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Employee filter
    if (employeeFilter) {
      result = result.filter((t) => {
        const id = typeof t.assignedTo === 'object' ? t.assignedTo?._id : t.assignedTo;
        return id === employeeFilter;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const ORDER = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
        return (ORDER[a.priority] ?? 4) - (ORDER[b.priority] ?? 4);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      // Default: createdAt desc
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [tasks, searchTerm, statusFilter, priorityFilter, employeeFilter, sortBy]);

  const isFiltered =
    searchTerm !== '' ||
    statusFilter !== 'All' ||
    priorityFilter !== '' ||
    employeeFilter !== '';

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('');
    setEmployeeFilter('');
    setSortBy('createdAt');
  };

  const STATUS_TABS = [
    { label: 'All', count: metrics.total, color: 'text-slate-600' },
    { label: 'Pending', count: metrics.pending, color: 'text-amber-600' },
    { label: 'In Progress', count: metrics.inProgress, color: 'text-indigo-600' },
    { label: 'Completed', count: metrics.completed, color: 'text-emerald-600' },
    ...(metrics.overdue > 0
      ? [{ label: 'Overdue', count: metrics.overdue, color: 'text-rose-600' }]
      : [])
  ];

  return (
    <div className="space-y-6 animate-modal">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight m-0">
            Task Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, assign and track all workplace tasks and deliverables in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Button variant="primary" size="sm" icon={Plus} onClick={onOpenAddTask}>
            Add Task
          </Button>
        </div>
      </div>

      {/* ── KPI Statistics ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Total Tasks"
          value={metrics.total}
          icon={CheckSquare}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          onClick={() => setStatusFilter('All')}
          active={statusFilter === 'All'}
        />
        <StatCard
          label="Pending"
          value={metrics.pending}
          icon={Clock}
          color="text-amber-600"
          bgColor="bg-amber-50"
          onClick={() => setStatusFilter('Pending')}
          active={statusFilter === 'Pending'}
        />
        <StatCard
          label="In Progress"
          value={metrics.inProgress}
          icon={ArrowRight}
          color="text-blue-600"
          bgColor="bg-blue-50"
          onClick={() => setStatusFilter('In Progress')}
          active={statusFilter === 'In Progress'}
        />
        <StatCard
          label="Completed"
          value={metrics.completed}
          icon={CheckCircle2}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          onClick={() => setStatusFilter('Completed')}
          active={statusFilter === 'Completed'}
        />
        <StatCard
          label="Overdue"
          value={metrics.overdue}
          icon={AlertTriangle}
          color="text-rose-600"
          bgColor="bg-rose-50"
          onClick={() => setStatusFilter('Overdue')}
          active={statusFilter === 'Overdue'}
        />
      </div>

      {/* ── Progress Bar ─────────────────────────────────────── */}
      {metrics.total > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600">Overall Completion</span>
              <span className="text-xs font-bold text-emerald-600">{metrics.completionRate}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${metrics.completionRate}%` }}
              />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 shrink-0">
            <span><strong className="text-emerald-600">{metrics.completed}</strong> done</span>
            <span><strong className="text-amber-600">{metrics.pending}</strong> pending</span>
            {metrics.overdue > 0 && (
              <span><strong className="text-rose-600">{metrics.overdue}</strong> overdue</span>
            )}
          </div>
        </div>
      )}

      {/* ── Filters Panel ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Status tabs */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 pt-3 pb-0 border-b border-slate-100">
          {STATUS_TABS.map(({ label, count, color }) => (
            <button
              key={label}
              type="button"
              onClick={() => setStatusFilter(label)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                statusFilter === label
                  ? `border-indigo-600 ${color} bg-indigo-50/50`
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  statusFilter === label ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* Search + Filter toggle + View toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks by title, description, or assignee..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors shrink-0 ${
                showFilters || priorityFilter || employeeFilter
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-600'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:block">Filters</span>
              {(priorityFilter || employeeFilter) && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>

            {/* View mode toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 animate-slide-down">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                >
                  <option value="">All Priorities</option>
                  <option value="Low">🔵 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🟠 High</option>
                  <option value="Urgent">🔴 Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Assignee</label>
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

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority (High → Low)</option>
                  <option value="title">Title (A → Z)</option>
                </select>
              </div>
            </div>
          )}

          {/* Active filter indicator */}
          {isFiltered && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">
                Showing{' '}
                <strong className="text-slate-900">{filteredTasks.length}</strong> of{' '}
                <strong className="text-slate-900">{metrics.total}</strong> tasks
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Task Content ─────────────────────────────────────── */}
      {isLoading ? (
        <Spinner size="lg" className="py-16" />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={isFiltered ? 'No matching tasks found' : 'No tasks yet'}
          description={
            isFiltered
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating and assigning your first task.'
          }
          actionText={isFiltered ? 'Reset filters' : 'Create First Task'}
          onAction={isFiltered ? resetFilters : onOpenAddTask}
          isSearch={isFiltered}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onUpdateStatus}
              onView={setViewTask}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* List header */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_80px_90px_100px_80px] gap-4 px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-200">
            <span>Task</span>
            <span>Assignee</span>
            <span>Priority</span>
            <span>Due Date</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          {filteredTasks.map((task) => (
            <TaskListRow
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onUpdateStatus}
              onView={setViewTask}
            />
          ))}
        </div>
      )}

      {/* ── Task Detail Modal ────────────────────────────────── */}
      <TaskDetailModal
        task={viewTask}
        isOpen={Boolean(viewTask)}
        onClose={() => setViewTask(null)}
        onEdit={(t) => { setViewTask(null); onEditTask(t); }}
        onDelete={(t) => { setViewTask(null); onDeleteTask(t); }}
      />
    </div>
  );
};
