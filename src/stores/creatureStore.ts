import { create } from 'zustand';

export type Mood = 'idle' | 'happy' | 'thinking' | 'typing' | 'excited' | 'confused' | 'roasting' | 'celebrating' | 'sleepy' | 'proud' | 'chaos' | 'sad';

interface CreatureState {
  mood: Mood;
  energy: number;
  setMood: (mood: Mood) => void;
  setEnergy: (energy: number) => void;
}

export const useCreatureStore = create<CreatureState>((set) => ({
  mood: 'idle',
  energy: 100,
  setMood: (mood) => set({ mood }),
  setEnergy: (energy) => set({ energy }),
}));
