import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, Star, Heart,
  Menu, LogOut, Pencil, Trash2, Plus, X, Save,
  IndianRupee, TrendingUp,
  CheckCircle, XCircle, CalendarDays, MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '@/context/AuthContext';
import { AppointmentsContext } from '@/context/AppointmentsContext';
import initialDoctors from '@/data/doctors.json';
import initialPatients from '@/data/patients.json';
import type { Appointment } from '@/types';

// ── types ─────────────────────────────────────────────────────────────────────
interface Doctor {
  id: string; name: string; specialty: string; department: string;
  location: string; hospitalName: string; cabin: string;
  consultationFee: number; bio: string; avatarUrl: string;
  rating: number; experience: number; availableDays: string[];
}
interface Patient {
  id: string; name: string; email: string; phone: string;
  dateOfBirth: string; gender: string; status: 'active' | 'inactive';
  registeredAt: string; assignedDoctorId?: string;
}

// ── localStorage persistence ──────────────────────────────────────────────────
const DOCTORS_KEY  = 'hms_admin_doctors';
const PATIENTS_KEY = 'hms_admin_patients';

function loadDoctors(): Doctor[] {
  try { const s = localStorage.getItem(DOCTORS_KEY); if (s) return JSON.parse(s); } catch {}
  return initialDoctors as unknown as Doctor[];
}
function saveDoctors(d: Doctor[]) { localStorage.setItem(DOCTORS_KEY, JSON.stringify(d)); }
function loadPatients(): Patient[] {
  try { const s = localStorage.getItem(PATIENTS_KEY); if (s) return JSON.parse(s); } catch {}
  return initialPatients as unknown as Patient[];
}
function savePatients(p: Patient[]) { localStorage.setItem(PATIENTS_KEY, JSON.stringify(p)); }

