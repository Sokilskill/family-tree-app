import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { Home, Loader2, LogOut, Network, Settings, User } from "lucide-react";

import { useUserStore } from "../../store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const isSubmitting = useUserStore((state) => state.isSubmitting);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/tree" className="group flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 transition-shadow group-hover:shadow-lg">
                <Network className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                Родинне Дерево
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              <Link to="/tree">
                <Button
                  variant={isActive("/tree") ? "secondary" : "ghost"}
                  className={`rounded-xl ${
                    isActive("/tree")
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-purple-50"
                  }`}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Дерево
                </Button>
              </Link>
            </div>

            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="relative">
                      <Avatar className="h-10 w-10 cursor-pointer border-2 border-purple-200 transition-colors hover:border-purple-400">
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer rounded-lg"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Мій профіль</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer rounded-lg"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Налаштування</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isSubmitting}
                      className="cursor-pointer rounded-lg text-red-600"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      <span>Вийти</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <main>{children}</main>
    </div>
  );
}
