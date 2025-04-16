import { OpenAIChatBot } from '@/components/chat/OpenAIChatBot';
import { OpenAITest } from '@/components/chat/OpenAITest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Chat() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Wellbeing Assistant</h1>
        
        <Tabs defaultValue="chat">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="test">API Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <OpenAIChatBot />
          </TabsContent>
          
          <TabsContent value="test">
            <OpenAITest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 