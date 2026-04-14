export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  maidenName?: string;
  birthDate?: string;
  deathDate?: string;
  avatar?: string;
  description?: string;
  facts: string[];
  photos: string[];
  gender: "male" | "female";
  parents: string[];
  children: string[];
  partners?: string[];
  stepParents?: string[];
  spouse?: string;
}

export interface FamilyTreeFilters {
  generation?: string;
  gender?: "all" | "male" | "female";
  alive?: "all" | "alive" | "deceased";
}
