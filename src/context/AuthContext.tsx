import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, type Timestamp } from "firebase/firestore";

import { auth, db } from "../firebase";
import { ensureUserProfileDocument } from "../auth";

type AppUser = {
  uid: string;
  email: string | null;
  displayName: string;
  createdAt?: Timestamp;
  imageUrl?: string;
};

type AuthContextType = {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  refreshAppUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  refreshAppUser: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAppUser = useCallback(async (firebaseUser: User) => {
    /*
     * Google and other federated providers create the Firebase Auth user
     * automatically. Ensure Lorebound's /users/{uid} document also exists
     * before trying to read it.
     */
    await ensureUserProfileDocument(firebaseUser);

    const snap = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!snap.exists()) {
      setAppUser(null);
      return;
    }

    const data = snap.data();

    setAppUser({
      uid: data.uid ?? firebaseUser.uid,
      email: data.email ?? firebaseUser.email ?? null,
      displayName:
        data.displayName ??
        firebaseUser.displayName ??
        firebaseUser.email?.split("@")[0] ??
        "",
      createdAt: data.createdAt,
      imageUrl: data.imageUrl,
    });
  }, []);

  const refreshAppUser = useCallback(async () => {
    if (!auth.currentUser) {
      setAppUser(null);
      return;
    }

    await fetchAppUser(auth.currentUser);
  }, [fetchAppUser]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      try {
        if (firebaseUser) {
          await fetchAppUser(firebaseUser);
        } else {
          setAppUser(null);
        }
      } catch (error) {
        console.error("Failed to load authenticated user profile:", error);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [fetchAppUser]);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, appUser, loading, refreshAppUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
