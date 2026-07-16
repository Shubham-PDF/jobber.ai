import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from './useAuth';

export interface CreditRequest {
  id: string;
  transaction_id: string;
  amount_inr: number;
  credits_requested: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const useCredits = () => {
  const { refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<CreditRequest[]>([]);

  const submitCreditRequest = async (transactionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/credits/request/', { transaction_id: transactionId });
      await refreshUserData();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.transaction_id?.[0] || 'Failed to submit request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/credits/history/');
      setRequests(res.data);
    } catch (err: any) {
      setError('Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    requests,
    submitCreditRequest,
    fetchRequestHistory,
  };
};
