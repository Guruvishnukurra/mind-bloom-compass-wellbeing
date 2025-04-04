
export const getMeditationRecommendations = (moodValue: number) => {
  const recommendations = {
    1: [
      {
        title: "Comfort and Healing Meditation",
        description: "A gentle session to help you process difficult emotions",
        duration: 10,
        category: "Emotional Healing",
        image: "/meditations/comfort.jpg"
      },
      {
        title: "Self-Compassion Journey",
        description: "A meditation focused on self-love during challenging times",
        duration: 15,
        category: "Emotional Support",
        image: "/meditations/compassion.jpg"
      }
    ],
    2: [
      {
        title: "Mood Lift Meditation",
        description: "Guided meditation to help elevate your mood",
        duration: 12,
        category: "Mood Enhancement",
        image: "/meditations/mood-lift.jpg"
      }
    ],
    3: [
      {
        title: "Balance and Centeredness",
        description: "A meditation to help you find inner equilibrium",
        duration: 10,
        category: "Mindfulness",
        image: "/meditations/balance.jpg"
      }
    ],
    4: [
      {
        title: "Gratitude Practice",
        description: "Meditation to amplify positive emotions",
        duration: 15,
        category: "Positive Thinking",
        image: "/meditations/gratitude.jpg"
      }
    ],
    5: [
      {
        title: "Celebration Meditation",
        description: "A joyful session to amplify your positive energy",
        duration: 10,
        category: "Joy",
        image: "/meditations/celebration.jpg"
      }
    ]
  };

  return recommendations[moodValue as keyof typeof recommendations] || [];
};

