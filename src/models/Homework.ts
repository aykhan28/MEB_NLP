import { createContext } from 'react';

export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  childId: string;
  teacher: string;
  completedDate: string | null;
  grade: number | null;
  feedback: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Yerel depolama için kullanılacak
export const saveHomeworkToLocalStorage = (homework: Homework[]) => {
  localStorage.setItem('homework', JSON.stringify(homework));
};

export const getHomeworkFromLocalStorage = (): Homework[] => {
  const data = localStorage.getItem('homework');
  return data ? JSON.parse(data) : [];
};

// Context API için
export interface HomeworkContextType {
  homework: Homework[];
  addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHomework: (id: string, homework: Partial<Homework>) => void;
  deleteHomework: (id: string) => void;
  getHomeworkById: (id: string) => Homework | undefined;
  getHomeworkByChildId: (childId: string) => Homework[];
}

export const HomeworkContext = createContext<HomeworkContextType>({
  homework: [],
  addHomework: () => {},
  updateHomework: () => {},
  deleteHomework: () => {},
  getHomeworkById: () => undefined,
  getHomeworkByChildId: () => []
}); 