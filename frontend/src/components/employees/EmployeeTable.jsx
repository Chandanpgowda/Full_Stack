import React from 'react';
import { Eye, Edit2, Trash2, Mail, Briefcase } from 'lucide-react';
import { DepartmentBadge } from '../common/Badge';
import { formatDate, getInitials, getAvatarBg } from '../../utils/formatters';

export const EmployeeTable = ({
  employees = [],
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th scope="col" className="py-3.5 pl-6 pr-3">Employee</th>
            <th scope="col" className="py-3.5 px-3">Email Address</th>
            <th scope="col" className="py-3.5 px-3">Department</th>
            <th scope="col" className="py-3.5 px-3">Designation</th>
            <th scope="col" className="py-3.5 px-3">Joined Date</th>
            <th scope="col" className="py-3.5 pl-3 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {employees.map((employee) => {
            const avatarBg = getAvatarBg(employee.name);

            return (
              <tr
                key={employee._id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Name & Avatar */}
                <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${avatarBg}`}
                    >
                      {getInitials(employee.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {employee.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        ID: {employee._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${employee.email}`}
                      className="hover:text-indigo-600 hover:underline text-xs"
                    >
                      {employee.email}
                    </a>
                  </div>
                </td>

                {/* Department */}
                <td className="py-4 px-3 whitespace-nowrap">
                  <DepartmentBadge department={employee.department} />
                </td>

                {/* Designation */}
                <td className="py-4 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {employee.designation}
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-3 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(employee.createdAt)}
                </td>

                {/* Action Buttons */}
                <td className="py-4 pl-3 pr-6 whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(employee)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(employee)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Edit Employee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(employee)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
