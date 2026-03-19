import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

type AppUser = {
  uid: string;
  email: string | null;
  displayName: string;
  createdAt?: Timestamp;
  photoURL?: string;
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

  const fetchAppUser = useCallback(async (uid: string) => {
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      setAppUser(null);
      return;
    }

    const data = snap.data();

    setAppUser({
      uid: data.uid ?? uid,
      email: data.email ?? null,
      displayName: data.displayName ?? "",
      createdAt: data.createdAt,
    });
  }, []);

  const refreshAppUser = useCallback(async () => {
    if (!auth.currentUser) {
      setAppUser(null);
      return;
    }

    await fetchAppUser(auth.currentUser.uid);
  }, [fetchAppUser]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchAppUser(firebaseUser.uid);
      } else {
        setAppUser(null);
      }

      setLoading(false);
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
