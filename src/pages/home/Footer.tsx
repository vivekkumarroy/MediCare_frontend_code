import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
  { label: 'OPD', to: '/services/opd' },
  { label: 'Laboratory', to: '/services/lab' },
  { label: 'Emergency', to: '/services/emergency' },
  { label: 'Pharmacy', to: '/services/pharmacy' },
];

export function Footer() {
  return (
    <footer className="bg-navy text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-white font-bold">Medi<span className="text-primary-400">Care+</span></span>
            </div>
            <p className="text-sm leading-relaxed">Your trusted partner in health. Quality care, anytime, anywhere.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 shrink-0 text-primary-400" />
                123 Health Avenue, Medical City, NY 10001
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 text-primary-400" />
                <a href="tel:+18005551234" className="hover:text-white transition-colors">+1 (800) 555-1234</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="shrink-0 text-primary-400" />
                <a href="mailto:info@medicare.com" className="hover:text-white transition-colors">info@medicare.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} MediCare+. All rights reserved.</span>
          <span>Built with care for better health</span>
        </div>
      </div>
    </footer>
  );
}
