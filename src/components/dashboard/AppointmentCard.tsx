import { motion } from 'framer-motion';
import { Calendar, Clock, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppointments } from '@/hooks/useAppointments';
import type { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { cancelAppointment } = useAppointments();

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }}>
      <Card className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{appointment.doctorName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5" />
              {appointment.specialty}
            </p>
          </div>
          <Badge variant={appointment.status} label={appointment.status} />
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(appointment.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {appointment.time}
          </span>
        </div>
        {appointment.status === 'upcoming' && (
          <Button
            variant="danger"
            size="sm"
            className="self-start"
            onClick={() => cancelAppointment(appointment.id)}
          >
            Cancel
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
