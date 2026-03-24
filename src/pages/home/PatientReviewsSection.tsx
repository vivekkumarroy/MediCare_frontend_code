import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Bangalore',
    doctor: 'Dr. Arjun Mehta',
    specialty: 'Cardiology',
    rating: 5,
    review: 'Excellent experience! Dr. Arjun was very thorough and explained everything clearly. The booking process was seamless and the staff was very helpful.',
    avatar: 'PS',
    date: 'March 2026',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Noida',
    doctor: 'Dr. Sneha Kapoor',
    specialty: 'Dermatology',
    rating: 5,
    review: 'Dr. Sneha is amazing. She diagnosed my condition quickly and the treatment worked perfectly. Highly recommend MediCare+ for skin issues.',
    avatar: 'RV',
    date: 'February 2026',
  },
  {
    id: 3,
    name: 'Anita Patel',
    location: 'Gandhinagar',
    doctor: 'Dr. Vikram Singh',
    specialty: 'Orthopedics',
    rating: 4,
    review: 'Very professional doctor. My knee pain is completely gone after following his treatment plan. The online appointment system saved me a lot of time.',
    avatar: 'AP',
    date: 'March 2026',
  },
  {
    id: 4,
    name: 'Suresh Kumar',
    location: 'Patna',
    doctor: 'Dr. Meera Joshi',
    specialty: 'Gynecology',
    rating: 5,
    review: 'My wife had a wonderful experience with Dr. Meera. She is very caring and patient. The hospital facilities are top-notch. Will definitely visit again.',
    avatar: 'SK',
    date: 'January 2026',
  },
  {
    id: 5,
    name: 'Kavita Reddy',
    location: 'Lucknow',
    doctor: 'Dr. Rohan Das',
    specialty: 'Pediatrics',
    rating: 5,
    review: 'Dr. Rohan is fantastic with kids. My 5-year-old was scared but he made her feel so comfortable. The entire visit was stress-free. Thank you MediCare+!',
    avatar: 'KR',
    date: 'February 2026',
  },
  {
    id: 6,
    name: 'Amit Gupta',
    location: 'Kota',
    doctor: 'Dr. Neha Agarwal',
    specialty: 'General Medicine',
    rating: 4,
    review: 'Quick diagnosis and effective treatment. The receipt and appointment confirmation system is very well designed. Makes tracking appointments easy.',
    avatar: 'AG',
    date: 'March 2026',
  },
  {
    id: 7,
    name: 'Deepa Nair',
    location: 'Bangalore',
    doctor: 'Dr. Sanjay Iyer',
    specialty: 'Neurology',
    rating: 5,
    review: 'Outstanding service from start to finish. Dr. Sanjay took time to understand my symptoms and the treatment has been very effective. Highly recommended!',
    avatar: 'DN',
    date: 'March 2026',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
}

export function PatientReviewsSection() {
  return (
    <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: '#f0f5fa' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-[#4a9ead] uppercase tracking-widest bg-[#e0f4f7] px-3 py-1 rounded-full mb-3">
            Patient Stories
          </span>
          <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
            Real experiences from patients who trusted MediCare+ for their healthcare needs.
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
          {reviews.map((r, idx) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow w-full box-border ${
                idx === reviews.length - 1 && reviews.length % 3 === 1
                  ? 'lg:col-start-2'
                  : ''
              }`}
            >
              {/* Quote icon */}
              <Quote className="w-7 h-7 text-[#4a9ead]/30 -mb-1" />

              {/* Review text */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">"{r.review}"</p>

              {/* Rating */}
              <StarRating rating={r.rating} />

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Patient info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a9ead] to-[#2d7a8a] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {r.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{r.name}</p>
                  <p className="text-xs text-gray-400 truncate">{r.location} · {r.date}</p>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <p className="text-xs font-medium text-[#4a9ead] truncate">{r.doctor}</p>
                  <p className="text-[10px] text-gray-400">{r.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
