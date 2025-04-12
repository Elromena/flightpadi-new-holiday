import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (attraction: Attraction) => void;
  onExpand: (id: string) => void;
  disabled?: boolean;
}

export function AttractionCard({ 
  attraction, 
  isSelected, 
  isExpanded,
  onSelect, 
  onExpand,
  disabled 
}: AttractionCardProps) {
  const handleClick = () => {
    if (isExpanded) {
      onSelect(attraction);
    } else {
      onExpand(attraction.id);
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        ${isExpanded ? 'h-[320px]' : 'h-[200px]'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-blue-300'}
        ${isSelected ? 'ring-4 ring-white' : isExpanded ? 'ring-2 ring-white/60' : ''}`}
      onClick={() => !disabled && handleClick()}
    >
      <img
        src={attraction.image}
        alt={attraction.name}
        className="w-full h-full object-cover transition-transform duration-700"
      />
      <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${
        isExpanded
          ? 'from-black/90 via-black/70 to-black/30'
          : 'from-black/70 to-black/20'
      }`} />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{attraction.name}</h3>
          {!isExpanded && (
            <ChevronDown className={`w-5 h-5 text-white transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          )}
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3 transition-opacity duration-300">
            <p className="text-white/90 text-sm">{attraction.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium px-2 py-1 rounded-full ${
                attraction.type === 'full_package' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {attraction.type === 'full_package' ? 'Full Package' : 'Regular Attraction'}
              </span>
              <span className="text-white font-medium">
                {attraction.price === 0 ? 'Free' : `₦${attraction.price.toLocaleString()}`}
              </span>
            </div>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(attraction);
              }}
            >
              {isSelected ? 'Remove from Plan' : 'Add to Your Plan'}
            </button>
          </div>
        )}
      </div>
      {isSelected && (
        <div className="absolute top-4 right-4 bg-white text-blue-500 p-2 rounded-full">
          <Check className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}