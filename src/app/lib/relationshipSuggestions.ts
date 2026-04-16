import type { Person } from "../types/person";

type PersonReference = Pick<
  Person,
  | "id"
  | "lastName"
  | "maidenName"
  | "birthDate"
  | "parents"
  | "children"
  | "gender"
>;

function normalizeSurname(value?: string) {
  return (value || "")
    .trim()
    .toLocaleLowerCase("uk")
    .replace(/['`’\s-]+/g, "");
}

function getComparableSurnames(
  person: Pick<PersonReference, "lastName" | "maidenName">,
) {
  return Array.from(
    new Set(
      [person.lastName, person.maidenName]
        .map((value) => normalizeSurname(value))
        .filter(Boolean),
    ),
  );
}

function haveSimilarSurname(left: PersonReference, right: PersonReference) {
  const leftSurnames = getComparableSurnames(left);
  const rightSurnames = getComparableSurnames(right);

  if (leftSurnames.length === 0 || rightSurnames.length === 0) {
    return false;
  }

  return leftSurnames.some((leftSurname) =>
    rightSurnames.some(
      (rightSurname) =>
        leftSurname === rightSurname ||
        leftSurname.startsWith(rightSurname) ||
        rightSurname.startsWith(leftSurname),
    ),
  );
}

function getBirthYear(date?: string) {
  if (!date) {
    return null;
  }

  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : year;
}

function isDeadBeforeBirth(candidate: Person, reference: PersonReference) {
  const deathYear = getBirthYear(candidate.deathDate);
  const birthYear = getBirthYear(reference.birthDate);

  if (deathYear === null || birthYear === null) return false;

  return deathYear < birthYear;
}

function isAtLeastYearsYounger(
  candidate: PersonReference,
  reference: PersonReference,
  years: number,
) {
  const candidateYear = getBirthYear(candidate.birthDate);
  const referenceYear = getBirthYear(reference.birthDate);

  if (candidateYear === null || referenceYear === null) {
    return false;
  }

  return candidateYear - referenceYear >= years;
}

export function getSuggestedChildren(
  persons: Person[],
  reference: PersonReference,
) {
  if (!reference.lastName || !reference.birthDate) {
    return [];
  }

  return persons.filter((candidate) => {
    if (candidate.id === reference.id) {
      return false;
    }

    if (!candidate.birthDate) {
      return false;
    }


    if (
      reference.parents.includes(candidate.id) ||
      reference.children.includes(candidate.id)
    ) {
      return false;
    }

    return (
      haveSimilarSurname(candidate, reference) &&
      isAtLeastYearsYounger(candidate, reference, 18)
    );
  });
}

export function getSuggestedParents(
  persons: Person[],
  reference: PersonReference,
) {
  if (!reference.lastName || !reference.birthDate) {
    return [];
  }

  return persons.filter((candidate) => {
    if (candidate.id === reference.id) {
      return false;
    }

    if (!candidate.birthDate) {
      return false;
    }

    if (
      reference.parents.includes(candidate.id) ||
      reference.children.includes(candidate.id)
    ) {
      return false;
    }

    if (candidate.deathDate && isDeadBeforeBirth(candidate, reference)) {
      return false;
    }

    return (
      haveSimilarSurname(candidate, reference) &&
      isAtLeastYearsYounger(reference, candidate, 18)
    );
  });
}

export function getSuggestedPartners(
  persons: Person[],
  reference: PersonReference,
) {
  if (!reference.lastName || !reference.birthDate) {
    return [];
  }

  return persons.filter((candidate) => {
    if (candidate.id === reference.id) {
      return false;
    }

    if (
      reference.parents.includes(candidate.id) ||
      reference.children.includes(candidate.id)
    ) {
      return false;
    }

    if (candidate.gender === reference.gender) {
      return false;
    }

    return (
      haveSimilarSurname(candidate, reference) &&
      !isAtLeastYearsYounger(candidate, reference, 18)
    );
  });
}
