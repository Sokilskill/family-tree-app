import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import type { Person } from "../types/person";

type PersonPayload = Omit<Person, "id">;

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function toOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function mapPersonDocument(
  id: string,
  data: Record<string, unknown>,
): Person {
  return {
    id,
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    middleName: toOptionalString(data.middleName),
    maidenName: toOptionalString(data.maidenName),
    birthDate: toOptionalString(data.birthDate),
    deathDate: toOptionalString(data.deathDate),
    avatar: toOptionalString(data.avatar),
    description: toOptionalString(data.description),
    facts: toStringArray(data.facts),
    photos: toStringArray(data.photos),
    gender: data.gender === "female" ? "female" : "male",
    parents: toStringArray(data.parents),
    children: toStringArray(data.children),
    spouse: toOptionalString(data.spouse),
  };
}

function getPersonsCollection(uid: string) {
  return collection(db, "users", uid, "persons");
}

function sanitizePersonPayload(payload: PersonPayload) {
  return {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    middleName: payload.middleName?.trim() || "",
    maidenName: payload.maidenName?.trim() || "",
    birthDate: payload.birthDate || "",
    deathDate: payload.deathDate || "",
    avatar: payload.avatar || "",
    description: payload.description?.trim() || "",
    facts: payload.facts.map((fact) => fact.trim()).filter(Boolean),
    photos: payload.photos.filter(Boolean),
    gender: payload.gender,
    parents: payload.parents.filter(Boolean),
    children: payload.children.filter(Boolean),
    spouse: payload.spouse || "",
  };
}

export async function listFamilyPersons(uid: string) {
  const snapshot = await getDocs(getPersonsCollection(uid));

  return snapshot.docs
    .map((personDoc) => mapPersonDocument(personDoc.id, personDoc.data()))
    .sort((left, right) => {
      const lastNameCompare = left.lastName.localeCompare(right.lastName, "uk");

      if (lastNameCompare !== 0) {
        return lastNameCompare;
      }

      return left.firstName.localeCompare(right.firstName, "uk");
    });
}

export async function createFamilyPerson(uid: string, payload: PersonPayload) {
  const personRef = doc(getPersonsCollection(uid));
  const personData = sanitizePersonPayload(payload);

  await setDoc(personRef, {
    ...personData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: personRef.id,
    ...personData,
  };
}

export async function updateFamilyPerson(uid: string, person: Person) {
  const personRef = doc(db, "users", uid, "persons", person.id);
  const personData = sanitizePersonPayload(person);

  await updateDoc(personRef, {
    ...personData,
    updatedAt: serverTimestamp(),
  });

  return {
    id: person.id,
    ...personData,
  };
}
