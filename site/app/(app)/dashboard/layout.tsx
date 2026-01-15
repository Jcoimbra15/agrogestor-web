import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <main className="max-w-7xl mx-auto">
        <section className="bg-white rounded shadow p-6">
          {children}
        </section>
      </main>
    </div>
  );
}
