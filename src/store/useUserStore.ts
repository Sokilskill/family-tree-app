import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { create } from "zustand";

import { auth } from "../firebase";
import type { User } from "../app/types/user";
import {
  createUserProfileDocument,
  ensureUserProfileDocument,
  updateUserProfileDocument,
} from "../app/lib/auth";

const DEFAULT_AUTH_ERROR =
  "Сталася помилка. Спробуйте ще раз або перевірте підключення.";

function getAvatar(email: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`;
}

function mapFirebaseAuthError(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return DEFAULT_AUTH_ERROR;
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "Користувач з таким email вже існує.";
    case "auth/invalid-email":
      return "Вкажіть коректну email-адресу.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Невірний email або пароль.";
    case "auth/weak-password":
      return "Пароль має містити щонайменше 6 символів.";
    case "auth/too-many-requests":
      return "Забагато спроб входу. Спробуйте трохи пізніше.";
    case "auth/network-request-failed":
      return "Не вдалося підключитися до сервера. Перевірте інтернет.";
    default:
      return DEFAULT_AUTH_ERROR;
  }
}

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  avatar?: string;
};

type UserStore = {
  user: User | null;
  isAuthLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  hasInitialized: boolean;
  initAuth: () => void;
  clearError: () => void;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
};

let unsubscribeAuthListener: (() => void) | null = null;

async function syncUser(firebaseUser: FirebaseUser) {
  return ensureUserProfileDocument(firebaseUser, {
    avatar: firebaseUser.photoURL || getAvatar(firebaseUser.email || firebaseUser.uid),
  });
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isAuthLoading: true,
  isSubmitting: false,
  error: null,
  hasInitialized: false,

  initAuth: () => {
    if (get().hasInitialized) {
      return;
    }

    set({ hasInitialized: true, isAuthLoading: true });

    unsubscribeAuthListener = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, isAuthLoading: false, error: null });
        return;
      }

      try {
        const user = await syncUser(firebaseUser);
        set({ user, isAuthLoading: false, error: null });
      } catch (error) {
        set({
          user: null,
          isAuthLoading: false,
          error: mapFirebaseAuthError(error),
        });
      }
    });
  },

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isSubmitting: true, error: null });

    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const user = await syncUser(credentials.user);
      set({ user, isSubmitting: false, error: null });
      return user;
    } catch (error) {
      const message = mapFirebaseAuthError(error);
      set({ isSubmitting: false, error: message });
      throw error;
    }
  },

  register: async ({ firstName, lastName, email, password }) => {
    set({ isSubmitting: true, error: null });

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const avatar = getAvatar(email);

      await updateAuthProfile(credentials.user, {
        displayName: `${firstName} ${lastName}`.trim(),
        photoURL: avatar,
      });

      await createUserProfileDocument(credentials.user, {
        firstName,
        lastName,
        email,
        avatar,
      });

      const user = await syncUser(credentials.user);
      set({ user, isSubmitting: false, error: null });
      return user;
    } catch (error) {
      const message = mapFirebaseAuthError(error);
      set({ isSubmitting: false, error: message });
      throw error;
    }
  },

  logout: async () => {
    set({ isSubmitting: true, error: null });

    try {
      await signOut(auth);
      set({ user: null, isSubmitting: false, error: null });
    } catch (error) {
      const message = mapFirebaseAuthError(error);
      set({ isSubmitting: false, error: message });
      throw error;
    }
  },

  updateProfile: async ({ firstName, lastName, avatar }) => {
    const currentUser = get().user;
    const firebaseUser = auth.currentUser;

    if (!currentUser || !firebaseUser) {
      const message = "Щоб оновити профіль, потрібно знову увійти в акаунт.";
      set({ error: message });
      throw new Error(message);
    }

    set({ isSubmitting: true, error: null });

    try {
      await updateAuthProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`.trim(),
        photoURL: avatar || currentUser.avatar || null,
      });

      const user = await updateUserProfileDocument(firebaseUser.uid, {
        firstName,
        lastName,
        avatar: avatar || currentUser.avatar,
      });

      set({ user, isSubmitting: false, error: null });
      return user;
    } catch (error) {
      const message = mapFirebaseAuthError(error);
      set({ isSubmitting: false, error: message });
      throw error;
    }
  },
}));

export function cleanupUserStore() {
  unsubscribeAuthListener?.();
  unsubscribeAuthListener = null;
}
