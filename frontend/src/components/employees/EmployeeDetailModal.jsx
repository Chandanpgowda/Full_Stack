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
      accentColor="from-cyan-500 via-violet-500 to-pink-500"
    >
      <div className="flex flex-col gap-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${avatarBg} shrink-0`}
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {getInitials(employee.name)}
          </div>
          <div className="min-w-0 flex-1 relative z-10">
            <h3
              className="text-xl font-bold text-white truncate tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {employee.name}
            </h3>
            <p className="text-sm font-medium text-slate-300 truncate flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-violet-400" />
              {employee.designation}
            </p>
            <div className="mt-2.5">
              <DepartmentBadge department={employee.department} />
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Email */}
          <div className="p-3.5 rounded-2xl glass border border-white/5 flex flex-col gap-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Email Address
            </span>
            <a
              href={`mailto:${employee.email}`}
              className="font-semibold text-white hover:text-cyan-400 transition-colors truncate"
            >
              {employee.email}
            </a>
          </div>

          {/* Department */}
          <div className="p-3.5 rounded-2xl glass border border-white/5 flex flex-col gap-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-pink-400" />
              Department
            </span>
            <span className="font-semibold text-white">{employee.department}</span>
          </div>

          {/* Created Date */}
          <div className="p-3.5 rounded-2xl glass border border-white/5 flex flex-col gap-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Record Created
            </span>
            <span className="font-semibold text-white">{formatDate(employee.createdAt)}</span>
          </div>

          {/* Last Updated */}
          <div className="p-3.5 rounded-2xl glass border border-white/5 flex flex-col gap-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Last Modified
            </span>
            <span className="font-semibold text-white">{formatDate(employee.updatedAt)}</span>
          </div>
        </div>

        {/* System Identifier */}
        <div className="p-3 rounded-2xl glass border border-white/5 text-xs flex items-center justify-between font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-violet-400" />
            MongoDB _id:
          </span>
          <span className="font-semibold text-violet-300">{employee._id}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
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
