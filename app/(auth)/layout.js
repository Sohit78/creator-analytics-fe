export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 p-4">
      <section className="w-full max-w-md rounded-2xl border border-brand-100 bg-white p-6 shadow-lg">{children}</section>
    </main>
  );
}
