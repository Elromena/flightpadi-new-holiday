import React from 'react';
import { ArrowLeft, ArrowRight, Phone, User, Mail, Phone as PhoneIcon, MapPin, Users } from 'lucide-react';
import type { TravellerInfo, TravelPartySize } from '../types';
import { destinations } from '../data/destinations';
import { attractions } from '../data/attractions';
import { hotels } from '../data/hotels';
import { PRICING } from '../config/pricing';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { sendWebhook } from '../services/webhook';
import { generateBookingId } from '../utils/bookingId';
import { APP_CONFIG } from '../config/app';

interface BioDataCollectorProps {
  selectedDestination: string;
  tripIntent: TripIntent;
  selectedAttractions: Attraction[];
  selectedHotel: Hotel | null;
  dateRange: DateRange | undefined;
  bookingId: string;
  onBack: () => void;
  onNext: (info: TravellerInfo) => void;
}

export function BioDataCollector({
  selectedDestination,
  tripIntent,
  selectedAttractions,
  selectedHotel,
  dateRange,
  bookingId,
  onBack,
  onNext
}: BioDataCollectorProps) {
  const [formData, setFormData] = React.useState<TravellerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    partySize: 'single',
    needsTransport: false,
    originCity: '',
    wantsTransportQuote: false
  });

  useScrollToTop(null);

  const [errors, setErrors] = React.useState<Partial<Record<keyof TravellerInfo, string>>>({});
  const destination = destinations.find(d => d.id === selectedDestination);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TravellerInfo, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'Please enter a valid phone number';
    }
    if (formData.needsTransport && !formData.originCity) {
      newErrors.originCity = 'Please select your origin city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const destination = destinations.find(d => d.id === selectedDestination);
        if (!destination) return;

        const packageType = selectedAttractions[0]?.type || 'regular';
        const duration = dateRange?.from && dateRange?.to
          ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
          : undefined;

        // Send webhook before proceeding
        await sendWebhook({
          bookingId,
          bookingId,
          intent: tripIntent,
          tripIntent,
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.whatsapp,
            partySize: formData.partySize,
            location: {
              needsTransport: formData.needsTransport,
              originCity: formData.originCity,
              wantsTransportQuote: formData.wantsTransportQuote,
            },
          },
          trip: {
            destination: {
              id: selectedDestination,
              name: destination.name,
            },
            dates: dateRange?.from && dateRange?.to ? {
              startDate: dateRange.from.toISOString(),
              endDate: dateRange.to.toISOString(),
              duration,
            } : undefined,
            package: {
              type: packageType,
              attractions: selectedAttractions.map(attraction => ({
                id: attraction.id,
                name: attraction.name,
                price: attraction.price,
              })),
              accommodation: selectedHotel ? {
                id: selectedHotel.id,
                name: selectedHotel.name,
                price: selectedHotel.price,
                nights: duration,
              } : undefined,
            },
          },
          pricing: {
            subtotal: selectedAttractions.reduce((sum, attr) => sum + attr.price, 0) +
              (selectedHotel ? selectedHotel.price * (duration || 0) : 0),
            curationFee: PRICING.CURATION_FEE,
            total: selectedAttractions.reduce((sum, attr) => sum + attr.price, 0) +
              (selectedHotel ? selectedHotel.price * (duration || 0) : 0) + PRICING.CURATION_FEE,
            breakdown: {
              attractions: selectedAttractions.reduce((sum, attr) => sum + attr.price, 0),
              accommodation: selectedHotel ? selectedHotel.price * (duration || 0) : 0,
              fees: PRICING.CURATION_FEE,
            },
          },
          stage: 'bio_completed',
        });
      } catch (error) {
        // Log the error but don't block the flow
        console.error('Failed to send bio completion webhook:', error);
      }

      // Continue with the flow regardless of webhook success/failure
      onNext(formData);
    }
  };

  const handlePartySizeChange = (size: TravelPartySize) => {
    if (size === 'group') {
      return;
    }
    setFormData(prev => ({ ...prev, partySize: size }));
  };

  if (!destination) return null;

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
      <div className="relative z-20 max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Almost There!
          </h1>
          <p className="text-xl text-white/90 text-center max-w-2xl">
            Please provide your details to complete your booking
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                <User className="w-4 h-4" />
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.firstName ? 'border-red-300' : 'border-white/20'
                } bg-white/10 text-white placeholder-white/60 focus:border-white/40 focus:ring-0 transition-all outline-none`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                <User className="w-4 h-4" />
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.lastName ? 'border-red-300' : 'border-white/20'
                } bg-white/10 text-white placeholder-white/60 focus:border-white/40 focus:ring-0 transition-all outline-none`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.email ? 'border-red-300' : 'border-white/20'
                } bg-white/10 text-white placeholder-white/60 focus:border-white/40 focus:ring-0 transition-all outline-none`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                <PhoneIcon className="w-4 h-4" />
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.whatsapp ? 'border-red-300' : 'border-white/20'
                } bg-white/10 text-white placeholder-white/60 focus:border-white/40 focus:ring-0 transition-all outline-none`}
                placeholder="+234 XXX XXX XXXX"
              />
              {errors.whatsapp && (
                <p className="mt-2 text-sm text-red-400">{errors.whatsapp}</p>
              )}
            </div>
          </div>

          {/* Travel Party Size */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
              <Users className="w-4 h-4" />
              How many people are traveling?
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handlePartySizeChange('single')}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                  formData.partySize === 'single'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                }`}
              >
                Just Me
              </button>
              <button
                onClick={() => handlePartySizeChange('couple')}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                  formData.partySize === 'couple'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                }`}
              >
                Couple
              </button>
              <button
                onClick={() => handlePartySizeChange('group')}
                className="px-6 py-3 rounded-lg font-medium text-sm bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 transition-all group relative"
              >
                Group (3+)
                <div className="absolute top-full mt-2 left-0 w-80 p-4 rounded-lg bg-white shadow-xl border border-white/20 z-10 hidden group-hover:block">
                  <div className="flex items-start gap-3 text-left">
                    <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Contact us for group bookings</p>
                      <p className="text-gray-600 mt-1">Call {APP_CONFIG.social.whatsapp} for custom group rates and special arrangements</p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Transportation */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <MapPin className="w-4 h-4" />
                Are you coming from outside {destination.name}?
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, needsTransport: true }))}
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                    formData.needsTransport
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, needsTransport: false, originCity: '' }))}
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                    formData.needsTransport === false
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {formData.needsTransport && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                    <MapPin className="w-4 h-4" /> 
                    Where are you coming from?
                  </label>
                  <input
                    type="text"
                    value={formData.originCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, originCity: e.target.value }))}
                    placeholder="e.g., London, United Kingdom or Lagos, Nigeria"
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.originCity ? 'border-red-300' : 'border-white/20'
                    } bg-white/10 text-white placeholder-white/60 focus:border-white/40 focus:ring-0 transition-all outline-none`}
                  />
                  {errors.originCity && (
                    <p className="mt-2 text-sm text-red-400">{errors.originCity}</p>
                  )}
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-4 border border-white/20">
                  <h4 className="font-medium text-white">Need help with transportation?</h4>
                  <p className="text-sm text-white/90">
                    We can arrange your transportation to {destination.name}. After booking, we'll send you available flight
                    and land transport options with prices (not included in the vacation package).
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, wantsTransportQuote: true }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.wantsTransportQuote
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Yes, send me options
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, wantsTransportQuote: false }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.wantsTransportQuote === false
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      No thanks, I'll manage
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-8 mt-12 flex justify-center gap-4">
          <button
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
            Change Accommodation
          </button>
          <button
            className="bg-blue-500 text-white px-4 sm:px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            onClick={handleSubmit}
          >
            Review & Pay
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}