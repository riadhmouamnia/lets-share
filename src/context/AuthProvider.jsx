import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import Image from "next/image";
import Spinner from "public/images/spinner.svg";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const listener = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          setUser(user);
        } catch (e) {
          setError(e);
        }
      },
      setError
    );
    return () => {
      listener();
    };
  }, []);

  //Sign up with Credentials
  const signUp = useCallback(async (email, password, userInfo) => {
    setLoading(true);
    setError(undefined);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      // Reference to the "users" collection
      const usersCollectionRef = collection(db, "users");
      // Add a new document with the user's UID as the document ID
      await setDoc(doc(usersCollectionRef, user.user.uid), {
        uid: user.user.uid,
        photoURL: user.user.photoURL,
        ...userInfo,
        role: "user",
        date: serverTimestamp(),
      });
      setUser({
        uid: user.user.uid,
        photoURL: user.user.photoURL,
        ...userInfo,
        role: "user",
        date: serverTimestamp(),
      });
      toast.success(`Hi ${userInfo.name}, Thank you for joing in us! 😍`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      const router = require("next/router").default;
      // redirect user to their profile page
      router.push({
        pathname: "/dashboard",
        query: { user: user.user.uid },
      });
    } catch (err) {
      setError(err);
      if (err.code === "auth/email-already-in-use")
        toast.error("this email is already in use", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
    } finally {
      setLoading(false);
    }
  }, []);

  //Sign in with Credentials
  const signIn = () => {};

  // Sign out
  const logOut = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        error,
        user,
        signUp,
        signIn,
        logOut,
      }}
    >
      {loading ? (
        <div className='flex justify-center items-center h-screen'>
          <Image src={Spinner} alt='loading' height={100} width={100} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
