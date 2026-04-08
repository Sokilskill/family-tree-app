import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Person } from '../types/person';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'lucide-react';

interface PersonNodeProps {
  data: {
    person: Person;
    onClick: (person: Person) => void;
  };
}

function PersonNodeComponent({ data }: PersonNodeProps) {
  const { person, onClick } = data;

  const getYears = () => {
    const birthYear = person.birthDate ? new Date(person.birthDate).getFullYear() : '?';
    const deathYear = person.deathDate ? new Date(person.deathDate).getFullYear() : '';
    return deathYear ? `${birthYear} - ${deathYear}` : `${birthYear}`;
  };

  const getInitials = () => {
    return `${person.firstName[0]}${person.lastName[0]}`;
  };

  const getFullName = () => {
    const parts = [person.lastName, person.firstName, person.middleName].filter(Boolean);
    return parts.join(' ');
  };

  const getMaidenName = () => {
    return person.maidenName ? `(${person.maidenName})` : '';
  };

  return (
    <div
      onClick={() => onClick(person)}
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-purple-400 hover:shadow-xl transition-all duration-300 cursor-pointer p-4 min-w-[240px] hover:scale-105"
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-500" />
      
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar className="h-16 w-16 border-2 border-gray-100 shadow-md">
          <AvatarImage src={person.avatar} alt={getFullName()} />
          <AvatarFallback className={person.gender === 'male' ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gradient-to-br from-pink-100 to-pink-200'}>
            {person.avatar ? null : <User className="h-8 w-8 text-gray-400" />}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="font-semibold text-sm leading-tight text-gray-900">
            {getFullName()}
          </div>
          {person.maidenName && (
            <div className="text-xs text-gray-500 italic">{getMaidenName()}</div>
          )}
          <div className="text-xs text-gray-600">{getYears()}</div>
        </div>

        {person.deathDate && (
          <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
            †
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-500" />
    </div>
  );
}

export const PersonNode = memo(PersonNodeComponent);