import { motion } from 'framer-motion';
import { Bot, Star, Clock, Shield } from 'lucide-react';
import { DrShyra } from '@/components/chatbot/DrShyra';

const perks = [
  { icon: Star,   text: '4.9 rated by patients' },
  { icon: Clock,  text: 'Available 24/7' },
  { icon: Shield, text: 'Private & secure' },
];

export function DrShyraSection() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: '#e8eef5' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — Dr. Shyra image + info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            {/* Big image */}
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover" style={{ height: '480px' }}>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=85"
                alt="Dr. Shyra AI Health Assistant"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=85';
                }}
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e3b]/80 via-transparent to-transparent" />

              {/* Name card overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: 'rgba(15,40,55,0.22)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">Dr. Shyra</h3>
                    <p className="text-primary-300 text-sm">AI Health Assistant · MediCare+</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-3 py-1 text-xs text-emerald-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Floating perks */}
            <div className="absolute -right-4 top-8 flex flex-col gap-2">
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="bg-white rounded-xl shadow-card px-3 py-2 flex items-center gap-2 text-xs font-medium text-slate-700 border border-slate-100">
                  <Icon size={13} className="text-primary-500 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — chatbot */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <div>
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">AI Health Assistant</span>
              <h2 className="text-3xl font-extrabold text-[#1a2e3b] mt-1 mb-3">
                Meet Dr. Shyra
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Tell Dr. Shyra your symptoms or what kind of specialist you need. She'll understand your concern and guide you to the right doctor — instantly.
              </p>
            </div>

            {/* Full chatbot */}
            <DrShyra inline />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
