import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose }) => {
  const { submitCreditRequest, error, loading } = useCredits();
  const [transactionId, setTransactionId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!transactionId.trim()) {
      setLocalError('Please enter your transaction ID.');
      return;
    }

    try {
      await submitCreditRequest(transactionId);
      setSubmitted(true);
    } catch (err: any) {
      // Handled by hook error state
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="relative w-full max-w-sm p-8 bg-zinc-950 border border-white/10 rounded-lg shadow-2xl text-white overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-white/5 text-white rounded-full flex items-center justify-center mx-auto mb-4 border border-white/15 animate-pulse">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Claim Received</h3>
                <p className="text-neutral-450 text-[11px] mb-2 leading-relaxed">
                  We are validating your transaction ID. 10 credits will be credited to your balance within 24 hours.
                </p>
                <p className="text-neutral-500 text-[10px] mb-6 italic leading-relaxed">
                  You have to send a mail on <a href="mailto:trickyshubham@gmail.com" className="text-white hover:underline">trickyshubham@gmail.com</a> to get your credits faster.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setTransactionId('');
                    onClose();
                  }}
                  className="px-6 py-2 rounded bg-white text-black text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Add Balance</h3>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-wider mt-1">₹100 for 10 scanner credits</p>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center bg-black/40 p-6 rounded border border-white/5">
                  <div className="w-40 h-40 bg-white p-2 rounded flex items-center justify-center shadow-lg relative">
                    <img src="/QR.png" alt="UPI QR Code" className="w-full h-full object-contain rounded" />
                  </div>
                  <span className="text-[10px] text-neutral-450 mt-4 font-mono select-all">UPI ID: shubhamnman2124@okaxis</span>
                  <p className="text-[9px] text-neutral-500 mt-2 text-center max-w-[280px] leading-relaxed">
                    You have to send the screenshot of the payment to the email ID <a href="mailto:trickyshubham@gmail.com" className="text-white hover:underline">trickyshubham@gmail.com</a>.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(error || localError) && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-450 text-[11px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="font-medium">{error || localError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-neutral-450 uppercase tracking-widest">
                      UPI Ref / Transaction ID (12 Digits)
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-black border border-white/10 rounded text-white placeholder-neutral-700 focus:outline-none focus:border-white/40 text-xs font-mono"
                      placeholder="e.g. 301234567890"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Submitting...' : 'Submit Claim'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default BuyCreditsModal;
