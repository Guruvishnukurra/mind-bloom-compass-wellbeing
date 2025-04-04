export interface Quote {
  text: string;
  author: string;
  category: 'motivation' | 'meditation' | 'gratitude' | 'mindfulness' | 'growth';
}

export const quotes: Quote[] = [
  // Motivation Quotes
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "motivation"
  },
  
  // Meditation Quotes
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "meditation"
  },
  {
    text: "The only journey is the one within.",
    author: "Rainer Maria Rilke",
    category: "meditation"
  },
  {
    text: "Breathe in peace, breathe out stress.",
    author: "Unknown",
    category: "meditation"
  },
  
  // Gratitude Quotes
  {
    text: "Gratitude turns what we have into enough.",
    author: "Aesop",
    category: "gratitude"
  },
  {
    text: "Joy is the simplest form of gratitude.",
    author: "Karl Barth",
    category: "gratitude"
  },
  {
    text: "When you are grateful, fear disappears and abundance appears.",
    author: "Tony Robbins",
    category: "gratitude"
  },
  
  // Mindfulness Quotes
  {
    text: "Wherever you are, be there totally.",
    author: "Eckhart Tolle",
    category: "mindfulness"
  },
  {
    text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
    category: "mindfulness"
  },
  {
    text: "Mindfulness isn't difficult. We just need to remember to do it.",
    author: "Sharon Salzberg",
    category: "mindfulness"
  },
  
  // Personal Growth Quotes
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    category: "growth"
  },
  {
    text: "Growth is the only evidence of life.",
    author: "John Henry Newman",
    category: "growth"
  },
  {
    text: "What you get by achieving your goals is not as important as what you become.",
    author: "Zig Ziglar",
    category: "growth"
  }
];

export function getRandomQuote(category?: Quote['category']): Quote {
  const filteredQuotes = category 
    ? quotes.filter(quote => quote.category === category)
    : quotes;
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
}

export function getQuoteByCategory(category: Quote['category']): Quote {
  const categoryQuotes = quotes.filter(quote => quote.category === category);
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
} 