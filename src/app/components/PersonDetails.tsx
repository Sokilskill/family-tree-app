import { useState } from "react";
import { Person } from "../types/person";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  User,
  Edit,
  Calendar,
  Heart,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { PersonEditForm } from "./PersonEditForm";

interface PersonDetailsProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: Person) => Promise<void>;
  allPersons: Person[];
}

export function PersonDetails({
  person,
  isOpen,
  onClose,
  onSave,
  allPersons,
}: PersonDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!person) return null;

  const getFullName = () => {
    const parts = [person.lastName, person.firstName, person.middleName].filter(
      Boolean,
    );
    return parts.join(" ");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getAge = () => {
    if (!person.birthDate) return null;
    const birth = new Date(person.birthDate);
    const end = person.deathDate ? new Date(person.deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  const getRelativeName = (id: string) => {
    const relative = allPersons.find((p) => p.id === id);
    return relative ? `${relative.firstName} ${relative.lastName}` : "Невідомо";
  };

  const handleSave = async (updatedPerson: Person) => {
    await onSave(updatedPerson);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <PersonEditForm
        person={person}
        isOpen={isOpen}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-gray-200">
                <AvatarImage src={person.avatar} alt={getFullName()} />
                <AvatarFallback
                  className={
                    person.gender === "male" ? "bg-blue-100" : "bg-pink-100"
                  }
                >
                  <User className="h-10 w-10 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{getFullName()}</DialogTitle>
                {person.maidenName && (
                  <p className="text-sm text-gray-500">
                    Дівоче прізвище: {person.maidenName}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {person.birthDate && formatDate(person.birthDate)}
                  {person.deathDate && ` - ${formatDate(person.deathDate)}`}
                  {getAge() &&
                    ` (${getAge()} ${person.deathDate ? "років" : "років"})`}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Редагувати
            </Button>
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="info"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Інформація</TabsTrigger>
            <TabsTrigger value="family">Родина</TabsTrigger>
            <TabsTrigger value="facts">Факти</TabsTrigger>
            <TabsTrigger value="photos">Фото</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="info" className="space-y-4 p-1">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Опис
                </h3>
                <p className="text-gray-700">
                  {person.description || "Опис відсутній"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="family" className="space-y-4 p-1">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Родинні зв'язки
                </h3>

                {person.spouse && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Подружжя:</p>
                    <p className="text-gray-800">
                      {getRelativeName(person.spouse)}
                    </p>
                  </div>
                )}

                {person.parents.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Батьки:</p>
                    <ul className="list-disc list-inside text-gray-800">
                      {person.parents.map((parentId) => (
                        <li key={parentId}>{getRelativeName(parentId)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {person.children.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Діти:</p>
                    <ul className="list-disc list-inside text-gray-800">
                      {person.children.map((childId) => (
                        <li key={childId}>{getRelativeName(childId)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!person.spouse &&
                  person.parents.length === 0 &&
                  person.children.length === 0 && (
                    <p className="text-gray-500">
                      Інформація про родинні зв'язки відсутня
                    </p>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="facts" className="space-y-3 p-1">
              {person.facts.length > 0 ? (
                <ul className="space-y-2">
                  {person.facts.map((fact, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{fact}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Факти відсутні</p>
              )}
            </TabsContent>

            <TabsContent value="photos" className="p-1">
              {person.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {person.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={photo}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Фотографії відсутні</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
