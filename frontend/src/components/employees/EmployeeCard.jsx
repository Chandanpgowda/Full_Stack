import React from 'react';
import { Eye, Edit2, Trash2, Mail, Briefcase, Calendar } from 'lucide-react';
import { DepartmentBadge } from '../common/Badge';
import { formatDate, getInitials, getAvatarBg } from '../../utils/formatters';

export const EmployeeCard = ({
  employee,
  onView,
  onEdit,
  onDelete
}) => {
  const avatarBg = getAvatarBg(employee.name);

  return (
    <div className="glass-card p-5 border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between gap-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${avatarBg} group-hover:scale-105 transition-transform`}
          >
            {getInitials(employee.name)}
          </div>
          <div>
            <h4
              className="font-bold text-white text-sm leading-tight group-hover:text-violet-300 transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {employee.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <Briefcase className="w-3 h-3 text-slate-500" />
              {employee.designation}
            </div>
          </div>
        </div>

        <DepartmentBadge department={employee.department} />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate text-slate-300">{employee.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Joined {formatDate(employee.createdAt)}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={() => onView(employee)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(employee)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-violet-300 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(employee)}
          className="p-2 rounded-xl text-rose-400 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-all"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
