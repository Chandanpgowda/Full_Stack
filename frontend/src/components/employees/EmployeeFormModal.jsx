import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, Briefcase } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { DEPARTMENTS } from '../../utils/constants';
import { validateEmployeeForm } from '../../utils/validators';

const INITIAL_FORM = {
  name: '',
  email: '',
  department: '',
  designation: ''
};

export const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  employeeToEdit = null,
  isLoading = false
}) => {
  const isEditing = Boolean(employeeToEdit);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Sync form data when editing or opening modal
  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        department: employeeToEdit.department || '',
        designation: employeeToEdit.designation || ''
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
    setServerError('');
  }, [employeeToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Perform client-side validation
    const validation = validateEmployeeForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      // Check if duplicate email conflict (409)
      if (err.statusCode === 409 || err.message?.toLowerCase().includes('already exists') || err.message?.toLowerCase().includes('in use')) {
        setErrors((prev) => ({
          ...prev,
          email: err.message || 'An employee with this email address already exists'
        }));
      } else {
        setServerError(err.message || 'Failed to save employee profile. Please try again.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Employee Profile' : 'Add New Employee'}
      description={
        isEditing
          ? 'Update information and designation for this employee.'
          : 'Enter employee details to create a new profile in the database.'
      }
      maxWidth="max-w-lg"
      showClose={!isLoading}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Global Server Error Banner */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-slide-down">
            {serverError}
          </div>
        )}

        {/* Name Field */}
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Alexandra Rivers"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={User}
          required
          autoFocus
          disabled={isLoading}
        />

        {/* Email Field */}
        <Input
          label="Corporate Email"
          name="email"
          type="email"
          placeholder="e.g. alexandra.rivers@company.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          required
          disabled={isLoading}
        />

        {/* Department Field */}
        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          error={errors.department}
          options={DEPARTMENTS}
          placeholder="Select departmental unit"
          required
          disabled={isLoading}
        />

        {/* Designation Field */}
        <Input
          label="Designation / Job Title"
          name="designation"
          placeholder="e.g. Senior Software Architect"
          value={formData.designation}
          onChange={handleChange}
          error={errors.designation}
          icon={Briefcase}
          required
          disabled={isLoading}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
