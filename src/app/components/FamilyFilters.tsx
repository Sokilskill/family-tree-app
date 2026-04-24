import { motion } from "motion/react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Filter, Search } from "lucide-react";
import type { FamilyTreeFilters } from "../types/person";
import { Button } from "./ui/button";

interface FamilyFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FamilyTreeFilters;
  onFiltersChange: (filters: FamilyTreeFilters) => void;
}

export function FamilyFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: FamilyFiltersProps) {
  return (
    <div className="flex-1 space-y-6 ">
      <Label htmlFor="search" className="sr-only">
        Пошук
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          id="search"
          placeholder="Ім'я, прізвище, ключові слова..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="rounded-xl pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-purple-600" />
        <h3 className="font-medium">Фільтри</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Стать</Label>
        <Select
          value={filters.gender}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              gender: value as FamilyTreeFilters["gender"],
            })
          }
        >
          <SelectTrigger id="gender" className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі</SelectItem>
            <SelectItem value="male">Чоловіки</SelectItem>
            <SelectItem value="female">Жінки</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alive">Статус</Label>
        <Select
          value={filters.alive}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              alive: value as FamilyTreeFilters["alive"],
            })
          }
        >
          <SelectTrigger id="alive" className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі</SelectItem>
            <SelectItem value="alive">Живі</SelectItem>
            <SelectItem value="deceased">Відійшли у вічність</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full rounded-xl hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
        onClick={() => {
          onSearchChange("");
          onFiltersChange({ gender: "all", alive: "all" });
        }}
      >
        Скинути фільтри
      </Button>
    </div>
  );
}
