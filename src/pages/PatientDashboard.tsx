import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CheckCircle, XCircle, Clock, BookOpen, FileText, Phone, Star, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { StatsCard } from "@/components/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { fetchPrescriptions } from "@/data/fetchers";
import type { Appointment, Prescription } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function Box({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

function ProfileCard() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4a9ead] to-[#2d7a8a] flex items-center justify-center text-white text-xl font-bold shrink-0">
        {getInitials(user.name)}
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.phone && <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3.5 h-3.5" />{user.phone}</p>}
        <div className="mt-2"><Badge variant="default" label={user.role} /></div>
      </div>
    </Card>
  );
}

function MainView({ appointments, prescriptions, prescriptionsLoading }: { appointments: Appointment[]; prescriptions: Prescription[]; prescriptionsLoading: boolean }) {
  const navigate = useNavigate();
  const { cancelAppointment } = useAppointments();
  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const completed = appointments.filter((a) => a.status === "completed");
  const cancelled = appointments.filter((a) => a.status === "cancelled");
  const cols = [
    { key: "doctorName", label: "Doctor" },
    { key: "specialty", label: "Specialty" },
    { key: "date", label: "Date", render: (r: Appointment) => formatDate(r.date) },
    { key: "time", label: "Time" },
    { key: "status", label: "Status", render: (r: Appointment) => <Badge variant={r.status} label={r.status} /> },
    { key: "action", label: "", render: (r: Appointment) => r.status === "upcoming" ? <Button variant="danger" size="sm" onClick={() => cancelAppointment(r.id)}>Cancel</Button> : null },
  ];
  return (
    <div className="space-y-6">
      <ProfileCard />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate("/booking")}><BookOpen className="w-4 h-4" />Book Appointment</Button>
        <Button variant="secondary" onClick={() => navigate("/dashboard/prescriptions")}><FileText className="w-4 h-4" />Prescriptions</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<CalendarDays className="w-5 h-5" />} label="Total" value={appointments.length} color="bg-blue-500" />
        <StatsCard icon={<Clock className="w-5 h-5" />} label="Upcoming" value={upcoming.length} color="bg-indigo-500" />
        <StatsCard icon={<CheckCircle className="w-5 h-5" />} label="Completed" value={completed.length} color="bg-green-500" />
        <StatsCard icon={<XCircle className="w-5 h-5" />} label="Cancelled" value={cancelled.length} color="bg-red-500" />
      </div>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
        <Table<Appointment & Record<string, unknown>> columns={cols as never} data={upcoming as (Appointment & Record<string, unknown>)[]} />
      </Card>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Prescriptions</h3>
        {prescriptionsLoading ? (
          <div className="grid sm:grid-cols-3 gap-4">{[1,2,3].map(i => <Box key={i} className="h-32" />)}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.slice(0, 3).map((rx) => (
              <Card key={rx.id}>
                <p className="font-semibold text-gray-900">{rx.medication}</p>
                <p className="text-sm text-gray-500 mt-1">{rx.dosage}</p>
                <p className="text-xs text-gray-400 mt-2">{rx.doctorName}</p>
                <p className="text-xs text-gray-400">{formatDate(rx.issuedAt)}</p>
              </Card>
            ))}
            {prescriptions.length === 0 && <p className="text-gray-500 text-sm col-span-3">No prescriptions found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentsView({ appointments }: { appointments: Appointment[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { cancelAppointment } = useAppointments();
  const filtered = useMemo(() => appointments.filter((a) => {
    const q = search.toLowerCase();
    return (!search || a.doctorName.toLowerCase().includes(q) || a.specialty.toLowerCase().includes(q))
      && (statusFilter === "all" || a.status === statusFilter);
  }), [appointments, search, statusFilter]);
  const cols = [
    { key: "doctorName", label: "Doctor" },
    { key: "specialty", label: "Specialty" },
    { key: "date", label: "Date", render: (r: Appointment) => formatDate(r.date) },
    { key: "time", label: "Time" },
    { key: "status", label: "Status", render: (r: Appointment) => <Badge variant={r.status} label={r.status} /> },
    { key: "action", label: "", render: (r: Appointment) => r.status === "upcoming" ? <Button variant="danger" size="sm" onClick={() => cancelAppointment(r.id)}>Cancel</Button> : null },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">My Appointments</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9ead]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9ead]">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Card><Table<Appointment & Record<string, unknown>> columns={cols as never} data={filtered as (Appointment & Record<string, unknown>)[]} /></Card>
    </div>
  );
}

function HistoryView({ appointments }: { appointments: Appointment[] }) {
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Appointment History</h2>
      {past.length === 0 ? <p className="text-gray-500 text-sm">No past appointments.</p> : (
        <div className="flex flex-col gap-3">
          {past.map((a) => (
            <Card key={a.id} className="flex items-start gap-4">
              <div className={`w-2 self-stretch rounded-full shrink-0 ${a.status === "completed" ? "bg-green-400" : "bg-red-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{a.doctorName}</p>
                  <Badge variant={a.status} label={a.status} />
                </div>
                <p className="text-sm text-[#4a9ead]">{a.specialty}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(a.date)} - {a.time}</p>
                {a.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < a.rating! ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    ))}
                    {a.ratingComment && <span className="text-xs text-gray-400 ml-1">"{a.ratingComment}"</span>}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

function RatingView({ appointments }: { appointments: Appointment[] }) {
  const { rateAppointment } = useAppointments();
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState(0);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const completed = appointments.filter((a) => a.status === "completed" && !a.rating);
  function handleSubmit() {
    if (!selected || stars === 0) return;
    rateAppointment(selected, stars, comment);
    setSubmitted(true);
    setSelected(null); setStars(0); setComment(""); setHover(0);
    setTimeout(() => setSubmitted(false), 3000);
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Rate Your Doctor</h2>
      {completed.length === 0 ? <p className="text-gray-500 text-sm">No completed appointments to rate.</p> : (
        <div className="flex flex-col gap-3">
          {completed.map((a) => (
            <button key={a.id} onClick={() => { setSelected(a.id); setStars(0); setComment(""); }}
              className={`text-left p-4 rounded-xl border transition-all ${selected === a.id ? "border-[#4a9ead] bg-[#f0f9fb] ring-2 ring-[#4a9ead]/30" : "border-gray-200 bg-white hover:border-[#4a9ead]"}`}>
              <p className="font-semibold text-gray-900">{a.doctorName}</p>
              <p className="text-sm text-[#4a9ead]">{a.specialty}</p>
              <p className="text-xs text-gray-400">{formatDate(a.date)} - {a.time}</p>
            </button>
          ))}
        </div>
      )}
      {selected && (
        <Card className="space-y-4">
          <p className="font-semibold text-gray-800">Your Rating</p>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => {
              const val = i + 1;
              return (
                <button key={i} onMouseEnter={() => setHover(val)} onMouseLeave={() => setHover(0)} onClick={() => setStars(val)}>
                  <Star className={`w-8 h-8 transition-colors ${val <= (hover || stars) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                </button>
              );
            })}
            {(hover || stars) > 0 && <span className="text-sm font-medium text-[#4a9ead] ml-2">{LABELS[(hover || stars) - 1]}</span>}
          </div>
          <textarea rows={3} placeholder="Write your experience (optional)..." value={comment} onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9ead] resize-none" />
          <Button onClick={handleSubmit} disabled={stars === 0} className="bg-[#4a9ead] hover:bg-[#3a8e9d]">Submit Rating</Button>
          {submitted && <p className="text-green-600 text-sm font-medium">Rating submitted!</p>}
        </Card>
      )}
    </div>
  );
}

function PrescriptionsView({ prescriptions, loading }: { prescriptions: Prescription[]; loading: boolean }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">My Prescriptions</h2>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Box key={i} className="h-36" />)}</div>
      ) : prescriptions.length === 0 ? <p className="text-gray-500 text-sm">No prescriptions found.</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id}>
              <p className="font-semibold text-gray-900">{rx.medication}</p>
              <p className="text-sm text-gray-500 mt-1">{rx.dosage}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">{rx.doctorName}</p>
                <p className="text-xs text-gray-400">{formatDate(rx.issuedAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
      <Card className="max-w-md space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4a9ead] to-[#2d7a8a] flex items-center justify-center text-white text-xl font-bold">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <Badge variant="default" label={user.role} />
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <User className="w-4 h-4 text-[#4a9ead]" /><span className="font-medium">Name:</span>{user.name}
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FileText className="w-4 h-4 text-[#4a9ead]" /><span className="font-medium">Email:</span>{user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <Phone className="w-4 h-4 text-[#4a9ead]" /><span className="font-medium">Phone:</span>{user.phone}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function PatientDashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const { data: allPrescriptions = [], isLoading: prescriptionsLoading } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: fetchPrescriptions,
  });
  const prescriptions = useMemo(() => {
    if (!user) return [];
    const byUser = allPrescriptions.filter((rx) => rx.patientId === user.id);
    if (byUser.length > 0) return byUser;
    const firstId = allPrescriptions[0]?.patientId;
    return firstId ? allPrescriptions.filter((rx) => rx.patientId === firstId) : [];
  }, [allPrescriptions, user]);

  const path = location.pathname;
  let content: React.ReactNode;
  if (path === "/dashboard/appointments") content = <AppointmentsView appointments={appointments} />;
  else if (path === "/dashboard/history") content = <HistoryView appointments={appointments} />;
  else if (path === "/dashboard/rating") content = <RatingView appointments={appointments} />;
  else if (path === "/dashboard/prescriptions") content = <PrescriptionsView prescriptions={prescriptions} loading={prescriptionsLoading} />;
  else if (path === "/dashboard/profile") content = <ProfileView />;
  else content = <MainView appointments={appointments} prescriptions={prescriptions} prescriptionsLoading={prescriptionsLoading} />;

  return (
    <Layout showSidebar sidebarRole="patient">
      <div className="p-4 md:p-6 max-w-6xl mx-auto">{content}</div>
    </Layout>
  );
}
