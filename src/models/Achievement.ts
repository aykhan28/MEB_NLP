import { createContext } from 'react';

export interface Achievement {
  id: string;
  title: string;
  type: 'exam' | 'award' | 'goal' | 'competition' | 'habit';
  description: string;
  date: string;
  childId: string;
  teacher: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
}

// Yerel depolama için kullanılacak
export const saveAchievementsToLocalStorage = (achievements: Achievement[]) => {
  localStorage.setItem('achievements', JSON.stringify(achievements));
};

export const getAchievementsFromLocalStorage = (): Achievement[] => {
  const data = localStorage.getItem('achievements');
  return data ? JSON.parse(data) : [];
};

// Context API için
export interface AchievementContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;
  getAchievementById: (id: string) => Achievement | undefined;
  getAchievementsByChildId: (childId: string) => Achievement[];
}

export const AchievementContext = createContext<AchievementContextType>({
  achievements: [],
  addAchievement: () => {},
  updateAchievement: () => {},
  deleteAchievement: () => {},
  getAchievementById: () => undefined,
  getAchievementsByChildId: () => []
}); 