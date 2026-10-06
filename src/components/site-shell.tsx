"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import {
  CONTACT,
  localizeHref,
  navigation,
  siteCopy,
  type Locale,
} from "@/content/site";
import { ButtonLink, RollLink } from "./ui";
import "./site-shell.css";

function useCurrentPathWithHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  return `${pathname}${hash}`;
}

function LanguageToggle({ locale, onNavigate }: { locale: Locale; onNavigate?: () => void }) {
  const currentHref = useCurrentPathWithHash();
  const router = useRouter();
  const targetLocale = locale === "en" ? "id" : "en";

  return (
    <button
      className="site-language"
      type="button"
      aria-label={siteCopy(locale).switchLanguage}
      aria-pressed={locale === "id"}
      onClick={() => {
        onNavigate?.();
        router.push(localizeHref(currentHref, targetLocale));
      }}
    >
      <span className="site-language__thumb" aria-hidden="true" />
      <span className="site-language__label" lang={locale}>{locale.toUpperCase()}</span>
    </button>
  );
}

function Brand({ locale, onNavigate }: { locale: Locale; onNavigate?: () => void }) {
  return (
    <Link className="site-brand" href={localizeHref("/", locale)} onClick={onNavigate}>
      <Image src="/assets/logo/logo-rekanmu.png" width={32} height={32} alt="" priority />
      <span>RekanMU</span>
    </Link>
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeFallbackRef = useRef<number | null>(null);
  const restoreFocusRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const text = siteCopy(locale);
  const items = navigation(locale);
  const desktopItems = items.slice(1, 4);
  const previewIndex = activeIndex ?? 2;
  const home = pathname === "/" || pathname === "/id";

  const clearCloseFallback = () => {
    if (closeFallbackRef.current === null) return;
    window.clearTimeout(closeFallbackRef.current);
    closeFallbackRef.current = null;
  };

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    const revealFrame = requestAnimationFrame(() => {
      if (dialog.open && !dialog.classList.contains("is-closing")) dialog.classList.add("is-visible");
    });
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(revealFrame);
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    openerRef.current?.focus();
  }, [open]);

  const finishClose = (restoreFocus = true) => {
    clearCloseFallback();
    restoreFocusRef.current = restoreFocus;
    const dialog = dialogRef.current;
    dialog?.classList.remove("is-closing", "is-visible");
    if (dialog?.open) dialog.close();
    setOpen(false);
    setActiveIndex(null);
  };

  const close = (restoreFocus = true) => {
    const dialog = dialogRef.current;
    if (dialog?.classList.contains("is-closing")) return;
    if (
      restoreFocus &&
      dialog?.open &&
      dialog.classList.contains("is-visible") &&
      window.matchMedia("(max-width: 820px) and (prefers-reduced-motion: no-preference)").matches
    ) {
      dialog.classList.add("is-closing");
      const panel = dialog.querySelector(".site-menu__panel");
      const duration = panel ? Number.parseFloat(getComputedStyle(panel).transitionDuration) : 0;
      closeFallbackRef.current = window.setTimeout(finishClose, (Number.isFinite(duration) ? duration * 1000 : 0) + 100);
      return;
    }
    finishClose(restoreFocus);
  };

  const navigate = () => close(false);

  return (
    <>
      <header className={`site-header gut${home ? " site-header--home" : ""}${open ? " site-header--menu-open" : ""}${scrolled ? " site-header--scrolled" : ""}`}>
        <Brand locale={locale} />
        <div className="site-header__actions">
          <nav className="site-header__desktop-nav" aria-label={text.navigation}>
            {desktopItems.map((item) => {
              const isBusinessesPage = item.href.endsWith("/businesses") && pathname.startsWith(`${item.href}/`);
              const isCurrent = pathname === item.href || isBusinessesPage;
              return (
                <Link
                  key={item.href}
                  className="site-header__link"
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <LanguageToggle locale={locale} />
          <button
            ref={openerRef}
            className="site-menu-button"
            type="button"
            aria-label={text.menu}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span className="site-menu-button__label">{text.menu}</span>
            <span className="site-menu-mark" aria-hidden="true" />
            <span className="site-menu-toggle" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="site-menu"
        className="site-menu"
        aria-label={text.navigation}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          clearCloseFallback();
          dialogRef.current?.classList.remove("is-closing", "is-visible");
          setOpen(false);
          setActiveIndex(null);
        }}
        onTransitionEnd={(event) => {
          if (
            event.target instanceof HTMLElement &&
            event.target.classList.contains("site-menu__panel") &&
            event.propertyName === "transform" &&
            dialogRef.current?.classList.contains("is-closing")
          ) {
            finishClose();
          }
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
          ).filter((element) => element.getClientRects().length > 0);
          const first = focusable[0];
          const last = focusable.at(-1);
          if (!first || !last) return;

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <button className="site-menu__close" type="button" aria-label={text.close} autoFocus onClick={() => close()}>
          <span className="site-menu__close-label">{text.close}</span>
          <span className="site-menu-toggle" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className="site-menu__top gut">
          <Brand locale={locale} onNavigate={navigate} />
        </div>

        <div className="site-menu__panel">
          <div className="site-menu__backgrounds" aria-hidden="true">
            {items.map((item, index) => (
              <span
                key={item.image}
                className={index === previewIndex ? "is-active" : ""}
                data-menu-image={item.image}
                style={{ backgroundImage: `url(/assets/renders/${item.image})` }}
              />
            ))}
          </div>
          <div className="site-menu__shade" aria-hidden="true" />

          <nav
            className={activeIndex === null ? "site-menu__nav" : "site-menu__nav has-active"}
            aria-label={text.navigation}
            onMouseLeave={() => setActiveIndex(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setActiveIndex(null);
            }}
          >
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={activeIndex !== null && activeIndex !== index ? "is-dimmed" : ""}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={navigate}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {activeIndex !== null && (
            <p className="site-menu__headline" aria-hidden="true">
              {items[activeIndex].headline}
            </p>
          )}

          <div className="site-menu__bottom gut">
            <LanguageToggle locale={locale} onNavigate={navigate} />
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
        </div>
      </dialog>
    </>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const text = siteCopy(locale);
  const items = navigation(locale).slice(0, 4);

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    const footer = event.currentTarget;
    const cta = footer.querySelector(".cta");
    const belowCTA = !cta || event.clientY >= cta.getBoundingClientRect().bottom;
    const desktopHover = window.matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)").matches;

    footer.toggleAttribute("data-footer-spot-active", desktopHover || belowCTA);

    const rect = footer.getBoundingClientRect();
    footer.style.setProperty("--footer-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    const wordmark = footer.querySelector(".site-footer__wordmark");
    const wordmarkRect = wordmark?.getBoundingClientRect();
    const wordmarkY = wordmarkRect
      ? ((wordmarkRect.top + wordmarkRect.height / 2 - rect.top) / rect.height) * 100
      : 82;
    footer.style.setProperty("--footer-y", `${wordmarkY}%`);
  };

  return (
    <footer
      className="site-footer"
      onPointerMove={followPointer}
      onPointerLeave={(event) => {
        event.currentTarget.removeAttribute("data-footer-spot-active");
        event.currentTarget.style.setProperty("--footer-x", "50%");
      }}
    >
      <div className="site-footer__points site-footer__points--base" aria-hidden="true" />
      <div className="site-footer__points site-footer__points--spot" aria-hidden="true" />

      <div className="site-footer__content">
        <div>
          <h2>{text.footerTitle}</h2>
          <p className="site-footer__intro">{text.footerIntro}</p>
          <ButtonLink href={`mailto:${CONTACT.email}`} small>
            {text.contact}
          </ButtonLink>
        </div>

        <nav aria-label={text.quickLinks}>
          <p className="site-footer__label">{text.quickLinks}</p>
          {items.map((item) => (
            <RollLink className="footer-roll-link" key={item.href} href={item.href}>{`${item.label}.`}</RollLink>
          ))}
        </nav>

        <div>
          <p className="site-footer__label">{text.contactUs}</p>
          <div className="site-footer__contact">
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
          </div>
          <div className="site-footer__meta">
            <p>{CONTACT.legalName}</p>
            <p>{text.location}</p>
            <p>NIB {CONTACT.nib}</p>
            <p>© 2026 {CONTACT.legalName}</p>
          </div>
        </div>

        <nav aria-label={text.followUs}>
          <p className="site-footer__label">{text.followUs}</p>
          <div className="site-footer__social">
            <a className="site-footer__social-link" href="https://www.instagram.com/rekanmu.id/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>
            </a>
            <a className="site-footer__social-link" href="https://www.facebook.com/rekanmu.id" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.5-1.5h1.7V3.6c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.5v2.5H7.4V13h2.9v8z" /></svg>
            </a>
            <a className="site-footer__social-link" href="https://www.linkedin.com/in/rekanmu.id" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a className="site-footer__social-link" href="https://x.com/rekanmuid" target="_blank" rel="noreferrer" aria-label="X">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.63 7.584H.48l8.6-9.83L0 1.153h7.594l5.243 6.933zm-1.29 19.492h2.039L6.486 3.239H4.298z" /></svg>
            </a>
          </div>
        </nav>
      </div>

      <p className="site-footer__wordmark" aria-hidden="true">
        RekanMU
      </p>
    </footer>
  );
}
