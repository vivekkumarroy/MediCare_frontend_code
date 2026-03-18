import type { Doctor, Patient } from '../types/index';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateTimeSlots(doctor: Doctor, date: string): string[] {
  return doctor.availableSlots[date] ?? [];
}

export function filterDoctors(
  doctors: Doctor[],
  search: string,
  specialty: string,
  location: string
): Doctor[] {
  const term = search.toLowerCase();
  return doctors.filter((d) => {
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(term) ||
      d.specialty.toLowerCase().includes(term);
    const matchesSpecialty = !specialty || d.specialty === specialty;
    const matchesLocation = !location || d.location === location;
    return matchesSearch && matchesSpecialty && matchesLocation;
  });
}

export function filterPatients(patients: Patient[], query: string): Patient[] {
  const term = query.toLowerCase();
  return patients.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.toLowerCase().includes(term)
  );
}

export function getUniqueSpecialties(doctors: Doctor[]): string[] {
  return [...new Set(doctors.map((d) => d.specialty))].sort();
}

export function getUniqueLocations(doctors: Doctor[]): string[] {
  return [...new Set(doctors.map((d) => d.location))].sort();
}

export function getRatingStars(rating: number): string {
  const filled = Math.round(rating);
  const empty = 5 - filled;
  return '★'.repeat(filled) + '☆'.repeat(empty);
}
