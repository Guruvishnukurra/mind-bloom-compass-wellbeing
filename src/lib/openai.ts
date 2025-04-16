import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
});

// Function to generate a response using OpenAI's API
export async function generateAIResponse(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
  try {
    // Add a system message if one doesn't exist
    if (!messages.some(msg => msg.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: `You are a helpful wellbeing assistant focused on mental health and wellness. 
        Provide supportive, empathetic responses to help users with their mental wellbeing.
        You can offer guidance on meditation, stress management, anxiety, depression, sleep, 
        and other mental health topics. Always be encouraging and positive, but don't minimize 
        the user's concerns. If someone appears to be in crisis, suggest they seek professional help.`
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

export default openai;