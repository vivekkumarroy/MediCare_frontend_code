import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { generateTimeSlots } from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { Doctor } from '@/types';

interface Step2Props {
  doctor: Doctor;
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function toDateKey(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function Step2DateTime({
  doctor,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
}: Step2Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const availableDates = new Set(Object.keys(doctor.availableSlots));

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const timeSlots = selectedDate ? generateTimeSlots(doctor, selectedDate) : [];

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Select Date &amp; Time</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Booking with <span className="font-medium text-blue-600 dark:text-blue-400">{doctor.name}</span>
        </p>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">{monthName}</span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {dayLabels.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateKey = toDateKey(viewYear, viewMonth, day);
            const isAvailable = availableDates.has(dateKey);
            const isSelected = dateKey === selectedDate;
            const isPast = new Date(dateKey) < new Date(today.toDateString());

            return (
              <button
                key={day}
                disabled={!isAvailable || isPast}
                onClick={() => {
                  onDateSelect(dateKey);
                  onTimeSelect('');
                }}
                className={cn(
                  'mx-auto w-9 h-9 rounded-full text-sm font-medium transition-all duration-150 flex items-center justify-center',
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isAvailable && !isPast
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Available times for{' '}
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {timeSlots.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              No slots available for this date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onTimeSelect(slot)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150',
                    selectedTime === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={onBack} size="lg">
          Back
        </Button>
        <Button onClick={onNext} disabled={!selectedDate || !selectedTime} size="lg">
          Next: Confirm
        </Button>
      </div>
    </div>
  );
}
