import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateAIResponse } from '@/lib/openai';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export function OpenAIChatBot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history on component mount
  useEffect(() => {
    async function fetchChatHistory() {
      if (!user) return;

      try {
        // Get or create a chat session for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        const { data: existingChat, error: chatError } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', todayStr)
          .order('created_at', { ascending: false })
          .limit(1);

        if (chatError) throw chatError;

        if (existingChat && existingChat.length > 0) {
          setChatId(existingChat[0].id);
          
          // Fetch messages for this chat
          const { data: chatMessages, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', existingChat[0].id)
            .order('created_at', { ascending: true });

          if (messagesError) throw messagesError;
          
          setMessages(chatMessages || []);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    }

    fetchChatHistory();
  }, [user]);

  const handleSendMessage = async () => {
    if (!user || !input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a new chat session if none exists
      if (!chatId) {
        const { data: newChat, error: chatError } = await supabase
          .from('chat_sessions')
          .insert([{ user_id: user.id }])
          .select();

        if (chatError) throw chatError;
        
        setChatId(newChat[0].id);
      }

      // Save user message to database
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert([
          {
            chat_id: chatId,
            role: 'user',
            content: userMessage.content
          }
        ]);

      if (messageError) throw messageError;

      // Format messages for OpenAI API
      const apiMessages = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: userMessage.content
      });

      // Get response from OpenAI
      const aiResponseContent = await generateAIResponse(apiMessages);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponseContent || "I'm sorry, I couldn't generate a response. Please try again.",
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save AI response to database
      const { error: aiMessageError } = await supabase
        .from('chat_messages')
        .insert([
          {
            chat_id: chatId,
            role: 'assistant',
            content: assistantMessage.content
          }
        ]);

      if (aiMessageError) throw aiMessageError;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response from the AI assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = async () => {
    if (!user) return;

    try {
      // Create a new chat session
      const { data: newChat, error: chatError } = await supabase
        .from('chat_sessions')
        .insert([{ user_id: user.id }])
        .select();

      if (chatError) throw chatError;
      
      setChatId(newChat[0].id);
      setMessages([]);
      
      toast.success('Started a new chat');
    } catch (error) {
      console.error('Error starting new chat:', error);
      toast.error('Failed to start new chat');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>AI Wellbeing Assistant</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startNewChat}
            className="h-8"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
        <CardDescription>
          Chat with your AI wellbeing assistant powered by OpenAI
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
              <Bot className="h-12 w-12 mb-4 text-primary/50" />
              <p className="text-lg font-medium mb-2">Welcome to your AI Wellbeing Assistant</p>
              <p className="max-w-md">
                I'm here to support your mental health journey. You can ask me about:
              </p>
              <ul className="mt-4 text-left list-disc pl-4 space-y-1">
                <li>Mental health topics and coping strategies</li>
                <li>Meditation and mindfulness techniques</li>
                <li>Stress and anxiety management</li>
                <li>Sleep improvement tips</li>
                <li>Resources for additional support</li>
              </ul>
              <p className="mt-4">How can I help you today?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}