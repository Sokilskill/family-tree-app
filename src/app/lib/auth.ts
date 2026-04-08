import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

import { db } from "../../firebase";
import type { User } from "../types/user";

type UserProfileOverrides = Partial<
  Pick<User, "firstName" | "lastName" | "email" | "avatar">
>;

function getDefaultAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;
}

function timestampToIso(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return new Date().toISOString();
}

function getNamesFromDisplayName(displayName: string | null) {
  if (!displayName) {
    return { firstName: "", lastName: "" };
  }

  const [firstName = "", ...rest] = displayName.trim().split(" ");
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function mapUserDocument(
  uid: string,
  data: Record<string, unknown>,
  fallbackEmail = "",
): User {
  return {
    id: uid,
    email: typeof data.email === "string" ? data.email : fallbackEmail,
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    avatar: typeof data.avatar === "string" ? data.avatar : undefined,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

function buildFallbackUser(
  firebaseUser: FirebaseUser,
  overrides: UserProfileOverrides = {},
) {
  const displayName = getNamesFromDisplayName(firebaseUser.displayName);

  return {
    firstName: overrides.firstName || displayName.firstName || "Користувач",
    lastName: overrides.lastName || displayName.lastName || "",
    email: overrides.email || firebaseUser.email || "",
    avatar:
      overrides.avatar ||
      firebaseUser.photoURL ||
      getDefaultAvatar(firebaseUser.email || firebaseUser.uid),
  };
}

export async function createUserProfileDocument(
  firebaseUser: FirebaseUser,
  overrides: UserProfileOverrides = {},
) {
  const userRef = doc(db, "users", firebaseUser.uid);
  const fallback = buildFallbackUser(firebaseUser, overrides);

  await setDoc(userRef, {
    ...fallback,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function ensureUserProfileDocument(
  firebaseUser: FirebaseUser,
  overrides: UserProfileOverrides = {},
) {
  const userRef = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await createUserProfileDocument(firebaseUser, overrides);
    const createdSnapshot = await getDoc(userRef);
    return mapUserDocument(
      firebaseUser.uid,
      createdSnapshot.data() || {},
      firebaseUser.email || "",
    );
  }

  const data = snapshot.data();
  const fallback = buildFallbackUser(firebaseUser, overrides);
  const nextData = {
    ...data,
    email: data.email || fallback.email,
    firstName: data.firstName || fallback.firstName,
    lastName: data.lastName || fallback.lastName,
    avatar: data.avatar || fallback.avatar,
  };

  return mapUserDocument(firebaseUser.uid, nextData, firebaseUser.email || "");
}

export async function updateUserProfileDocument(
  uid: string,
  updates: Pick<User, "firstName" | "lastName"> & { avatar?: string },
) {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  const snapshot = await getDoc(userRef);
  return mapUserDocument(uid, snapshot.data() || {}, "");
}