// ── helpers ───────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</label>
      <input type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white" />
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewView({ doctors, patients, appointments }: { doctors: Doctor[]; patients: Patient[]; appointments: Appointment[] }) {
  const total     = appointments.length;
  const upcoming  = appointments.filter(a => a.status === 'upcoming').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const revenue   = doctors.reduce((s, d) => {
    const count = appointments.filter(a => a.doctorId === d.id && a.status !== 'cancelled').length;
    return s + count * d.consultationFee;
  }, 0);

  // all doctors sorted by appointment count
  const topDoctors = doctors.map(d => ({
    ...d,
    patientCount: patients.filter(p => p.assignedDoctorId === d.id).length,
    apptCount: appointments.filter(a => a.doctorId === d.id).length,
  })).filter(d => d.apptCount > 0).sort((a, b) => b.apptCount - a.apptCount);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Admin Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Patients"      value={patients.length} icon={<Users        className="w-6 h-6 text-white"/>} color="bg-blue-500"    />
        <StatCard label="Total Doctors"       value={doctors.length}  icon={<Stethoscope  className="w-6 h-6 text-white"/>} color="bg-primary-500" />
        <StatCard label="Total Appointments"  value={total}           icon={<CalendarDays className="w-6 h-6 text-white"/>} color="bg-purple-500"  />
        <StatCard label="Total Revenue"       value={`₹${revenue.toLocaleString()}`} icon={<IndianRupee className="w-6 h-6 text-white"/>} color="bg-green-500"   />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Upcoming"  value={upcoming}  icon={<TrendingUp  className="w-6 h-6 text-white"/>} color="bg-blue-400"   />
        <StatCard label="Completed" value={completed} icon={<CheckCircle className="w-6 h-6 text-white"/>} color="bg-green-400"  />
        <StatCard label="Cancelled" value={appointments.filter(a=>a.status==='cancelled').length} icon={<XCircle className="w-6 h-6 text-white"/>} color="bg-red-400" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Doctors by Appointment Count</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Doctor</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Specialty</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Patients</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Appointments</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Fee</th>
              </tr>
            </thead>
            <tbody>
              {topDoctors.map(d => (
                <tr key={d.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-700">{d.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{d.specialty}</td>
                  <td className="py-2.5 px-3 text-slate-600">{d.patientCount}</td>
                  <td className="py-2.5 px-3 text-slate-600">{d.apptCount}</td>
                  <td className="py-2.5 px-3 text-slate-600">₹{d.consultationFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Doctors Management ────────────────────────────────────────────────────────
const BLANK_DOCTOR: Omit<Doctor,'id'> = {
  name:'', specialty:'', department:'', location:'', hospitalName:'',
  cabin:'', consultationFee:500, bio:'', avatarUrl:'', rating:4.5,
  experience:5, availableDays:['Monday','Wednesday','Friday'],
};

function DoctorsView({ doctors, setDoctors, appointments }: {
  doctors: Doctor[]; setDoctors: (d: Doctor[]) => void; appointments: Appointment[];
}) {
  const [search, setSearch] = useState('');
  const [editDoc, setEditDoc] = useState<Doctor | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newDoc, setNewDoc] = useState<Omit<Doctor,'id'>>(BLANK_DOCTOR);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [editForm, setEditForm] = useState<Doctor | null>(null);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    const doc: Doctor = { ...newDoc, id: `d${Date.now()}` };
    const updated = [...doctors, doc];
    setDoctors(updated); saveDoctors(updated);
    setAddOpen(false); setNewDoc(BLANK_DOCTOR);
    toast.success('Doctor added');
  }

  function handleDelete(d: Doctor) {
    const updated = doctors.filter(x => x.id !== d.id);
    setDoctors(updated); saveDoctors(updated);
    setDeleteTarget(null); toast.success('Doctor removed');
  }

  function handleEditSave() {
    if (!editForm) return;
    const updated = doctors.map(d => d.id === editForm.id ? editForm : d);
    setDoctors(updated); saveDoctors(updated);
    setEditDoc(null); setEditForm(null); toast.success('Doctor updated');
  }

  function openEdit(d: Doctor) { setEditDoc(d); setEditForm({ ...d }); }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-slate-800">Manage Doctors</h2>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or specialty..."
        className="w-full max-w-sm rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Specialty</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Hospital</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Exp</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Fee</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Patients</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-700">{d.name}</td>
                  <td className="py-3 px-4 text-slate-600">{d.specialty}</td>
                  <td className="py-3 px-4 text-slate-600">{d.location}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-[160px] truncate">{d.hospitalName}</td>
                  <td className="py-3 px-4 text-slate-600">{d.experience}y</td>
                  <td className="py-3 px-4 text-slate-600">₹{d.consultationFee}</td>
                  <td className="py-3 px-4 text-slate-600">{appointments.filter(a=>a.doctorId===d.id).length}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-500"><Pencil className="w-4 h-4"/></button>
                      <button onClick={() => setDeleteTarget(d)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Doctor">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Name"            value={newDoc.name}            onChange={v => setNewDoc(f=>({...f,name:v}))} />
          <Field label="Specialty"       value={newDoc.specialty}       onChange={v => setNewDoc(f=>({...f,specialty:v}))} />
          <Field label="Department"      value={newDoc.department}      onChange={v => setNewDoc(f=>({...f,department:v}))} />
          <Field label="Location"        value={newDoc.location}        onChange={v => setNewDoc(f=>({...f,location:v}))} />
          <Field label="Hospital Name"   value={newDoc.hospitalName}    onChange={v => setNewDoc(f=>({...f,hospitalName:v}))} />
          <Field label="Cabin"           value={newDoc.cabin}           onChange={v => setNewDoc(f=>({...f,cabin:v}))} />
          <Field label="Experience (yrs)"value={newDoc.experience}      onChange={v => setNewDoc(f=>({...f,experience:Number(v)}))} type="number" />
          <Field label="Consult Fee (₹)" value={newDoc.consultationFee} onChange={v => setNewDoc(f=>({...f,consultationFee:Number(v)}))} type="number" />
          <Field label="Bio"             value={newDoc.bio}             onChange={v => setNewDoc(f=>({...f,bio:v}))} />
          <Field label="Avatar URL"      value={newDoc.avatarUrl}       onChange={v => setNewDoc(f=>({...f,avatarUrl:v}))} />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm hover:bg-primary-600"><Save className="w-4 h-4"/>Add Doctor</button>
        </div>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal open={!!editDoc} onClose={() => { setEditDoc(null); setEditForm(null); }} title="Edit Doctor">
        {editForm && (
          <>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Name"            value={editForm.name}            onChange={v => setEditForm(f=>f?{...f,name:v}:f)} />
              <Field label="Specialty"       value={editForm.specialty}       onChange={v => setEditForm(f=>f?{...f,specialty:v}:f)} />
              <Field label="Department"      value={editForm.department}      onChange={v => setEditForm(f=>f?{...f,department:v}:f)} />
              <Field label="Location"        value={editForm.location}        onChange={v => setEditForm(f=>f?{...f,location:v}:f)} />
              <Field label="Hospital Name"   value={editForm.hospitalName}    onChange={v => setEditForm(f=>f?{...f,hospitalName:v}:f)} />
              <Field label="Cabin"           value={editForm.cabin}           onChange={v => setEditForm(f=>f?{...f,cabin:v}:f)} />
              <Field label="Experience (yrs)"value={editForm.experience}      onChange={v => setEditForm(f=>f?{...f,experience:Number(v)}:f)} type="number" />
              <Field label="Consult Fee (₹)" value={editForm.consultationFee} onChange={v => setEditForm(f=>f?{...f,consultationFee:Number(v)}:f)} type="number" />
              <Field label="Bio"             value={editForm.bio}             onChange={v => setEditForm(f=>f?{...f,bio:v}:f)} />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { setEditDoc(null); setEditForm(null); }} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleEditSave} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm hover:bg-primary-600"><Save className="w-4 h-4"/>Save</button>
            </div>
          </>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Doctor">
        <p className="text-sm text-slate-600 mb-5">Remove <span className="font-semibold">{deleteTarget?.name}</span>? This cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={() => deleteTarget && handleDelete(deleteTarget)} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600">Remove</button>
        </div>
      </Modal>
    </div>
  );
}

// ── Patients Management ───────────────────────────────────────────────────────
const BLANK_PATIENT: Omit<Patient,'id'> = {
  name:'', email:'', phone:'', dateOfBirth:'', gender:'Male',
  status:'active', registeredAt: new Date().toISOString().split('T')[0], assignedDoctorId:'',
};

function PatientsView({ patients, setPatients, doctors }: {
  patients: Patient[]; setPatients: (p: Patient[]) => void; doctors: Doctor[];
}) {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newPat, setNewPat] = useState<Omit<Patient,'id'>>(BLANK_PATIENT);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    const pat: Patient = { ...newPat, id: `p${Date.now()}` };
    const updated = [...patients, pat];
    setPatients(updated); savePatients(updated);
    setAddOpen(false); setNewPat(BLANK_PATIENT); toast.success('Patient added');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-slate-800">Manage Patients</h2>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full max-w-sm rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Gender</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Assigned Doctor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const doc = doctors.find(d => d.id === p.assignedDoctorId);
                return (
                  <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.email}</td>
                    <td className="py-3 px-4 text-slate-600">{p.phone}</td>
                    <td className="py-3 px-4 text-slate-600">{p.gender}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{doc?.name ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Patient">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Name"  value={newPat.name}  onChange={v => setNewPat(f=>({...f,name:v}))} />
          <Field label="Email" value={newPat.email} onChange={v => setNewPat(f=>({...f,email:v}))} />
          <Field label="Phone" value={newPat.phone} onChange={v => setNewPat(f=>({...f,phone:v}))} />
          <Field label="Date of Birth" value={newPat.dateOfBirth} onChange={v => setNewPat(f=>({...f,dateOfBirth:v}))} type="date" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Gender</label>
            <select value={newPat.gender} onChange={e => setNewPat(f=>({...f,gender:e.target.value}))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Assign Doctor</label>
            <select value={newPat.assignedDoctorId} onChange={e => setNewPat(f=>({...f,assignedDoctorId:e.target.value}))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
              <option value="">— None —</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm hover:bg-primary-600"><Save className="w-4 h-4"/>Add</button>
        </div>
      </Modal>
    </div>
  );
}

// ── Feedback View ─────────────────────────────────────────────────────────────
function FeedbackView({ appointments, doctors }: { appointments: Appointment[]; doctors: Doctor[] }) {
  const rated = appointments.filter(a => a.rating != null);
  const avg = rated.length ? (rated.reduce((s,a) => s + (a.rating??0), 0) / rated.length).toFixed(1) : '—';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Patient Feedback</h2>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-amber-700 text-lg">{avg}</span>
          <span className="text-amber-600 text-sm">avg / 5</span>
        </div>
      </div>
      {rated.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">No feedback yet</div>
      ) : (
        <div className="grid gap-4">
          {rated.map(a => {
            const doc = doctors.find(d => d.id === a.doctorId);
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-slate-700">{doc?.name ?? a.doctorName}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-500 text-xs">{doc?.specialty}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-500 text-xs">Patient: {a.patientId}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-500 text-xs">{a.date}</span>
                    </div>
                    <span className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s<=(a.rating??0)?'fill-amber-400 text-amber-400':'text-slate-200'}`} />
                      ))}
                    </span>
                    {a.ratingComment && <p className="text-sm text-slate-600 italic">"{a.ratingComment}"</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Revenue View ──────────────────────────────────────────────────────────────
function RevenueView({ doctors, appointments }: { doctors: Doctor[]; appointments: Appointment[] }) {
  const rows = doctors.map(d => {
    const count = appointments.filter(a => a.doctorId === d.id && a.status !== 'cancelled').length;
    return { ...d, count, revenue: count * d.consultationFee };
  }).sort((a,b) => b.revenue - a.revenue);

  const total = rows.reduce((s,r) => s + r.revenue, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Revenue Control</h2>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
          <IndianRupee className="w-5 h-5 text-green-600" />
          <span className="font-bold text-green-700 text-lg">₹{total.toLocaleString()}</span>
          <span className="text-green-600 text-sm">total</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Doctor</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Specialty</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Fee/Visit</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Appointments</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-700">{r.name}</td>
                  <td className="py-3 px-4 text-slate-600">{r.specialty}</td>
                  <td className="py-3 px-4 text-slate-600">₹{r.consultationFee}</td>
                  <td className="py-3 px-4 text-slate-600">{r.count}</td>
                  <td className="py-3 px-4 font-semibold text-green-700">₹{r.revenue.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td colSpan={4} className="py-3 px-4 font-bold text-slate-700">Total</td>
                <td className="py-3 px-4 font-bold text-green-700">₹{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── nav config ────────────────────────────────────────────────────────────────
type View = 'overview' | 'doctors' | 'patients' | 'feedback' | 'revenue';
const adminNav = [
  { key: 'overview', label: 'Overview',  icon: <LayoutDashboard className="w-4 h-4"/> },
  { key: 'doctors',  label: 'Doctors',   icon: <Stethoscope     className="w-4 h-4"/> },
  { key: 'patients', label: 'Patients',  icon: <Users           className="w-4 h-4"/> },
  { key: 'feedback', label: 'Feedback',  icon: <MessageSquare   className="w-4 h-4"/> },
  { key: 'revenue',  label: 'Revenue',   icon: <IndianRupee     className="w-4 h-4"/> },
] as const;

// ── main export ───────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const { appointments } = useContext(AppointmentsContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<View>('overview');
  const [doctors,  setDoctors]  = useState<Doctor[]>(loadDoctors);
  const [patients, setPatients] = useState<Patient[]>(loadPatients);

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8eef5' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200 shadow-sm" style={{ backgroundColor: '#dce4ee' }}>
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-white/50" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-slate-800">Medi<span className="text-primary-500">Care+</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <>
        <aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-white border-r border-slate-100">
          <div className="px-4 pt-5 pb-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Administration</p>
          </div>
          <nav className="flex flex-col gap-0.5 p-3">
            {adminNav.map(item => (
              <button key={item.key} onClick={() => setView(item.key as View)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${view === item.key ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-[#f0f8fa] hover:text-primary-600'}`}>
                <span className={view === item.key ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="relative w-60 bg-white h-full flex flex-col shadow-xl">
              <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Admin Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"><X className="w-5 h-5"/></button>
              </div>
              <nav className="flex flex-col gap-0.5 p-3">
                {adminNav.map(item => (
                  <button key={item.key} onClick={() => { setView(item.key as View); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${view === item.key ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-[#f0f8fa] hover:text-primary-600'}`}>
                    <span className={view === item.key ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}
      </>

      <main className="pt-16 md:pl-60">
        <div className="p-4 md:p-6 max-w-6xl">
          {view === 'overview' && <OverviewView doctors={doctors} patients={patients} appointments={appointments} />}
          {view === 'doctors'  && <DoctorsView  doctors={doctors} setDoctors={setDoctors} appointments={appointments} />}
          {view === 'patients' && <PatientsView patients={patients} setPatients={setPatients} doctors={doctors} />}
          {view === 'feedback' && <FeedbackView appointments={appointments} doctors={doctors} />}
          {view === 'revenue'  && <RevenueView  doctors={doctors} appointments={appointments} />}
        </div>
      </main>
    </div>
  );
}
