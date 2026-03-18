export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  avatarUrl?: string;
  doctorId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  location: string;
  hospitalName: string;
  cabin: string;
  consultationFee: number; // in INR
  bio: string;
  avatarUrl: string;
  rating: number;
  experience: number; // years
  availableDays: string[];
  availableSlots: Record<string, string[]>; // date -> time slots
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  status: 'active' | 'inactive';
  registeredAt: string;
  assignedDoctorId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  ratingComment?: string;
  bookedAt?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medication: string;
  dosage: string;
  issuedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
}
