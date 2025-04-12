import React from 'react';
import { Copy, Check, ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../config/app';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface BankTransferDetailsProps {
  amount: number;
  bookingId: string;
  customerEmail: string;
  onBack: () => void;
}

export function BankTransferDetails({ amount, bookingId, customerEmail, onBack }: BankTransferDetailsProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [expandedSection, setExpandedSection] = React.useState<'account' | 'steps' | null>('account');
  const navigate = useNavigate();

  useScrollToTop(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
      <div className="relative z-20 max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600">
            <h2 className="text-2xl font-bold text-white mb-2">Bank Transfer Details</h2>
            <p className="text-white/90">Complete your payment via bank transfer</p>
          </div>

          {/* Amount Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount to Pay</span>
              <span className="text-2xl font-bold text-gray-900">₦{amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setExpandedSection(expandedSection === 'account' ? null : 'account')}
              className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Account Details</span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSection === 'account' ? 'rotate-180' : ''
              }`} />
            </button>

            {expandedSection === 'account' && (
              <div className="px-6 pb-6 space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={APP_CONFIG.company.bank.logo}
                    alt={APP_CONFIG.company.bank.name}
                    className="h-8 object-contain"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{APP_CONFIG.company.bank.name}</p>
                    <p className="text-sm text-gray-500">{APP_CONFIG.company.bank.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Account Number</p>
                      <p className="font-mono text-lg font-medium text-gray-900">
                        {APP_CONFIG.company.bank.accountNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(APP_CONFIG.company.bank.accountNumber, 'account')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'account' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Account Name</p>
                      <p className="font-medium text-gray-900">{APP_CONFIG.company.bank.accountName}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(APP_CONFIG.company.bank.accountName, 'name')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'name' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Transaction Description</p>
                      <p className="font-mono text-gray-900">{bookingId}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(bookingId, 'description')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'description' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps Section */}
          <div>
            <button
              onClick={() => setExpandedSection(expandedSection === 'steps' ? null : 'steps')}
              className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Next Steps</span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSection === 'steps' ? 'rotate-180' : ''
              }`} />
            </button>

            {expandedSection === 'steps' && (
              <div className="px-6 pb-6">
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">Make the transfer</p>
                      <p className="text-gray-600 text-sm">
                        Transfer ₦{amount.toLocaleString()} to the account details above
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">Confirm payment on WhatsApp</p>
                      <p className="text-gray-600 text-sm">
                        Click the button below to share proof of payment with the team for confirmation.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50">
            <a
              onClick={() => {
                sessionStorage.removeItem('bookingState');
                window.location.href = 'https://flightpadi.com/travel-guides/';
              }}
              href={`https://wa.me/${APP_CONFIG.social.whatsapp.replace(/[^0-9]/g, '')}?text=Hello, I've completed my payment for booking ${bookingId}. Here's my payment confirmation screenshot:`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              I've Completed Payment
            </a>

            <div className="h-4" />

            <button
              onClick={onBack}
              className="w-full bg-white text-gray-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Change Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}