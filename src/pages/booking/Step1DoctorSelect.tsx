import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { fetchDoctors } from '@/data/fetchers';
import { Input, Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Doctor } from '@/types';

interface Step1Props {
  selectedDoctorId: string | null;
  onSelect: (doctorId: string, doctor: Doctor) => void;
  onNext: () => void;
}

function DoctorRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/5" />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
    </span>
  );
}

export function Step1DoctorSelect({ selectedDoctorId, onSelect, onNext }: Step1Props) {
  const [search, setSearch] = useState('');

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  // When doctors load and there's a preselected ID, fire onSelect so the doctor object is set
  useEffect(() => {
    if (!isLoading && selectedDoctorId && doctors.length > 0) {
      const preselected = doctors.find((d) => d.id === selectedDoctorId);
      if (preselected) onSelect(preselected.id, preselected);
    }
  }, [isLoading, doctors, selectedDoctorId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = doctors.filter((d) => {
    const term = search.toLowerCase();
    return (
      !search ||
      d.name.toLowerCase().includes(term) ||
      d.specialty.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Select a Doctor</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Choose a doctor to book your appointment with</p>
      </div>

      <Input
        placeholder="Search by name or specialty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />

      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <DoctorRowSkeleton key={i} />)
          : filtered.map((doctor) => {
              const isSelected = doctor.id === selectedDoctorId;
              return (
                <button
                  key={doctor.id}
                  onClick={() => onSelect(doctor.id, doctor)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150 w-full',
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {isSelected && (
                      <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 bg-white dark:bg-gray-900 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{doctor.name}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{doctor.experience} yrs experience</p>
                    <StarRating rating={doctor.rating} />
                  </div>
                </button>
              );
            })}
        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No doctors found matching your search.</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={!selectedDoctorId} size="lg">
          Next: Date &amp; Time
        </Button>
      </div>
    </div>
  );
}
