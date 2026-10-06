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
  SlidersHorizontal,
  Eye,
  Edit2,
  Trash2
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
const StatCard = ({ label, value, icon: Icon, color, glow, border, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 w-full text-left transition-all duration-200 cursor-pointer ${
      active
        ? `glass-card border-violet-500 shadow-lg ${glow} scale-[1.02]`
        : 'glass hover:border-white/20 hover:scale-[1.01]'
    } ${border}`}
  >
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${active ? color : 'text-slate-400'}`}>
        {label}
      </p>
      <p
        className={`text-2xl font-black mt-1 ${active ? 'text-white' : 'text-slate-100'}`}
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {value}
      </p>
    </div>
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-white/10' : 'bg-white/5'}`}>
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
    <div className="glass-card border border-white/10 hover:border-violet-500/30 transition-all flex items-center gap-4 px-4 py-3 group">
      {/* Status bar */}
      <div className={`w-1 h-10 rounded-full shrink-0 ${statusStyle.bar}`} />

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-bold text-sm truncate cursor-pointer hover:text-violet-300 transition-colors ${
            task.status === 'Completed' ? 'line-through text-slate-500' : 'text-white'
          }`}
          style={{ fontFamily: 'Outfit, sans-serif' }}
          onClick={() => onView && onView(task)}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
        )}
      </div>

      {/* Assignee */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[9px] ${avatarBg}`}>
          {getInitials(assigned.name || 'UA')}
        </div>
        <span className="text-xs text-slate-300 max-w-[80px] truncate">{assigned.name || '—'}</span>
      </div>

      {/* Priority badge */}
      <span className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${priorityStyle.badge}`}>
        {task.priority}
      </span>

      {/* Due date */}
      <span className={`hidden lg:block text-[11px] font-medium shrink-0 ${overdue ? 'text-rose-400' : 'text-slate-400'}`}>
        {task.dueDate ? formatDate(task.dueDate) : '—'}
        {overdue && ' ⚠'}
      </span>

      {/* Status select */}
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className={`px-2 py-1 rounded-xl text-[10px] font-semibold border cursor-pointer focus:outline-none shrink-0 ${statusStyle.badge}`}
      >
        <option value="Pending" style={{ background: '#131326', color: '#fff' }}>Pending</option>
        <option value="In Progress" style={{ background: '#131326', color: '#fff' }}>In Progress</option>
        <option value="Completed" style={{ background: '#131326', color: '#fff' }}>Completed</option>
      </select>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onView && onView(task)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          title="View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
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
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [viewTask, setViewTask] = useState(null);

  // Computed metrics
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

  // Filtered + sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q) ||
          (t.assignedTo?.name || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'Overdue') {
      result = result.filter(
        (t) => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < new Date()
      );
    } else if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (employeeFilter) {
      result = result.filter((t) => {
        const id = typeof t.assignedTo === 'object' ? t.assignedTo?._id : t.assignedTo;
        return id === employeeFilter;
      });
    }

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
    { label: 'All', count: metrics.total, color: 'text-violet-300' },
    { label: 'Pending', count: metrics.pending, color: 'text-amber-400' },
    { label: 'In Progress', count: metrics.inProgress, color: 'text-cyan-400' },
    { label: 'Completed', count: metrics.completed, color: 'text-emerald-400' },
    ...(metrics.overdue > 0
      ? [{ label: 'Overdue', count: metrics.overdue, color: 'text-rose-400' }]
      : [])
  ];

  return (
    <div className="space-y-6 animate-modal">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Task Management
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, assign and track workplace deliverables in real-time with automatic overdue tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            icon={RefreshCw}
            title="Refresh"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onOpenAddTask}
            className="shadow-lg shadow-violet-500/20"
          >
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
          color="text-violet-400"
          glow="glow-purple"
          border="border-violet-500/20"
          onClick={() => setStatusFilter('All')}
          active={statusFilter === 'All'}
        />
        <StatCard
          label="Pending"
          value={metrics.pending}
          icon={Clock}
          color="text-amber-400"
          glow="glow-emerald"
          border="border-amber-500/20"
          onClick={() => setStatusFilter('Pending')}
          active={statusFilter === 'Pending'}
        />
        <StatCard
          label="In Progress"
          value={metrics.inProgress}
          icon={ArrowRight}
          color="text-cyan-400"
          glow="glow-cyan"
          border="border-cyan-500/20"
          onClick={() => setStatusFilter('In Progress')}
          active={statusFilter === 'In Progress'}
        />
        <StatCard
          label="Completed"
          value={metrics.completed}
          icon={CheckCircle2}
          color="text-emerald-400"
          glow="glow-emerald"
          border="border-emerald-500/20"
          onClick={() => setStatusFilter('Completed')}
          active={statusFilter === 'Completed'}
        />
        <StatCard
          label="Overdue"
          value={metrics.overdue}
          icon={AlertTriangle}
          color="text-rose-400"
          glow="glow-pink"
          border="border-rose-500/20"
          onClick={() => setStatusFilter('Overdue')}
          active={statusFilter === 'Overdue'}
        />
      </div>

      {/* ── Progress Bar ─────────────────────────────────────── */}
      {metrics.total > 0 && (
        <div className="glass-card p-4 border border-white/10 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">Completion Progress</span>
              <span className="text-xs font-black text-emerald-400">{metrics.completionRate}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${metrics.completionRate}%` }}
              />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 shrink-0">
            <span><strong className="text-emerald-400">{metrics.completed}</strong> done</span>
            <span><strong className="text-amber-400">{metrics.pending}</strong> pending</span>
            {metrics.overdue > 0 && (
              <span><strong className="text-rose-400">{metrics.overdue}</strong> overdue</span>
            )}
          </div>
        </div>
      )}

      {/* ── Filters Panel ───────────────────────────────────── */}
      <div className="glass-card border border-white/10 shadow-2xl">
        {/* Status tabs */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 pt-3 pb-0 border-b border-white/10">
          {STATUS_TABS.map(({ label, count, color }) => (
            <button
              key={label}
              type="button"
              onClick={() => setStatusFilter(label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px cursor-pointer ${
                statusFilter === label
                  ? `border-violet-500 text-white bg-violet-500/15`
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  statusFilter === label ? 'bg-violet-500 text-white' : 'bg-white/10 text-slate-400'
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
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                showFilters || priorityFilter || employeeFilter
                  ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                  : 'border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:block">Filters</span>
              {(priorityFilter || employeeFilter) && (
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              )}
            </button>

            {/* View mode toggle */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 animate-slide-down">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="" style={{ background: '#131326', color: '#fff' }}>All Priorities</option>
                  <option value="Low" style={{ background: '#131326', color: '#fff' }}>🔵 Low</option>
                  <option value="Medium" style={{ background: '#131326', color: '#fff' }}>🟡 Medium</option>
                  <option value="High" style={{ background: '#131326', color: '#fff' }}>🟠 High</option>
                  <option value="Urgent" style={{ background: '#131326', color: '#fff' }}>🔴 Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Assignee</label>
                <select
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="" style={{ background: '#131326', color: '#fff' }}>All Assignees</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id} style={{ background: '#131326', color: '#fff' }}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="createdAt" style={{ background: '#131326', color: '#fff' }}>Newest First</option>
                  <option value="dueDate" style={{ background: '#131326', color: '#fff' }}>Due Date</option>
                  <option value="priority" style={{ background: '#131326', color: '#fff' }}>Priority (High → Low)</option>
                  <option value="title" style={{ background: '#131326', color: '#fff' }}>Title (A → Z)</option>
                </select>
              </div>
            </div>
          )}

          {/* Active filter indicator */}
          {isFiltered && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className="text-slate-400">
                Showing{' '}
                <strong className="text-white font-bold">{filteredTasks.length}</strong> of{' '}
                <strong className="text-white font-bold">{metrics.total}</strong> tasks
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
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
        <div className="flex flex-col gap-2.5">
          {/* List header */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_80px_90px_100px_80px] gap-4 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10">
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
