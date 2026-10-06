import React, { useState, useEffect } from 'react';
import { CheckSquare, User, AlertCircle, Calendar, Flag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

const INITIAL_FORM = {
  title: '',
  description: '',
  assignedTo: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: ''
};

export const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  employees = [],
  taskToEdit = null,
  isLoading = false
}) => {
  const isEditing = Boolean(taskToEdit);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        assignedTo: typeof taskToEdit.assignedTo === 'object' ? taskToEdit.assignedTo?._id : (taskToEdit.assignedTo || ''),
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Pending',
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10) : ''
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this task to an employee';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to save task'
      }));
    }
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: `${emp.name} (${emp.department} - ${emp.designation})`
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create & Assign Task'}
      description={
        isEditing
          ? 'Update task details, assignment, or completion status.'
          : 'Assign a new workplace task or deliverable to a team member.'
      }
      maxWidth="max-w-lg"
      showClose={!isLoading}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errors.form && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-slide-down">
            {errors.form}
          </div>
        )}

        {/* Task Title */}
        <Input
          label="Task Title"
          name="title"
          placeholder="e.g. Conduct Q3 Cloud Infrastructure Security Audit"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          icon={CheckSquare}
          required
          autoFocus
          disabled={isLoading}
        />

        {/* Assigned Employee */}
        <Select
          label="Assign to Employee"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          error={errors.assignedTo}
          options={employeeOptions}
          placeholder="Select team member"
          required
          disabled={isLoading}
        />

        {/* Priority and Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Priority Level"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={['Low', 'Medium', 'High', 'Urgent']}
            disabled={isLoading}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Pending', 'In Progress', 'Completed']}
            disabled={isLoading}
          />
        </div>

        {/* Due Date */}
        <Input
          label="Target Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          icon={Calendar}
          disabled={isLoading}
        />

        {/* Task Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 tracking-wide">
            Description & Notes (Optional)
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide task objectives, key deliverables, or instructions..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* Modal Actions */}
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
            {isEditing ? 'Save Task' : 'Assign Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
