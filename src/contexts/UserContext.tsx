import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photo?: string;
}

interface UserContextType {
  users: User[];
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => { success: boolean; error?: string };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem('systemUsers');
    const storedCurrentUser = localStorage.getItem('currentUser');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (userData: Omit<User, 'id'>): { success: boolean; error?: string } => {
    if (users.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email já cadastrado' };
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    
    return { success: true };
  };

  return (
    <UserContext.Provider value={{ users, currentUser, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
