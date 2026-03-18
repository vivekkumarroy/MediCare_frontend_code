import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+91 98765 43210', '+91 11 2345 6789'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['support@medicare-plus.in', 'appointments@medicare-plus.in'],
  },
  {
    icon: MapPin,
    title: 'Head Office',
    lines: ['MG Road, Bangalore – 560001', 'Karnataka, India'],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon – Sat: 8:00 AM – 8:00 PM', 'Sunday: 10:00 AM – 4:00 PM'],
  },
];

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <section id="contact" className="py-20 px-4" style={{ backgroundColor: '#dce4ee' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#d0eaf0', color: '#4a9ead' }}
          >
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Contact Us</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Have a question or need help? We're here for you — reach out and we'll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactInfo.map(({ icon: Icon, title, lines }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex gap-4 items-start"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#d0eaf0' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#4a9ead' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{title}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-navy font-medium leading-snug">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#d0eaf0' }}
                >
                  <Send className="w-6 h-6" style={{ color: '#4a9ead' }} />
                </div>
                <h3 className="text-lg font-bold text-navy">Message Sent!</h3>
                <p className="text-slate-500 text-sm">Thanks for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    style={{ '--tw-ring-color': '#4a9ead' } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    style={{ '--tw-ring-color': '#4a9ead' } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none"
                    style={{ '--tw-ring-color': '#4a9ead' } as React.CSSProperties}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#4a9ead' }}
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
