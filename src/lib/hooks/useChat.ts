import { useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useCreatureStore } from '../../stores/creatureStore';
import { Message } from '../../types';

export function useChat() {
  const { messages, addMessage, updateLastMessage, setIsTyping, personalityMode } = useChatStore();
  const { setMood } = useCreatureStore();
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    const userMsg: Message = {
      id: 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
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
        id: 'ai-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
        role: 'AI',
        content: '',
        createdAt: new Date(),
      };
      addMessage(aiMsg);
      setMood('typing');
      setIsTyping(true);

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
      
      // Analyze response length
      let lenClass: 'short' | 'medium' | 'long' = 'medium';
      if (completeResponse.length < 35) {
        lenClass = 'short';
      } else if (completeResponse.length > 95) {
        lenClass = 'long';
      }

      // Analyze response sentiment
      let sentClass: 'savage' | 'friendly' | 'chaotic' | 'cool' | 'shocked' = 'cool';
      
      if (
        lowerResp.includes('saala') || 
        lowerResp.includes('dhakkan') || 
        lowerResp.includes('gadha') || 
        lowerResp.includes('ullu') || 
        lowerResp.includes('kamina') || 
        lowerResp.includes('fattu') || 
        lowerResp.includes('savage') || 
        lowerResp.includes('roast') || 
        lowerResp.includes('shakl') || 
        lowerResp.includes('chirkut') ||
        lowerResp.includes('😏')
      ) {
        sentClass = 'savage';
        setMood('roasting');
      } else if (
        lowerResp.includes('💀') || 
        lowerResp.includes('😭') || 
        lowerResp.includes('🤡') ||
        lowerResp.includes('chaos') ||
        lowerResp.includes('crazy')
      ) {
        sentClass = 'chaotic';
        setMood('chaos');
      } else if (
        lowerResp.includes('😊') || 
        lowerResp.includes('🥳') || 
        lowerResp.includes('party') ||
        lowerResp.includes('great') ||
        lowerResp.includes('proud') ||
        lowerResp.includes('🤝')
      ) {
        sentClass = 'friendly';
        setMood('happy');
      } else if (
        lowerResp.includes('🙄') || 
        lowerResp.includes('💅') ||
        lowerResp.includes('whatever') ||
        lowerResp.includes('cool')
      ) {
        sentClass = 'cool';
        setMood('proud');
      } else {
        if (lenClass === 'long') {
          setMood('sleepy');
        } else if (lenClass === 'short') {
          setMood('excited');
        } else {
          setMood('idle');
        }
      }

      const { setResponseMeta } = useCreatureStore.getState();
      setResponseMeta(lenClass, sentClass);

    } catch (err: any) {
      console.error(err);
      setError('Failed to connect to the NIG AI intelligence core.');
      setMood('sad');
    } finally {
      setIsTyping(false);
    }
  };

  return { sendMessage, error };
}
