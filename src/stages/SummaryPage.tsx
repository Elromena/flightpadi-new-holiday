import React from 'react';
import { differenceInDays } from 'date-fns';
import { MapPin, Calendar, Users, Hotel, Palmtree, CreditCard, ArrowLeft, Clock, Ticket, ChevronRight } from 'lucide-react';
import { BankTransferDetails } from '../components/BankTransferDetails';
import type { Attraction, Hotel as HotelType, TravellerInfo } from '../types';
import { destinations } from '../data/destinations';
import { APP_CONFIG } from '../config/app';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { PRICING } from '../config/pricing';
import { useBookingState } from '../hooks/useBookingState';

interface SummaryPageProps {
  selectedDestination: string;
  tripIntent: TripIntent;
  dateRange: { from: Date; to: Date };
  selectedAttractions: Attraction[];
  selectedHotel: HotelType;
  travellerInfo: TravellerInfo;
  onBack: () => void;
  onNext: (amount: number) => void;
}

const FLUTTERWAVE_MAX_AMOUNT = 499999;

export function SummaryPage({
  selectedDestination,
  tripIntent,
  dateRange,
  selectedAttractions,
  selectedHotel,
  travellerInfo,
  onBack,
  onNext,
}: SummaryPageProps) {
  const [expandedAttraction, setExpandedAttraction] = React.useState<string | null>(null);
  const destination = destinations.find(d => d.id === selectedDestination);
  const numDays = differenceInDays(dateRange.to, dateRange.from);
  const isFullPackage = selectedAttractions[0]?.type === 'full_package';
  const [showBankTransfer, setShowBankTransfer] = React.useState(false);
  const { bookingId } = useBookingState();

  useScrollToTop(null);

  const calculateTotal = React.useMemo(() => {
    if (isFullPackage) {
      const attraction = selectedAttractions[0];
      if (!attraction.accommodation) {
        console.error('Full package attraction missing accommodation details:', attraction);
        return 0;
      }

      const baseAccommodationPrice = attraction.price * numDays;
      const accommodationTotal = travellerInfo.partySize === 'couple'
        ? baseAccommodationPrice + (baseAccommodationPrice * 0.5)
        : baseAccommodationPrice;

      const activitiesTotal = attraction.accommodation.activities
        .filter(activity => activity.included)
        .reduce((sum, activity) => sum + (activity.price || 0), 0);
      
      const partyMultiplier = travellerInfo.partySize === 'couple' ? 2 : 1;
      const total = accommodationTotal + (activitiesTotal * partyMultiplier);

      return total + PRICING.CURATION_FEE;
    }

    const multiplier = travellerInfo.partySize === 'couple' ? 2 : 1;
    const attractionsTotal = selectedAttractions.reduce((sum, attr) => sum + attr.price, 0) * multiplier;
    const accommodationTotal = selectedHotel.price * numDays;
    return attractionsTotal + accommodationTotal + PRICING.CURATION_FEE;
  }, [selectedAttractions, selectedHotel, numDays, travellerInfo.partySize, isFullPackage]);

  if (!destination) return null;

  if (showBankTransfer) {
    return (
      <BankTransferDetails
        amount={calculateTotal}
        bookingId={bookingId}
        customerEmail={travellerInfo.email}
        onBack={() => setShowBankTransfer(false)}
      />
    );
  }

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

      <div className="relative z-20 max-w-5xl mx-auto px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Your Dream Vacation Awaits
          </h1>
          <p className="text-xl text-white/90 text-center max-w-2xl">
            Review your personalized travel package
          </p>
        </div>

        <div className="relative">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Itinerary Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {destination.name} Adventure
                    </h2>
                    <p className="text-white/90">
                      {numDays} days of unforgettable experiences
                    </p>
                  </div>
                </div>

                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Itinerary</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {numDays} Days
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <h3 className="font-medium text-gray-700">Location</h3>
                      </div>
                      <p className="text-gray-900 font-medium">{destination.name}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <h3 className="font-medium text-gray-700">Dates</h3>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <h3 className="font-medium text-gray-700">Travelers</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Accommodation */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Hotel className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">Accommodation</h3>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{numDays} nights</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{selectedHotel.name}</p>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500">Check-in after 2 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experiences */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">Experiences</h3>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{selectedAttractions.length} selected</span>
                        </div>
                        <div className="space-y-3">
                          {selectedAttractions.map((attraction, index) => (
                            <div key={attraction.id}>
                              <button
                                onClick={() => {
                                  setExpandedAttraction(
                                    expandedAttraction === attraction.id ? null : attraction.id
                                  );
                                }}
                                className="w-full bg-gray-50 rounded-xl p-4 text-left transition-colors hover:bg-gray-100"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200">
                                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-gray-900">{attraction.name}</p>
                                      <ChevronRight 
                                        className={`w-5 h-5 text-gray-400 transition-transform ${
                                          expandedAttraction === attraction.id ? 'rotate-90' : ''
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </button>
                              {expandedAttraction === attraction.id && (
                                <div className="mt-2 p-4 bg-gray-50 rounded-xl animate-fadeIn">
                                  <p className="text-sm text-gray-600">{attraction.description}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:sticky lg:top-6 h-fit">
              <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <h2 className="text-xl font-semibold mb-2">Package Summary</h2>
                <p className="text-white/90">
                  {isFullPackage ? 'All-inclusive package' : 'Customized experience'} for{' '}
                  {travellerInfo.partySize === 'single' ? '1 person' : '2 people'}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {isFullPackage ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fee</span>
                        <span className="font-medium text-gray-900">
                          ₦{(selectedAttractions[0].price * numDays * 
                             (travellerInfo.partySize === 'couple' ? 1.5 : 1)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Activities</span>
                        <span className="font-medium text-gray-900">
                          ₦{(selectedAttractions[0].accommodation?.activities
                            .filter(activity => activity.included)
                            .reduce((sum, activity) => sum + (activity.price || 0), 0) * 
                            (travellerInfo.partySize === 'couple' ? 2 : 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attractions Total</span>
                        <span className="font-medium text-gray-900">
                          ₦{(selectedAttractions.reduce((sum, attr) => sum + attr.price, 0) * 
                             (travellerInfo.partySize === 'couple' ? 2 : 1)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accommodation ({numDays} nights)</span>
                        <span className="font-medium text-gray-900">
                          ₦{(selectedHotel.price * numDays).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600">Taxes & Service Charge</span>
                  <span className="font-medium text-gray-900">
                    ₦{PRICING.CURATION_FEE.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-blue-500">
                    ₦{calculateTotal.toLocaleString()}
                  </span>
                </div>

                {travellerInfo.wantsTransportQuote && (
                  <div className="bg-amber-50 rounded-xl p-4 mt-6">
                    <p className="text-sm text-amber-800">
                      Transportation options and pricing will be sent to you separately after booking.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (calculateTotal > FLUTTERWAVE_MAX_AMOUNT) {
                      setShowBankTransfer(true);
                    } else {
                      onNext(calculateTotal);
                    }
                  }}
                  className="w-full bg-blue-500 text-white px-4 sm:px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {calculateTotal > FLUTTERWAVE_MAX_AMOUNT ? 'Pay via Bank Transfer' : 'Complete Booking'}
                </button>
                <button
                  onClick={onBack}
                  className="w-full bg-white text-gray-600 px-4 sm:px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Change Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}