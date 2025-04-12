import { useState, useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import type { Attraction, Hotel, TravellerInfo, TripIntent } from '../types';
import { generateBookingId } from '../utils/bookingId';

interface BookingState {
  tripIntent: TripIntent | null;
  selectedDestination: string | null;
  dateRange: DateRange | undefined;
  selectedAttractions: Attraction[];
  selectedHotel: Hotel | null;
  travellerInfo: TravellerInfo | null;
  stage: 'intent' | 'destination' | 'dates' | 'attractions' | 'accommodation' | 'bio' | 'summary',
  bookingId: string;
}

export function useBookingState() {
  const [state, setState] = useState<BookingState>(() => {
    const saved = sessionStorage.getItem('bookingState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      if (parsed.dateRange?.from) {
        parsed.dateRange.from = new Date(parsed.dateRange.from);
      }
      if (parsed.dateRange?.to) {
        parsed.dateRange.to = new Date(parsed.dateRange.to);
      }
      return parsed;
    }
    return {
      tripIntent: null,
      selectedDestination: null,
      dateRange: undefined,
      selectedAttractions: [],
      selectedHotel: null,
      travellerInfo: null,
      stage: 'intent',
      bookingId: generateBookingId()
    };
  });

  useEffect(() => {
    sessionStorage.setItem('bookingState', JSON.stringify(state));
  }, [state]);

  const clearBookingState = () => {
    sessionStorage.removeItem('bookingState');
    setState({
      tripIntent: null,
      selectedDestination: null,
      dateRange: undefined,
      selectedAttractions: [],
      selectedHotel: null,
      travellerInfo: null,
      stage: 'intent',
      bookingId: generateBookingId()
    });
  };

  return {
    ...state,
    setState,
    clearBookingState,
    updateState: (updates: Partial<BookingState>) => {
      setState(prev => ({ ...prev, ...updates }));
    }
  };
}