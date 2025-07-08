import { createContext } from 'react';

export interface StudySession {
  id: string;
  childId: string;
  date: string;
  subject: string;
  hours: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  createdAt: Date;
  updatedAt: Date;
}

// Yerel depolama için kullanılacak
export const saveStudySessionsToLocalStorage = (sessions: StudySession[]) => {
  localStorage.setItem('studySessions', JSON.stringify(sessions));
};

export const getStudySessionsFromLocalStorage = (): StudySession[] => {
  const data = localStorage.getItem('studySessions');
  return data ? JSON.parse(data) : [];
};

// Context API için
export interface StudyTimeContextType {
  studySessions: StudySession[];
  addStudySession: (session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudySession: (id: string, session: Partial<StudySession>) => void;
  deleteStudySession: (id: string) => void;
  getStudySessionById: (id: string) => StudySession | undefined;
  getStudySessionsByChildId: (childId: string) => StudySession[];
  getWeeklyStudyData: (childId: string) => { day: string; hours: number; subject: string }[];
  getMonthlyStudyData: (childId: string) => { week: string; hours: number }[];
  getSubjectDistribution: (childId: string) => { name: string; value: number }[];
  getTimeOfDayDistribution: (childId: string) => { name: string; value: number }[];
}

export const StudyTimeContext = createContext<StudyTimeContextType>({
  studySessions: [],
  addStudySession: () => {},
  updateStudySession: () => {},
  deleteStudySession: () => {},
  getStudySessionById: () => undefined,
  getStudySessionsByChildId: () => [],
  getWeeklyStudyData: () => [],
  getMonthlyStudyData: () => [],
  getSubjectDistribution: () => [],
  getTimeOfDayDistribution: () => []
}); 