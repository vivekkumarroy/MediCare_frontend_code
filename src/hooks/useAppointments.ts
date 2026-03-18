import { useContext } from 'react';
import { AppointmentsContext } from '@/context/AppointmentsContext';

export const useAppointments = () => useContext(AppointmentsContext);
