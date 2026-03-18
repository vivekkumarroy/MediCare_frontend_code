import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, X, Minimize2 } from 'lucide-react';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  action?: { label: string; route: string };
}

// ── AI Knowledge Base ─────────────────────────────────────────────────────────

const KNOWLEDGE: {
  keywords: string[];
  specialty: string;
  doctorSearch: string;
  response: string;
  followUp?: string;
}[] = [
  {
    keywords: ['chest pain', 'chest tightness', 'heart pain', 'palpitation', 'irregular heartbeat', 'shortness of breath', 'hypertension', 'high blood pressure', 'heart attack', 'cardiac', 'angina'],
    specialty: 'Cardiology',
    doctorSearch: 'Cardiology',
    response: "That sounds like it could be a cardiac concern. Chest pain, palpitations, or high blood pressure should be evaluated by a Cardiologist. I'll connect you with our heart specialists.",
    followUp: "Are you experiencing this right now? If it's severe, please call emergency services immediately.",
  },
  {
    keywords: ['headache', 'migraine', 'severe headache', 'head pain', 'seizure', 'epilepsy', 'memory loss', 'forgetfulness', 'dizziness', 'vertigo', 'numbness', 'tingling', 'stroke', 'brain', 'nerve pain', 'tremor', 'parkinson'],
    specialty: 'Neurology',
    doctorSearch: 'Neurology',
    response: "These symptoms suggest a neurological issue. Headaches, dizziness, memory problems, or seizures are best evaluated by a Neurologist.",
    followUp: "How long have you been experiencing this? Is it getting worse?",
  },
  {
    keywords: ['skin rash', 'rash', 'acne', 'eczema', 'psoriasis', 'itching', 'skin irritation', 'hives', 'skin infection', 'hair loss', 'alopecia', 'dandruff', 'dry skin', 'skin allergy', 'dermatitis'],
    specialty: 'Dermatology',
    doctorSearch: 'Dermatology',
    response: "Skin conditions like rashes, acne, eczema, or hair loss are treated by a Dermatologist. Let me find the right skin specialist for you.",
  },
  {
    keywords: ['bone pain', 'joint pain', 'knee pain', 'back pain', 'spine', 'fracture', 'broken bone', 'arthritis', 'shoulder pain', 'hip pain', 'muscle pain', 'sports injury', 'ligament', 'tendon', 'orthopedic', 'scoliosis'],
    specialty: 'Orthopedics',
    doctorSearch: 'Orthopedics',
    response: "Bone, joint, or muscle pain is handled by an Orthopedic specialist. Whether it's arthritis, a fracture, or back pain — they can help.",
  },
  {
    keywords: ['child', 'baby', 'infant', 'toddler', 'kid', 'pediatric', 'vaccination', 'growth', 'fever in child', 'child cough', 'newborn'],
    specialty: 'Pediatrics',
    doctorSearch: 'Pediatrics',
    response: "For children's health concerns, our Pediatricians are the right specialists. They handle everything from vaccinations to childhood illnesses.",
  },
  {
    keywords: ['eye pain', 'blurry vision', 'vision loss', 'cataract', 'glaucoma', 'eye infection', 'red eye', 'eye allergy', 'glasses', 'contact lens', 'ophthalmology'],
    specialty: 'Ophthalmology',
    doctorSearch: 'Ophthalmology',
    response: "Eye problems like blurry vision, cataracts, or eye infections are treated by an Ophthalmologist.",
  },
  {
    keywords: ['tooth pain', 'toothache', 'cavity', 'gum pain', 'bleeding gums', 'dental', 'dentist', 'braces', 'root canal', 'wisdom tooth'],
    specialty: 'Dentistry',
    doctorSearch: 'Dentistry',
    response: "Dental issues like toothache, cavities, or gum problems are handled by our dental specialists.",
  },
  {
    keywords: ['stomach pain', 'abdominal pain', 'bloating', 'gas', 'diarrhea', 'constipation', 'acid reflux', 'heartburn', 'nausea', 'vomiting', 'liver', 'jaundice', 'ibs', 'crohn', 'ulcer', 'gastro', 'indigestion'],
    specialty: 'Gastroenterology',
    doctorSearch: 'Gastroenterology',
    response: "Digestive issues like stomach pain, acid reflux, or bowel problems are treated by a Gastroenterologist.",
  },
  {
    keywords: ['anxiety', 'depression', 'stress', 'panic attack', 'mental health', 'mood swings', 'insomnia', 'sleep disorder', 'bipolar', 'schizophrenia', 'ocd', 'ptsd', 'phobia', 'psychiatry', 'psychology', 'suicidal'],
    specialty: 'Psychiatry',
    doctorSearch: 'Psychiatry',
    response: "Mental health is just as important as physical health. Our Psychiatry team can help with anxiety, depression, sleep disorders, and more. You're not alone.",
    followUp: "Would you like to speak with a mental health professional today?",
  },
  {
    keywords: ['diabetes', 'blood sugar', 'thyroid', 'hypothyroid', 'hyperthyroid', 'hormone', 'weight gain', 'weight loss', 'metabolism', 'adrenal', 'pcos', 'endocrine'],
    specialty: 'Endocrinology',
    doctorSearch: 'Endocrinology',
    response: "Hormonal and metabolic conditions like diabetes, thyroid disorders, or PCOS are managed by an Endocrinologist.",
  },
  {
    keywords: ['cough', 'cold', 'flu', 'fever', 'sore throat', 'runny nose', 'body ache', 'fatigue', 'weakness', 'general', 'checkup', 'not feeling well', 'sick', 'infection', 'viral', 'bacterial'],
    specialty: 'General Medicine',
    doctorSearch: 'General',
    response: "For general symptoms like fever, cough, cold, or fatigue, a General Physician is the right first step. They can diagnose and refer you to a specialist if needed.",
  },
  {
    keywords: ['kidney', 'urination', 'frequent urination', 'burning urination', 'uti', 'kidney stone', 'renal', 'nephrology', 'dialysis'],
    specialty: 'Nephrology',
    doctorSearch: 'Nephrology',
    response: "Kidney and urinary issues like UTIs, kidney stones, or renal disease are treated by a Nephrologist.",
  },
  {
    keywords: ['breathing', 'asthma', 'wheezing', 'lung', 'pneumonia', 'bronchitis', 'copd', 'chest congestion', 'pulmonary', 'respiratory', 'oxygen'],
    specialty: 'Pulmonology',
    doctorSearch: 'Pulmonology',
    response: "Breathing difficulties, asthma, or lung conditions are handled by a Pulmonologist.",
  },
  {
    keywords: ['cancer', 'tumor', 'oncology', 'chemotherapy', 'radiation', 'biopsy', 'malignant', 'benign'],
    specialty: 'Oncology',
    doctorSearch: 'Oncology',
    response: "Cancer-related concerns require an Oncologist. Early detection is key — let me connect you with our oncology specialists.",
    followUp: "Has a diagnosis already been made, or are you experiencing concerning symptoms?",
  },
  {
    keywords: ['pregnancy', 'prenatal', 'gynecology', 'periods', 'menstrual', 'ovarian', 'uterus', 'fertility', 'obstetrics', 'women health', 'breast'],
    specialty: 'Gynecology',
    doctorSearch: 'Gynecology',
    response: "Women's health concerns including pregnancy, menstrual issues, or gynecological conditions are handled by our Gynecology specialists.",
  },
  {
    keywords: ['ear', 'hearing loss', 'ear pain', 'tinnitus', 'nose', 'throat', 'tonsil', 'sinusitis', 'ent', 'nasal', 'snoring', 'voice'],
    specialty: 'ENT',
    doctorSearch: 'ENT',
    response: "Ear, nose, and throat issues are treated by an ENT (Otolaryngologist) specialist.",
  },
];

