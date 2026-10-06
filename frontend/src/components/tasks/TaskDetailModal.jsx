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
  <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-0.5 text-violet-400">
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="text-sm font-medium text-slate-200">{children}</div>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Task Detail"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative glass-dark rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-white/10 animate-modal z-10 my-auto">
        {/* Color accent bar */}
        <div className={`h-1.5 w-full ${statusStyle.bar} shrink-0`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/10 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${priorityStyle.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                {task.priority === 'Urgent' && <Flame className="w-3 h-3 text-rose-400" />}
                {task.priority} Priority
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${statusStyle.badge}`}>
                <StatusIcon className="w-3 h-3" />
                {task.status}
              </span>
              {overdue && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>
            <h3
              className="text-lg font-black text-white leading-snug mt-2"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {task.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 modal-scroll">
          {task.description && (
            <div className="mb-4 p-4 rounded-2xl glass border border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="divide-y divide-white/5">
            <DetailRow icon={User} label="Assigned To">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 shadow-md ${avatarBg}`}>
                  {getInitials(assigned.name || 'UA')}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{assigned.name || 'Unassigned'}</p>
                  {assigned.department && (
                    <p className="text-xs text-slate-400">{assigned.department} · {assigned.designation || ''}</p>
                  )}
                </div>
              </div>
            </DetailRow>

            <DetailRow icon={Calendar} label="Due Date">
              {task.dueDate ? (
                <span className={overdue ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                  {formatDate(task.dueDate)}
                  {overdue && ' (Overdue)'}
                </span>
              ) : (
                <span className="text-slate-500 font-normal">No due date set</span>
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
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-white/5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { onClose(); onDelete(task); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={() => { onClose(); onEdit(task); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white grad-purple-pink glow-purple transition-all cursor-pointer hover:opacity-90"
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
