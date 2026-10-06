import React from 'react';
import {
  Mail,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Fingerprint,
  Edit2,
  Trash2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DepartmentBadge } from '../common/Badge';
import { formatDate, getInitials, getAvatarBg } from '../../utils/formatters';

export const EmployeeDetailModal = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete
}) => {
  if (!employee) return null;

  const avatarBg = getAvatarBg(employee.name);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Profile Details"
      description="Comprehensive employment and system record information."
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200/80">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md ${avatarBg} shrink-0`}
          >
            {getInitials(employee.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 truncate tracking-tight">
              {employee.name}
            </h3>
            <p className="text-sm font-medium text-slate-600 truncate flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              {employee.designation}
            </p>
            <div className="mt-2">
              <DepartmentBadge department={employee.department} />
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Email */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </span>
            <a
              href={`mailto:${employee.email}`}
              className="font-semibold text-slate-800 hover:text-indigo-600 hover:underline truncate"
            >
              {employee.email}
            </a>
          </div>

          {/* Department */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Department
            </span>
            <span className="font-semibold text-slate-800">{employee.department}</span>
          </div>

          {/* Created Date */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Record Created
            </span>
            <span className="font-semibold text-slate-800">{formatDate(employee.createdAt)}</span>
          </div>

          {/* Last Updated */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Last Modified
            </span>
            <span className="font-semibold text-slate-800">{formatDate(employee.updatedAt)}</span>
          </div>
        </div>

        {/* System Identifier */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
            Database ID:
          </span>
          <span className="font-semibold text-slate-700">{employee._id}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              onClose();
              onDelete(employee);
            }}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Edit2}
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
