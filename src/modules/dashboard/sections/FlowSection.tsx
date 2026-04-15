export function FlowSection() {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">Pipeline Flow</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          <li>Token updates enter source control with semantic versioning.</li>
          <li>CI validates WCAG rules across every published theme.</li>
          <li>Verdaccio stores every version for instant rollback options.</li>
          <li>CDN receives stable and versioned all-themes.js bundles.</li>
        </ul>
      </article>

      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">Runtime Flow</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          <li>Host loads one bundle and populates selector dynamically.</li>
          <li>Selection applies variables plus layout and density classes.</li>
          <li>MFEs reflect changes instantly through CSS inheritance.</li>
          <li>Preference persists locally and recovers on next page load.</li>
        </ul>
      </article>
    </section>
  );
}
