import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';
import { Step1DoctorSelect } from './booking/Step1DoctorSelect';
import { Step2DateTime } from './booking/Step2DateTime';
import { Step3Summary } from './booking/Step3Summary';
import { SuccessModal } from './booking/SuccessModal';
import { PatientDetailsModal } from './booking/PatientDetailsModal';
import type { PatientDetails } from './booking/PatientDetailsModal';
import { fetchDoctorById } from '@/data/fetchers';
import { cn } from '@/lib/cn';
import type { Doctor, Appointment } from '@/types';

interface WizardData {
  doctorId: string | null;
  doctor: Doctor | null;
  date: string;
  time: string;
  notes: string;
}

const STEPS = [
  { label: 'Select Doctor' },
  { label: 'Date & Time' },
  { label: 'Confirm' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < current;
        const isActive = stepNum === current;

        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                  isCompleted
                    ? 'bg-blue-600 text-white'
                    : isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                )}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500'
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-all duration-200',
                  stepNum < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedDoctorId = searchParams.get('doctorId');

  const { user, isAuthenticated } = useAuth();

  // Patient details modal — shown before wizard starts
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    doctorId: preselectedDoctorId,
    doctor: null,
    date: '',
    time: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastAppointmentId, setLastAppointmentId] = useState<string | undefined>();

  const { addAppointment } = useAppointments();

  // On mount: if not authenticated redirect to login, else show patient details form
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`, { replace: true });
      return;
    }
    // Show patient details modal immediately
    setDetailsOpen(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When arriving with a preselected doctorId, fetch the full doctor object
  // and auto-advance to step 2 once patient details are also filled
  useEffect(() => {
    if (preselectedDoctorId && !wizardData.doctor) {
      fetchDoctorById(preselectedDoctorId).then((doc) => {
        if (doc) {
          setWizardData((prev) => ({ ...prev, doctor: doc }));
          // If patient details already confirmed (modal closed), jump to step 2
          setCurrentStep((prev) => (prev === 1 && patientDetails ? 2 : prev));
        }
      });
    }
  }, [preselectedDoctorId]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDoctorSelect(doctorId: string, doctor: Doctor) {
    setWizardData((prev) => ({ ...prev, doctorId, doctor }));
  }

  function handleDateSelect(date: string) {
    setWizardData((prev) => ({ ...prev, date }));
  }

  function handleTimeSelect(time: string) {
    setWizardData((prev) => ({ ...prev, time }));
  }

  async function handleSubmit(notes: string) {
    if (!wizardData.doctor || !wizardData.date || !wizardData.time) return;

    setSubmitting(true);
    const detailsNote = patientDetails
      ? `Patient: ${patientDetails.name}, Age: ${patientDetails.age}, Sex: ${patientDetails.sex}, Symptoms: ${patientDetails.symptoms}`
      : '';
    const fullNotes = [detailsNote, notes].filter(Boolean).join(' | ');

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      patientId: user?.id ?? 'unknown',
      doctorId: wizardData.doctor.id,
      doctorName: wizardData.doctor.name,
      specialty: wizardData.doctor.specialty,
      date: wizardData.date,
      time: wizardData.time,
      status: 'upcoming',
      notes: fullNotes || undefined,
    };

    // Simulate brief async operation
    await new Promise((r) => setTimeout(r, 600));
    addAppointment(newAppointment);
    setWizardData((prev) => ({ ...prev, notes }));
    setLastAppointmentId(newAppointment.id);
    setSubmitting(false);
    setSuccessOpen(true);
  }

  function handleBookAnother() {
    setSuccessOpen(false);
    setCurrentStep(1);
    setPatientDetails(null);
    setDetailsOpen(true);
    setWizardData({
      doctorId: null,
      doctor: null,
      date: '',
      time: '',
      notes: '',
    });
  }

  return (
    <Layout>
      {/* Patient details modal — shown before wizard */}
      <PatientDetailsModal
        open={detailsOpen}
        defaultName={user?.name ?? ''}
        onConfirm={(details) => {
          setPatientDetails(details);
          setDetailsOpen(false);
          // If a doctor was preselected and already loaded, skip to Step 2
          if (preselectedDoctorId) {
            setCurrentStep(2);
          }
        }}
        onClose={() => navigate(-1)}
      />

      <div className="min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book an Appointment</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complete the steps below to schedule your visit
            </p>
          </div>

          <StepIndicator current={currentStep} />

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            {currentStep === 1 && (
              <Step1DoctorSelect
                selectedDoctorId={wizardData.doctorId}
                onSelect={handleDoctorSelect}
                onNext={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && !wizardData.doctor && (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-[#4a9ead] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {currentStep === 2 && wizardData.doctor && (
              <Step2DateTime
                doctor={wizardData.doctor}
                selectedDate={wizardData.date}
                selectedTime={wizardData.time}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && wizardData.doctor && (
              <Step3Summary
                doctor={wizardData.doctor}
                date={wizardData.date}
                time={wizardData.time}
                onSubmit={handleSubmit}
                onBack={() => setCurrentStep(2)}
                loading={submitting}
              />
            )}
          </div>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        doctor={wizardData.doctor}
        date={wizardData.date}
        time={wizardData.time}
        appointmentId={lastAppointmentId}
        patientDetails={patientDetails}
        onClose={() => setSuccessOpen(false)}
        onBookAnother={handleBookAnother}
      />
    </Layout>
  );
}