const GREETINGS = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'namaste', 'hii', 'helo'];
const THANKS = ['thank', 'thanks', 'thank you', 'thx', 'ty'];
const EMERGENCY_WORDS = ['emergency', 'dying', 'unconscious', 'not breathing', 'heart attack', 'stroke', 'severe bleeding', 'accident'];

function analyzeInput(input: string): { text: string; action?: { label: string; route: string } } {
  const lower = input.toLowerCase();

  if (EMERGENCY_WORDS.some((w) => lower.includes(w))) {
    return {
      text: "🚨 This sounds like a medical emergency! Please call emergency services (911 / 108) immediately. Do not wait. If you need our emergency department, click below.",
      action: { label: 'Emergency Department →', route: '/doctors?search=Emergency' },
    };
  }

  if (GREETINGS.some((g) => lower === g || lower.startsWith(g + ' ') || lower.endsWith(' ' + g))) {
    return {
      text: "Hello! I'm Dr. Shyra 👋 I'm your AI health assistant at MediCare+. Tell me what symptoms you're experiencing or what kind of doctor you're looking for, and I'll guide you to the right specialist.",
    };
  }

  if (THANKS.some((t) => lower.includes(t))) {
    return {
      text: "You're welcome! 😊 Take care of your health. If you have more questions or need to book an appointment, I'm always here.",
    };
  }

  if (['book', 'appointment', 'schedule', 'consult', 'visit', 'see a doctor'].some((k) => lower.includes(k))) {
    return {
      text: "I'll take you to our doctors directory where you can browse specialists and book an appointment instantly.",
      action: { label: 'Browse & Book Doctors →', route: '/doctors' },
    };
  }

  for (const entry of KNOWLEDGE) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      const followUp = entry.followUp ? `\n\n${entry.followUp}` : '';
      return {
        text: `${entry.response}${followUp}`,
        action: {
          label: `View ${entry.specialty} Doctors →`,
          route: `/doctors?search=${encodeURIComponent(entry.doctorSearch)}`,
        },
      };
    }
  }

  return {
    text: "I understand you're not feeling well. Based on what you've described, I'd recommend starting with a General Physician who can assess your condition and refer you to the right specialist if needed.",
    action: { label: 'See General Physicians →', route: '/doctors?search=General' },
  };
}

