export default function AdminHome() {
  return (
    <section className="mx-auto max-w-3xl space-y-4 py-10">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Authenticated admin tools will live here. This placeholder confirms that session checks protect the
        <code className="mx-1">/admin</code> route family.
      </p>
    </section>
  );
}
