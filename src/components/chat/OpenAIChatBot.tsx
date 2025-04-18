import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { Bot, MessageSquare, RefreshCw, Send, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const suggestedPrompts = [
  "How can I reduce anxiety?",
  "Give me a quick meditation exercise",
  "Tips for better sleep",
  "How to start a gratitude practice"
];

export function OpenAIChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call with a timeout
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: getAIResponse(input.trim()),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAIResponse = (message: string): string => {
    // This is a mock response function
    const responses = [
      "That's a great question about wellness. Based on research, regular mindfulness practice can help reduce stress levels by up to 40% over time. Would you like me to suggest some simple mindfulness exercises you can try?",
      "I understand you're looking for ways to improve your mental wellbeing. One effective approach is the '5-4-3-2-1' grounding technique: acknowledge 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste. This can help during moments of anxiety.",
      "Sleep is essential for mental health. Some evidence-based tips include: maintaining a consistent sleep schedule, avoiding screens 1 hour before bed, keeping your bedroom cool (around 65°F/18°C), and practicing a relaxing bedtime ritual. Would you like more specific advice?",
      "Gratitude practices have been shown to significantly improve mental wellbeing. Try starting with just 3 minutes each morning writing down three specific things you're grateful for. The key is being specific rather than general. Would you like to explore more structured gratitude exercises?",
      "I'd recommend trying a simple breathing exercise: breathe in for 4 counts, hold for 7 counts, and exhale for 8 counts. Repeat this 4-7-8 pattern four times. This activates your parasympathetic nervous system, helping to reduce stress and anxiety quickly."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      setMessages([]);
      toast.success('Started a new chat (offline mode)');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col rounded-3xl shadow-lg overflow-hidden border-sage-200 mx-auto bg-cream-100">
      <CardHeader className="pb-3 bg-gradient-to-r from-sage-500 to-gold-500 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-md animate-pulse-slow">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="font-heading text-xl">Mindful Assistant</CardTitle>
              <CardDescription className="text-white/90 font-body text-sm">
                Your personal guide to mental wellness
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startNewChat}
            className="h-9 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white rounded-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col bg-gradient-to-b from-cream-50 to-cream-100">
        <ScrollArea className="flex-1 px-6 py-5" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sage-100 to-gold-100 flex items-center justify-center mb-5 shadow-md">
                <Bot className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-2xl font-heading font-medium mb-3 text-deep-ocean-600">Welcome to Your Mindful Assistant</h3>
              <p className="text-deep-ocean-600/70 mb-8 max-w-md font-body">
                I'm here to support your mental health journey. Ask me anything about wellness, meditation, or how to improve your wellbeing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left border-sage-200 hover:bg-gold-50 hover:border-gold-300 transition-all rounded-2xl"
                    onClick={() => {
                      setInput(prompt);
                      inputRef.current?.focus();
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-gold-500" />
                    <span className="truncate text-deep-ocean-600">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-5 w-full`}
              >
                {message.role === 'assistant' && (
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-sage-500 to-sage-600 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse-slow"></div>
                  </div>
                )}
                <motion.div 
                  className={`rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-sage-500 to-gold-500 text-white shadow-md ml-auto max-w-[75%]' 
                      : 'bg-white border border-sage-200 shadow-sm max-w-[75%]'
                  }`}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ReactMarkdown
                    className={`prose ${message.role === 'user' ? 'text-white' : 'text-foreground'} max-w-none prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:p-2 prose-pre:rounded-md`}
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </motion.div>
                {message.role === 'user' && (
                  <Avatar className="h-10 w-10 shadow-md flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-gold-500 to-gold-600 text-deep-ocean-800">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start gap-3 mb-5">
              <Avatar className="h-10 w-10 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-sage-500 to-sage-600 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl p-4 max-w-[80%] shadow-sm bg-white border border-sage-200">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t border-sage-200 bg-cream-50">
          <div className="flex gap-3 items-end">
            <Textarea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none border-sage-200 focus-visible:ring-gold-400 bg-white rounded-2xl flex-1"
              disabled={isLoading}
              ref={inputRef}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-deep-ocean-800 rounded-full shadow-md h-12 w-12 p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OpenAIChatBot;