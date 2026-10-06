import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Flag, AlertCircle, Info } from 'lucide-react';
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

const MAX_TITLE_LEN = 150;
const MAX_DESC_LEN = 500;

const getTodayStr = () => new Date().toISOString().slice(0, 10);

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
  const [touched, setTouched] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        assignedTo:
          typeof taskToEdit.assignedTo === 'object'
            ? taskToEdit.assignedTo?._id
            : taskToEdit.assignedTo || '',
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Pending',
        dueDate: taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10)
          : ''
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
    setTouched({});
  }, [taskToEdit, isOpen]);

  const validate = (data) => {
    const errs = {};
    const title = data.title?.trim() || '';
    if (!title) {
      errs.title = 'Task title is required.';
    } else if (title.length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    } else if (title.length > MAX_TITLE_LEN) {
      errs.title = `Title cannot exceed ${MAX_TITLE_LEN} characters.`;
    }

    if (!data.assignedTo) {
      errs.assignedTo = 'Please assign this task to an employee.';
    }

    if (data.description && data.description.length > MAX_DESC_LEN) {
      errs.description = `Description cannot exceed ${MAX_DESC_LEN} characters.`;
    }

    // Due date must not be in the past for new tasks
    if (!isEditing && data.dueDate) {
      if (data.dueDate < getTodayStr()) {
        errs.dueDate = 'Due date cannot be in the past.';
      }
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    // Re-validate the field that changed (only if it was already touched)
    if (touched[name]) {
      const newErrs = validate(next);
      setErrors((prev) => ({
        ...prev,
        [name]: newErrs[name]
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrs = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({ title: true, assignedTo: true, description: true, dueDate: true });

    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      // onClose() is called by the parent after successful submit
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to save task. Please try again.'
      }));
    }
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: `${emp.name} — ${emp.department} (${emp.designation})`
  }));

  const titleLen = formData.title.length;
  const descLen = formData.description.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create & Assign Task'}
      description={
        isEditing
          ? 'Update task details, assignment, priority, or completion status.'
          : 'Create a new task and assign it to a team member.'
      }
      maxWidth="max-w-lg"
      showClose={!isLoading}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Form-level error */}
        {errors.form && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-slide-down">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* No employees warning */}
        {employees.length === 0 && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>No employees found. Please add employees first before creating tasks.</span>
          </div>
        )}

        {/* Task Title */}
        <div className="flex flex-col gap-1">
          <Input
            label="Task Title"
            name="title"
            placeholder="e.g. Conduct Q3 Infrastructure Security Audit"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.title}
            icon={CheckSquare}
            required
            autoFocus
            disabled={isLoading}
            maxLength={MAX_TITLE_LEN}
          />
          <div className="flex justify-end">
            <span
              className={`text-[10px] font-medium ${
                titleLen > MAX_TITLE_LEN * 0.9
                  ? titleLen >= MAX_TITLE_LEN
                    ? 'text-rose-500'
                    : 'text-amber-500'
                  : 'text-slate-400'
              }`}
            >
              {titleLen} / {MAX_TITLE_LEN}
            </span>
          </div>
        </div>

        {/* Assigned Employee */}
        <Select
          label="Assign to Employee"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.assignedTo}
          options={employeeOptions}
          placeholder="— Select team member —"
          required
          disabled={isLoading || employees.length === 0}
        />

        {/* Priority and Status side-by-side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Priority Level"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: 'Low', label: '🔵 Low' },
              { value: 'Medium', label: '🟡 Medium' },
              { value: 'High', label: '🟠 High' },
              { value: 'Urgent', label: '🔴 Urgent' }
            ]}
            disabled={isLoading}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'Pending', label: '⏳ Pending' },
              { value: 'In Progress', label: '🔄 In Progress' },
              { value: 'Completed', label: '✅ Completed' }
            ]}
            disabled={isLoading}
          />
        </div>

        {/* Due Date */}
        <div>
          <Input
            label="Due Date (Optional)"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.dueDate}
            icon={Calendar}
            disabled={isLoading}
            min={!isEditing ? getTodayStr() : undefined}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 tracking-wide">
            Description & Notes{' '}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe the task objectives, deliverables, or acceptance criteria..."
            maxLength={MAX_DESC_LEN}
            className={`w-full rounded-xl border p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors resize-none ${
              errors.description
                ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500'
                : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            {errors.description ? (
              <span className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </span>
            ) : (
              <span />
            )}
            <span
              className={`text-[10px] font-medium ml-auto ${
                descLen > MAX_DESC_LEN * 0.9
                  ? descLen >= MAX_DESC_LEN
                    ? 'text-rose-500'
                    : 'text-amber-500'
                  : 'text-slate-400'
              }`}
            >
              {descLen} / {MAX_DESC_LEN}
            </span>
          </div>
        </div>

        {/* Actions */}
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
            disabled={isLoading || employees.length === 0}
          >
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
