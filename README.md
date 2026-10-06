# Employee Management System (EMS Portal)

> A modern, production-quality Full-Stack Employee Management System built for the **Gupio Campus Placement Development Practical Assignment**.

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-339933?logo=node.js)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-000000?logo=express)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-v19.x-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-v8.x-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?logo=mongodb)](https://mongodb.com)
[![Tests](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen)]()

---

## 1. Project Title
**Enterprise Employee Management System (EMS Portal)**

---

## 2. Project Description
The Employee Management System is an enterprise-grade full-stack web application that streamlines personnel administration. It allows HR teams and engineering managers to create, view, update, search, filter, and delete employee profiles with real-time feedback, interactive analytics, and persistent storage.

---

## 3. Objective
Designed and engineered to meet the Gupio Campus Placement Development Practical Evaluation standards:
- Deliver a clean, responsive, production-ready full-stack application.
- Follow architectural best practices: modular controllers, centralized error handling, and component-based UI.
- Provide comprehensive test coverage with zero tolerance for broken flows or memory leaks.
- Ensure all code is cleanly written, well-documented, and easily explainable in technical interviews.

---

## 4. Features
- **Real-Time Analytics Dashboard**: Displays total workforce count, active departments, largest department metric, and latest onboarded profiles.
- **Department Distribution Analytics**: Visual distribution bars showing headcount and percentages by departmental unit with 1-click filtering.
- **Full Employee CRUD**: Complete Create, Read, Update, and Delete capabilities.
- **Debounced Search**: Instant search by employee name or email with client-side debouncing (350ms) to avoid server spamming.
- **Department Filtering**: Filter personnel by department with active filter badge removal.
- **Server-Side Pagination & Sorting**: Configurable page sizes (5, 10, 20, 50) and multi-column sorting (Date, Name, Department, Designation).
- **Double Confirmation Delete Dialog**: Prevents accidental deletion of employee records.
- **Client & Server-Side Validation**: Immediate feedback on invalid names, email formats, and missing attributes.
- **1-Click CSV Export**: Instant download of current directory records to CSV.
- **In-App API Documentation**: Live reference modal displaying all REST endpoints, query parameters, request bodies, and status codes.
- **Continuous Server Health Monitoring**: Real-time heartbeat indicator checking Express & MongoDB database connectivity.

---

## 5. Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Modern HSL styling & dark/light slate tones)
- **Icons**: Lucide React
- **HTTP Client**: Axios (with centralized interceptors & error handlers)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose 8.x ODM)
- **Middleware**: CORS, Morgan (HTTP logging), Dotenv (Environment configuration)
- **Testing**: Native Node.js test runner & custom REST assertion suite

---

## 6. Project Architecture

```
[ Browser / Client ] 
       │
       ▼
 [ React + Vite + Tailwind CSS ]  (SPA running on Port 3000)
       │
       ▼ (Axios API Service Layer + Debounce Hook)
 [ Express.js REST API Server ]   (Node.js server on Port 5000)
       │
       ├── Global Middleware: CORS, Morgan, ErrorHandler, 404 Handler
       ├── Health Controller: GET /api/health (Database Heartbeat)
       └── Employee Controller: GET, POST, PUT, DELETE /api/employees
       │
       ▼ (Mongoose ODM with Indexes & Schema Validation)
 [ MongoDB Database ]             (Atlas Cloud or Local Instance)
```

---

## 7. Folder Structure

