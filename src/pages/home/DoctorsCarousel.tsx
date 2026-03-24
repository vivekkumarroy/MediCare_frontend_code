import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchDoctors } from '@/data/fetchers';
import { Button } from '@/components/ui';
import { useState, useRef } from 'react';

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

function DoctorCardItem({ doctor }: { doctor: ReturnType<typeof Array.prototype.find> }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card p-5 flex flex-col items-center text-center w-full">
      <img
        src={doctor.avatarUrl}
        alt={doctor.name}
        className="w-14 h-14 rounded-full object-cover border-2 border-[#d4ecf2] mb-3"
      />
      <h3 className="font-semibold text-navy dark:text-white text-sm leading-tight mb-0.5">{doctor.name}</h3>
      <p className="text-primary-600 text-xs font-medium mb-1">{doctor.specialty}</p>
      <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
        <MapPin size={10} />
        <span className="truncate max-w-[160px]">{doctor.location}</span>
      </div>
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} size={11} className={j < Math.round(doctor.rating) ? 'text-amber-400' : 'text-slate-200'} fill={j < Math.round(doctor.rating) ? 'currentColor' : 'none'} />
        ))}
        <span className="text-slate-400 text-xs ml-1">{doctor.rating.toFixed(1)}</span>
      </div>
      <Link to={`/booking?doctorId=${doctor.id}`} className="w-full">
        <Button size="sm" className="w-full text-xs text-center justify-center">Book Now</Button>
      </Link>
    </div>
  );
}

export function DoctorsCarousel() {
  const { data: doctors, isLoading } = useQuery({ queryKey: ['doctors'], queryFn: fetchDoctors });
  const displayed = doctors?.slice(0, 8) ?? [];

  // Single state so dir and index always update together — no stale animation direction
  const [slide, setSlide] = useState({ index: 0, dir: 1 });
  const { index: current, dir } = slide;

  const atStart = current === 0;
  const atEnd = current === displayed.length - 1;

  const prev = () => {
    if (atStart) return;
    setSlide({ index: current - 1, dir: -1 });
  };
  const next = () => {
    if (atEnd) return;
    setSlide({ index: current + 1, dir: 1 });
  };

  // Touch swipe — separate from animation so they never interfere
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

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

        {/* Desktop: horizontal scroll (unchanged) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="hidden sm:flex overflow-x-auto gap-4 pb-4 -mx-2 px-2"
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

        {/* Mobile: one card at a time with arrows + swipe */}
        <div className="sm:hidden">
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <div
              className="relative overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div
                  key={current}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                >
                  <DoctorCardItem doctor={displayed[current]} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Dot indicator */}
          {!isLoading && (
            <div className="flex justify-center gap-1.5 mt-4">
              {displayed.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide({ index: i, dir: i > current ? 1 : -1 })}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-primary-500 w-4' : 'bg-slate-300'}`}
                />
              ))}
            </div>
          )}

          {/* Arrows + View All button row */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={prev}
              disabled={atStart}
              className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <Link to="/doctors">
              <Button variant="outline" size="sm">View All Doctors</Button>
            </Link>
            <button
              onClick={next}
              disabled={atEnd}
              className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
