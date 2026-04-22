import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import type { Person } from "../types/person";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface RelationshipSelectorProps {
  label: string;
  persons: Person[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  emptyText?: string;
  maxSelections?: number;
}

interface RelationshipInputSelectorProps extends RelationshipSelectorProps {
  priorityIds?: string[];
  placeholder?: string;
  onCreateNewPerson?: () => void;
  showSuggestions?: boolean;
}

function getPersonLabel(person: Person) {
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}

export function RelationshipInputSelector({
  label,
  persons,
  selectedIds,
  onChange,
  emptyText,
  maxSelections,
  priorityIds = [],
  placeholder = "Пошук за ім'ям або прізвищем...",
  onCreateNewPerson,
  showSuggestions = true,
}: RelationshipInputSelectorProps) {
  const [query, setQuery] = useState("");

  const availablePersons = useMemo(
    () => persons.filter((candidate) => !selectedIds.includes(candidate.id)),
    [persons, selectedIds],
  );

  const filteredPersons = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("uk");

    if (!normalizedQuery) {
      if (!showSuggestions || priorityIds.length === 0) {
        return [];
      }

      return availablePersons
        .filter((person) => priorityIds.includes(person.id))
        .sort((left, right) => {
          const leftPriority = priorityIds.includes(left.id) ? 0 : 1;
          const rightPriority = priorityIds.includes(right.id) ? 0 : 1;

          if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
          }
          return getPersonLabel(left).localeCompare(getPersonLabel(right));
        });
    }

    return availablePersons
      .filter((person) => {
        const label = getPersonLabel(person).toLocaleLowerCase("uk");
        return label.includes(normalizedQuery);
      })
      .sort((left, right) => {
        const leftPriority = priorityIds.includes(left.id) ? 0 : 1;
        const rightPriority = priorityIds.includes(right.id) ? 0 : 1;

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        return getPersonLabel(left).localeCompare(getPersonLabel(right));
      });
  }, [availablePersons, priorityIds, query, showSuggestions]);

  const handleToggle = (personId: string) => {
    const nextIds = [...selectedIds, personId];
    onChange(maxSelections ? nextIds.slice(-maxSelections) : nextIds);
  };

  const handleAdd = () => {
    const normalizedQuery = query.trim().toLocaleLowerCase("uk");
    if (!normalizedQuery) {
      return;
    }

    const exactMatch = availablePersons.find(
      (person) =>
        getPersonLabel(person).toLocaleLowerCase("uk") === normalizedQuery,
    );

    if (exactMatch) {
      handleToggle(exactMatch.id);
      setQuery("");
      return;
    }

    if (filteredPersons.length === 1) {
      handleToggle(filteredPersons[0].id);
      setQuery("");
    }
  };

  const hasSuggestions = filteredPersons.length > 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLocaleLowerCase().replace(/\s+/g, "-")}>
        {label}
      </Label>
      <div className="relative flex items-center">
        <Input
          id={label.toLocaleLowerCase().replace(/\s+/g, "-")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 pr-10"
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
        />
        {onCreateNewPerson ? (
          <Button
            type="button"
            onClick={onCreateNewPerson}
            variant="outline"
            className="absolute right-6 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full  border border-slate-200 bg-white text-slate-700 transition hover:border-purple-300 hover:bg-purple-50"
            aria-label={`Створити ${label}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds.map((personId) => {
            const person = persons.find((item) => item.id === personId);
            if (!person) {
              return null;
            }

            return (
              <Button
                key={personId}
                type="button"
                onClick={() =>
                  onChange(selectedIds.filter((id) => id !== personId))
                }
                className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm text-purple-700"
              >
                {getPersonLabel(person)}
                <X className="h-3.5 w-3.5" />
              </Button>
            );
          })}
        </div>
      )}

      {hasSuggestions ? (
        <div className="flex flex-wrap gap-2">
          {filteredPersons.map((person) => (
            <Button
              key={person.id}
              type="button"
              onClick={() => handleToggle(person.id)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:border-purple-300 hover:bg-purple-100 hover:cursor-pointer"
            >
              {getPersonLabel(person)}
            </Button>
          ))}
        </div>
      ) : persons.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          {emptyText}
        </p>
      ) : null}
    </div>
  );
}
