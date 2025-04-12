import React from 'react';
import { MapPin, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { destinations } from '../data/destinations';
import { DestinationCard } from '../components/DestinationCard';
import { DestinationSuggestion } from '../components/DestinationSuggestion';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { APP_CONFIG } from '../config/app';
import type { TripIntent } from '../types';

interface DestinationPickerProps {
  selectedDestination: string | null;
  tripIntent: TripIntent | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const INTENT_HEADLINES = {
  birthday: 'Choose Where to Celebrate Your Special Day',
  anniversary: 'Pick the Perfect Setting for Your Love Story',
  workation: 'Find Your Ideal Work-Life Balance Destination',
  family: 'Select Your Family\'s Next Adventure Spot',
  friends: 'Choose Where to Create Memories with Friends',
  solo: 'Pick Your Perfect Solo Adventure Destination',
  honeymoon: 'Select Your Romantic Getaway Paradise',
  other: 'Choose Your Dream Destination'
} as const;

const INTENT_DESCRIPTIONS = {
  birthday: 'Design a celebration that\'s uniquely yours',
  anniversary: 'Create the perfect backdrop for your special milestone',
  workation: 'Build your ideal environment for productivity and relaxation',
  family: 'Design an experience that brings everyone together',
  friends: 'Create the ultimate group adventure playground',
  solo: 'Craft your perfect journey of self-discovery',
  honeymoon: 'Design the romantic escape you\'ve always dreamed of',
  other: 'Build your perfect escape, your way'
} as const;

export function DestinationPicker({ selectedDestination, tripIntent, onSelect, onBack, onNext }: DestinationPickerProps) {
  const [expandedDestination, setExpandedDestination] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestionForm, setShowSuggestionForm] = React.useState(false);

  useScrollToTop(null);

  const filteredDestinations = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return destinations.filter(
      (destination) =>
        destination.name.toLowerCase().includes(query) || destination.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={APP_CONFIG.urls.introVideo} type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            {tripIntent ? INTENT_HEADLINES[tripIntent] : 'Choose Your Dream Destination'}
          </h1>
          <p className="text-xl text-white/90 text-center max-w-2xl mb-8">
            {tripIntent ? INTENT_DESCRIPTIONS[tripIntent] : 'Start building your perfect getaway'}
          </p>
          <div className="w-full max-w-xl relative flex gap-2">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 pl-12 rounded-2xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none"
            />
            <Search className="w-5 h-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              onClick={() => {
                setSearchQuery('');
                setExpandedDestination(null);
                setShowSuggestionForm(true);
              }}
              className="px-4 py-2 rounded-2xl border-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <MapPin className="w-5 h-5 sm:block hidden" />
              <span className="sm:inline">
                <span className="sm:hidden">New</span>
                <span className="hidden sm:inline">Add New Destination</span>
              </span>
            </button>
          </div>
        </div>

        <div>
          {(filteredDestinations.length === 0 || showSuggestionForm) ? (
            <DestinationSuggestion
              searchQuery={searchQuery}
              tripIntent={tripIntent}
              onClose={() => {
                setSearchQuery('');
                setShowSuggestionForm(false);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-start">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isSelected={selectedDestination === destination.id}
                  isExpanded={expandedDestination === destination.id}
                  onSelect={onSelect}
                  onExpand={setExpandedDestination}
                />
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-8 mt-12 flex justify-center gap-4">
          <button
            className="bg-white text-gray-600 px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
            Change Purpose
          </button>
          {selectedDestination && !showSuggestionForm && (
            <button
              className="bg-blue-500 text-white px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={onNext}
            >
              Design Your Schedule
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}