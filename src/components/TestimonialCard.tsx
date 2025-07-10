import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  company: string;
  content: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, company, content, rating }) => {
  return (
    <div className="bg-primary-dark rounded-xl shadow-lg p-6 border border-divider-grey">
      <div className="flex items-center mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-accent-gold fill-current" />
        ))}
      </div>
      <p className="text-text-grey mb-4 italic">"{content}"</p>
      <div>
        <p className="font-semibold text-text-light">{name}</p>
        <p className="text-sm text-text-grey">{company}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;