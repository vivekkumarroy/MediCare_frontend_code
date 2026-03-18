import { Link } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, FileText, BookOpen,
  User, Users, Stethoscope, Settings, X, History, Star,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface NavItem { label: string; href: string; icon: React.ReactNode; }

const patientNav: NavItem[] = [
  { label: 'Dashboard',        href: '/dashboard',               icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Appointments',  href: '/dashboard/appointments',  icon: <CalendarDays className="w-4 h-4" /> },
  { label: 'History',          href: '/dashboard/history',       icon: <History className="w-4 h-4" /> },
  { label: 'Rate Doctor',      href: '/dashboard/rating',        icon: <Star className="w-4 h-4" /> },
  { label: 'Prescriptions',    href: '/dashboard/prescriptions', icon: <FileText className="w-4 h-4" /> },
  { label: 'Book Appointment', href: '/booking',                 icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Profile',          href: '/dashboard/profile',       icon: <User className="w-4 h-4" /> },
];

const doctorNav: NavItem[] = [
  { label: 'Dashboard',    href: '/doctor',              icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <CalendarDays    className="w-4 h-4" /> },
  { label: 'History',      href: '/doctor/history',      icon: <History         className="w-4 h-4" /> },
  { label: 'Ratings',      href: '/doctor/ratings',      icon: <Star            className="w-4 h-4" /> },
  { label: 'Profile',      href: '/doctor/profile',      icon: <User            className="w-4 h-4" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard',    href: '/admin',              icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Patients',     href: '/admin/patients',     icon: <Users className="w-4 h-4" /> },
  { label: 'Doctors',      href: '/doctors',            icon: <Stethoscope className="w-4 h-4" /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <CalendarDays className="w-4 h-4" /> },
  { label: 'Settings',     href: '/admin/settings',     icon: <Settings className="w-4 h-4" /> },
];

interface SidebarProps {
  role: 'patient' | 'doctor' | 'admin';
  currentPath: string;
  isOpen?: boolean;
  onClose?: () => void;
}

function NavList({ items, currentPath, onClose }: { items: NavItem[]; currentPath: string; onClose?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {items.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-primary-500 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-[#f0f8fa] dark:hover:bg-slate-800 hover:text-primary-600'
            )}
          >
            <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ role, currentPath, isOpen = false, onClose }: SidebarProps) {
  const items = role === 'admin' ? adminNav : role === 'doctor' ? doctorNav : patientNav;

  return (
    <>
      <aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800">
        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            {role === 'admin' ? 'Administration' : role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
          </p>
        </div>
        <NavList items={items} currentPath={currentPath} />
      </aside>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
          <aside className="relative w-60 bg-white dark:bg-slate-950 h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {role === 'admin' ? 'Admin Menu' : role === 'doctor' ? 'Doctor Menu' : 'My Account'}
              </span>
              <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavList items={items} currentPath={currentPath} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