```
Fullstack/
├── .gitignore                    # Global git ignore (protects .env & node_modules)
├── render.yaml                   # Infrastructure-as-Code for Render deployment
├── README.md                     # Comprehensive project documentation
├── backend/
│   ├── .env                      # Local environment variables (git-ignored)
│   ├── .env.example              # Placeholder environment variable template
│   ├── .gitignore                # Backend ignore rules
│   ├── package.json              # Backend dependencies and scripts
│   ├── src/
│   │   ├── app.js                # Express app configuration & middleware
│   │   ├── server.js             # Server bootstrap & graceful shutdown
│   │   ├── seed.js               # Initial database seeder
│   │   ├── config/
│   │   │   └── db.js             # Mongoose connection manager
│   │   ├── controllers/
│   │   │   └── employeeController.js # CRUD, search, filter & pagination logic
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # Centralized error & 404 middleware
│   │   ├── models/
│   │   │   └── Employee.js       # Employee Mongoose Schema & Indexes
│   │   └── routes/
│   │       ├── employeeRoutes.js # REST routes for /api/employees
│   │       └── healthRoutes.js   # Health check route /api/health
│   └── tests/
│       ├── testApi.js            # Automated integration test suite
│       └── fullE2eTest.js        # Comprehensive quality & edge case test suite
└── frontend/
    ├── .env.example              # Frontend environment template
    ├── index.html                # HTML entrypoint with Inter typography
    ├── package.json              # Frontend dependencies and scripts
    ├── vercel.json               # SPA rewrite rule for Vercel deployment
    ├── vite.config.js            # Vite configuration with Tailwind CSS & Proxy
    ├── public/
    │   └── _redirects            # SPA redirect rule for Netlify deployment
    └── src/
        ├── App.jsx               # Root application coordinator
        ├── index.css             # Tailwind v4 imports & custom scrollbar
        ├── main.jsx              # React DOM mounting
        ├── components/
        │   ├── common/           # Button, Input, Select, Modal, ConfirmDialog, Badge, Spinner, Skeleton, EmptyState, ApiDocsModal
        │   ├── layout/           # Navbar, Footer
        │   ├── dashboard/        # StatsGrid, DepartmentDistribution, RecentEmployees
        │   └── employees/        # FilterBar, EmployeeTable, EmployeeCard, EmployeePagination, EmployeeFormModal, EmployeeDetailModal
        ├── context/
        │   └── ToastContext.jsx  # Floating toast notification manager
        ├── hooks/
        │   └── useDebounce.js    # Custom search debounce hook
        ├── services/
        │   ├── api.js            # Configured Axios instance with error formatting
        │   └── employeeService.js# REST API service functions
        └── utils/
            ├── constants.js      # Departments & color palettes
            ├── exportToCsv.js    # CSV report exporter
            ├── formatters.js     # Date & avatar initial formatters
            └── validators.js     # Client form validation rules
```

---

## 8. Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server (runs on http://localhost:3000)
npm run dev

# 4. Build for production
npm run build
```

---

## 9. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Seed initial sample data (optional)
npm run seed

# 4. Run automated test suites
npm test
npm run test:quality

# 5. Start development server with auto-reload (runs on http://localhost:5000)
npm run dev

# 6. Start production server
npm start
```

---

## 10. MongoDB Setup

### Local MongoDB
Ensure MongoDB daemon is running locally on port `27017`:
```env
MONGODB_URI=mongodb://localhost:27017/employee_management
```

### MongoDB Atlas Cloud Cluster
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user under **Database Access**.
3. Allow network access under **Network Access** (`0.0.0.0/0` for cloud hosting).
4. Copy your connection string into `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/employee_management?retryWrites=true&w=majority
```

---

## 11. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 12. REST API Endpoints

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service & database health check | `200`, `503` |
| `POST` | `/api/employees` | Create a new employee record | `201`, `400`, `409`, `500` |
| `GET` | `/api/employees` | List employees with search, filter, sort & pagination | `200`, `500` |
| `GET` | `/api/employees/:id` | Retrieve a single employee by ID | `200`, `400`, `404`, `500` |
| `PUT` | `/api/employees/:id` | Update an existing employee profile | `200`, `400`, `404`, `409`, `500` |
| `DELETE` | `/api/employees/:id` | Delete an employee record | `200`, `400`, `404`, `500` |

---

## 13. Example API Requests & Responses

### 1. Create Employee
**Request:**
```http
POST /api/employees HTTP/1.1
Content-Type: application/json

{
  "name": "Alex Mercer",
  "email": "alex.mercer@company.com",
  "department": "Engineering",
  "designation": "Staff Software Architect"
}
```
**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "_id": "6ac494745722c37d4c774263",
    "name": "Alex Mercer",
    "email": "alex.mercer@company.com",
    "department": "Engineering",
    "designation": "Staff Software Architect",
    "createdAt": "2026-10-06T06:25:56.000Z",
    "updatedAt": "2026-10-06T06:25:56.000Z"
  }
}
```

### 2. List Employees with Filtering & Search
**Request:**
```http
GET /api/employees?search=alex&department=Engineering&page=1&limit=10&sortBy=createdAt&order=desc HTTP/1.1
```
**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "data": [
    {
      "_id": "6ac494745722c37d4c774263",
      "name": "Alex Mercer",
      "email": "alex.mercer@company.com",
      "department": "Engineering",
      "designation": "Staff Software Architect",
      "createdAt": "2026-10-06T06:25:56.000Z"
    }
  ]
}
```

