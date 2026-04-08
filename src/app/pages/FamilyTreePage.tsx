import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Menu, Plus } from "lucide-react";

import { Button } from "../components/ui/button";
import { Sidebar } from "../components/Sidebar";
import { FamilyTree } from "../components/FamilyTree";
import { PersonDetails } from "../components/PersonDetails";
import { AddPersonForm } from "../components/AddPersonForm";
import { Person, FamilyTreeFilters } from "../types/person";
import { mockPersons } from "../data/mockData";

export function FamilyTreePage() {
  const [persons, setPersons] = useState<Person[]>(mockPersons);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
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
          person.lastName.toLowerCase().includes(query) ||
          person.middleName?.toLowerCase().includes(query) ||
          person.maidenName?.toLowerCase().includes(query);

        const matchesFacts = person.facts.some((fact) =>
          fact.toLowerCase().includes(query),
        );
        const matchesDescription = person.description?.toLowerCase().includes(query);

        if (!matchesName && !matchesFacts && !matchesDescription) {
          return false;
        }
      }

      if (filters.gender !== "all" && person.gender !== filters.gender) {
        return false;
      }

      if (filters.alive !== "all") {
        const isAlive = !person.deathDate;

        if (filters.alive === "alive" && !isAlive) {
          return false;
        }

        if (filters.alive === "deceased" && isAlive) {
          return false;
        }
      }

      return true;
    });
  }, [persons, searchQuery, filters]);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handlePersonSave = (updatedPerson: Person) => {
    setPersons((prevPersons) =>
      prevPersons.map((person) =>
        person.id === updatedPerson.id ? updatedPerson : person,
      ),
    );
    setSelectedPerson(updatedPerson);
  };

  const handlePersonAdd = (newPerson: Person) => {
    setPersons((prevPersons) => [...prevPersons, newPerson]);
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-semibold text-transparent">
            Родинне дерево
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Показано:{" "}
            <span className="font-semibold text-purple-600">{filteredPersons.length}</span> з{" "}
            {persons.length} осіб
          </span>
          <Button
            onClick={() => setIsAddFormOpen(true)}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Додати особу
          </Button>
        </div>
      </motion.header>

      <div className="relative h-[calc(100%-57px)]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full transition-all duration-300"
          style={{ marginLeft: isSidebarOpen ? "320px" : "0" }}
        >
          {filteredPersons.length > 0 ? (
            <FamilyTree persons={filteredPersons} onPersonClick={handlePersonClick} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                  <Menu className="h-10 w-10 text-purple-400" />
                </div>
                <p className="mb-2 text-xl text-gray-600">Нічого не знайдено</p>
                <p className="text-sm text-gray-500">
                  Спробуйте змінити параметри пошуку або фільтри
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      <PersonDetails
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onSave={handlePersonSave}
        allPersons={persons}
      />

      <AddPersonForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handlePersonAdd}
        allPersons={persons}
      />
    </div>
  );
}
