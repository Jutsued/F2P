import Link from "next/link";

// Breadcrumb + title block shared by the listing pages.
// `crumbs` is [{ href, label }]; the last crumb is the current page (no href).
export default function PageHeader({ crumbs, title, children }) {
  return (
    <header className="space-y-4 border-b-2 border-ink pb-6">
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.label}>
            {" / "}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-ink">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className="display text-4xl sm:text-6xl">{title}</h1>
      {children}
    </header>
  );
}
