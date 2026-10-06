import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader, SiteFooter } from "./site-shell";
import type { Locale } from "@/content/site";
import "@/app/globals.css";

export function Document({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">{locale === "en" ? "Skip to content" : "Lewati ke konten"}</a>
        <SiteHeader locale={locale} />
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
