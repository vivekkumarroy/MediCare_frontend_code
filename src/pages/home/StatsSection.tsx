import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, UserCheck, BookOpen, Clock } from 'lucide-react';

const stats = [
  { icon: Users,     value: 5000, suffix: '+', label: 'Patients Served' },
  { icon: UserCheck, value: 100,  suffix: '+', label: 'Expert Doctors' },
  { icon: BookOpen,  value: 50,   suffix: '+', label: 'Specialties' },
  { icon: Clock,     value: 24,   suffix: '/7', label: 'Support' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (1500 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function StatsSection() {
  return (
    <section className="py-16 px-6 bg-primary-500">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants} className="flex flex-col items-center text-center text-white">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <Icon size={22} />
                </div>
                <div className="text-3xl font-extrabold mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
