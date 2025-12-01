import { useRef, useCallback, useEffect } from 'react';

export const useSimulationSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sirenOscillatorRef = useRef<OscillatorNode | null>(null);
  const sirenGainRef = useRef<GainNode | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSirenPlayingRef = useRef(false);

  // Inicializar AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Som de sirene de ambulância (oscila entre duas frequências)
  const startSiren = useCallback(() => {
    if (isSirenPlayingRef.current) return;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Criar oscillator e gain node
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime); // Volume baixo
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      
      sirenOscillatorRef.current = oscillator;
      sirenGainRef.current = gainNode;
      isSirenPlayingRef.current = true;

      // Alternar frequência para criar efeito de sirene
      let isHigh = true;
      sirenIntervalRef.current = setInterval(() => {
        if (sirenOscillatorRef.current) {
          const freq = isHigh ? 600 : 800;
          sirenOscillatorRef.current.frequency.setValueAtTime(freq, ctx.currentTime);
          isHigh = !isHigh;
        }
      }, 500);

      console.log('Sirene iniciada');
    } catch (error) {
      console.error('Erro ao iniciar sirene:', error);
    }
  }, [getAudioContext]);

  // Parar sirene
  const stopSiren = useCallback(() => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    
    if (sirenOscillatorRef.current) {
      try {
        sirenOscillatorRef.current.stop();
        sirenOscillatorRef.current.disconnect();
      } catch (e) {
        // Ignorar erros ao parar
      }
      sirenOscillatorRef.current = null;
    }
    
    if (sirenGainRef.current) {
      sirenGainRef.current.disconnect();
      sirenGainRef.current = null;
    }
    
    isSirenPlayingRef.current = false;
    console.log('Sirene parada');
  }, []);

  // Som de notificação (beep curto)
  const playNotification = useCallback((type: 'success' | 'info' | 'warning' = 'info') => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Diferentes frequências para diferentes tipos
      const frequencies = {
        success: [880, 1100], // Dois tons ascendentes
        info: [660],
        warning: [440, 440], // Tom repetido
      };

      oscillator.type = type === 'success' ? 'sine' : 'square';
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const freqs = frequencies[type];
      const duration = type === 'success' ? 0.15 : 0.1;

      oscillator.frequency.setValueAtTime(freqs[0], ctx.currentTime);
      
      if (freqs.length > 1) {
        oscillator.frequency.setValueAtTime(freqs[1], ctx.currentTime + duration);
      }

      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * freqs.length);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration * freqs.length + 0.05);

      console.log(`Notificação: ${type}`);
    } catch (error) {
      console.error('Erro ao tocar notificação:', error);
    }
  }, [getAudioContext]);

  // Som de semáforo liberado
  const playTrafficLightCleared = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523, ctx.currentTime); // Dó
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // Mi
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // Sol

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);

      console.log('Som: Semáforo liberado');
    } catch (error) {
      console.error('Erro ao tocar som de semáforo:', error);
    }
  }, [getAudioContext]);

  // Som de chegada ao hospital
  const playArrival = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Fanfarra de sucesso
      const notes = [523, 659, 784, 1047]; // Dó, Mi, Sol, Dó (oitava)
      
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        const startTime = ctx.currentTime + index * 0.15;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });

      console.log('Som: Chegada ao hospital');
    } catch (error) {
      console.error('Erro ao tocar som de chegada:', error);
    }
  }, [getAudioContext]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopSiren();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopSiren]);

  return {
    startSiren,
    stopSiren,
    playNotification,
    playTrafficLightCleared,
    playArrival,
  };
};
