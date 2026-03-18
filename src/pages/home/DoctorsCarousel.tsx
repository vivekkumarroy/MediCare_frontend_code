import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { fetchDoctors } from '@/data/fetchers';
import { Button } from '@/components/ui';

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-52 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 mx-2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-3 mx-4" />
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg mt-4" />
    </div>
  );
}

export function DoctorsCarousel() {
  const { data: doctors, isLoading } = useQuery({ queryKey: ['doctors'], queryFn: fetchDoctors });
  const displayed = doctors?.slice(0, 8) ?? [];

  return (
    <section id="doctors" className="py-20 px-6" style={{ backgroundColor: '#e8e4d9' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Our Team</span>
            <h2 className="text-3xl font-bold text-navy dark:text-white mt-1">Meet Our Doctors</h2>
          </div>
          <Link to="/doctors" className="hidden sm:block">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  whileHover={{ y: -3 }}
                  className="flex-shrink-0 w-52 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover p-5 flex flex-col items-center text-center transition-shadow"
                >
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#d4ecf2] mb-3"
                  />
                  <h3 className="font-semibold text-navy dark:text-white text-sm leading-tight mb-0.5">{doctor.name}</h3>
                  <p className="text-primary-600 text-xs font-medium mb-1">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                    <MapPin size={10} />
                    <span className="truncate max-w-[110px]">{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={11} className={j < Math.round(doctor.rating) ? 'text-amber-400' : 'text-slate-200'} fill={j < Math.round(doctor.rating) ? 'currentColor' : 'none'} />
                    ))}
                    <span className="text-slate-400 text-xs ml-1">{doctor.rating.toFixed(1)}</span>
                  </div>
                  <Link to={`/booking?doctorId=${doctor.id}`} className="w-full">
                    <Button size="sm" className="w-full text-xs">Book Now</Button>
                  </Link>
                </motion.div>
              ))}
        </motion.div>

        <div className="text-center mt-6 sm:hidden">
          <Link to="/doctors"><Button variant="outline" size="sm">View All Doctors</Button></Link>
        </div>
      </div>
    </section>
  );
}
