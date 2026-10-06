import React from 'react';
import {
  X,
  CheckSquare,
  User,
  Calendar,
  Flag,
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  AlertTriangle,
  Edit2,
  Trash2,
  Tag
} from 'lucide-react';
import { formatDate, getInitials, getAvatarBg } from '../../utils/formatters';
import { PRIORITY_STYLES, STATUS_STYLES } from './TaskCard';

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;
  return new Date(dueDate) < new Date();
};

const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="text-sm font-medium text-slate-800">{children}</div>
    </div>
  </div>
);

export const TaskDetailModal = ({ task, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !task) return null;

  const assigned = task.assignedTo || {};
  const avatarBg = getAvatarBg(assigned.name || 'Unassigned');
  const overdue = isOverdue(task.dueDate, task.status);
  const statusStyle = STATUS_STYLES[task.status] || STATUS_STYLES.Pending;
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const StatusIcon = statusStyle.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Task Detail"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-modal">
        {/* Color accent bar */}
        <div className={`h-1.5 w-full ${statusStyle.bar} shrink-0`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${priorityStyle.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                {task.priority === 'Urgent' && <Flame className="w-3 h-3" />}
                {task.priority} Priority
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle.badge}`}>
                <StatusIcon className="w-3 h-3" />
                {task.status}
              </span>
              {overdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  Overdue
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug mt-2">
              {task.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {task.description && (
            <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            <DetailRow icon={User} label="Assigned To">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${avatarBg}`}>
                  {getInitials(assigned.name || 'UA')}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{assigned.name || 'Unassigned'}</p>
                  {assigned.department && (
                    <p className="text-xs text-slate-500">{assigned.department} · {assigned.designation || ''}</p>
                  )}
                </div>
              </div>
            </DetailRow>

            <DetailRow icon={Calendar} label="Due Date">
              {task.dueDate ? (
                <span className={overdue ? 'text-rose-600' : 'text-slate-800'}>
                  {formatDate(task.dueDate)}
                  {overdue && ' (Overdue)'}
                </span>
              ) : (
                <span className="text-slate-400 font-normal">No due date set</span>
              )}
            </DetailRow>

            <DetailRow icon={Clock} label="Created">
              {formatDate(task.createdAt)}
            </DetailRow>

            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <DetailRow icon={Tag} label="Last Updated">
                {formatDate(task.updatedAt)}
              </DetailRow>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { onClose(); onDelete(task); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={() => { onClose(); onEdit(task); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