interface DrShyraProps {
  inline?: boolean;
}

export function DrShyra({ inline = false }: DrShyraProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: 'bot',
      text: "Hi, I'm Dr. Shyra 👋 I'm your AI health assistant. Describe your symptoms or tell me what kind of doctor you need — I'll guide you to the right specialist instantly.",
    },
  ]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: idRef.current++, from: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = analyzeInput(text);
      const botMsg: Message = {
        id: idRef.current++,
        from: 'bot',
        text: response.text,
        action: response.action,
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 800);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') send();
  }

  const chatBody = (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{ maxHeight: inline ? 280 : 340 }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.from === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.from === 'user'
                    ? 'bg-primary-500 text-white rounded-br-sm'
                    : 'rounded-bl-sm'
                }`}
                style={msg.from === 'bot' ? {
                  background: 'var(--bot-bubble, #f1f5f9)',
                  color: 'var(--bot-text, #1e293b)',
                } : undefined}
              >
                {msg.text}
              </div>
            </div>
            {msg.action && (
              <button
                onClick={() => navigate(msg.action!.route)}
                className="mt-1.5 ml-9 text-xs bg-primary-500 hover:bg-primary-600 text-white px-4 py-1.5 rounded-xl transition-colors font-medium"
              >
                {msg.action.label}
              </button>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
              <Bot size={13} className="text-white" />
            </div>
            <div className="rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1" style={{ background: 'var(--bot-bubble, #f1f5f9)' }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: 'var(--bot-text, #94a3b8)', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your symptoms..."
          className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-slate-800 placeholder:text-slate-400"
        />
        <button
          onClick={send}
          className="w-9 h-9 rounded-xl bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors shrink-0"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );

  // ── Inline mode ──
  if (inline) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100" style={{ backgroundColor: '#dce4ee' }}>
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a2e3b]">Dr. Shyra</p>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              AI Health Assistant · Online
            </p>
          </div>
        </div>
        {chatBody}
      </div>
    );
  }
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
          aria-label="Chat with Dr. Shyra"
          title="Chat with Dr. Shyra"
        >
          <Bot size={24} />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100" style={{ backgroundColor: '#e8eef5' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
                <Bot size={13} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a2e3b]">Dr. Shyra</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  AI Health Assistant
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
                <Minimize2 size={13} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
                <X size={13} />
              </button>
            </div>
          </div>
          {chatBody}
        </div>
      )}
    </>
  );
}
