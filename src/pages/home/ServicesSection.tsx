import { motion } from 'framer-motion';
import { Stethoscope, FlaskConical, Siren, Pill } from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'Outpatient Department',
    description: 'Comprehensive consultations with experienced specialists across all medical fields.',
    iconBg: 'bg-[#e8f4f7]',
    iconColor: '#4a9ead',
    accent: '#4a9ead22',
  },
  {
    icon: FlaskConical,
    title: 'Laboratory Services',
    description: 'State-of-the-art diagnostics with fast, accurate results for all tests.',
    iconBg: 'bg-emerald-50',
    iconColor: '#10b981',
    accent: '#10b98122',
  },
  {
    icon: Siren,
    title: '24/7 Emergency Care',
    description: 'Round-the-clock emergency services with rapid response teams on standby.',
    iconBg: 'bg-red-50',
    iconColor: '#ef4444',
    accent: '#ef444422',
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description: 'On-site pharmacy with a wide range of medications and expert guidance.',
    iconBg: 'bg-violet-50',
    iconColor: '#7c3aed',
    accent: '#7c3aed22',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function ServicesSection() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#f0f5fa' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl font-bold text-[#1a2e3b] mt-2 mb-3">Our Services</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Everything you need for your health, all in one place.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} variants={cardVariants}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white rounded-2xl p-6 h-full flex flex-col gap-4 cursor-pointer"
                  style={{
                    border: '1px solid #e2eaf2',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${service.accent}, 0 2px 8px rgba(0,0,0,0.08)`;
                    (e.currentTarget as HTMLDivElement).style.borderColor = service.iconColor + '55';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e2eaf2';
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.iconBg}`}
                  >
                    <Icon size={22} style={{ color: service.iconColor }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a2e3b] mb-2 text-base">{service.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
