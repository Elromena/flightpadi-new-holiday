import React from 'react';
import { Building, Send } from 'lucide-react';
import { sendWebhook } from '../services/webhook';

interface HotelSuggestionProps {
  searchQuery: string;
  onClose: () => void;
}

export function HotelSuggestion({ searchQuery, onClose }: HotelSuggestionProps) {
  const [suggestion, setSuggestion] = React.useState(searchQuery);
  const [description, setDescription] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    if (!lastName.trim()) {
      setError('Please enter your last name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendWebhook({
        stage: 'suggestion_submitted',
        suggestion: {
          type: 'hotel',
          name: suggestion,
          description,
          firstName,
          lastName,
          email,
          timestamp: new Date().toISOString()
        }
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send suggestion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Thanks for Your Suggestion!
        </h3>
        <p className="text-white/80 mb-6">
          We're always expanding our hotel options based on traveler recommendations.
        </p>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          Continue Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-8 px-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Building className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Suggest a Hotel
      </h3>
      <p className="text-white/80 mb-6">
        Can't find your preferred hotel? Tell us where you'd love to stay, and we'll consider adding it to our collection.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Hotel name"
            className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none"
            required
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none"
            required
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What makes this hotel special? (optional)"
            className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:ring-0 transition-all outline-none resize-none h-32"
          />
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Submit Suggestion'}
          </button>
        </div>
      </form>
    </div>
  );
}