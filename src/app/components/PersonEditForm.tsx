import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Person } from "../types/person";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface PersonEditFormProps {
  person: Person;
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: Person) => void;
  allPersons: Person[];
}

export function PersonEditForm({ person, isOpen, onClose, onSave }: PersonEditFormProps) {
  const [editedPerson, setEditedPerson] = useState<Person>({ ...person });
  const [newFact, setNewFact] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(editedPerson);
  };

  const addFact = () => {
    if (!newFact.trim()) return;
    setEditedPerson((prevPerson) => ({ ...prevPerson, facts: [...prevPerson.facts, newFact.trim()] }));
    setNewFact("");
  };

  const removeFact = (index: number) => {
    setEditedPerson((prevPerson) => ({
      ...prevPerson,
      facts: prevPerson.facts.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Редагувати інформацію</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ім&apos;я *</Label>
                  <Input id="firstName" value={editedPerson.firstName} onChange={(event) => setEditedPerson({ ...editedPerson, firstName: event.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Прізвище *</Label>
                  <Input id="lastName" value={editedPerson.lastName} onChange={(event) => setEditedPerson({ ...editedPerson, lastName: event.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="middleName">По батькові</Label>
                  <Input id="middleName" value={editedPerson.middleName || ""} onChange={(event) => setEditedPerson({ ...editedPerson, middleName: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maidenName">Дівоче прізвище</Label>
                  <Input id="maidenName" value={editedPerson.maidenName || ""} onChange={(event) => setEditedPerson({ ...editedPerson, maidenName: event.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Дата народження</Label>
                  <Input id="birthDate" type="date" value={editedPerson.birthDate || ""} onChange={(event) => setEditedPerson({ ...editedPerson, birthDate: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deathDate">Дата смерті</Label>
                  <Input id="deathDate" type="date" value={editedPerson.deathDate || ""} onChange={(event) => setEditedPerson({ ...editedPerson, deathDate: event.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Стать *</Label>
                <Select value={editedPerson.gender} onValueChange={(value: "male" | "female") => setEditedPerson({ ...editedPerson, gender: value })}>
                  <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Чоловік</SelectItem>
                    <SelectItem value="female">Жінка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">URL аватара</Label>
                <Input id="avatar" type="url" placeholder="https://example.com/photo.jpg" value={editedPerson.avatar || ""} onChange={(event) => setEditedPerson({ ...editedPerson, avatar: event.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Опис</Label>
                <Textarea id="description" rows={4} value={editedPerson.description || ""} onChange={(event) => setEditedPerson({ ...editedPerson, description: event.target.value })} placeholder="Розкажіть про цю людину..." />
              </div>

              <div className="space-y-2">
                <Label>Факти</Label>
                <div className="space-y-2">
                  {editedPerson.facts.map((fact, index) => (
                    <div key={`${fact}-${index}`} className="flex items-start gap-2">
                      <p className="flex-1 rounded bg-gray-50 p-2 text-sm">{fact}</p>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFact(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Додати новий факт..."
                      value={newFact}
                      onChange={(event) => setNewFact(event.target.value)}
                      onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addFact(); } }}
                    />
                    <Button type="button" onClick={addFact} size="icon"><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Скасувати</Button>
            <Button type="submit">Зберегти</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
