import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  children: ReactNode;
}

export function Sidebar({ isOpen, onToggle, title, children }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ duration: 0.5, ease: "linear" }}
      className="fixed left-0 top-[57px] z-10 h-full border-r border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md overflow-y-auto"
      style={{ width: "320px" }}
    >
      <div className="flex h-full flex-col center">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-md font-semibold text-transparent">
            {title}
          </h2>

          <Button variant="ghost" size="icon" onClick={onToggle}>
            {isOpen ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </Button>
        </div>

        {isOpen && (
          <div className="flex-1 space-y-6 overflow-y-auto p-4">{children}</div>
        )}
      </div>
    </motion.div>
  );
}
