export interface Message {
  id: string;
  role: 'USER' | 'AI' | 'SYSTEM';
  content: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
}
