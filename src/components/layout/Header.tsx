import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, Building2, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

const navLinks = [
  { label: 'Home', href: '/' },
];

const hospitalLocations = [
  {
    city: 'Bangalore',
    address: 'MG Road, Bangalore – 560001',
    hospitals: [
      'Apollo MediCare Hospital, Bangalore',
      'Manipal Hospital, Bangalore',
      'Fortis Hospital, Bannerghatta',
      'Narayana Health City, Bangalore',
      'Columbia Asia Hospital, Whitefield',
    ],
  },
  {
    city: 'Patna',
    address: 'Boring Road, Patna – 800001',
    hospitals: [
      'Patna MediCare Hospital',
      'AIIMS Patna',
      'Ruban Memorial Hospital',
      'Paras HMRI Hospital, Patna',
      'Big Apollo Spectra Hospital',
    ],
  },
  {
    city: 'Lucknow',
    address: 'Hazratganj, Lucknow – 226001',
    hospitals: [
      'Lucknow MediCare Hospital',
      'Medanta Hospital, Lucknow',
      'Sahara Hospital, Lucknow',
      'Charak Hospital & Research Centre',
      'Ram Manohar Lohia Hospital',
    ],
  },
  {
    city: 'Noida',
    address: 'Sector 18, Noida – 201301',
    hospitals: [
      'Noida MediCare Hospital',
      'Jaypee Hospital, Noida',
      'Felix Hospital, Noida',
      'Fortis Hospital, Noida',
      'Max Super Speciality Hospital, Noida',
    ],
  },
  {
    city: 'Gandhinagar',
    address: 'Sector 11, Gandhinagar – 382011',
    hospitals: [
      'Gandhinagar MediCare Hospital',
      'AIIMS Gandhinagar',
      'Civil Hospital, Gandhinagar',
      'Zydus Hospital, Ahmedabad',
      'Sterling Hospital, Ahmedabad',
    ],
  },
  {
    city: 'Kota',
    address: 'Talwandi, Kota – 324005',
    hospitals: [
      'Kota MediCare Hospital',
      'New Medical College Hospital, Kota',
      'Aravali Hospital, Kota',
      'Bombay Hospital, Kota',
      'Goyal Hospital & Research Centre',
    ],
  },
];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hospitalsOpen, setHospitalsOpen] = useState(false);
  const [activeCity, setActiveCity] = useState('Bangalore');
  const [aboutActive, setAboutActive] = useState(false);
  const [doctorsActive, setDoctorsActive] = useState(false);
  const hospitalsRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // After navigation completes, scroll to pending hash
  useEffect(() => {
    if (pendingScroll.current && location.pathname === '/') {
      const id = pendingScroll.current;
      pendingScroll.current = null;
      // Retry until element is available (page may still be rendering)
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });
        } else if (attempts < 10) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 100);
    }
  }, [location]);

  // Auto-update active nav item based on scroll position
  useEffect(() => {
    if (location.pathname !== '/') return;

    function getAbsoluteTop(el: HTMLElement) {
      return el.getBoundingClientRect().top + window.scrollY;
    }

    function onScroll() {
      const doctorsEl = document.getElementById('doctors');
      const aboutEl = document.getElementById('about');
      if (!doctorsEl || !aboutEl) return;

      const scrollY = window.scrollY + 150;
      const doctorsOffset = getAbsoluteTop(doctorsEl);
      const aboutOffset = getAbsoluteTop(aboutEl);

      // Doctors comes after About on the page
      if (scrollY >= doctorsOffset) {
        setDoctorsActive(true);
        setAboutActive(false);
      } else if (scrollY >= aboutOffset) {
        setAboutActive(true);
        setDoctorsActive(false);
      } else {
        setAboutActive(false);
        setDoctorsActive(false);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Clear active states when navigating away from home
  useEffect(() => {
    if (location.pathname !== '/') {
      setAboutActive(false);
      setDoctorsActive(false);
    }
  }, [location.pathname]);

  function scrollToSection(id: string) {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      pendingScroll.current = id;
      navigate('/');
    }
  }

  function handleDoctorsClick() {
    setDoctorsActive(true);
    setAboutActive(false);
    scrollToSection('doctors');
  }

  function handleAboutClick() {
    setAboutActive(true);
    setDoctorsActive(false);
    scrollToSection('about');
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (hospitalsRef.current && !hospitalsRef.current.contains(e.target as Node)) {
        setHospitalsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#cdd6e2]" style={{ backgroundColor: '#dce4ee' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setAboutActive(false);
            setDoctorsActive(false);
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-navy dark:text-white">
            Medi<span className="text-primary-500">Care+</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href && !doctorsActive && !aboutActive;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setAboutActive(false);
                  setDoctorsActive(false);
                  if (location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    navigate('/');
                  }
                }}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {link.label}
              </a>
            );
          })}

          <button
            onClick={handleAboutClick}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              aboutActive
                ? 'text-primary-600 bg-primary-50'
                : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            About
          </button>

          <button
            onClick={handleDoctorsClick}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              doctorsActive
                ? 'text-primary-600 bg-primary-50'
                : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            Doctors
          </button>

          {/* Hospitals dropdown */}
          <div ref={hospitalsRef} className="relative">
            <button
              onClick={() => setHospitalsOpen((o) => !o)}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                hospitalsOpen
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
              )}
            >
              <Building2 size={14} className="shrink-0" />
              Hospitals
              <ChevronDown size={13} className={`transition-transform ${hospitalsOpen ? 'rotate-180' : ''}`} />
            </button>

            {hospitalsOpen && (
              <div className="absolute left-0 top-full mt-2 w-[520px] bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden flex">
                {/* City list */}
                <div className="w-44 bg-slate-50 border-r border-slate-100 py-2 shrink-0">
                  <p className="px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Cities</p>
                  {hospitalLocations.map(({ city }) => (
                    <button
                      key={city}
                      onMouseEnter={() => setActiveCity(city)}
                      onClick={() => { setHospitalsOpen(false); navigate(`/doctors?location=${encodeURIComponent(city)}`); }}
                      className={cn(
                        'w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors text-sm font-medium',
                        activeCity === city
                          ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                          : 'text-slate-600 hover:bg-white hover:text-primary-600'
                      )}
                    >
                      <MapPin size={12} className="shrink-0 text-primary-400" />
                      {city}
                    </button>
                  ))}
                </div>

                {/* Hospital list for active city */}
                <div className="flex-1 py-3 px-2">
                  {hospitalLocations.filter((h) => h.city === activeCity).map(({ city, address, hospitals }) => (
                    <div key={city}>
                      <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{city} · {address}</p>
                      {hospitals.map((name) => (
                        <button
                          key={name}
                          onClick={() => { setHospitalsOpen(false); navigate(`/doctors?location=${encodeURIComponent(city)}`); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-left group"
                        >
                          <div className="w-6 h-6 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
                            <Building2 size={11} className="text-primary-500" />
                          </div>
                          <span className="text-sm text-slate-700 group-hover:text-primary-600 font-medium leading-tight">{name}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                    {getInitials(user.name)}
                  </span>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#dce4ee' }}>
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-lg text-navy dark:text-white">
                Medi<span className="text-primary-500">Care+</span>
              </span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setAboutActive(false);
                  setDoctorsActive(false);
                  setMobileOpen(false);
                  if (location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    navigate('/');
                  }
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              className="px-4 py-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-medium text-left"
              onClick={() => { setMobileOpen(false); handleDoctorsClick(); }}
            >
              Doctors
            </button>
            <button
              className="px-4 py-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-medium text-left"
              onClick={() => { setMobileOpen(false); handleAboutClick(); }}
            >
              About
            </button>
          </nav>
          <div className="flex flex-col gap-2 p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
            {isAuthenticated && user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor' : '/dashboard'} onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">Dashboard</Button>
                </Link>
                <Button variant="danger" className="w-full justify-center" onClick={() => { logout(); setMobileOpen(false); }}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Sign in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
