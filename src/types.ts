
export type Section = 'oracle' | 'pantheon' | 'scriptures' | 'visions';
export type Language = 'fr' | 'en';

export interface GodInfo {
  name: string;
  origin: string;
  domain: string;
  description: string;
  mythology: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface BibleInsight {
  topic: string;
  explanation: string;
  verses: string[];
  historicalContext: string;
}
