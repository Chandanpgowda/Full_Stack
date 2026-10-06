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
    <div className="w-full overflow-x-auto glass-card border border-white/10 shadow-2xl relative">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th scope="col" className="py-4 pl-6 pr-3">Employee</th>
            <th scope="col" className="py-4 px-3">Email Address</th>
            <th scope="col" className="py-4 px-3">Department</th>
            <th scope="col" className="py-4 px-3">Designation</th>
            <th scope="col" className="py-4 px-3">Joined Date</th>
            <th scope="col" className="py-4 pl-3 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
          {employees.map((employee) => {
            const avatarBg = getAvatarBg(employee.name);

            return (
              <tr
                key={employee._id}
                className="hover:bg-white/5 transition-all duration-150 group"
              >
                {/* Name & Avatar */}
                <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${avatarBg} group-hover:scale-105 transition-transform`}
                    >
                      {getInitials(employee.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {employee.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        #{employee._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <a
                      href={`mailto:${employee.email}`}
                      className="hover:text-cyan-400 transition-colors text-xs"
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
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium text-xs">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {employee.designation}
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-3 whitespace-nowrap text-xs text-slate-400">
                  {formatDate(employee.createdAt)}
                </td>

                {/* Action Buttons */}
                <td className="py-4 pl-3 pr-6 whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(employee)}
                      className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(employee)}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
                      title="Edit Employee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(employee)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
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
