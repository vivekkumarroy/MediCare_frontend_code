import type { Doctor, Patient, Appointment, Prescription, User } from '../types/index';
import doctorsData from './doctors.json';
import patientsData from './patients.json';
import appointmentsData from './appointments.json';
import prescriptionsData from './prescriptions.json';
import usersData from './users.json';

const DELAY_MS = 300;

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), DELAY_MS));

export const fetchDoctors = (): Promise<Doctor[]> =>
  delay(doctorsData as unknown as Doctor[]);

export const fetchPatients = (): Promise<Patient[]> =>
  delay(patientsData as Patient[]);

export const fetchAppointments = (): Promise<Appointment[]> =>
  delay(appointmentsData as Appointment[]);

export const fetchPrescriptions = (): Promise<Prescription[]> =>
  delay(prescriptionsData as Prescription[]);

export const fetchUsers = (): Promise<User[]> =>
  delay(usersData as User[]);

export const fetchDoctorById = async (id: string): Promise<Doctor | undefined> => {
  const doctors = await fetchDoctors();
  return doctors.find((d) => d.id === id);
};

export const fetchPatientById = async (id: string): Promise<Patient | undefined> => {
  const patients = await fetchPatients();
  return patients.find((p) => p.id === id);
};
