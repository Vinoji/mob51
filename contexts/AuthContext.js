import React, { createContext, useState, useEffect } from 'react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  logout, 
  getCurrentUser,
  sendPhoneVerification,
  verifyOTP 
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user, isAdmin } = await getCurrentUser();
        setCurrentUser(user);
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { user, isAdmin } = await loginWithEmail(email, password);
      setCurrentUser(user);
      setIsAdmin(isAdmin);
      return { success: true, user, isAdmin };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, userData) => {
    try {
      const { user, isAdmin } = await registerWithEmail(email, password, userData);
      setCurrentUser(user);
      setIsAdmin(isAdmin);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setIsAdmin(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Phone authentication methods
  const sendOTP = async (phoneNumber, recaptchaVerifier) => {
    try {
      const verificationId = await sendPhoneVerification(phoneNumber, recaptchaVerifier);
      setVerificationId(verificationId);
      return { success: true, verificationId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const confirmOTP = async (otp) => {
    if (!verificationId) {
      return { success: false, error: "No verification in progress" };
    }
    
    try {
      const { user, isAdmin } = await verifyOTP(verificationId, otp);
      setCurrentUser(user);
      setIsAdmin(isAdmin);
      setVerificationId(null); // Reset verification ID after successful confirmation
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user: currentUser,
    isAdmin,
    login,
    register,
    logout: signOut,
    sendOTP,
    confirmOTP,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};