import { Loader2 } from "lucide-react";
import { createBrowserRouter, Navigate } from "react-router";

import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { FamilyTreePage } from "./pages/FamilyTreePage";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { useUserStore } from "../store/useUserStore";

function AuthScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="flex items-center gap-3 rounded-2xl bg-white/85 px-5 py-4 shadow-lg backdrop-blur">
        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
        <p className="text-sm font-medium text-slate-700">Перевіряємо сесію...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const isAuthLoading = useUserStore((state) => state.isAuthLoading);

  if (isAuthLoading) {
    return <AuthScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const isAuthLoading = useUserStore((state) => state.isAuthLoading);

  if (isAuthLoading) {
    return <AuthScreenLoader />;
  }

  if (user) {
    return <Navigate to="/tree" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/tree",
    element: (
      <ProtectedRoute>
        <FamilyTreePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
