import React, { useState, useEffect, ReactNode } from 'react';
import { generateId } from '../utils/helpers';
import { Child, ChildrenContext, ChildrenContextType, getChildrenFromLocalStorage, saveChildrenToLocalStorage } from '../models/Child';
import { loadSampleData } from '../utils/sampleData';

interface ChildrenProviderProps {
  children: ReactNode;
}

export const ChildrenProvider: React.FC<ChildrenProviderProps> = ({ children }) => {
  const [childrenData, setChildrenData] = useState<Child[]>([]);

  useEffect(() => {
    // LocalStorage'dan çocuk verilerini yükle
    const savedChildren = getChildrenFromLocalStorage();
    if (savedChildren.length > 0) {
      setChildrenData(savedChildren);
    } else {
      // Eğer localStorage'da veri yoksa örnek verileri yükle
      loadSampleData();
      const sampleChildren = getChildrenFromLocalStorage();
      setChildrenData(sampleChildren);
    }
  }, []);

  const addChild = (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt' | 'parentId'>) => {
    const now = new Date();
    const newChild: Child = {
      ...child,
      id: generateId(),
      parentId: 'current-user-id', // Normalde auth sisteminden alınacak
      createdAt: now,
      updatedAt: now
    };
    
    const updatedChildren = [...childrenData, newChild];
    setChildrenData(updatedChildren);
    saveChildrenToLocalStorage(updatedChildren);
  };

  const updateChild = (id: string, childUpdates: Partial<Child>) => {
    const updatedChildren = childrenData.map(child => 
      child.id === id 
        ? { ...child, ...childUpdates, updatedAt: new Date() } 
        : child
    );
    
    setChildrenData(updatedChildren);
    saveChildrenToLocalStorage(updatedChildren);
  };

  const deleteChild = (id: string) => {
    const updatedChildren = childrenData.filter(child => child.id !== id);
    setChildrenData(updatedChildren);
    saveChildrenToLocalStorage(updatedChildren);
  };

  const getChildById = (id: string) => {
    return childrenData.find(child => child.id === id);
  };

  const contextValue: ChildrenContextType = {
    children: childrenData,
    addChild,
    updateChild,
    deleteChild,
    getChildById
  };

  return (
    <ChildrenContext.Provider value={contextValue}>
      {children}
    </ChildrenContext.Provider>
  );
}; 