"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        style: {
          borderRadius: "8px",
          fontFamily: "inherit",
        },
      }}
    />
  );
}
