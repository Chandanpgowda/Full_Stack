import React from 'react';
import { Modal } from './Modal';
import { Code2, Server } from 'lucide-react';

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
      accentColor="from-cyan-500 via-blue-500 to-violet-500"
    >
      <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1 text-xs modal-scroll">
        {ENDPOINTS.map((ep, idx) => {
          let methodBg = 'bg-blue-500/15 text-blue-300 border-blue-500/30';
          if (ep.method === 'POST') methodBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
          if (ep.method === 'PUT') methodBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
          if (ep.method === 'DELETE') methodBg = 'bg-rose-500/15 text-rose-300 border-rose-500/30';

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl glass border border-white/5 flex flex-col gap-2.5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] ${methodBg}`}>
                    {ep.method}
                  </span>
                  <span className="text-white text-xs">{ep.path}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {ep.codes.map((code, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/5 text-slate-400"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">{ep.description}</p>

              {ep.params && (
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 font-mono text-[11px] text-slate-300 truncate">
                  <strong className="text-violet-400">Query: </strong> {ep.params}
                </div>
              )}

              {ep.body && (
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 font-mono text-[11px] text-slate-300 truncate">
                  <strong className="text-pink-400">Body: </strong> {ep.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
