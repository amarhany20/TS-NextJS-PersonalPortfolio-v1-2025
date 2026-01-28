export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Portfolio Setup
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Let's get your portfolio website up and running
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}