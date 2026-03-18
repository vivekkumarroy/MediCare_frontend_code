import {
  CalendarCheck,
  ShieldCheck,
  Stethoscope,
  BrainCircuit,
  ClipboardList,
  Star,
  Users,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: CalendarCheck,
    title: 'Easy Appointment Booking',
    desc: 'Book appointments with top doctors in just a few clicks — choose your specialist, pick a date and time, and confirm instantly.',
  },
  {
    icon: Stethoscope,
    title: 'Verified Specialist Doctors',
    desc: 'Browse profiles of experienced, verified doctors across multiple specialties with real patient ratings and reviews.',
  },
  {
    icon: BrainCircuit,
    title: 'Dr. Shyra AI Assistant',
    desc: 'Our intelligent AI chatbot helps you understand symptoms, suggests the right specialist, and answers health queries 24/7.',
  },
  {
    icon: ClipboardList,
    title: 'Patient Dashboard',
    desc: 'Track all your appointments, view history, manage prescriptions, and rate your doctors — all from one place.',
  },
  {
    icon: BarChart3,
    title: 'Doctor Dashboard',
    desc: 'Doctors get a dedicated workspace to manage their schedule, view patient details, mark completions, and track feedback.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Control Panel',
    desc: 'Admins can manage doctors and patients, monitor revenue, view all feedback, and control the entire platform.',
  },
  {
    icon: Star,
    title: 'Ratings & Feedback',
    desc: 'Patients can rate and review their experience after each appointment, helping others make informed decisions.',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    desc: 'Separate, secure dashboards for patients, doctors, and admins — each with role-specific features and permissions.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4" style={{ backgroundColor: '#e8eef5' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#d0eaf0', color: '#4a9ead' }}
          >
            About MediCare+
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Everything you need for smarter healthcare
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
            MediCare+ is a modern hospital management platform built to make healthcare
            accessible, transparent, and efficient — for patients, doctors, and administrators alike.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: '#d0eaf0' }}
              >
                <Icon className="w-5 h-5" style={{ color: '#4a9ead' }} />
              </div>
              <h3 className="font-semibold text-navy text-sm mb-2">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="mt-14 text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border"
            style={{ backgroundColor: '#f0f8fa', borderColor: '#c2dfe6' }}
          >
            <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: '#4a9ead' }} />
            <p className="text-sm text-slate-600">
              Trusted by <span className="font-semibold text-navy">10,000+ patients</span> across India —
              secure, private, and always available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
