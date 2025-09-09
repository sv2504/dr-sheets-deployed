
import React from 'react';

const testimonials = [
  {
    flag: '🇺🇸',
    country: 'USA',
    name: 'Sarah K.',
    text: "Dr. Sheets is a lifesaver! I was stuck on a complex QUERY formula for hours. I described what I needed, and it gave me the perfect solution with a clear explanation in seconds. Highly recommended!",
  },
  {
    flag: '🇬🇧',
    country: 'UK',
    name: 'David L.',
    text: "As a small business owner, I use Google Sheets for everything. This tool has saved me so much time fixing broken formulas and helping me learn new functions. It's like having a Sheets expert on call 24/7.",
  },
  {
    flag: '🇦🇺',
    country: 'Australia',
    name: 'Megan R.',
    text: "I used to be intimidated by advanced functions, but Dr. Sheets breaks them down so well. The explanations are fantastic for learning. My spreadsheets have never been more efficient.",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center text-slate-800">Trusted by Google Sheets Users Worldwide</h2>
      <p className="mt-2 text-center text-lg text-slate-600">See what others are saying about Dr. Sheets.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col">
            <div className="flex-grow">
              <p className="text-slate-700 italic leading-relaxed">&quot;{testimonial.text}&quot;</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="font-bold text-slate-800">{testimonial.name}</p>
              <p className="text-sm text-slate-500">{testimonial.flag} {testimonial.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};