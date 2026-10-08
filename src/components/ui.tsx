import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import specimens from "@/assets/specimens.jpg";
import type { Locale } from "@/content/site";
import type { BusinessPointSlug } from "@/content/businesses-point-data";
import { BusinessesCardViewer } from "./businesses-card-viewer";

import "./ui.css";

type LinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export function ButtonLink({
  children,
  className = "",
  href,
  small = false,
}: LinkProps & { small?: boolean }) {
  return (
    <Link
      className={`cta${small ? " sm" : ""}${className ? ` ${className}` : ""}`}
      href={href}
    >
      {children}
    </Link>
  );
}

export function TextLink({ children, className = "", href }: LinkProps) {
  return (
    <Link className={`lk${className ? ` ${className}` : ""}`} href={href}>
      {children}
      <svg
        aria-hidden="true"
        fill="none"
        height="12"
        viewBox="0 0 20 12"
        width="20"
      >
        <path d="M0 6h18M13 1l5 5-5 5" />
      </svg>
    </Link>
  );
}

export function RollLink({ children, className = "", href, current = false }: LinkProps & { current?: boolean }) {
  return (
    <Link
      aria-current={current ? "page" : undefined}
      className={`rollLink${className ? ` ${className}` : ""}`}
      href={href}
    >
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </Link>
  );
}

export function Tag({
  children,
  selected = false,
}: {
  children: ReactNode;
  selected?: boolean;
}) {
  return <span className={`tag${selected ? " on" : ""}`}>{children}</span>;
}

export function PointType({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`dots${className ? ` ${className}` : ""}`}>{children}</span>;
}

export type RuledListItem = {
  description: ReactNode;
  title: ReactNode;
};

export function RuledList({
  highlightedIndex,
  items,
}: {
  highlightedIndex?: number;
  items: readonly RuledListItem[];
}) {
  return (
    <ul className="rule ruledList">
      {items.map((item, index) => (
        <li className={`row${highlightedIndex === index ? " open" : ""}`} key={index}>
          <h3 className="h3">{item.title}</h3>
          <div className="body">{item.description}</div>
        </li>
      ))}
    </ul>
  );
}

type SpecimenIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type SpecimenStyle = CSSProperties & { "--specimen-index": SpecimenIndex };

export function BusinessPlate({
  ctaLabel = "View business",
  description,
  href,
  imageAlt,
  businessSlug,
  locale = "en",
  name,
  specimenIndex,
}: {
  ctaLabel?: string;
  description: string;
  href: string;
  imageAlt: string;
  businessSlug?: BusinessPointSlug;
  locale?: Locale;
  name: string;
  specimenIndex: SpecimenIndex;
}) {
  const imageStyle: SpecimenStyle = { "--specimen-index": specimenIndex };

  return (
    <article className="plate">
      <div className="businessPlateImage">
        {businessSlug ? (
          <BusinessesCardViewer locale={locale} name={name} slug={businessSlug} specimenIndex={specimenIndex} />
        ) : (
          <Image alt={imageAlt} src={specimens} style={imageStyle} unoptimized />
        )}
      </div>
      <h3 className="h3">{name}</h3>
      <p className="body">{description}</p>
      <div>
        <ButtonLink href={href} small>
          {ctaLabel}
        </ButtonLink>
      </div>
    </article>
  );
}

export function Figure({
  description,
  point = false,
  title,
  value,
}: {
  description: ReactNode;
  point?: boolean;
  title: ReactNode;
  value?: ReactNode;
}) {
  return (
    <div className="figure">
      {value === undefined ? null : (
        <p className={`num${point ? " dots" : ""}`}>{value}</p>
      )}
      <h3 className="h3">{title}</h3>
      <div className="body">{description}</div>
    </div>
  );
}

export function Statement({ children }: { children: ReactNode }) {
  return <p className="statement">{children}</p>;
}
