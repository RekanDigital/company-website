import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { SiteHeader, SiteFooter } from "./site-shell";
import { PageTransition } from "./page-transition";
import type { Locale } from "@/content/site";
import "@/app/globals.css";

export function Document({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Script src="/home-loading.js" strategy="beforeInteractive" />
        <a className="skip-link" href="#main">{locale === "en" ? "Skip to content" : "Lewati ke konten"}</a>
        <SiteHeader locale={locale} />
        <PageTransition>{children}</PageTransition>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
