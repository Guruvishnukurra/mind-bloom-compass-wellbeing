import { ChatBot } from '@/components/chat/ChatBot';

export default function Chat() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wellbeing Assistant</h1>
        <ChatBot />
      </div>
    </div>
  );
} 