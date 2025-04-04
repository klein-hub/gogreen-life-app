import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { carbonService, CarbonFootprint } from '../services/carbon';

export function useCarbon() {
  const { session } = useAuth();
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      loadCarbonFootprint();
    }
  }, [session?.user?.id]);

  const loadCarbonFootprint = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carbonService.getCarbonFootprint(session!.user!.id);
      setFootprint(data);
    } catch (e) {
      console.error('Error loading carbon footprint:', e);
      setError('Failed to load carbon footprint data');
    } finally {
      setLoading(false);
    }
  };

  const saveCarbonFootprint = async (data: Omit<CarbonFootprint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      const savedData = await carbonService.saveCarbonFootprint(data);
      if (savedData) {
        setFootprint(savedData);
      }
      return savedData;
    } catch (e) {
      console.error('Error saving carbon footprint:', e);
      setError('Failed to save carbon footprint data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const calculateEmissions = (data: CarbonFootprint) => {
    return carbonService.calculateEmissions(data);
  };

  return {
    footprint,
    loading,
    error,
    loadCarbonFootprint,
    saveCarbonFootprint,
    calculateEmissions
  };
}