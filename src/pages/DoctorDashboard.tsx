import { useContext, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays, Star, User,
  Menu, LogOut, Heart, Stethoscope, MapPin, Building2,
  DoorOpen, Clock, TrendingUp, CheckCircle, XCircle, Calendar,
  Pencil,
} from 'lucide-react';import { AuthContext } from '@/context/AuthContext';
import { AppointmentsContext } from '@/context/AppointmentsContext';
import { Sidebar } from '@/components/layout/Sidebar';
import doctorsData from '@/data/doctors.json';
import type { Appointment } from '@/types';

// ── helpers ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
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

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const map = {
    upcoming:  'bg-blue-50 text-blue-700 border border-blue-200',
    completed: 'bg-green-50 text-green-700 border border-green-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </span>
  );
}

// ── views ─────────────────────────────────────────────────────────────────────
function MainView({ appointments, doctorName }: { appointments: Appointment[]; doctorName: string }) {
  const total     = appointments.length;
  const upcoming  = appointments.filter((a) => a.status === 'upcoming').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
  const recent = [...appointments].filter((a) => a.status === 'upcoming').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Welcome, {doctorName}</h2>
        <p className="text-sm text-slate-500 mt-0.5">Here's your appointment overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Appointments" value={total}     icon={<CalendarDays className="w-6 h-6 text-white" />} color="bg-primary-500" />
        <StatCard label="Upcoming"           value={upcoming}  icon={<TrendingUp    className="w-6 h-6 text-white" />} color="bg-blue-500"    />
        <StatCard label="Completed"          value={completed} icon={<CheckCircle   className="w-6 h-6 text-white" />} color="bg-green-500"   />
        <StatCard label="Cancelled"          value={cancelled} icon={<XCircle       className="w-6 h-6 text-white" />} color="bg-red-400"     />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Recent Appointments</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No appointments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Patient ID</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Specialty</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Date</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Time</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{a.patientId}</td>
                    <td className="py-2.5 px-3 text-slate-600">{a.specialty}</td>
                    <td className="py-2.5 px-3 text-slate-600">{a.date}</td>
                    <td className="py-2.5 px-3 text-slate-600">{a.time}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentsView({ appointments }: { appointments: Appointment[] }) {
  const { completeAppointment } = useContext(AppointmentsContext);
  const [filter, setFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const filtered = appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-slate-800">My Appointments</h2>
        <div className="flex gap-2">
          {(['upcoming', 'completed'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${filter === s ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">No {filter} appointments</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Patient ID</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Specialty</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Notes</th>
                  {filter === 'upcoming' && <th className="text-left py-3 px-4 text-slate-500 font-medium">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">{a.patientId}</td>
                    <td className="py-3 px-4 text-slate-600">{a.specialty}</td>
                    <td className="py-3 px-4 text-slate-600">{a.date}</td>
                    <td className="py-3 px-4 text-slate-600">{a.time}</td>
                    <td className="py-3 px-4"><StatusBadge status={a.status} /></td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{a.notes || '—'}</td>
                    {filter === 'upcoming' && (
                      <td className="py-3 px-4">
                        <button
                          onClick={() => completeAppointment(a.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-medium hover:bg-green-100 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryView({ appointments }: { appointments: Appointment[] }) {
  const past = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Appointment History</h2>
      {past.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">No history yet</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Patient ID</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Specialty</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {past.map((a) => (
                  <tr key={a.id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">{a.patientId}</td>
                    <td className="py-3 px-4 text-slate-600">{a.specialty}</td>
                    <td className="py-3 px-4 text-slate-600">{a.date}</td>
                    <td className="py-3 px-4 text-slate-600">{a.time}</td>
                    <td className="py-3 px-4"><StatusBadge status={a.status} /></td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{a.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function RatingsView({ appointments }: { appointments: Appointment[] }) {
  const rated = appointments.filter((a) => a.rating != null);
  const avg = rated.length ? (rated.reduce((s, a) => s + (a.rating ?? 0), 0) / rated.length).toFixed(1) : '—';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Patient Ratings & Feedback</h2>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-amber-700 text-lg">{avg}</span>
          <span className="text-amber-600 text-sm">/ 5</span>
        </div>
      </div>

      {rated.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">No ratings yet</div>
      ) : (
        <div className="grid gap-4">
          {rated.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-700">Patient: {a.patientId}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-slate-500 text-xs">{a.date}</span>
                  </div>
                  <Stars rating={a.rating ?? 0} />
                  {a.ratingComment && (
                    <p className="mt-2 text-sm text-slate-600 italic">"{a.ratingComment}"</p>
                  )}
                </div>
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStorageKey(userId: string) { return `hms_doctor_profile_${userId}`; }

function ProfileView({ user }: { user: { id: string; name: string; email: string; phone?: string; avatarUrl?: string; doctorId?: string } }) {
  const baseDoctor = (doctorsData as unknown as { id: string; name: string; specialty: string; department: string; location: string; hospitalName: string; cabin: string; consultationFee: number; bio: string; avatarUrl: string; rating: number; experience: number; availableDays: string[] }[])
    .find((d) => d.name === user.name);

  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(user.id));
      if (stored) return JSON.parse(stored).avatarUrl || user.avatarUrl || '';
    } catch { /* ignore */ }
    return user.avatarUrl || '';
  });

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      localStorage.setItem(getStorageKey(user.id), JSON.stringify({ avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">My Profile</h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {/* Avatar — click to change */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative group cursor-pointer">
            <img
              src={avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary-100"
            />
            <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Pencil className="w-5 h-5 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
            <p className="text-primary-600 font-medium text-sm">{baseDoctor?.specialty ?? 'Doctor'}</p>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <p className="text-xs text-slate-400 mt-1">Click photo to change</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <InfoRow icon={<Stethoscope className="w-4 h-4" />} label="Specialty"   value={baseDoctor?.specialty ?? '—'} />
          <InfoRow icon={<Building2   className="w-4 h-4" />} label="Department"  value={baseDoctor?.department ?? '—'} />
          <InfoRow icon={<MapPin      className="w-4 h-4" />} label="Location"    value={baseDoctor?.location ?? '—'} />
          <InfoRow icon={<Building2   className="w-4 h-4" />} label="Hospital"    value={baseDoctor?.hospitalName ?? '—'} />
          <InfoRow icon={<DoorOpen    className="w-4 h-4" />} label="Cabin"       value={baseDoctor?.cabin ?? '—'} />
          <InfoRow icon={<Clock       className="w-4 h-4" />} label="Experience"  value={baseDoctor ? `${baseDoctor.experience} years` : '—'} />
          <InfoRow icon={<Star        className="w-4 h-4" />} label="Rating"      value={baseDoctor ? `${baseDoctor.rating} / 5` : '—'} />
          <InfoRow icon={<Heart       className="w-4 h-4" />} label="Consult Fee" value={baseDoctor ? `₹${baseDoctor.consultationFee}` : '—'} />
          <InfoRow icon={<Calendar    className="w-4 h-4" />} label="Available"   value={baseDoctor?.availableDays.join(', ') ?? '—'} />
          <InfoRow icon={<User        className="w-4 h-4" />} label="Phone"       value={user.phone ?? '—'} />
        </div>

        {baseDoctor?.bio && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">About</p>
            <p className="text-sm text-slate-600 leading-relaxed">{baseDoctor.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
      <span className="text-primary-500 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-slate-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const { appointments } = useContext(AppointmentsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  // Match appointments strictly by doctorId from the user's linked doctorId
  const myAppointments = appointments.filter(
    (a) => a.doctorId === user.doctorId
  );

  const path = location.pathname;

  function renderView() {
    if (path === '/doctor/appointments') return <AppointmentsView appointments={myAppointments} />;
    if (path === '/doctor/history')      return <HistoryView      appointments={myAppointments} />;
    if (path === '/doctor/ratings')      return <RatingsView      appointments={myAppointments} />;
    if (path === '/doctor/profile')      return <ProfileView      user={user!} />;
    return <MainView appointments={myAppointments} doctorName={user!.name} />;
  }

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
          <img src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-primary-200" />
          <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      <Sidebar role="doctor" currentPath={path} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-60">
        <div className="p-4 md:p-6 max-w-5xl">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
