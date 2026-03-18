import { motion } from 'framer-motion';
import { MapPin, Star, Clock, IndianRupee, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook?: () => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const filled = Math.round(doctor.rating);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-shadow flex flex-col h-full"
    >
      <div className="p-5 flex flex-col h-full">
        {/* Avatar + info */}
        <div className="flex items-start gap-3 mb-4">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-12 h-12 rounded-xl object-cover border border-[#d4ecf2] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-navy dark:text-white text-sm leading-tight truncate">{doctor.name}</h3>
            <p className="text-primary-600 text-xs font-medium mt-0.5 truncate">{doctor.specialty}</p>
            <p className="text-slate-400 text-xs truncate">{doctor.department}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.location}</span>
          </div>
          {doctor.hospitalName && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.hospitalName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{doctor.experience} {doctor.experience === 1 ? 'year' : 'years'} experience</span>
          </div>
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={11}
                className={i < filled ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}
                fill={i < filled ? 'currentColor' : 'none'}
              />
            ))}
            <span className="ml-1 text-xs text-slate-400">({doctor.rating.toFixed(1)})</span>
          </div>
          {doctor.consultationFee && (
            <div className="flex items-center gap-1 mt-1.5 bg-[#e8f6f8] rounded-lg px-2 py-1 w-fit">
              <IndianRupee className="w-3 h-3 text-[#4a9ead]" />
              <span className="text-xs font-bold text-[#2d7a8a]">{doctor.consultationFee}</span>
              <span className="text-[10px] text-[#4a9ead]">consultation</span>
            </div>
          )}
        </div>

        <Link
          to={`/booking?doctorId=${doctor.id}`}
          onClick={onBook}
          className="block w-full bg-primary-500 hover:bg-primary-600 text-white rounded-lg py-2 text-xs font-semibold text-center transition-colors"
        >
          Book Appointment
        </Link>
      </div>
    </motion.div>
  );
}
