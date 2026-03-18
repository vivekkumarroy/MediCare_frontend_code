import { useState } from 'react';
import { User, Calendar, Activity } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface PatientDetails {
  name: string;
  age: string;
  sex: string;
  symptoms: string;
}

interface Props {
  open: boolean;
  defaultName?: string;
  onConfirm: (details: PatientDetails) => void;
  onClose: () => void;
}

export function PatientDetailsModal({ open, defaultName = '', onConfirm, onClose }: Props) {
  const [name, setName] = useState(defaultName);
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [errors, setErrors] = useState<Partial<PatientDetails>>({});

  function validate() {
    const e: Partial<PatientDetails> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) e.age = 'Enter a valid age';
    if (!sex) e.sex = 'Please select sex';
    if (!symptoms.trim()) e.symptoms = 'Please describe your symptoms';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onConfirm({ name: name.trim(), age, sex, symptoms: symptoms.trim() });
  }

  return (
    <Modal open={open} onClose={onClose} title="Patient Details" size="md">
      <p className="text-sm text-gray-500 mb-5">Please fill in your details before booking the appointment.</p>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1">
            <User className="w-3.5 h-3.5 text-[#4a9ead]" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9ead]"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Age + Sex row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#4a9ead]" /> Age
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 28"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9ead]"
            />
            {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Sex</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9ead] bg-white"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.sex && <p className="text-xs text-red-500 mt-1">{errors.sex}</p>}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-[#4a9ead]" /> Symptoms / Reason for Visit
          </label>
          <textarea
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms or reason for the appointment..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9ead] resize-none"
          />
          {errors.symptoms && <p className="text-xs text-red-500 mt-1">{errors.symptoms}</p>}
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1 justify-center">Cancel</Button>
          <Button onClick={handleSubmit} className="flex-1 justify-center bg-[#4a9ead] hover:bg-[#3a8e9d]">
            Continue to Booking
          </Button>
        </div>
      </div>
    </Modal>
  );
}
