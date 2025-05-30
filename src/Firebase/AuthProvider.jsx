import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import auth from './firebase.config';
import axios from 'axios';

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //create user
const createUser = async (email, password) => {
  setLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    toast.success('Verification email sent. Please check your inbox.');
    return userCredential;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false); // ✅ always stop loading
  }
};

//email password login
const loginUser = async (email, password) => {
  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      toast.error('Please verify your email before logging in.');
      await signOut(auth);
      return null;
    }
    return userCredential;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false); // ✅ always stop loading
  }
};
  const resetPassword = email => {
    return sendPasswordResetEmail(auth, email);
  };
  //update user profile
  const updateUserProfile = (name, profile) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: profile,
    });
  };
  // google login
  const googleLogin = () => {
    setUser(null);
    return signInWithPopup(auth, googleProvider);
  };

  //logOut
  const logOut = async () => {
    const { data } = await axios(
      `https://life-sync-server-eight.vercel.app/logout`,
      { withCredentials: true }
    );
    console.log(data);
    signOut(auth).then(() => {
      setUser(null);
      toast.success('Successfully Logged Out');
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        const loggedUser = { email: currentUser.email };
        // axios
        //   .post('https://life-sync-server-eight.vercel.app/jwt', loggedUser, {
        //     withCredentials: true,
        //   })
        //   .then(res => {
        //     console.log('token response', res.data);
        //   });
      }
    });

    return () => unsubscribe();
  }, []);

  const userInfo = {
    setUser,
    user,
    createUser,
    loginUser,
    logOut,
    loading,
    resetPassword,
    googleLogin,
    updateUserProfile,
  };
  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
