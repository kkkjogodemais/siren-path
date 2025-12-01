import { useState, useEffect, useCallback } from 'react';
import { 
  TrafficData, 
  getRealtimeTrafficData,
  trafficService 
} from '@/services/trafficSimulationService';

interface UseTrafficDataOptions {
  autoUpdate?: boolean;
  updateInterval?: number;
}

export function useTrafficData(options: UseTrafficDataOptions = {}) {
  const { autoUpdate = true, updateInterval = 5000 } = options;
  
  const [trafficData, setTrafficData] = useState<TrafficData>(() => 
    getRealtimeTrafficData()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshData = useCallback(() => {
    setIsLoading(true);
    // Simula um pequeno delay como se fosse uma chamada de API
    setTimeout(() => {
      const newData = getRealtimeTrafficData();
      setTrafficData(newData);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (!autoUpdate) return;

    const unsubscribe = trafficService.subscribe(data => {
      setTrafficData(data);
      setLastUpdate(new Date());
    });

    trafficService.start(updateInterval);

    return () => {
      unsubscribe();
      trafficService.stop();
    };
  }, [autoUpdate, updateInterval]);

  const simulateSpike = useCallback(() => {
    trafficService.simulateTrafficSpike();
  }, []);

  return {
    trafficData,
    isLoading,
    lastUpdate,
    refreshData,
    simulateSpike
  };
}
