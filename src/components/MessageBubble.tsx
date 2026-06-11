import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'USER';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300 flex-shrink-0 flex items-center justify-center mt-auto mb-1 shadow-sm">
          <span className="text-sm font-black text-orange-600">AI</span>
        </div>
      )}
      <div 
        className={cn(
          "max-w-[85%] md:max-w-[75%] p-4 shadow-sm relative overflow-hidden",
          isUser 
            ? "bg-[#111111] text-white rounded-3xl rounded-br-sm shadow-md" 
            : "bg-white border border-[#EFEFEA] text-[#111111] rounded-3xl rounded-bl-sm shadow-sm"
        )}
      >
        <div className={cn("markdown-body leading-relaxed text-[15px]", isUser && "text-white prose-invert")}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
              a: ({href, children}) => <a href={href} className="underline underline-offset-2 hover:text-orange-400 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
              code: ({inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="bg-[#1a1a1a] rounded-lg my-3 overflow-hidden text-[13px] border border-gray-800">
                    <div className="flex items-center px-4 py-2 bg-[#222] text-gray-400 text-xs font-mono border-b border-gray-800">
                      {match[1]}
                    </div>
                    <pre className="p-4 overflow-x-auto text-gray-300">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code className={cn("bg-black/10 rounded px-1.5 py-0.5 text-[0.9em] font-mono", isUser ? "bg-white/20 text-orange-200" : "text-orange-600")} {...props}>
                    {children}
                  </code>
                )
              },
              ul: ({children}) => <ul className="list-disc pl-5 mb-2 space-y-1 marker:text-orange-400">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal pl-5 mb-2 space-y-1 marker:text-orange-400">{children}</ol>,
              li: ({children}) => <li>{children}</li>,
              strong: ({children}) => <strong className="font-bold">{children}</strong>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-orange-500 pl-4 py-1 my-3 bg-orange-50/50 rounded-r-lg italic text-gray-700">{children}</blockquote>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          "text-[10px] mt-2 font-medium opacity-50 flex items-center justify-end",
          isUser ? "text-right" : "text-left"
        )}>
           {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};
