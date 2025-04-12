import React from 'react';
import { Search, ArrowLeft, ArrowRight, Package2, Palmtree } from 'lucide-react';
import { attractions } from '../data/attractions';
import { AttractionCard } from '../components/AttractionCard';
import { AttractionSuggestion } from '../components/AttractionSuggestion';
import { useScrollToTop } from '../hooks/useScrollToTop';
import type { Attraction, AttractionType, TripIntent } from '../types';
import { APP_CONFIG } from '../config/app';

interface AttractionsPickerProps {
  selectedDestination: string;
  tripIntent: TripIntent | null;
  onBack: () => void;
  onNext: (selectedAttractions: Attraction[]) => void;
}

export function AttractionsPicker({ selectedDestination, tripIntent, onBack, onNext }: AttractionsPickerProps) {
  const [selectedAttractions, setSelectedAttractions] = React.useState<Attraction[]>([]);
  const [expandedAttraction, setExpandedAttraction] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<AttractionType | 'all'>('all');
  const [showSuggestionForm, setShowSuggestionForm] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useScrollToTop(null);

  const destinationAttractions = React.useMemo(() => {
    return attractions.filter(attraction => attraction.destinationId === selectedDestination);
  }, [selectedDestination]);

  const filteredAttractions = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return destinationAttractions.filter(
      attraction => (
        (typeFilter === 'all' || attraction.type === typeFilter) &&
        (
        attraction.name.toLowerCase().includes(query) ||
        attraction.description.toLowerCase().includes(query)
        )
      )
    );
  }, [destinationAttractions, searchQuery, typeFilter]);

  const selectedType: AttractionType | null = React.useMemo(() => {
    if (selectedAttractions.length === 0) return null;
    return selectedAttractions[0].type;
  }, [selectedAttractions]);

  const handleSelect = (attraction: Attraction) => {
    setError(null);
    
    // Check if attraction is already selected
    const isSelected = selectedAttractions.some(a => a.id === attraction.id);
    
    // If it's already selected, remove it
    if (isSelected) {
      setSelectedAttractions(prev => prev.filter(a => a.id !== attraction.id));
      return;
    }
    
    // If selecting a new attraction
    if (selectedType && attraction.type !== selectedType) {
      setError(
        selectedType === 'regular'
          ? 'You cannot mix regular attractions with full package attractions'
          : 'You can only select one full package attraction'
      );
      return;
    }

    // Handle full package selection
    if (attraction.type === 'full_package') {
      setSelectedAttractions([attraction]);
      return;
    }

    // Add new regular attraction
    setSelectedAttractions(prev => [...prev, attraction]);
  };

  const isValidSelection = React.useMemo(() => {
    if (selectedAttractions.length === 0) return false;
    if (selectedType === 'full_package') return selectedAttractions.length === 1;
    return selectedAttractions.length >= 2;
  }, [selectedAttractions, selectedType]);

  const totalPrice = React.useMemo(() => {
    return selectedAttractions.reduce((sum, attraction) => sum + attraction.price, 0);
  }, [selectedAttractions]);

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
            Design Your Perfect Experience
          </h1>
          <p className="text-xl text-white/90 text-center mb-8">
            Choose how you want to explore
          </p>

          {/* Package Type Selection */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mb-12">
            <button
              onClick={() => setTypeFilter('full_package')}
              className={`relative group p-4 sm:p-5 rounded-xl transition-all duration-300 ${
                typeFilter === 'full_package'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white hover:bg-blue-50 hover:scale-[1.02] shadow-lg'
              } transform-gpu`}
            >
              <Package2 className={`w-6 h-6 mb-3 ${
                typeFilter === 'full_package' ? 'text-white' : 'text-blue-500'
              }`} />
              <h3 className={`text-sm font-semibold mb-1.5 ${
                typeFilter === 'full_package' ? 'text-white' : 'text-gray-900'
              }`}>Full Package</h3>
              <p className={`text-xs sm:text-sm ${
                typeFilter === 'full_package' ? 'text-white/90' : 'text-gray-600'
              } line-clamp-2`}>
                All-inclusive experience with accommodation and activities
              </p>
            </button>

            <button
              onClick={() => setTypeFilter('regular')}
              className={`relative group p-4 sm:p-5 rounded-xl transition-all duration-300 ${
                typeFilter === 'regular'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white hover:bg-blue-50 hover:scale-[1.02] shadow-lg'
              } transform-gpu`}
            >
              <Palmtree className={`w-6 h-6 mb-3 ${
                typeFilter === 'regular' ? 'text-white' : 'text-blue-500'
              }`} />
              <h3 className={`text-sm font-semibold mb-1.5 ${
                typeFilter === 'regular' ? 'text-white' : 'text-gray-900'
              }`}>Build Your Own</h3>
              <p className={`text-xs sm:text-sm ${
                typeFilter === 'regular' ? 'text-white/90' : 'text-gray-600'
              } line-clamp-2`}>
                Mix and match attractions to create your perfect itinerary
              </p>
            </button>
          </div>

          {/* Search */}
          <div className="w-full max-w-xl relative flex gap-2">
            <input
              type="text"
              placeholder="Search or suggest experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-2xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none"
            />
            <Search className="w-5 h-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              onClick={() => {
                setSearchQuery('');
                setExpandedAttraction(null);
                setShowSuggestionForm(true);
              }}
              className="px-4 py-2 rounded-2xl border-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Palmtree className="w-5 h-5 sm:block hidden" />
              <span className="sm:inline">
                <span className="sm:hidden">New</span>
                <span className="hidden sm:inline">Suggest Experience</span>
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-8">
            <p className="text-red-400 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {(filteredAttractions.length === 0 || showSuggestionForm) ? (
          <AttractionSuggestion
            searchQuery={searchQuery}
            tripIntent={tripIntent}
            onClose={() => {
              setSearchQuery('');
              setShowSuggestionForm(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions
              .filter(attraction => typeFilter === 'all' || attraction.type === typeFilter)
              .map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  isSelected={selectedAttractions.some(a => a.id === attraction.id)}
                  isExpanded={expandedAttraction === attraction.id}
                  onSelect={handleSelect}
                  onExpand={setExpandedAttraction}
                  disabled={
                    selectedType &&
                    ((selectedType === 'full_package' && attraction.type === 'regular') ||
                     (selectedType === 'regular' && attraction.type === 'full_package'))
                  }
                />
              ))}
          </div>
        )}

        {!showSuggestionForm && (
          <div className="sticky bottom-8 mt-12 flex justify-center gap-4">
            <button
              className="bg-white text-gray-600 px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
              Change Dates
            </button>
            {(selectedType === 'regular' || isValidSelection) && (
              <button
                className={`px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transition-all ${
                  isValidSelection
                    ? 'bg-blue-500 text-white hover:bg-blue-600 px-4 sm:px-8'
                    : 'bg-white/5 text-white/40 cursor-not-allowed backdrop-blur-sm'
                }`}
                onClick={() => onNext(selectedAttractions)}
                disabled={!isValidSelection}
              >
                {selectedType === 'regular' && !isValidSelection
                  ? `Select ${2 - selectedAttractions.length} More Experience${selectedAttractions.length === 1 ? '' : 's'}`
                  : 'Choose Your Stay'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}