import Link from 'next/link';

import { DashboardService } from '@/server/services/DashboardService';

const badgeClassNames: Record<'default' | 'warning' | 'info', string> = {
  default: 'bg-muted text-muted-foreground',
  warning: 'bg-amber-500/15 text-amber-600',
  info: 'bg-sky-500/15 text-sky-600',
};

export default async function AdminHome() {
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

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick links</h2>
          <span className="text-xs text-muted-foreground">
            {overview.meta.pendingSetup
              ? 'Finish setup to unlock all actions.'
              : 'Recommended next steps based on current data.'}
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {overview.quickLinks.map((link) => (
            <QuickLinkCard key={link.title} link={link} />
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

function QuickLinkCard({
  link,
}: {
  link: Awaited<ReturnType<typeof DashboardService.getAdminOverview>>['quickLinks'][number];
}) {
  return (
    <Link
      prefetch={false}
      href={link.href}
      className="rounded-xl border border-border bg-card p-4 transition hover:border-accent"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{link.title}</p>
          <p className="text-sm text-muted-foreground">{link.description}</p>
        </div>
        {link.badge ? (
          <span
            className={`${badgeClassNames[link.status ?? 'default']} rounded-full px-2 py-0.5 text-xs font-medium`}
          >
            {link.badge}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
