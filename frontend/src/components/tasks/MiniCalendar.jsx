import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, X } from 'lucide-react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const toDateString = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const addDaysToToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const MiniCalendar = ({ value, onChange, minDate }) => {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Initialize view year & month from selected value or today
  const initialDate = value ? new Date(value) : today;
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getTime()) ? today.getFullYear() : initialDate.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getTime()) ? today.getMonth() : initialDate.getMonth()
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar calculations
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handleSelectDay = (day) => {
    const dateStr = toDateString(currentYear, currentMonth, day);
    onChange(dateStr);
  };

  return (
    <div className="glass-card p-4 border border-violet-500/30 rounded-2xl shadow-2xl relative overflow-hidden animate-slide-down">
      {/* Decorative ambient gradient inside calendar */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header Month / Year controls */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 relative z-10">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-violet-400" />
          <span
            className="text-sm font-bold text-white tracking-wide"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Next Month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Previous month leading days */}
        {Array.from({ length: firstDayIndex }).map((_, i) => {
          const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
          return (
            <div
              key={`prev-${i}`}
              className="text-xs text-slate-600 py-1.5 rounded-xl select-none"
            >
              {dayNum}
            </div>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayStr = toDateString(currentYear, currentMonth, dayNum);
          const isSelected = value === dayStr;
          const isToday = dayStr === todayStr;
          const isPast = minDate && dayStr < minDate;

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              disabled={Boolean(isPast)}
              onClick={() => handleSelectDay(dayNum)}
              className={`text-xs py-1.5 rounded-xl font-semibold transition-all relative cursor-pointer ${
                isSelected
                  ? 'grad-purple-pink text-white glow-purple shadow-md scale-105 z-10'
                  : isPast
                  ? 'text-slate-600 cursor-not-allowed opacity-40'
                  : 'text-slate-200 hover:bg-violet-500/20 hover:text-white'
              }`}
            >
              {dayNum}
              {isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Presets Bar */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onChange(addDaysToToday(0))}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-violet-500/20 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChange(addDaysToToday(1))}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-violet-500/20 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => onChange(addDaysToToday(3))}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-violet-500/20 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            +3 Days
          </button>
          <button
            type="button"
            onClick={() => onChange(addDaysToToday(7))}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-violet-500/20 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            +1 Week
          </button>
          <button
            type="button"
            onClick={() => onChange(addDaysToToday(14))}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-violet-500/20 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            +2 Weeks
          </button>
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-2 py-1 rounded-lg text-[10px] font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
            title="Clear due date"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
