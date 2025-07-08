import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ComingSoonFeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  availableDate?: string;
}

const ComingSoonFeature: React.FC<ComingSoonFeatureProps> = ({ 
  title, 
  description, 
  icon: Icon,
  availableDate 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Yakında</span>
          </div>
          
          <p className="text-sm text-gray-600 mt-2">{description}</p>
          
          {availableDate && (
            <p className="text-xs text-indigo-600 mt-3 font-medium">
              Tahmini kullanıma sunulma: {availableDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonFeature; 