import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'BORROWER' | 'LENDER') => Promise<void>;
  logout: () => void;
  switchRole: () => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and user data
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, create mock user based on email
      const indianRuralBorrowers = [
        'राम सिंह', 'सीता देवी', 'कृष्ण कुमार', 'गीता शर्मा', 'अजय पटेल'
      ];
      const indianRuralLenders = [
        'लक्ष्मी देवी', 'हरि प्रसाद', 'कमला सिंह', 'राम प्रसाद', 'सुशीला देवी'
      ];
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.includes('lender') 
          ? indianRuralLenders[Math.floor(Math.random() * indianRuralLenders.length)]
          : indianRuralBorrowers[Math.floor(Math.random() * indianRuralBorrowers.length)],
        role: email.includes('lender') ? 'LENDER' : 'BORROWER',
      };

      const mockToken = 'demo_jwt_token_' + Date.now();

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'BORROWER' | 'LENDER') => {
    try {
      setIsLoading(true);

      // For demo purposes, create mock user
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
      };

      const mockToken = 'demo_jwt_token_' + Date.now();

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);

      toast({
        title: "Registration Successful",
        description: `Welcome to Kshetra Kredit, ${name}!`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again with different details.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Demo function to switch between roles for hackathon demo
  const switchRole = () => {
    if (user) {
      const newRole: 'BORROWER' | 'LENDER' = user.role === 'BORROWER' ? 'LENDER' : 'BORROWER';
      const indianRuralBorrowers = [
        'राम सिंह', 'सीता देवी', 'कृष्ण कुमार', 'गीता शर्मा', 'अजय पटेल'
      ];
      const indianRuralLenders = [
        'लक्ष्मी देवी', 'हरि प्रसाद', 'कमला सिंह', 'राम प्रसाद', 'सुशीला देवी'
      ];
      
      const updatedUser: User = {
        ...user,
        role: newRole,
        name: newRole === 'LENDER' 
          ? indianRuralLenders[Math.floor(Math.random() * indianRuralLenders.length)]
          : indianRuralBorrowers[Math.floor(Math.random() * indianRuralBorrowers.length)],
      };
      
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      toast({
        title: `Switched to ${newRole}`,
        description: `You are now viewing as a ${newRole.toLowerCase()}.`,
      });
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};