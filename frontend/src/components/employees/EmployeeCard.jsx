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
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${avatarBg}`}
          >
            {getInitials(employee.name)}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm leading-tight">
              {employee.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Briefcase className="w-3 h-3 text-slate-400" />
              {employee.designation}
            </div>
          </div>
        </div>

        <DepartmentBadge department={employee.department} />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/75 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Joined {formatDate(employee.createdAt)}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onView(employee)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(employee)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(employee)}
          className="p-2 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