### 3. Duplicate Email Error
**Response (`409 Conflict`):**
```json
{
  "success": false,
  "message": "Employee with email 'alex.mercer@company.com' already exists"
}
```

---

## 14. Search and Filter Functionality
- **Search**: Built using regex matching across `name` and `email` with special character escaping.
- **Frontend Debouncing**: Uses a custom `useDebounce` hook (350ms delay) to prevent sending unnecessary HTTP requests on every keystroke.
- **Department Filter**: Dropdown selection with instant query filtering; active filters render removable tag chips.
- **Sorting**: Toggle between `createdAt`, `name`, `department`, and `designation` in ascending or descending direction.

---

## 15. Validation and Error Handling
- **Client-Side Validation**: Real-time form checks ensuring valid email formats, min/max length constraints, and required fields before triggering network calls.
- **Server-Side Mongoose Validation**: Enforces database schema integrity.
- **Duplicate Key (11000) Trapping**: Converts raw MongoDB duplicate key errors into user-friendly `409 Conflict` messages mapped to the email input.
- **Malformed ID (CastError) Trapping**: Gracefully returns `400 Bad Request` for invalid MongoDB ObjectIds instead of crashing.
- **Network Resilience**: Global Axios response interceptor displays an actionable server-disconnected alert with retry triggers when the backend is unreachable.

---

## 16. Testing Performed
- **Unit & Integration Suite (`npm test`)**: 38 automated assertions verifying all CRUD routes, search, department filtering, duplicate emails, invalid inputs, and pagination.
- **End-to-End Edge Case Suite (`npm run test:quality`)**: 21 assertions testing boundary conditions, malformed ObjectIds, non-existent records, and database heartbeat checks.
- **100% Pass Rate**: Zero test failures across all test suites.

---

## 17. Deployment Information

### Backend Deployment (e.g. Render / Railway)
1. Link GitHub repository to **Render**.
2. Create a new **Web Service** with root directory set to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your_mongodb_atlas_connection_string>`
   - `CLIENT_ORIGIN=https://<your_frontend_domain>.vercel.app`

### Frontend Deployment (e.g. Vercel / Netlify)
1. Link GitHub repository to **Vercel** or **Netlify**.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variable:
   - `VITE_API_BASE_URL=https://<your_render_backend_url>/api`

---

## 18. Completed Features
- [x] Full CRUD operations (Create, Read, Update, Delete)
- [x] Real-time debounced search (by Name & Email)
- [x] Department dropdown filtering & active filter chips
- [x] Server-side pagination & items-per-page selector
- [x] Multi-column sorting (Ascending / Descending)
- [x] Double-confirmation delete modal
- [x] Toast feedback notifications (Success, Error, Warning)
- [x] Skeleton pulse loading states & empty state fallbacks
- [x] Interactive workforce statistics & department distribution analytics
- [x] In-app REST API documentation viewer
- [x] 1-Click CSV data export
- [x] Live backend health monitor in navigation header
- [x] Responsive layout (Desktop Table & Mobile Cards)

---

## 19. Incomplete / Intentionally Omitted Features
- **User Authentication / JWT Login**: Omitted to keep the assignment focused on core employee data management without unnecessary failure points.
- **Cloud Binary File Uploads**: Used deterministic initials-based avatars rather than external S3/Cloudinary storage.

---

## 20. Future Improvements
1. Role-Based Access Control (RBAC) with JWT auth (Admin vs Employee view).
2. Advanced Analytics Charts using Recharts / Chart.js for salary distributions and tenure.
3. Batch operations (bulk employee deletion / department reassignment).
4. Automated email notifications on onboarding.

---

## License
MIT License. Developed for Gupio Campus Placement Evaluation.
