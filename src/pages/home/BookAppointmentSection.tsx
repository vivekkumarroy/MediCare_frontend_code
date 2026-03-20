import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { fetchDoctors } from '@/data/fetchers';

// fallback IDs to show in the featured section
const FEATURED_IDS = ['d1', 'd2', 'd3'];

export function BookAppointmentSection() {
  const { data: allDoctors = [] } = useQuery({ queryKey: ['doctors'], queryFn: fetchDoctors });
  const featured = allDoctors.filter(d => FEATURED_IDS.includes(d.id));
  return (
    <section id="book-appointment" className="py-16 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Quick Booking</span>
            <h2 className="text-3xl font-extrabold text-[#1a2e3b] mt-1">Book an Appointment</h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Choose from our top-rated specialists and book your slot in seconds.
            </p>
          </div>
          <Link to="/doctors" className="hidden sm:block">
            <Button variant="outline" size="sm">View All Doctors</Button>
          </Link>
        </div>

        {/* Doctor cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {featured.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-5 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={doc.avatarUrl} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#d4ecf2]" />
                <div className="min-w-0">
                  <h3 className="font-bold text-[#1a2e3b] text-sm truncate">{doc.name}</h3>
                  <p className="text-primary-600 text-xs font-medium">{doc.specialty}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Available today
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><MapPin size={11} />{doc.location}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{doc.experience} yrs</span>
                <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{doc.rating}</span>
              </div>
              <Link to={`/booking?doctorId=${doc.id}`} className="mt-auto">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  <CalendarDays size={14} /> Book Appointment
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: '#e8eef5' }}>
          <div>
            <h3 className="font-bold text-[#1a2e3b] text-lg mb-1">Can't find the right doctor?</h3>
            <p className="text-slate-500 text-sm">Ask Dr. Shyra — our AI assistant will guide you to the perfect specialist.</p>
          </div>
          <Link to="/doctors">
            <Button variant="primary" size="lg">
              Browse All Doctors <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
