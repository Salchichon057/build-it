"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </SessionContextProvider>
  );
}
