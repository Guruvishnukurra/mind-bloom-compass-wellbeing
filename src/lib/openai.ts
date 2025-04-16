import OpenAI from 'openai';

// Your OpenAI API key
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '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';

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
});

// Function to generate a response using OpenAI's API
export async function generateAIResponse(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
  console.log('generateAIResponse called with messages:', messages);
  console.log('Current API key:', apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : 'none');
  
  try {
    // Check if we have a valid API key
    if (!apiKey || apiKey === 'your-openai-api-key-here' || apiKey === 'dummy-key') {
      console.warn('OpenAI API key not configured. Using fallback responses.');
      return generateFallbackResponse(messages[messages.length - 1]?.content || '');
    }
    
    // Log that we're using the OpenAI API
    console.log('Using OpenAI API for chat response with key:', apiKey.substring(0, 5));

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

    console.log('OpenAI API response received:', response.choices[0].message.content.substring(0, 50) + '...');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Check for quota exceeded error
    const errorStr = String(error);
    if (errorStr.includes('exceeded your current quota') || 
        errorStr.includes('billing') || 
        errorStr.includes('limit') || 
        errorStr.includes('rate limit')) {
      return "I'm sorry, but the OpenAI API quota has been exceeded. The application is currently using the fallback responses. Please try again later or contact the administrator to update the API key.";
    }
    
    return generateFallbackResponse(messages[messages.length - 1]?.content || '');
  }
}

// Fallback response generator when API is not available
function generateFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Basic response patterns
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your wellbeing assistant. How can I help you today?";
  }
  
  if (lowerMessage.includes('anxiety') || lowerMessage.includes('stress')) {
    return "I understand you're feeling anxious or stressed. Try taking a few deep breaths and focusing on the present moment. Would you like to try a quick meditation exercise?";
  }
  
  if (lowerMessage.includes('depression') || lowerMessage.includes('sad')) {
    return "I'm sorry you're feeling down. Remember that it's okay to feel this way, and you don't have to go through it alone. Have you considered talking to a mental health professional? I can provide information about resources if you'd like.";
  }
  
  if (lowerMessage.includes('meditation') || lowerMessage.includes('meditate')) {
    return "Meditation is a great tool for mental wellbeing. You can try our guided meditation feature, which offers various sessions for different needs like stress relief, better sleep, or anxiety reduction.";
  }
  
  if (lowerMessage.includes('gratitude') || lowerMessage.includes('thankful')) {
    return "Practicing gratitude is an excellent way to improve your mood and overall wellbeing. Try listing three things you're grateful for today. You can use our Gratitude Journal feature to track these daily reflections.";
  }
  
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
    return "Sleep is crucial for mental health. Try establishing a regular sleep schedule, avoiding screens before bedtime, and creating a relaxing bedtime routine. Our app has sleep-focused meditations that might help.";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to support you. You can use our various features like mood tracking, meditation, journaling, and the gratitude journal to support your mental wellbeing journey. Is there a specific area you'd like to focus on?";
  }
  
  // Default response
  return "I'm here to support your wellbeing journey. You can ask me about mental health topics, meditation techniques, or how to use the features in this app. How can I assist you today?";
}

export default openai;