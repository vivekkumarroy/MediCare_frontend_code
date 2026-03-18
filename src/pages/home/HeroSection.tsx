import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, CalendarDays, HeartPulse, Stethoscope, Building2, ArrowRight } from 'lucide-react';

const quickActions = [
  { icon: CalendarDays, label: 'Book Appointment', to: '/booking' },
  { icon: Stethoscope,  label: 'Find a Doctor',    to: '/doctors' },
  { icon: HeartPulse,   label: 'Health Check',     to: '/doctors?search=General' },
  { icon: Building2,    label: 'Get Expert Opinion', to: '/doctors' },
];

export function HeroSection() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/doctors?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '560px' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&q=85"
          alt="Dr. Shyra"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1600&q=85';
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,40,55,0.62) 0%, rgba(10,40,55,0.48) 50%, rgba(10,40,55,0.75) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-0" style={{ minHeight: '560px' }}>
        {/* Headline */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-sm font-medium">Dr. Shyra — AI Health Assistant is Online</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg mb-3">
            Your Health, Our Priority
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Search doctors, book appointments, or chat with Dr. Shyra instantly.
          </p>
        </div>

        {/* Glassmorphism search + actions */}
        <div className="w-full max-w-2xl">
          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex rounded-2xl overflow-hidden shadow-2xl mb-6 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: focused
                ? '1.5px solid rgba(74,158,173,0.85)'
                : '1px solid rgba(255,255,255,0.3)',
              boxShadow: focused
                ? '0 0 0 3px rgba(74,158,173,0.25), 0 8px 32px rgba(0,0,0,0.2)'
                : '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search For Doctors, Specialities And Health Checkups..."
                className="w-full pl-12 pr-4 py-4 text-sm text-white bg-transparent focus:outline-none placeholder:text-white font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-5 flex items-center justify-center transition-colors shrink-0 rounded-r-2xl"
              style={{ backgroundColor: '#4a9ead' }}
            >
              <Search size={18} className="text-white" />
            </button>
          </form>

          {/* Quick action buttons — separated glass card */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.22)',
            }}
          >
            {quickActions.map(({ icon: Icon, label, to }, i) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-2.5 px-4 py-3.5 hover:bg-white/20 transition-all duration-200 text-xs font-semibold text-white group ${
                  i < quickActions.length - 1 ? 'border-r border-white/20' : ''
                }`}
              >
                <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#4a9ead]/60" style={{ background: 'rgba(74,158,173,0.25)' }}>
                  <Icon size={13} style={{ color: '#7dd3e0' }} />
                </span>
                <span className="truncate">{label}</span>
                <ArrowRight size={11} className="ml-auto text-white/40 shrink-0 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
