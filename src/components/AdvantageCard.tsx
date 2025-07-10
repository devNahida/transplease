import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdvantageCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const AdvantageCard: React.FC<AdvantageCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center p-6 rounded-lg bg-secondary-green hover:bg-accent-gold hover:text-primary-dark transition-colors border border-divider-grey">
      <div className="w-16 h-16 bg-accent-gold rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-primary-dark" />
      </div>
      <h3 className="text-lg font-semibold text-text-light mb-2">{title}</h3>
      <p className="text-text-grey">{description}</p>
    </div>
  );
};

export default AdvantageCard;