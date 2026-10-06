import type { Locale } from "@/content/site";
import { CONTACT, siteCopy } from "@/content/site";
import { ButtonLink } from "./ui";
import "./site-shell.css";

type ClosingCardProps = {
  locale: Locale;
  variant?: "standard" | "businesses";
};

export function ClosingCard({ locale, variant = "standard" }: ClosingCardProps) {
  const text = siteCopy(locale);
  const businesses = variant === "businesses";
  const title = businesses
    ? locale === "en"
      ? ["Let’s Explore", "What Fits"]
      : ["Mari Temukan yang", "Paling Sesuai"]
    : locale === "en"
      ? ["Start a", "Conversation"]
      : ["Mulai", "Percakapan"];

  return (
    <section className="closing-card" id={businesses ? "contact" : undefined}>
      <h2>
        {title[0]}
        <br />
        {title[1]}
      </h2>
      <p>{businesses ? text.businessesBody : text.closingBody}</p>
      {businesses && (
        <address className="closing-card__details">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
          <span>{text.location.replace(", Indonesia", "")}</span>
        </address>
      )}
      <ButtonLink className="shell-button--light" href={`mailto:${CONTACT.email}`}>
        {businesses ? text.businessInquiry : text.contact}
      </ButtonLink>
    </section>
  );
}
