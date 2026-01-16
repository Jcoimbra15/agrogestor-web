import "./globals.css";

export const metadata = {
  title: "AgroGestor",
  description: "Gestão Rural Inteligente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
