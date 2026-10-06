import React from 'react';
import {
  Users2,
  LayoutDashboard,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Plus,
  Zap,
  Activity,
  Code2,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenAddTaskModal,
  onOpenDocs,
  serverStatus,
  totalCount = 0,
  taskCount = 0,
  authUser,
  onSignOut
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Directory', icon: Users2, count: totalCount, countColor: 'bg-violet-500/30 text-violet-300' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: taskCount, countColor: 'bg-pink-500/30 text-pink-300' },
  ];

  return (
    <header className="sticky top-0 z-40 glass-dark border-b border-white/6 shadow-2xl">
      {/* Animated top border */}
      <div className="h-px w-full grad-animated opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative w-10 h-10 rounded-2xl grad-purple-pink flex items-center justify-center shadow-lg glow-purple group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-2xl grad-purple-pink opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  EMS Portal
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Workforce Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/4 rounded-2xl p-1 border border-white/6">
            {navItems.map(({ id, label, icon: Icon, count, countColor }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/6'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : countColor}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 shrink-0">
            {/* API Docs */}
            <button
              type="button"
              onClick={onOpenDocs}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 border border-transparent hover:border-violet-500/20 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              API
            </button>

            {/* Server Status */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                serverStatus === 'healthy'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  : serverStatus === 'unhealthy'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}
            >
              {serverStatus === 'healthy' ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : serverStatus === 'unhealthy' ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Activity className="w-3 h-3 animate-pulse" />
              )}
              <span className="capitalize">{serverStatus}</span>
            </div>

            {/* Add Task */}
            <Button
              variant="secondary"
              size="sm"
              icon={CheckSquare}
              onClick={onOpenAddTaskModal}
              className="hidden sm:inline-flex"
            >
              Task
            </Button>

            {/* Add Employee */}
            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={onOpenAddModal}
            >
              <span className="hidden sm:block">Employee</span>
            </Button>

            {/* User Profile & Sign Out */}
            {authUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/8 text-xs text-slate-300"
                  title={authUser.email}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
                    {authUser.name ? authUser.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                  </div>
                  <span className="hidden xl:inline max-w-[100px] truncate font-medium">
                    {authUser.name || authUser.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  title="Sign out"
                  className="p-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-around py-1.5 border-t border-white/5">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === id
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {count > 0 && (
                <span className="text-[9px] font-bold px-1 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
