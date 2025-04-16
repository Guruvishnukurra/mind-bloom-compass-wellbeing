import { OpenAIChatBot } from '@/components/chat/OpenAIChatBot';

export default function Chat() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Wellbeing Assistant</h1>
        <OpenAIChatBot />
      </div>
    </div>
  );
} 