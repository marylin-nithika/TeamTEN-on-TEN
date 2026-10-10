import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('creovate_role') || 'brand');
  const [user, setUser] = useState(() => {
    const defaultId = role === 'brand' ? '11111111-1111-1111-1111-111111111111' : 'a0000000-0000-0000-0000-000000000001';
    return {
      id: defaultId,
      email: role === 'brand' ? 'brand@aetheria.com' : 'elena@vance.ai',
      display_name: role === 'brand' ? 'Aetheria Studio' : 'Elena Vance',
      role: role,
      avatar_url: role === 'brand' 
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
    };
  });
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    localStorage.setItem('creovate_role', role);
    localStorage.setItem('creovate_token', `preview_token_${role}`);
    
    // Update default user payload when role changes in preview mode
    const defaultId = role === 'brand' ? '11111111-1111-1111-1111-111111111111' : 'a0000000-0000-0000-0000-000000000001';
    setUser({
      id: defaultId,
      email: role === 'brand' ? 'brand@aetheria.com' : 'elena@vance.ai',
      display_name: role === 'brand' ? 'Aetheria Studio' : 'Elena Vance',
      role: role,
      avatar_url: role === 'brand' 
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
    });
  }, [role]);

  const switchRole = (newRole) => {
    setRole(newRole);
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'brand',
          display_name: data.user.user_metadata?.display_name || email.split('@')[0]
        });
        setRole(data.user.user_metadata?.role || 'brand');
      }
    } else {
      // Preview mode simulated login
      setUser({
        id: role === 'brand' ? '11111111-1111-1111-1111-111111111111' : 'a0000000-0000-0000-0000-000000000001',
        email: email,
        display_name: email.split('@')[0],
        role: role
      });
    }
  };

  const signup = async (email, password, displayName, selectedRole) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: selectedRole
          }
        }
      });
      if (error) throw error;
      if (data.user) {
        setRole(selectedRole);
        setUser({
          id: data.user.id,
          email: data.user.email,
          role: selectedRole,
          display_name: displayName
        });
      }
    } else {
      setRole(selectedRole);
      setUser({
        id: `u-${Date.now()}`,
        email: email,
        display_name: displayName,
        role: selectedRole
      });
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('creovate_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      switchRole,
      login,
      signup,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
