import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Appointment } from '@/types';
import { fetchAppointments } from '@/data/fetchers';

const STORAGE_KEY = 'hms_appointments_overlay';

// Overlay: persisted mutations keyed by appointment id
interface Overlay {
  ratings: Record<string, { rating: number; ratingComment: string }>;
  cancelled: string[];
  completed: string[];
  added: Appointment[];
}

function loadOverlay(): Overlay {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { ratings: {}, cancelled: [], completed: [], added: [] };
}

function saveOverlay(overlay: Overlay) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
}

interface AppointmentsState {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  cancelAppointment: (id: string) => void;
  rateAppointment: (id: string, rating: number, comment: string) => void;
  completeAppointment: (id: string) => void;
}

export const AppointmentsContext = createContext<AppointmentsState>({
  appointments: [],
  addAppointment: () => {},
  cancelAppointment: () => {},
  rateAppointment: () => {},
  completeAppointment: () => {},
});

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments().then((base) => {
      const overlay = loadOverlay();
      // Apply persisted mutations on top of base data
      const merged: Appointment[] = base.map((a) => {
        let result = { ...a };
        if (overlay.cancelled.includes(a.id)) result = { ...result, status: 'cancelled' };
        if (overlay.completed?.includes(a.id)) result = { ...result, status: 'completed' };
        if (overlay.ratings[a.id]) result = { ...result, ...overlay.ratings[a.id] };
        return result;
      });
      // Append any newly booked appointments
      const baseIds = new Set(base.map((a) => a.id));
      const extraAdded = overlay.added.filter((a) => !baseIds.has(a.id));
      setAppointments([...merged, ...extraAdded]);
    });
  }, []);

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => {
      const next = [...prev, appointment];
      const overlay = loadOverlay();
      if (!overlay.added.find((a) => a.id === appointment.id)) {
        overlay.added.push(appointment);
        saveOverlay(overlay);
      }
      return next;
    });
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a));
      const overlay = loadOverlay();
      if (!overlay.cancelled.includes(id)) {
        overlay.cancelled.push(id);
        saveOverlay(overlay);
      }
      return next;
    });
  };

  const rateAppointment = (id: string, rating: number, comment: string) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, rating, ratingComment: comment } : a));
      const overlay = loadOverlay();
      overlay.ratings[id] = { rating, ratingComment: comment };
      saveOverlay(overlay);
      return next;
    });
  };

  const completeAppointment = (id: string) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status: 'completed' as const } : a));
      const overlay = loadOverlay();
      if (!overlay.completed) overlay.completed = [];
      if (!overlay.completed.includes(id)) overlay.completed.push(id);
      saveOverlay(overlay);
      return next;
    });
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, cancelAppointment, rateAppointment, completeAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
}
