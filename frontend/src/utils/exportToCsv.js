/**
 * Export employee records to a standard CSV file
 * @param {Array} employees - Array of employee objects
 * @param {string} filename - Desired filename
 */
export const exportEmployeesToCSV = (employees, filename = 'employees_export.csv') => {
  if (!employees || employees.length === 0) {
    throw new Error('No employee records available to export.');
  }

  // Define headers
  const headers = ['Employee ID', 'Full Name', 'Email Address', 'Department', 'Designation', 'Date Joined', 'Last Updated'];

  // Map rows
  const rows = employees.map((emp) => [
    `"${emp._id || ''}"`,
    `"${(emp.name || '').replace(/"/g, '""')}"`,
    `"${(emp.email || '').replace(/"/g, '""')}"`,
    `"${(emp.department || '').replace(/"/g, '""')}"`,
    `"${(emp.designation || '').replace(/"/g, '""')}"`,
    `"${emp.createdAt ? new Date(emp.createdAt).toISOString() : ''}"`,
    `"${emp.updatedAt ? new Date(emp.updatedAt).toISOString() : ''}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.join(','))
  ].join('\r\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
