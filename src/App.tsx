import { useEffect } from "react";
import { RouterProvider } from "react-router";

import { Toaster } from "./app/components/ui/sonner";
import { router } from "./app/routes";
import { useUserStore } from "./store/useUserStore";

export default function App() {
  useEffect(() => {
    useUserStore.getState().initAuth();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
