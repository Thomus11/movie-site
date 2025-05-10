// MpesaPayment.js
import React, { useState } from 'react';

const MpesaPayment = ({ amount, movieTitle, seats, onPaymentSuccess, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    // Validate phone number (Kenyan format)
    if (!phoneNumber.match(/^(\+254|0)[17]\d{8}$/)) {
      setError('Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX or +2547XXXXXXXX)');
      setIsProcessing(false);
      return;
    }

    try {
      // Simulate M-Pesa API call (in a real app, this would call your backend)
      console.log(`Initiating M-Pesa payment of KSh ${amount} for ${movieTitle}`);
      console.log(`Seats: ${seats.join(', ')}`);
      console.log(`Phone number: ${phoneNumber}`);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful payment
      onPaymentSuccess({
        transactionId: `MPESA${Date.now()}`,
        amount,
        phoneNumber,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1F1F1F] rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6">Complete Payment via M-Pesa</h2>
        
        <div className="mb-6 bg-[#0B0C10] p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Movie:</span>
            <span>{movieTitle}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Seats:</span>
            <span>{seats.join(', ')}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Amount:</span>
            <span>KSh {amount}</span>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-400 mb-2">
              Enter M-Pesa Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="e.g., 0712345678"
              className="w-full px-4 py-3 bg-[#0B0C10] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-transparent hover:bg-[#2A2A2A] text-white py-3 px-4 rounded-lg transition-colors border border-[#2A2A2A]"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay via M-Pesa'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-400">
          <p>You will receive an M-Pesa push notification to confirm payment.</p>
        </div>
      </div>
    </div>
  );
};

export default MpesaPayment;