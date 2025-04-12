import React from 'react';
import { ArrowLeft, ArrowRight, Search, Building, Star, Check, ChevronRight } from 'lucide-react';
import { hotels } from '../data/hotels';
import { attractions } from '../data/attractions';
import { HotelSuggestion } from '../components/HotelSuggestion';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { APP_CONFIG } from '../config/app';
import type { Hotel } from '../types';

interface AccommodationPickerProps {
  selectedDestination: string;
  selectedPackageType: 'regular' | 'full_package';
  packageAccommodation?: string;
  onBack: () => void;
  onNext: (hotel: Hotel) => void;
}

export function AccommodationPicker({
  selectedDestination,
  selectedPackageType,
  packageAccommodation,
  onBack,
  onNext
}: AccommodationPickerProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedHotel, setExpandedHotel] = React.useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = React.useState<Hotel | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [showSuggestionForm, setShowSuggestionForm] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({
    rooms: false,
    amenities: false,
    activities: false,
    policies: false
  });

  useScrollToTop(null);

  const filteredHotels = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return hotels
      .filter(hotel => hotel.destinationId === selectedDestination)
      .filter(hotel =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.description.toLowerCase().includes(query)
      );
  }, [selectedDestination, searchQuery]);

  if (selectedPackageType === 'full_package' && packageAccommodation) {
    const selectedAttraction = attractions.find(a => 
      a.type === 'full_package' && 
      a.name === packageAccommodation && 
      a.destinationId === selectedDestination
    );

    if (!selectedAttraction || !selectedAttraction.accommodation) return null;

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
              Welcome to {packageAccommodation}
            </h1>
            <p className="text-xl text-white/90 text-center max-w-2xl">
              Your luxury all-inclusive stay awaits
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-16">
            <div className="relative aspect-[21/9] overflow-hidden">
              <img
                src={selectedAttraction.image}
                alt={selectedAttraction.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-base text-white/90 max-w-3xl leading-relaxed">
                  {selectedAttraction.description}
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Room Preview */}
              <div className="p-6">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, rooms: !prev.rooms }))}
                  className="flex items-center justify-between w-full group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Destination Preview
                  </h3>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform group-hover:text-blue-600
                    ${expandedSections.rooms ? 'rotate-90' : ''}`}
                  />
                </button>
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-300
                  ${expandedSections.rooms ? 'mt-4 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  {selectedAttraction.accommodation.roomImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Room ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                    />
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="p-6">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, amenities: !prev.amenities }))}
                  className="flex items-center justify-between w-full group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Destination Amenities
                  </h3>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform group-hover:text-blue-600
                    ${expandedSections.amenities ? 'rotate-90' : ''}`}
                  />
                </button>
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 transition-all duration-300
                  ${expandedSections.amenities ? 'mt-4 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  {selectedAttraction.accommodation.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="text-sm hover:text-blue-600 transition-colors">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="p-6">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, activities: !prev.activities }))}
                  className="flex items-center justify-between w-full group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Package Activities
                  </h3>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform group-hover:text-blue-600
                    ${expandedSections.activities ? 'rotate-90' : ''}`}
                  />
                </button>
                <div className={`grid gap-3 transition-all duration-300
                  ${expandedSections.activities ? 'mt-4 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  {selectedAttraction.accommodation.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        activity.included ? 'bg-green-500' : 'bg-gray-300'
                      }`} style={{ flexShrink: 0 }} />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{activity.name}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <span className={`text-xs font-medium mt-1 inline-block px-2 py-1 rounded-full ${
                          activity.included
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`} style={{ width: 'fit-content' }}>
                          {activity.included ? 'Included' : 'Available for Purchase'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="p-6">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, policies: !prev.policies }))}
                  className="flex items-center justify-between w-full group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Destination Policies
                  </h3>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform group-hover:text-blue-600
                    ${expandedSections.policies ? 'rotate-90' : ''}`}
                  />
                </button>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300
                  ${expandedSections.policies ? 'mt-4 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">Check-in Time</p>
                    <p className="text-sm text-gray-600">{selectedAttraction.accommodation.policies.checkIn}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">Check-out Time</p>
                    <p className="text-sm text-gray-600">{selectedAttraction.accommodation.policies.checkOut}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-6 mt-8 flex justify-center gap-4">
            <button
              className="bg-white text-gray-600 px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
              Change Adventures
            </button>
            <button
              className="bg-purple-500 text-white px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={() => onNext(selectedAttraction)}
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
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

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Choose Your Perfect Stay
          </h1>
          <p className="text-xl text-white/90 text-center mb-8">
            Select where you'll rest and recharge
          </p>
          <div className="w-full max-w-xl relative flex gap-2">
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-2xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none"
            />
            <Search className="w-5 h-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              onClick={() => {
                setSearchQuery('');
                setExpandedHotel(null);
                setShowSuggestionForm(true);
              }}
              className="px-4 py-2 rounded-2xl border-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Building className="w-5 h-5 sm:block hidden" />
              <span className="sm:inline">
                <span className="sm:hidden">New</span>
                <span className="hidden sm:inline">Suggest Hotel</span>
              </span>
            </button>
          </div>
        </div>

        {(filteredHotels.length === 0 || showSuggestionForm) ? (
          <HotelSuggestion
            searchQuery={searchQuery}
            onClose={() => {
              setSearchQuery('');
              setShowSuggestionForm(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 group ${
                  expandedHotel === hotel.id ? 'h-[480px]' : 'h-[200px]'
                } ${
                  selectedHotel?.id === hotel.id ? 'ring-4 ring-white' : expandedHotel === hotel.id ? 'ring-2 ring-white/60' : ''
                }`}
                onClick={() => {
                  if (expandedHotel === hotel.id) {
                    setExpandedHotel(null);
                  } else {
                    setExpandedHotel(hotel.id);
                  }
                }}
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${
                  expandedHotel === hotel.id
                    ? 'from-black/90 via-black/70 to-black/30'
                    : 'from-black/70 to-black/20'
                }`} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{hotel.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{hotel.rating}</span>
                    </div>
                  </div>

                  {expandedHotel === hotel.id && (
                    <div className="mt-3 space-y-3 transition-opacity duration-300">
                      <p className="text-white/90 text-sm">{hotel.description}</p>
                      
                      {/* Room Preview */}
                      <div className="grid grid-cols-3 gap-2">
                        {hotel.roomImages.map((image, index) => (
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(image);
                            }}
                            key={index}
                            src={image}
                            alt={`${hotel.name} Room ${index + 1}`}
                            className="w-full aspect-video object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                          />
                        ))}
                      </div>
                      
                      {/* Features */}
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {hotel.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-sm text-white/90">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-white">
                          <span className="text-lg font-bold">₦{hotel.price.toLocaleString()}</span>
                          <span className="text-sm text-white/80">/night</span>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                            selectedHotel?.id === hotel.id
                              ? 'bg-green-500 text-white cursor-default'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          } transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHotel(hotel);
                          }}
                        >
                          {selectedHotel?.id === hotel.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {selectedHotel?.id === hotel.id && (
                  <div className="absolute top-4 right-4 bg-white text-blue-500 p-2 rounded-full">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              alt="Room preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}

        {!showSuggestionForm && (
          <div className="sticky bottom-8 mt-12 flex justify-center gap-4">
            <button
              className="bg-white text-gray-600 px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
              Change Adventures
            </button>
            {selectedHotel && (
              <button
                className="bg-blue-500 text-white px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
                onClick={() => onNext(selectedHotel)}
              >
                Enter Your Details
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}