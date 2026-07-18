import React, { useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useGetChatMessages, useSendChatMessage, getGetChatMessagesQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, UserCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Chat() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useGetChatMessages({ query: { queryKey: getGetChatMessagesQueryKey() } });
  const sendMessage = useSendChatMessage();
  
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessage.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;

    // Optimistically update UI could go here, but for simplicity we rely on invalidation
    const userMessage = input.trim();
    setInput('');

    sendMessage.mutate({ data: { content: userMessage } }, {
      onSuccess: (newMsg) => {
        // The mock API returns the AI response, but might also need to append the user message if it's not returning both
        queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey() });
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto glass-card rounded-2xl overflow-hidden border-white/10">
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Renova Intelligence</h2>
            <p className="text-xs text-primary">Always active, always learning.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-primary animation-delay-200"></div>
                <div className="w-2 h-2 rounded-full bg-primary animation-delay-400"></div>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages?.map((msg, idx) => {
                const isAi = msg.role === 'assistant';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-4 max-w-[85%] ${isAi ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
                  >
                    <div className="shrink-0 mt-1">
                      {isAi ? (
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-white/70" />
                        </div>
                      )}
                    </div>
                    <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                      <div 
                        className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                          isAi 
                            ? 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm' 
                            : 'bg-primary text-primary-foreground rounded-tr-sm shadow-[0_4px_14px_rgba(31,178,166,0.25)]'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1.5 px-1">
                        {format(parseISO(msg.sentAt), 'HH:mm')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              
              {sendMessage.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 max-w-[85%] self-start"
                >
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-background/50 backdrop-blur-md border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-3 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your health data, care plan, or symptoms..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || sendMessage.isPending}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
