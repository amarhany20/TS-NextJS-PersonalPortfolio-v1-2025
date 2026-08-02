import Link from 'next/link';

import { DashboardService } from '@/server/services/DashboardService';

export default async function AdminDashboard() {
  const overview = await DashboardService.getAdminOverview();
  const lastUpdatedLabel = overview.meta.lastUpdatedAt
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(
        overview.meta.lastUpdatedAt,
      )
    : 'No activity recorded yet';

  return (
    <section className="space-y-10 py-10">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold">Admin dashboard</h1>
          {overview.meta.maintenanceMode ? (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-600">
              Maintenance mode enabled
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Snapshot of your content and operations. Data refreshes on every visit.
        </p>
        <p className="text-xs text-muted-foreground">Last activity: {lastUpdatedLabel}</p>
        {overview.meta.missingEnvVars.length > 0 ? (
          <p className="text-xs text-amber-600">
            Missing env vars: {overview.meta.missingEnvVars.join(', ')} — add them to your
            `.env.local` and deployment secrets.
          </p>
        ) : null}
      </header>

      <section>
        <h2 className="text-lg font-semibold">Key metrics</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overview.stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>
    </section>
  );
}

function StatCard({
  stat,
}: {
  stat: Awaited<ReturnType<typeof DashboardService.getAdminOverview>>['stats'][number];
}) {
  const CardContent = () => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{stat.label}</p>
      <p className="text-3xl font-semibold tracking-tight">{stat.value.toLocaleString()}</p>
      {stat.helper ? <p className="text-sm text-muted-foreground">{stat.helper}</p> : null}
    </div>
  );

  const cardClass = `rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-accent`;

  if (stat.href) {
    return (
      <Link
        prefetch={false}
        href={stat.href}
        className={`${cardClass} block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <div className={cardClass}>
      <CardContent />
    </div>
  );
}
