import { motion } from "motion/react";
import { Filter, Search, X } from "lucide-react";

import { FamilyTreeFilters } from "../types/person";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FamilyTreeFilters;
  onFiltersChange: (filters: FamilyTreeFilters) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-10 h-full border-r border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md"
      style={{ width: "320px" }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent">
            Фільтри та пошук
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
            <Label htmlFor="search">Пошук</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input id="search" placeholder="Ім&apos;я, прізвище, ключові слова..." value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} className="rounded-xl pl-10" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-600" />
              <h3 className="font-medium">Фільтри</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Стать</Label>
              <Select value={filters.gender} onValueChange={(value) => onFiltersChange({ ...filters, gender: value as FamilyTreeFilters["gender"] })}>
                <SelectTrigger id="gender" className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі</SelectItem>
                  <SelectItem value="male">Чоловіки</SelectItem>
                  <SelectItem value="female">Жінки</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alive">Статус</Label>
              <Select value={filters.alive} onValueChange={(value) => onFiltersChange({ ...filters, alive: value as FamilyTreeFilters["alive"] })}>
                <SelectTrigger id="alive" className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі</SelectItem>
                  <SelectItem value="alive">Живі</SelectItem>
                  <SelectItem value="deceased">Померлі</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
