import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle } from 'lucide-react';
import OpenAI from 'openai';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ApiTest() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const apiKey = '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';

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      console.log('Testing OpenAI API with key:', apiKey.substring(0, 5));
      
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: input || 'Say hello!'
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
      
      console.log('OpenAI API response:', result);
      setResponse(result.choices[0].message.content || 'No response content');
    } catch (err) {
      console.error('Error testing OpenAI API:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Check for quota exceeded error
      if (errorMessage.includes('exceeded your current quota') || 
          errorMessage.includes('billing') || 
          errorMessage.includes('limit') || 
          errorMessage.includes('rate limit')) {
        setError(`API Quota Exceeded: ${errorMessage}\n\nYou need to check your OpenAI account billing status or use a different API key.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OpenAI API Test</h1>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Test the OpenAI API</CardTitle>
            <CardDescription>
              Test the OpenAI API connection and check for quota issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>API Quota Warning</AlertTitle>
              <AlertDescription>
                The OpenAI API has usage limits. If you see a "quota exceeded" error, you'll need to:
                <ul className="list-disc pl-5 mt-2">
                  <li>Check your OpenAI account billing status</li>
                  <li>Upgrade your plan if needed</li>
                  <li>Or use a different API key with available quota</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Input
                placeholder="Enter a test message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                onClick={handleTest}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Test OpenAI API
              </Button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                <p className="font-semibold">Error:</p>
                <p className="whitespace-pre-wrap">{error}</p>
              </div>
            )}
            
            {response && (
              <div className="space-y-2">
                <p className="font-semibold">Response:</p>
                <Textarea 
                  readOnly 
                  value={response} 
                  className="min-h-[200px]"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}