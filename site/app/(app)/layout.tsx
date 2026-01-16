import type { ReactNode } from "react";
import { ToastProvider } from "./toast";
import Sidebar from "./sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#0b1020] text-white">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
