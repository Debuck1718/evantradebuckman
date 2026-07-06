import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Error 404
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Page Not Found
        </h1>

        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to the Evantra Headquarters.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Return to Headquarters
        </Link>
      </div>
    </main>
  );
}