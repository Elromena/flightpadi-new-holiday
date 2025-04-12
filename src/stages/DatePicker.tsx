import React from 'react';
import { Calendar, ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { destinations } from '../data/destinations';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { DateRangePicker } from '../components/DateRangePicker';
import { APP_CONFIG } from '../config/app';

interface DatePickerProps {
  selectedDestination: string | null;
  dateRange: DateRange | undefined;
  onDateSelect: (range: DateRange | undefined) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DatePicker({ selectedDestination, dateRange, onDateSelect, onBack, onNext }: DatePickerProps) {
  const destination = destinations.find(d => d.id === selectedDestination);

  useScrollToTop(null);

  if (!destination) return null;

  return (
    <div className="relative min-h-screen flex flex-col">
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
      <div className="relative z-20 max-w-3xl mx-auto px-4 py-12 sm:px-6 flex-1">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            When would you like to explore {destination.name}?
          </h1>
          <p className="text-xl text-white/90 text-center mb-6">
            Choose dates that work best for your schedule
          </p>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>7 days advance booking required</span>
            </div>
            <span>•</span>
            <span>Minimum 2-day stay</span>
          </div>
        </div>

        <DateRangePicker value={dateRange} onDateSelect={onDateSelect} />
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="relative z-20 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex justify-center gap-4">
          <button
            className="bg-white text-gray-600 px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
            Change Destination
          </button>
          {dateRange?.from && dateRange?.to && (
            <button
              className="bg-blue-500 text-white px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={onNext}
            >
              Choose Your Adventures
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}