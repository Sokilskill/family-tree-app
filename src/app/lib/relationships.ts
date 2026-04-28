import type { Person } from "../types/person";

function uniqueIds(ids: string[], selfId?: string) {
  return Array.from(new Set(ids.filter((id) => id && id !== selfId)));
}

export function getPartnerIds(person: Person) {
  return uniqueIds(
    [...(person.partners ?? []), person.spouse].filter(Boolean) as string[],
    person.id,
  );
}

export function getStepParentIds(person: Person) {
  return uniqueIds(person.stepParents ?? [], person.id);
}

function clonePerson(person: Person): Person {
  return {
    ...person,
    parents: [...person.parents],
    children: [...person.children],
    partners: [...getPartnerIds(person)],
    stepParents: [...getStepParentIds(person)],
  };
}

function addUnique(ids: string[], value: string, maxLength?: number) {
  const nextIds = uniqueIds([...ids, value]);

  if (!maxLength) {
    return nextIds;
  }

  return nextIds.slice(0, maxLength);
}

function removeId(ids: string[], value: string) {
  return ids.filter((id) => id !== value);
}

function sanitizePerson(person: Person, knownIds: Set<string>): Person {
  const partners = getPartnerIds(person).filter((id) => knownIds.has(id));

  return {
    ...person,
    parents: uniqueIds(person.parents, person.id).filter((id) =>
      knownIds.has(id),
    ),
    children: uniqueIds(person.children, person.id).filter((id) =>
      knownIds.has(id),
    ),
    partners,
    stepParents: getStepParentIds(person).filter((id) => knownIds.has(id)),
    spouse: partners[0],
  };
}

export function applyPersonRelationships(
  persons: Person[],
  nextPerson: Person,
  previousPerson?: Person,
) {
  const personMap = new Map(
    persons.map((person) => [person.id, clonePerson(person)]),
  );
  personMap.set(nextPerson.id, clonePerson(nextPerson));

  const knownIds = new Set(personMap.keys());

  for (const [id, person] of personMap) {
    personMap.set(id, sanitizePerson(person, knownIds));
  }

  const currentPerson = personMap.get(nextPerson.id);

  if (!currentPerson) {
    return Array.from(personMap.values());
  }

  const previousParents = new Set(previousPerson?.parents ?? []);
  const nextParents = new Set(currentPerson.parents);
  const previousChildren = new Set(previousPerson?.children ?? []);
  const nextChildren = new Set(currentPerson.children);
  const previousPartners = new Set(
    previousPerson ? getPartnerIds(previousPerson) : [],
  );
  const nextPartners = new Set(currentPerson.partners ?? []);

  previousParents.forEach((parentId) => {
    if (nextParents.has(parentId)) {
      return;
    }

    const parent = personMap.get(parentId);

    if (parent) {
      parent.children = removeId(parent.children, currentPerson.id);
    }
  });

  nextParents.forEach((parentId) => {
    const parent = personMap.get(parentId);

    if (parent) {
      parent.children = addUnique(parent.children, currentPerson.id);
    }
  });

  previousChildren.forEach((childId) => {
    if (nextChildren.has(childId)) {
      return;
    }

    const child = personMap.get(childId);

    if (child) {
      child.parents = removeId(child.parents, currentPerson.id);
    }
  });

  nextChildren.forEach((childId) => {
    const child = personMap.get(childId);

    if (child) {
      child.parents = addUnique(child.parents, currentPerson.id, 2);
    }
  });

  previousPartners.forEach((partnerId) => {
    if (nextPartners.has(partnerId)) {
      return;
    }

    const partner = personMap.get(partnerId);

    if (partner) {
      partner.partners = removeId(partner.partners ?? [], currentPerson.id);
      partner.spouse = partner.partners[0];
    }
  });

  nextPartners.forEach((partnerId) => {
    const partner = personMap.get(partnerId);

    if (partner) {
      partner.partners = addUnique(partner.partners ?? [], currentPerson.id);
      partner.spouse = partner.partners[0];
    }
  });

  currentPerson.parents = uniqueIds(currentPerson.parents, currentPerson.id);
  currentPerson.children = uniqueIds(currentPerson.children, currentPerson.id);
  currentPerson.partners = getPartnerIds(currentPerson);
  currentPerson.stepParents = getStepParentIds(currentPerson);
  currentPerson.spouse = currentPerson.partners[0];

  for (const person of personMap.values()) {
    person.parents = uniqueIds(person.parents, person.id);
    person.children = uniqueIds(person.children, person.id);
    person.partners = getPartnerIds(person);
    person.stepParents = getStepParentIds(person);
    person.spouse = person.partners[0];

    if (person.spouse === person.id) {
      person.spouse = undefined;
    }
  }

  return Array.from(personMap.values());
}

export function haveRelationshipsChanged(left: Person, right: Person) {
  return (
    left.firstName !== right.firstName ||
    left.lastName !== right.lastName ||
    left.middleName !== right.middleName ||
    left.maidenName !== right.maidenName ||
    left.birthDate !== right.birthDate ||
    left.deathDate !== right.deathDate ||
    left.avatar !== right.avatar ||
    left.description !== right.description ||
    left.gender !== right.gender ||
    left.spouse !== right.spouse ||
    getPartnerIds(left).join("|") !== getPartnerIds(right).join("|") ||
    getStepParentIds(left).join("|") !== getStepParentIds(right).join("|") ||
    left.facts.join("|") !== right.facts.join("|") ||
    left.photos.join("|") !== right.photos.join("|") ||
    left.parents.join("|") !== right.parents.join("|") ||
    left.children.join("|") !== right.children.join("|")
  );
}
