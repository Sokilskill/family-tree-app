import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Loader2, Plus, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import type { Person } from "../types/person";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface AddPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (person: Person) => Promise<void>;
}

interface PersonFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  maidenName?: string;
  birthDate?: string;
  deathDate?: string;
  gender: "male" | "female";
  description?: string;
}

export function AddPersonForm({ isOpen, onClose, onAdd }: AddPersonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facts, setFacts] = useState<string[]>([]);
  const [currentFact, setCurrentFact] = useState("");
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("male");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonFormData>();

  const handleClose = () => {
    reset();
    setFacts([]);
    setCurrentFact("");
    setSelectedGender("male");
    onClose();
  };

  const addFact = () => {
    if (!currentFact.trim()) {
      return;
    }

    setFacts((prevFacts) => [...prevFacts, currentFact.trim()]);
    setCurrentFact("");
  };

  const removeFact = (index: number) => {
    setFacts((prevFacts) =>
      prevFacts.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const onSubmit = async (data: PersonFormData) => {
    setIsSubmitting(true);

    try {
      const newPerson: Person = {
        id: "",
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        maidenName: data.maidenName,
        birthDate: data.birthDate,
        deathDate: data.deathDate,
        gender: selectedGender,
        description: data.description,
        facts,
        photos: [],
        parents: [],
        children: [],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}${data.lastName}`,
      };

      await onAdd(newPerson);
      handleClose();
    } catch {
      toast.error("Не вдалося зберегти нового члена родини.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl">
        <div className="-mx-6 -mt-6 mb-4 h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserPlus className="h-6 w-6 text-purple-600" />
            Додати нового члена родини
          </DialogTitle>
          <DialogDescription>
            Заповніть інформацію про члена родини. Обов&apos;язкові поля
            позначені зірочкою.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <div className="h-5 w-1 rounded-full bg-gradient-to-b from-purple-600 to-pink-600" />
              Основна інформація
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Ім&apos;я <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Іван"
                  className="rounded-xl"
                  {...register("firstName", {
                    required: "Ім&apos;я обов&apos;язкове",
                    minLength: { value: 2, message: "Мінімум 2 символи" },
                  })}
                />
                {errors.firstName ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600"
                  >
                    {errors.firstName.message}
                  </motion.p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Прізвище <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Петренко"
                  className="rounded-xl"
                  {...register("lastName", {
                    required: "Прізвище обов&apos;язкове",
                    minLength: { value: 2, message: "Мінімум 2 символи" },
                  })}
                />
                {errors.lastName ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600"
                  >
                    {errors.lastName.message}
                  </motion.p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="middleName">По батькові</Label>
                <Input
                  id="middleName"
                  placeholder="Миколайович"
                  className="rounded-xl"
                  {...register("middleName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maidenName">Дівоче прізвище</Label>
                <Input
                  id="maidenName"
                  placeholder="Іванова"
                  className="rounded-xl"
                  {...register("maidenName")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">
                Стать <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedGender}
                onValueChange={(value) =>
                  setSelectedGender(value as "male" | "female")
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Чоловіча</SelectItem>
                  <SelectItem value="female">Жіноча</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <div className="h-5 w-1 rounded-full bg-gradient-to-b from-purple-600 to-pink-600" />
              Дати
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Дата народження</Label>
                <Input
                  id="birthDate"
                  type="date"
                  className="rounded-xl"
                  {...register("birthDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deathDate">Дата смерті</Label>
                <Input
                  id="deathDate"
                  type="date"
                  className="rounded-xl"
                  {...register("deathDate")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Textarea
              id="description"
              placeholder="Розкажіть про цю людину..."
              className="min-h-24 resize-none rounded-xl"
              {...register("description")}
            />
          </div>

          <div className="space-y-3">
            <Label>Факти та історії</Label>
            <div className="flex gap-2">
              <Input
                value={currentFact}
                onChange={(event) => setCurrentFact(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addFact();
                  }
                }}
                placeholder="Додати факт або історію..."
                className="flex-1 rounded-xl"
              />
              <Button
                type="button"
                onClick={addFact}
                variant="outline"
                className="rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <AnimatePresence>
              {facts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {facts.map((fact, index) => (
                    <motion.div
                      key={`${fact}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group flex items-center gap-2 rounded-xl bg-purple-50 p-3"
                    >
                      <span className="flex-1 text-sm">{fact}</span>
                      <button
                        type="button"
                        onClick={() => removeFact(index)}
                        className="rounded p-1 text-red-600 opacity-0 transition-opacity hover:bg-red-100 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl"
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Додавання...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Додати
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
