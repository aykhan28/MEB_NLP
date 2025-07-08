import { createContext } from 'react';

export interface Child {
  id: string;
  name: string;
  grade: string;
  school: string;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Yerel depolama için kullanılacak
export const saveChildrenToLocalStorage = (children: Child[]) => {
  localStorage.setItem('children', JSON.stringify(children));
};

export const getChildrenFromLocalStorage = (): Child[] => {
  const data = localStorage.getItem('children');
  return data ? JSON.parse(data) : [];
};

// Context API için
export interface ChildrenContextType {
  children: Child[];
  addChild: (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt' | 'parentId'>) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  getChildById: (id: string) => Child | undefined;
}

export const ChildrenContext = createContext<ChildrenContextType>({
  children: [],
  addChild: () => {},
  updateChild: () => {},
  deleteChild: () => {},
  getChildById: () => undefined
}); 