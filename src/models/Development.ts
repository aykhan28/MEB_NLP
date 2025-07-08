import { createContext } from 'react';

export interface DevelopmentRecord {
  id: string;
  childId: string;
  date: string;
  subject: string;
  score: number;
  teacherId: string;
  examType: 'quiz' | 'midterm' | 'final' | 'project' | 'homework';
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}

// Yerel depolama için kullanılacak
export const saveDevelopmentRecordsToLocalStorage = (records: DevelopmentRecord[]) => {
  localStorage.setItem('developmentRecords', JSON.stringify(records));
};

export const getDevelopmentRecordsFromLocalStorage = (): DevelopmentRecord[] => {
  const data = localStorage.getItem('developmentRecords');
  return data ? JSON.parse(data) : [];
};

// Context API için
export interface DevelopmentContextType {
  developmentRecords: DevelopmentRecord[];
  addDevelopmentRecord: (record: Omit<DevelopmentRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDevelopmentRecord: (id: string, record: Partial<DevelopmentRecord>) => void;
  deleteDevelopmentRecord: (id: string) => void;
  getDevelopmentRecordById: (id: string) => DevelopmentRecord | undefined;
  getDevelopmentRecordsByChildId: (childId: string) => DevelopmentRecord[];
  getProgressData: (childId: string, subject?: string) => { date: string; score: number; subject: string }[];
  getSubjectProgress: (childId: string) => { subject: string; progress: number; change: number }[];
}

export const DevelopmentContext = createContext<DevelopmentContextType>({
  developmentRecords: [],
  addDevelopmentRecord: () => {},
  updateDevelopmentRecord: () => {},
  deleteDevelopmentRecord: () => {},
  getDevelopmentRecordById: () => undefined,
  getDevelopmentRecordsByChildId: () => [],
  getProgressData: () => [],
  getSubjectProgress: () => []
}); 