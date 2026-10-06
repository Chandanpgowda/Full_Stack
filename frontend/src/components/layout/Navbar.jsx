import {
  Users2,
  LayoutDashboard,
  UserPlus,
  Activity,
  CheckCircle2,
  AlertCircle,
  Code2
} from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenDocs,
  serverStatus,
  totalCount = 0
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Users2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
                  EMS Portal
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                    Pro
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Enterprise Employee Management
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('employees')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'employees'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Users2 className="w-4 h-4" />
                Directory
                {totalCount > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 ml-0.5">
                    {totalCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Section: System Health & Add Employee Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* API Docs Button */}
            <button
              type="button"
              onClick={onOpenDocs}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title="View REST API Documentation"
            >
              <Code2 className="w-4 h-4 text-slate-400" />
              API Docs
            </button>

            {/* Health Indicator */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                serverStatus === 'healthy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : serverStatus === 'unhealthy'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title={
                serverStatus === 'healthy'
                  ? 'Backend API and MongoDB Atlas/Local are connected'
                  : 'Connecting to server...'
              }
            >
              {serverStatus === 'healthy' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : serverStatus === 'unhealthy' ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <Activity className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
              )}
              <span className="capitalize">{serverStatus}</span>
            </div>

            {/* Quick Add Button */}
            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={onOpenAddModal}
              className="shadow-sm hover:shadow-md"
            >
              Add Employee
            </Button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'employees'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            Directory ({totalCount})
          </button>
        </div>
      </div>
    </header>
  );
};
