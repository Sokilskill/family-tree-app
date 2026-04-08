import { useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

import { Person } from "../types/person";
import { PersonNode } from "./PersonNode";

interface FamilyTreeProps {
  persons: Person[];
  onPersonClick: (person: Person) => void;
}

const nodeTypes = {
  person: PersonNode,
};

export function FamilyTree({ persons, onPersonClick }: FamilyTreeProps) {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const generations = new Map<number, Person[]>();

    const getGeneration = (person: Person, visited = new Set<string>()): number => {
      if (visited.has(person.id)) {
        return 0;
      }

      visited.add(person.id);

      if (person.parents.length === 0) {
        return 0;
      }

      const parentGenerations = person.parents.map((parentId) => {
        const parent = persons.find((candidate) => candidate.id === parentId);
        return parent ? getGeneration(parent, visited) : 0;
      });

      return Math.max(...parentGenerations) + 1;
    };

    persons.forEach((person) => {
      const generation = getGeneration(person);

      if (!generations.has(generation)) {
        generations.set(generation, []);
      }

      generations.get(generation)?.push(person);
    });

    const horizontalSpacing = 300;
    const verticalSpacing = 200;

    Array.from(generations.entries())
      .sort(([left], [right]) => left - right)
      .forEach(([generation, personsInGeneration]) => {
        const generationWidth = personsInGeneration.length * horizontalSpacing;
        const startX = -generationWidth / 2;

        personsInGeneration.forEach((person, index) => {
          nodes.push({
            id: person.id,
            type: "person",
            position: {
              x: startX + index * horizontalSpacing,
              y: generation * verticalSpacing,
            },
            data: {
              person,
              onClick: onPersonClick,
            },
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
          });
        });
      });

    persons.forEach((person) => {
      person.children.forEach((childId) => {
        edges.push({
          id: `${person.id}-${childId}`,
          source: person.id,
          target: childId,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#94a3b8", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#94a3b8",
            width: 20,
            height: 20,
          },
        });
      });

      if (person.spouse) {
        const spouseIndex = persons.findIndex((candidate) => candidate.id === person.spouse);
        const personIndex = persons.findIndex((candidate) => candidate.id === person.id);

        if (personIndex < spouseIndex) {
          edges.push({
            id: `spouse-${person.id}-${person.spouse}`,
            source: person.id,
            target: person.spouse,
            type: "straight",
            animated: false,
            style: { stroke: "#ec4899", strokeWidth: 2, strokeDasharray: "5,5" },
            label: "♥",
            labelStyle: { fill: "#ec4899", fontWeight: 700 },
            labelBgStyle: { fill: "white" },
          });
        }
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [persons, onPersonClick]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const person = (node.data as { person: Person }).person;
            return person.gender === "male" ? "#bfdbfe" : "#fbcfe8";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
