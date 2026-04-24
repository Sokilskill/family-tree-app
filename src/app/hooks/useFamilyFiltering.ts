import { useMemo, useState } from "react";
import type { Person, FamilyTreeFilters } from "../types/person";

export function useFamilyFiltering(persons: Person[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FamilyTreeFilters>({
    gender: "all",
    alive: "all",
  });

  const filteredPersons = useMemo(() => {
    return persons.filter((person) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName =
          person.firstName.toLowerCase().includes(query) ||
          person.lastName.toLowerCase().includes(query);
        const matchesFacts = person.facts.some((f) =>
          f.toLowerCase().includes(query),
        );

        if (!matchesName && !matchesFacts) return false;
      }

      if (filters.gender !== "all" && person.gender !== filters.gender)
        return false;

      if (filters.alive !== "all") {
        const isAlive = !person.deathDate;
        if (filters.alive === "alive" && !isAlive) return false;
        if (filters.alive === "deceased" && isAlive) return false;
      }

      return true;
    });
  }, [persons, searchQuery, filters]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredPersons,
  };
}
