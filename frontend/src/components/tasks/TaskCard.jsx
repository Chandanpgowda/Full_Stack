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
    badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400'
  },
  Medium: {
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dot: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
  },
  High: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
  },
  Urgent: {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
  }
};

export const STATUS_STYLES = {
  Pending: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    icon: Clock
  },
  'In Progress': {
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    bar: 'bg-gradient-to-r from-violet-500 to-indigo-500',
    icon: ArrowRight
  },
  Completed: {
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
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
      className={`glass-card border flex flex-col group overflow-hidden transition-all duration-300 ${
        overdue
          ? 'border-rose-500/30 hover:border-rose-500/50 shadow-rose-500/10'
          : 'border-white/10 hover:border-violet-500/30'
      }`}
    >
      {/* Color accent top bar */}
      <div className={`h-1 w-full ${statusStyle.bar}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top row: Priority & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${priorityStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
            {task.priority === 'Urgent' && <Flame className="w-3 h-3 text-rose-400 animate-pulse" />}
            {task.priority}
          </span>

          {overdue && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              Overdue
            </span>
          )}

          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors ${statusStyle.badge}`}
          >
            <option value="Pending" style={{ background: '#131326', color: '#fff' }}>Pending</option>
            <option value="In Progress" style={{ background: '#131326', color: '#fff' }}>In Progress</option>
            <option value="Completed" style={{ background: '#131326', color: '#fff' }}>Completed</option>
          </select>
        </div>

        {/* Task Title & Description */}
        <div className="flex-1">
          <h4
            className={`font-bold text-sm leading-snug cursor-pointer hover:text-violet-300 transition-colors ${
              task.status === 'Completed' ? 'line-through text-slate-500' : 'text-white'
            }`}
            style={{ fontFamily: 'Outfit, sans-serif' }}
            onClick={() => onView && onView(task)}
            title="Click to view task details"
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Assigned Employee & Due Date */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm ${avatarBg}`}
            >
              {getInitials(assigned.name || 'UA')}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-200 truncate text-[11px]">
                {assigned.name || 'Unassigned'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {assigned.department || 'Staff'}
              </p>
            </div>
          </div>

          {task.dueDate && (
            <div
              className={`flex items-center gap-1.5 text-[11px] shrink-0 font-medium ${
                overdue ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${overdue ? 'text-rose-400' : 'text-slate-500'}`} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-1 px-5 py-2.5 bg-white/5 border-t border-white/5">
        <button
          type="button"
          onClick={() => onView && onView(task)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
