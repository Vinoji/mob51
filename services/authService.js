import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    PhoneAuthProvider,
    signInWithCredential
  } from "firebase/auth";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { db } from "../config/firebaseConfig";
  
  // Initialize auth
  const auth = getAuth();
  
  // Email authentication
  export const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          user: {
            uid: user.uid,
            email: user.email,
            ...userData
          },
          isAdmin: userData.role === 'admin'
        };
      } else {
        // If user exists in Auth but not in Firestore, create a document
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: 'user',
          createdAt: new Date()
        });
        
        return {
          user: {
            uid: user.uid,
            email: user.email,
            role: 'user'
          },
          isAdmin: false
        };
      }
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };
  
  export const registerWithEmail = async (email, password, userData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: 'user',
        createdAt: new Date(),
        ...userData
      });
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          role: 'user',
          ...userData
        },
        isAdmin: false
      };
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  };
  
  export const logout = async () => {
    try {
      await firebaseSignOut(auth);
      return true;
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };
  
  export const getCurrentUser = async () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Stop listening once we get the first result
        
        if (user) {
          try {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              resolve({
                user: {
                  uid: user.uid,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  ...userData
                },
                isAdmin: userData.role === 'admin'
              });
            } else {
              // If no user document exists, resolve with basic info
              resolve({
                user: {
                  uid: user.uid,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  role: 'user'
                },
                isAdmin: false
              });
            }
          } catch (error) {
            reject(error);
          }
        } else {
          // No user is signed in
          resolve({ user: null, isAdmin: false });
        }
      }, reject);
    });
  };
  
  // Phone authentication
  export const sendPhoneVerification = async (phoneNumber, recaptchaVerifier) => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber, 
        recaptchaVerifier
      );
      return verificationId;
    } catch (error) {
      console.error("Phone verification error:", error.message);
      throw error;
    }
  };
  
  export const verifyOTP = async (verificationId, otp) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          user: {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            ...userData
          },
          isAdmin: userData.role === 'admin'
        };
      } else {
        // If user document doesn't exist in Firestore, create one with default role
        await setDoc(doc(db, "users", user.uid), {
          phoneNumber: user.phoneNumber,
          role: 'user',
          createdAt: new Date()
        });
        
        return {
          user: {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            role: 'user'
          },
          isAdmin: false
        };
      }
    } catch (error) {
      console.error("OTP verification error:", error.message);
      throw error;
    }
  };