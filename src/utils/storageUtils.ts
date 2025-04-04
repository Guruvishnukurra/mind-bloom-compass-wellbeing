
/**
 * Storage utility functions for handling persistent data
 */

export interface MoodEntry {
  id: number;
  date: string;
  mood: number;
  notes: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  prompt: string;
  content: string;
  mood: string;
}

// Save mood entries to local storage
export const saveMoodEntries = (entries: MoodEntry[]): void => {
  localStorage.setItem('moodEntries', JSON.stringify(entries));
};

// Get mood entries from local storage
export const getMoodEntries = (): MoodEntry[] => {
  const entries = localStorage.getItem('moodEntries');
  return entries ? JSON.parse(entries) : [];
};

// Save journal entries to local storage
export const saveJournalEntries = (entries: JournalEntry[]): void => {
  localStorage.setItem('journalEntries', JSON.stringify(entries));
};

// Get journal entries from local storage
export const getJournalEntries = (): JournalEntry[] => {
  const entries = localStorage.getItem('journalEntries');
  return entries ? JSON.parse(entries) : [];
};

// Get analytics data
export const getAnalyticsData = (): { 
  averageMood: number;
  moodCounts: Record<number, number>;
  journalCount: number;
  mostFrequentMood: number;
  recentTrend: 'improving' | 'steady' | 'declining' | 'unknown';
} => {
  const moodEntries = getMoodEntries();
  const journalEntries = getJournalEntries();
  
  // Return empty analytics if no entries
  if (moodEntries.length === 0) {
    return {
      averageMood: 0,
      moodCounts: {},
      journalCount: journalEntries.length,
      mostFrequentMood: 0,
      recentTrend: 'unknown'
    };
  }

  // Calculate average mood
  const totalMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
  const averageMood = Number((totalMood / moodEntries.length).toFixed(1));
  
  // Count occurrences of each mood
  const moodCounts: Record<number, number> = {};
  moodEntries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  
  // Find most frequent mood
  const mostFrequentMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
    
  // Determine recent trend (last 7 entries)
  let recentTrend: 'improving' | 'steady' | 'declining' | 'unknown' = 'unknown';
  
  if (moodEntries.length >= 3) {
    const recentEntries = [...moodEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 7);
    
    const firstHalf = recentEntries.slice(0, Math.ceil(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(Math.ceil(recentEntries.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
    
    const difference = firstHalfAvg - secondHalfAvg;
    
    if (difference > 0.5) {
      recentTrend = 'improving';
    } else if (difference < -0.5) {
      recentTrend = 'declining';
    } else {
      recentTrend = 'steady';
    }
  }
  
  return {
    averageMood,
    moodCounts,
    journalCount: journalEntries.length,
    mostFrequentMood: Number(mostFrequentMood),
    recentTrend
  };
};
