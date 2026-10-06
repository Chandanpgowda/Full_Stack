import React from 'react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Code2, Server, ExternalLink } from 'lucide-react';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/health',
    description: 'Check backend server and MongoDB connection health status.',
    codes: ['200 OK', '503 Service Unavailable']
  },
  {
    method: 'POST',
    path: '/api/employees',
    description: 'Create a new employee profile.',
    body: '{ "name": "...", "email": "...", "department": "...", "designation": "..." }',
    codes: ['201 Created', '400 Bad Request', '409 Conflict']
  },
  {
    method: 'GET',
    path: '/api/employees',
    description: 'List employees with search, department filter, sorting, and pagination.',
    params: '?search=john&department=Engineering&page=1&limit=10&sortBy=createdAt&order=desc',
    codes: ['200 OK', '500 Server Error']
  },
  {
    method: 'GET',
    path: '/api/employees/:id',
    description: 'Retrieve a single employee by their MongoDB ObjectId.',
    codes: ['200 OK', '400 Invalid ID', '404 Not Found']
  },
  {
    method: 'PUT',
    path: '/api/employees/:id',
    description: 'Update employee fields with validation and conflict checks.',
    body: '{ "designation": "Staff Engineer", "department": "Engineering" }',
    codes: ['200 OK', '400 Invalid ID/Validation', '404 Not Found', '409 Conflict']
  },
  {
    method: 'DELETE',
    path: '/api/employees/:id',
    description: 'Permanently remove an employee profile from the database.',
    codes: ['200 OK', '400 Invalid ID', '404 Not Found']
  },
  {
    method: 'POST',
    path: '/api/tasks',
    description: 'Create and assign a new workplace task to an employee.',
    body: '{ "title": "...", "assignedTo": "<Employee_ID>", "priority": "High", "status": "Pending", "dueDate": "2026-10-15" }',
    codes: ['201 Created', '400 Bad Request', '404 Employee Not Found']
  },
  {
    method: 'GET',
    path: '/api/tasks',
    description: 'List and filter tasks by status, priority, or assignee with pagination.',
    params: '?status=Pending&priority=High&assignedTo=<Employee_ID>',
    codes: ['200 OK', '500 Server Error']
  },
  {
    method: 'PUT',
    path: '/api/tasks/:id',
    description: 'Update task details, assignment, or completion status.',
    body: '{ "status": "Completed" }',
    codes: ['200 OK', '400 Invalid ID', '404 Not Found']
  },
  {
    method: 'DELETE',
    path: '/api/tasks/:id',
    description: 'Delete a task from the database.',
    codes: ['200 OK', '400 Invalid ID', '404 Not Found']
  }
];

export const ApiDocsModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="REST API Documentation"
      description="Overview of backend endpoints, request payloads, and status codes."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
        {ENDPOINTS.map((ep, idx) => {
          let methodBg = 'bg-blue-50 text-blue-700 border-blue-200';
          if (ep.method === 'POST') methodBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (ep.method === 'PUT') methodBg = 'bg-amber-50 text-amber-700 border-amber-200';
          if (ep.method === 'DELETE') methodBg = 'bg-rose-50 text-rose-700 border-rose-200';

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 font-mono font-semibold">
                  <span className={`px-2 py-0.5 rounded-md border text-[11px] ${methodBg}`}>
                    {ep.method}
                  </span>
                  <span className="text-slate-900 text-xs">{ep.path}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {ep.codes.map((code, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-600"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">{ep.description}</p>

              {ep.params && (
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 font-mono text-[11px] text-slate-600 truncate">
                  <strong className="text-slate-400">Query: </strong> {ep.params}
                </div>
              )}

              {ep.body && (
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 font-mono text-[11px] text-slate-600 truncate">
                  <strong className="text-slate-400">Body: </strong> {ep.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
