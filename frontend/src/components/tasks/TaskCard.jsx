import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  Flame,
  ArrowRight
} from 'lucide-react';
import { formatDate, getInitials, getAvatarBg } from '../../utils/formatters';

export const PRIORITY_STYLES = {
  Low: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400'
  },
  Medium: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500'
  },
  High: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  Urgent: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500'
  }
};

export const STATUS_STYLES = {
  Pending: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-400',
    icon: Clock
  },
  'In Progress': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    bar: 'bg-indigo-500',
    icon: ArrowRight
  },
  Completed: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
    icon: CheckCircle2
  }
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;
  return new Date(dueDate) < new Date();
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onView }) => {
  const assigned = task.assignedTo || {};
  const avatarBg = getAvatarBg(assigned.name || 'Unassigned');
  const overdue = isOverdue(task.dueDate, task.status);
  const statusStyle = STATUS_STYLES[task.status] || STATUS_STYLES.Pending;
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const StatusIcon = statusStyle.icon;

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group overflow-hidden ${
        overdue ? 'border-rose-200 hover:border-rose-300' : 'border-slate-200/80 hover:border-indigo-200'
      }`}
    >
      {/* Color accent top bar */}
      <div className={`h-1 w-full ${statusStyle.bar}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top row: Priority & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${priorityStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
            {task.priority === 'Urgent' && <Flame className="w-3 h-3" />}
            {task.priority}
          </span>

          {overdue && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
              <AlertTriangle className="w-2.5 h-2.5" />
              Overdue
            </span>
          )}

          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors ${statusStyle.badge}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Task Title & Description */}
        <div className="flex-1">
          <h4
            className={`font-semibold text-sm leading-snug cursor-pointer hover:text-indigo-600 transition-colors ${
              task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
            onClick={() => onView && onView(task)}
            title="Click to view task details"
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Assigned Employee & Due Date */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${avatarBg}`}
            >
              {getInitials(assigned.name || 'UA')}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate text-[11px]">
                {assigned.name || 'Unassigned'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {assigned.department || 'Staff'}
              </p>
            </div>
          </div>

          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-[11px] shrink-0 font-medium ${
                overdue ? 'text-rose-600' : 'text-slate-500'
              }`}
            >
              <Calendar className={`w-3 h-3 ${overdue ? 'text-rose-500' : 'text-slate-400'}`} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-1 px-5 py-2.5 bg-slate-50/70 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onView && onView(task)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          title="View Details"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
