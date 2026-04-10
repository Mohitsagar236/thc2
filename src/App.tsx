const highlights = [
  {
    title: "Fast bootstrap",
    description:
      "Vite powers local development on port 3000 with a clean React + TypeScript baseline.",
  },
  {
    title: "Design tokens",
    description:
      "Primary, blue.dark, and golden are exposed in Tailwind for consistent branding.",
  },
  {
    title: "Guardrails",
    description:
      "ESLint, Prettier, Husky, and lint-staged are wired for repeatable code quality.",
  },
];

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(100,103,242,0.16),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f7f8ff_100%)] text-blue-dark">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-golden" />
          Disha frontend setup
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-blue-dark sm:text-5xl lg:text-6xl">
              A clean React foundation with Vite, Tailwind, and repo guardrails.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              This scaffold gives Disha a production-ready starting point with
              aliases, linting, formatting, Husky hooks, and the requested brand
              colors already in place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-primary/90"
                href="https://vite.dev/guide/"
                target="_blank"
                rel="noreferrer"
              >
                Open Vite guide
              </a>
              <a
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-blue-dark transition hover:border-primary hover:text-primary"
                href="https://tailwindcss.com/docs/installation"
                target="_blank"
                rel="noreferrer"
              >
                Tailwind setup
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Project status
                </p>
                <p className="mt-1 text-2xl font-semibold text-blue-dark">
                  Ready to build
                </p>
              </div>
              <div className="rounded-2xl bg-golden/15 px-4 py-2 text-sm font-semibold text-golden">
                Tailwind v3
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <h2 className="text-base font-semibold text-blue-dark">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
