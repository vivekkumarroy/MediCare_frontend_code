import { useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Doctor } from '@/types';

interface Step3Props {
  doctor: Doctor;
  date: string;
  time: string;
  onSubmit: (notes: string) => void;
  onBack: () => void;
  loading: boolean;
}

export function Step3Summary({ doctor, date, time, onSubmit, onBack, loading }: Step3Props) {
  const [notes, setNotes] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Confirm Appointment</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Review your booking details before confirming</p>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-lg">{doctor.name}</p>
            <p className="text-blue-600 dark:text-blue-400 font-medium">{doctor.specialty}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <CalendarDays className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <span className="font-medium">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <span className="font-medium">{time}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any symptoms, concerns, or information for the doctor..."
          rows={4}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          onClick={() => onSubmit(notes)}
          loading={loading}
          size="lg"
          className="w-full justify-center"
        >
          Confirm Booking
        </Button>
        <Button variant="secondary" onClick={onBack} size="lg" className="w-full justify-center" disabled={loading}>
          Back
        </Button>
      </div>
    </div>
  );
}
