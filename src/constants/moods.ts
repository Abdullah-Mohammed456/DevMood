export type MoodType = 'Stressed' | 'Tired' | 'Neutral' | 'Focused';

export interface MoodConfig {
  id: MoodType;
  label: string;
  color: string;
  textColor: string;
  bgColor: string;
  accentColor: string;
  quotes: string[];
}

export const MOODS: Record<MoodType, MoodConfig> = {
  Stressed: {
    id: 'Stressed',
    label: 'Stressed',
    color: '#ff4d4d',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950',
    accentColor: 'border-red-500/50',
    quotes: [
      "Take a deep breath. You've solved harder bugs before.",
      "Step away for 5 minutes. The bug will be here when you get back.",
      "It's okay to feel overwhelmed. Break the problem down into smaller pieces.",
      "Remember: It's just code. Don't let it ruin your day."
    ]
  },
  Tired: {
    id: 'Tired',
    label: 'Tired',
    color: '#9b59b6',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950',
    accentColor: 'border-purple-500/50',
    quotes: [
      "Rest is productive. Don't push yourself to burnout.",
      "A tired mind writes tired code. Take a nap or a walk.",
      "You've worked hard today. Maybe it's time to log off?",
      "Sometimes the best debugging tool is a good night's sleep."
    ]
  },
  Neutral: {
    id: 'Neutral',
    label: 'Neutral',
    color: '#3498db',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-950',
    accentColor: 'border-blue-500/50',
    quotes: [
      "Steady progress is still progress.",
      "Keep moving forward, one line of code at a time.",
      "You're doing fine. Consistency is key.",
      "Another day, another challenge to conquer."
    ]
  },
  Focused: {
    id: 'Focused',
    label: 'Focused',
    color: '#2ecc71',
    textColor: 'text-green-400',
    bgColor: 'bg-green-950',
    accentColor: 'border-green-500/50',
    quotes: [
      "You are in the zone. Let the code flow!",
      "Unstoppable. Keep that momentum going.",
      "Focus mode engaged. You're building great things today.",
      "Zero distractions. Maximum productivity."
    ]
  }
};
