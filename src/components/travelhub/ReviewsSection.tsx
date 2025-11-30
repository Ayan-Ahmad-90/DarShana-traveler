import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    author: 'Priya Malhotra',
    location: 'Mumbai, India',
    quote: 'Their Kashmir circuit combined shikara sunsets, Gulmarg gondola slots, and Srinagar cafes without me lifting a finger.',
    rating: 5,
  },
  {
    id: '2',
    author: 'Arjun Narayanan',
    location: 'Bengaluru, India',
    quote: 'Expense calculator + train/flight sync kept our Coorg workcation within ₹60k. Support team responded on WhatsApp in 3 minutes.',
    rating: 4.9,
  },
  {
    id: '3',
    author: 'Meera Kapoor',
    location: 'New Delhi, India',
    quote: 'Booked an all-girls Meghalaya trip—permits, homestays, and guides verified inside the app. Parents tracked us live.',
    rating: 5,
  },
];

const ReviewsSection = () => (
  <section id="reviews" className="pt-16">
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reviews & ratings</p>
      <h2 className="text-3xl font-semibold text-[#0f172a]">Loved by explorers</h2>
      <p className="text-slate-500">Pull in Google reviews via API and showcase curated testimonials.</p>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <article key={testimonial.id} className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6 flex flex-col gap-4">
          <Quote className="text-[#06b6d4]/40" size={32} />
          <p className="text-slate-600">{testimonial.quote}</p>
          <div>
            <p className="font-semibold text-[#0f172a]">{testimonial.author}</p>
            <p className="text-sm text-slate-400">{testimonial.location}</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={18}
                className={idx < Math.round(testimonial.rating) ? 'text-[#fbbf24]' : 'text-slate-200'}
                fill={idx < Math.round(testimonial.rating) ? '#fbbf24' : 'none'}
              />
            ))}
            <span className="text-sm text-slate-500">{testimonial.rating.toFixed(1)}</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ReviewsSection;
