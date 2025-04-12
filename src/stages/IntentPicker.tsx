import React from 'react';
import { ArrowRight, ChevronDown, Cake, Heart, Briefcase, Users, UserPlus, User, Sparkles, HelpCircle } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import type { TripIntent } from '../types';
import { APP_CONFIG } from '../config/app';

interface IntentOption {
  id: TripIntent;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'birthday',
    label: 'Design My Birthday Escape',
    description: 'Craft the perfect celebration just for you',
    icon: <Cake className="w-6 h-6" />,
  },
  {
    id: 'anniversary',
    label: 'Create Our Anniversary Story',
    description: 'Build a romantic chapter together',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 'workation',
    label: 'Design My Perfect Workation',
    description: 'Build your ideal work-life balance retreat',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: 'family',
    label: 'Plan Our Family Adventure',
    description: 'Design an experience everyone will love',
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: 'friends',
    label: 'Create Our Squad Adventure',
    description: 'Build the ultimate friend trip together',
    icon: <UserPlus className="w-6 h-6" />,
  },
  {
    id: 'solo',
    label: 'Design My Solo Journey',
    description: 'Craft your perfect me-time experience',
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 'honeymoon',
    label: 'Create Our Dream Honeymoon',
    description: 'Design the perfect start to forever',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 'other',
    label: 'Design Something Unique',
    description: 'Create your own style of adventure',
    icon: <HelpCircle className="w-6 h-6" />,
  },
];

interface IntentPickerProps {
  selectedIntent: TripIntent | null;
  onSelect: (intent: TripIntent) => void;
  onNext: () => void;
}

export function IntentPicker({ selectedIntent, onSelect, onNext }: IntentPickerProps) {
  useScrollToTop(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
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
      <div className="relative z-20 w-full max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Design Your Perfect Getaway
          </h1>
          <p className="text-xl text-white/90">
            Start building your dream vacation experience
          </p>
        </div>

        {/* Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white rounded-2xl p-6 text-left shadow-xl hover:shadow-2xl transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500 mb-1">I want to...</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedIntent
                  ? INTENT_OPTIONS.find(opt => opt.id === selectedIntent)?.label
                  : 'Start designing my perfect trip'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Options */}
          <div className={`absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl transition-all overflow-hidden ${
            isOpen
              ? 'opacity-100 translate-y-0 max-h-[460px] overflow-y-auto'
              : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'
          }`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#E2E8F0 #ffffff' }}>
            {INTENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
                }}
                className={`w-full px-6 py-4 text-left flex items-center gap-4 transition-colors hover:bg-gray-50 ${
                  selectedIntent === option.id
                    ? 'bg-blue-50'
                    : 'bg-white'
                }`}
              >
                <div className={`${
                  selectedIntent === option.id ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {option.icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    selectedIntent === option.id ? 'text-blue-500' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        {selectedIntent && (
          <button
            onClick={onNext}
            className="w-full mt-6 bg-blue-500 text-white p-6 rounded-2xl font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Start Building Your Experience
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}