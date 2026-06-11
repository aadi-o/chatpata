import { useState } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useCreatureStore } from '../stores/creatureStore';
import { Message } from '../types';

export function useChat() {
  const { messages, addMessage, updateLastMessage, setIsTyping, personalityMode } = useChatStore();
  const { setMood } = useCreatureStore();
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content,
      createdAt: new Date(),
    };
    
    addMessage(userMsg);
    setIsTyping(true);
    setMood('thinking');

    try {
      const lowerReq = content.toLowerCase();
      if (lowerReq.includes('roast')) setMood('roasting');
      else if (lowerReq.includes('stupid') || lowerReq.includes('chaos')) setMood('chaos');
      else if (lowerReq.includes('good night') || lowerReq.includes('sleep')) setMood('sleepy');

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          personalityMode
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'AI',
        content: '',
        createdAt: new Date(),
      };
      addMessage(aiMsg);
      setMood('typing');
      setIsTyping(false);

      const decoder = new TextDecoder();
      let completeResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkInfo = decoder.decode(value, { stream: true });
        const lines = chunkInfo.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                setError(data.error);
                updateLastMessage('\n[Error: ' + data.error + ']');
                setMood('sad');
              } else if (data.text) {
                updateLastMessage(data.text);
                completeResponse += data.text;
              }
            } catch (e) {
              console.error('Error parsing JSON from stream', e);
            }
          }
        }
      }
      
      const lowerResp = completeResponse.toLowerCase();
      if (lowerResp.includes('🥳') || lowerResp.includes('party')) setMood('celebrating');
      else if (lowerResp.includes('😏') || lowerResp.includes('roast')) setMood('roasting');
      else setMood('idle');

    } catch (err: any) {
      console.error(err);
      setError('Failed to connect to the ChatPata intelligence core.');
      setMood('sad');
    } finally {
      setIsTyping(false);
    }
  };

  return { sendMessage, error };
}
