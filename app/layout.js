import "../styles/globals.css";

export const metadata = {
  title: "Creator Analytics Dashboard",
  description: "Manage creators and backend-generated analytics"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-brand-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
