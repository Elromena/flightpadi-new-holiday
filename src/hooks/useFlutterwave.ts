import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FlutterwaveConfig } from 'flutterwave-react-v3';
import { sendWebhook } from '../services/webhook';
import { generateBookingId } from '../utils/bookingId';
import { APP_CONFIG } from '../config/app';
import { useBookingState } from './useBookingState';

interface PaymentConfig {
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  meta: Record<string, any>;
}

export function useFlutterwave() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [txRef, setTxRef] = React.useState<string>('');
  const { bookingId, tripIntent } = useBookingState();

  // Clean up Flutterwave iframe on unmount
  React.useEffect(() => {
    return () => {
      const iframe = document.querySelector('iframe[name="checkout"]');
      if (iframe) {
        iframe.remove();
      }
    };
  }, []);

  const config = useCallback((paymentConfig: PaymentConfig): FlutterwaveConfig => {
    const { amount, customerEmail, customerName, customerPhone, meta } = paymentConfig;

    if (!import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY) {
      console.error('Flutterwave public key is missing');
      throw new Error('Payment configuration error');
    }

    const newTxRef = Date.now().toString();
    setTxRef(newTxRef);

    return {
      public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as string,
      tx_ref: newTxRef,
      amount,
      currency: 'NGN',
      payment_options: 'card,ussd,banktransfer',
      customer: {
        email: customerEmail,
        name: customerName,
        phonenumber: customerPhone,
      },
      customizations: {
        title: `${APP_CONFIG.company.name} Holiday`,
        description: 'Your Dream Vacation Package',
        logo: APP_CONFIG.company.logo,
      },
      meta,
      callback: async (response) => {
        console.log('Payment callback received:', {
          status: response.status,
          amount: response.amount,
          customer: response.customer.email,
          reference: response.tx_ref
        });

        setIsProcessing(true);
        const timestamp = new Date().toISOString();

        try {
          if (response.status === 'successful') {
            // Send webhook for successful payment
            console.log('Processing successful payment:', {
              amount: response.amount,
              currency: response.currency,
              status: response.status,
              reference: response.tx_ref,
              timestamp,
              bookingId,
              customer: meta.customer.email,
              destination: meta.trip.destination.name
            });

            await sendWebhook({
              bookingId: bookingId,
              intent: tripIntent!,
              transaction: {
                amount: response.amount,
                currency: response.currency,
                status: response.status,
                reference: response.tx_ref,
                timestamp,
              },
              customer: meta.customer,
              trip: meta.trip,
              stage: 'payment_completed',
            });

            navigate('/payment/success', { 
              replace: true, 
              state: { 
                verified: true,
                transactionId: txRef,
                amount: response.amount,
                customerEmail: response.customer.email,
                destinationId: meta.trip.destination.id
              }
            });
          } else {
            console.error('Payment failed:', {
              status: response.status,
              amount: response.amount,
              customer: response.customer.email,
              reference: response.tx_ref,
              error: response.error || 'Unknown error'
            });
            
            // Send webhook for failed payment
            await sendWebhook({
              bookingId,
              intent: tripIntent!,
              transaction: {
                amount: response.amount,
                currency: response.currency,
                status: 'failed',
                reference: response.tx_ref,
                timestamp,
              },
              customer: meta.customer,
              trip: meta.trip,
              stage: 'payment_failed',
            });

            navigate('/payment/failed', { 
              replace: true,
              state: { error: 'Payment was not successful' }
            });
          }
        } catch (error) {
          const errorDetails = {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            transactionRef: response.tx_ref,
            customer: response.customer.email
          };
          
          console.error('Payment processing error:', errorDetails);
          
          navigate('/payment/failed', { 
            replace: true,
            state: { error: 'An error occurred while processing payment' }
          });
        } finally {
          setIsProcessing(false);
          // @ts-ignore - FlutterWave types are not up to date
          window.FlutterwaveCheckout?.close();
        }
      },
      onclose: () => {
        console.log('Payment modal closed', {
          isProcessing,
          timestamp: new Date().toISOString()
        });
        
        if (!isProcessing) {
          navigate('/payment/cancelled', { replace: true });
        }
      }
    }
  }, [navigate, isProcessing, bookingId, tripIntent]);

  return { config, isProcessing, txRef };
}