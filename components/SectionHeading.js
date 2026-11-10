import Link from "next/link";

export default function SectionHeading({ id, title, link }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-t-2 border-ink pt-3">
      <h2 id={id} className="display text-3xl sm:text-4xl">
        {title}
      </h2>
      {link && (
        <Link href={link.href} className="text-link text-sm font-semibold">
          {link.label}
        </Link>
      )}
    </div>
  );
}
