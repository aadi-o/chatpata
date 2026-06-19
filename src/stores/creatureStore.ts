import { create } from 'zustand';

export type Mood = 'idle' | 'happy' | 'thinking' | 'typing' | 'excited' | 'confused' | 'roasting' | 'celebrating' | 'sleepy' | 'proud' | 'chaos' | 'sad';

interface CreatureState {
  mood: Mood;
  energy: number;
  responseLength: 'short' | 'medium' | 'long' | null;
  responseSentiment: 'savage' | 'friendly' | 'chaotic' | 'cool' | 'shocked' | null;
  setMood: (mood: Mood) => void;
  setEnergy: (energy: number) => void;
  setResponseMeta: (length: 'short' | 'medium' | 'long' | null, sentiment: 'savage' | 'friendly' | 'chaotic' | 'cool' | 'shocked' | null) => void;
}

export const useCreatureStore = create<CreatureState>((set) => ({
  mood: 'idle',
  energy: 100,
  responseLength: null,
  responseSentiment: null,
  setMood: (mood) => set({ mood }),
  setEnergy: (energy) => set({ energy }),
  setResponseMeta: (length, sentiment) => set({ responseLength: length, responseSentiment: sentiment }),
}));
