import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  function scrollTo(id: string) {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    } else {
      navigate('/');
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
        else if (attempts++ < 10) setTimeout(tryScroll, 100);
      };
      setTimeout(tryScroll, 100);
    }
  }

  const serviceLinks = [
    { label: 'OPD', id: 'book-appointment' },
    { label: 'Laboratory', id: '' },
    { label: 'Emergency', id: '' },
    { label: 'Pharmacy', id: '' },
  ];

  return (
    <footer className="bg-navy text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-white font-bold">Medi<span className="text-primary-400">Care+</span></span>
            </Link>
            <p className="text-sm leading-relaxed">Your trusted partner in health. Quality care, anytime, anywhere.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm hover:text-white transition-colors"
                >Home</Link>
              </li>
              <li>
                <button onClick={() => scrollTo('doctors')} className="text-sm hover:text-white transition-colors">Doctors</button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="text-sm hover:text-white transition-colors">About</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  {l.id ? (
                    <button onClick={() => scrollTo(l.id)} className="text-sm hover:text-white transition-colors">{l.label}</button>
                  ) : (
                    <span className="text-sm">{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 shrink-0 text-primary-400" />
                MG Road, Bangalore – 560001, Karnataka, India
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 text-primary-400" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="shrink-0 text-primary-400" />
                <a href="mailto:support@medicare-plus.in" className="hover:text-white transition-colors">support@medicare-plus.in</a>
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
