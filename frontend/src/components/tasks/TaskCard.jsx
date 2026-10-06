import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Calendar,
  User,
  Edit2,
  Trash2
} from 'lucide-react';
import { formatDate, getInitials, getAvatarBg } from '../../utils/formatters';

const PRIORITY_STYLES = {
  Low: 'bg-slate-100 text-slate-700 border-slate-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  Urgent: 'bg-rose-50 text-rose-700 border-rose-200'
};

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const assigned = task.assignedTo || {};
  const avatarBg = getAvatarBg(assigned.name || 'Unassigned');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
      {/* Top row: Priority & Quick Status Changer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium
          }`}
        >
          {task.priority === 'Urgent' && <AlertTriangle className="w-3 h-3" />}
          {task.priority} Priority
        </span>

        {/* Status Dropdown */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-colors ${
            STATUS_STYLES[task.status] || STATUS_STYLES.Pending
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Task Content */}
      <div>
        <h4 className="font-semibold text-slate-900 text-sm leading-snug">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
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
          <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-50">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Edit Task"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
