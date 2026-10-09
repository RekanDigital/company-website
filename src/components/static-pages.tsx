import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";

import {
  aboutContent,
  businessDetailContent,
  businessPages,
  businessesContent,
  contentItems,
  productsContent,
  type BusinessPage,
  type ContentNode,
  type ContentSection,
} from "@/content/static-pages";
import { localizeHref, type Locale } from "@/content/site";

import { AboutSlideshow } from "./about-slideshow";
import { BusinessesCardViewer } from "./businesses-card-viewer";
import { BusinessPlate, ButtonLink, Figure, PointType, Statement, TextLink } from "./ui";
import { OriginButton } from "./ui/origin-button";
import "./static-pages.css";

function withoutRepeatedHeading(section: ContentSection, heading: string) {
  return section.nodes[0]?.kind === "heading" && section.nodes[0].text === heading
    ? section.nodes.slice(1)
    : section.nodes;
}

function Paragraphs({ nodes }: { nodes: ContentNode[] }) {
  return (
    <div className="staticCopy">
      {nodes.map((node, index) =>
        node.kind === "heading" ? (
          <h3 className="h3" key={`${node.text}-${index}`}>{node.text}</h3>
        ) : (
          <p className="body" key={`${node.text}-${index}`}>{node.text}</p>
        ),
      )}
    </div>
  );
}

function pointTail(text: string | undefined, marker: string) {
  const start = text?.indexOf(marker) ?? -1;
  return text && start >= 0
    ? <>{text.slice(0, start)}<PointType>{text.slice(start)}</PointType></>
    : text;
}

function WordStatement({ text, marker, className = "aboutStatementWord" }: { text: string; marker?: string; className?: string }) {
  const words = text.split(" ");
  const offset = marker ? text.indexOf(marker) : -1;
  const pointWord = offset < 0 ? words.length : text.slice(0, offset).trim().split(" ").length;

  return (
    <Statement>
      {words.map((word, index) => (
        <span key={index}>
          <span
            className={`${className}${index >= pointWord ? " dots" : ""}`}
            style={{ "--word-start": `${4 + index / words.length * 92}%`, "--word-end": `${4 + (index + 1) / words.length * 92}%` } as CSSProperties}
          >{word}</span>{" "}
        </span>
      ))}
    </Statement>
  );
}

function AboutReadingSection({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className="aboutReadingStage">
      <section className={`sec gut staticSection ${className}`}>{children}</section>
    </div>
  );
}

export function AboutPageBody({ locale }: { locale: Locale }) {
  const sections = aboutContent[locale].filter((section) => section.nodes.length);
  const byName = (name: string) => sections.find((section) => section.name === name)!;
  const glanceHeading = locale === "en" ? "RekanMU at a Glance" : "Sekilas tentang RekanMU";
  const story = byName("Our Story").nodes;
  const storyParagraphs = story.filter((node) => node.kind === "paragraph").slice(0, 3);
  const storyStatement = story.filter((node) => node.kind === "heading").at(-1)?.text;
  const glance = contentItems(withoutRepeatedHeading(byName("RekanMU at a Glance"), glanceHeading));
  const vision = contentItems(byName("Vision & Mission").nodes);
  const values = contentItems(byName("Our Values").nodes);
  const corporate = contentItems(byName("Corporate Information").nodes);
  const visionItem = vision.items[0];
  const missionItem = vision.items[1];
  const visionText = visionItem?.paragraphs[0] ?? "";

  return (
    <div className="staticPage aboutPage">
      <AboutSlideshow locale={locale} paragraphs={storyParagraphs.map((node) => node.text)} />
      <AboutReadingSection className="staticStory">
        {storyStatement ? <WordStatement text={storyStatement} marker={locale === "en" ? "RekanMU continues" : "RekanMU terus"} /> : null}
      </AboutReadingSection>
      <AboutReadingSection className="atGlance">
        <div className="atGlanceIntro">{glance.intro.map((text) => <p className="lead" key={text}>{text}</p>)}</div>
        <div className="figureGrid">
          {glance.items.map((item, index) => (
            <article key={item.title}>
              <Figure
                description={item.paragraphs.map((text) => <p key={text}>{text}</p>)}
                point={index === 1}
                title={item.title}
                value={["7", "5", "50+"][index]}
              />
            </article>
          ))}
        </div>
      </AboutReadingSection>
      <AboutReadingSection className="visionMission">
        {visionItem ? (
          <div className="aboutVisionCurtain">
            <WordStatement text={visionText} marker={locale === "en" ? "based on Indonesia’s resources" : "berbasis sumber daya Indonesia"} />
          </div>
        ) : null}
      </AboutReadingSection>
      <AboutReadingSection className="aboutMission">
        <div className="missionBlock">
          <h2 className="disp2">{missionItem?.title}</h2>
          <ul className="missionList body">{missionItem?.paragraphs.map((text) => <li key={text}>{text}</li>)}</ul>
        </div>
      </AboutReadingSection>
      <AboutReadingSection className="valueSection">
        <div className="valueGrid">
          {values.items.map((item, index) => (
            <article className="valueItem" key={item.title}>
              <h3 className="disp2">{index === 1 || index === 3 ? <PointType>{item.title}</PointType> : item.title}</h3>
              <p className="body">{item.paragraphs[0]}</p>
            </article>
          ))}
        </div>
      </AboutReadingSection>
      <AboutReadingSection className="corporateSection">
        <h2 className="disp2">{locale === "en" ? "Corporate" : "Informasi"}<br /><PointType>{locale === "en" ? "Information" : "Perusahaan"}</PointType></h2>
        <dl className="corporateGrid">
          {corporate.items.map((item) => <div key={item.title}><dt className="mono">{item.title}</dt><dd className="body">{item.paragraphs.join(" ")}</dd></div>)}
        </dl>
      </AboutReadingSection>
    </div>
  );
}

const productHeadingParts = [
  ["Digital Creative &", "Agency Services"],
  ["Enterprise B2B Tech &", "Intelligent Automation"],
  ["Enterprise System Integrator &", "B2G"],
  ["Tech Talent &", "Professional Services"],
  ["Strategic", "Real-Sector Initiatives"],
] as const;

const productStreamIds = ["digital-creative", "enterprise-tech", "system-integrator", "tech-talent", "strategic-initiatives"] as const;

export function ProductsPageBody({ locale }: { locale: Locale }) {
  const sections = productsContent[locale].filter((section) => section.nodes.length);
  const inquiry = sections.find((section) => section.name === "Business Inquiry")!;
  const streams = sections.filter((section) => section !== inquiry);
  const streamRows = [streams.slice(0, 3), streams.slice(3)];
  return (
    <div className="staticPage productsPage">
      <nav aria-label={locale === "en" ? "Product and service streams" : "Alur produk dan layanan"} className="streamBar gut">
        {streamRows.map((row, rowIndex) => (
          <div className="streamBarRow" key={rowIndex}>
            {row.map((section, index) => {
              const streamIndex = rowIndex * 3 + index;
              return <OriginButton className="streamTag mono" href={`#${productStreamIds[streamIndex]}`} key={section.name} small>{section.name}</OriginButton>;
            })}
          </div>
        ))}
      </nav>
      {streams.map((section, sectionIndex) => {
        const content = contentItems(section.nodes);
        const [solid, point] = productHeadingParts[sectionIndex];
        return (
          <section className="sec gut catalogueSection" id={productStreamIds[sectionIndex]} key={section.name}>
            <div className="catalogueHeading">
              <h2 className="disp2">{solid}<br />{" "}<PointType>{point}</PointType></h2>
              <div className="catalogueIntro">{content.intro.map((text) => <p className="lead" key={text}>{text}</p>)}</div>
            </div>
            <div className="catalogueList">
              {content.items.map((item) => item.paragraphs.length ? (
                <article className="catalogueItem" key={item.title}><h3 className="h3">{item.title}</h3><div>{item.paragraphs.map((text) => <p className="body" key={text}>{text}</p>)}</div></article>
              ) : <h3 className="catalogueGroup mono" key={item.title}>[ {item.title} ]</h3>)}
            </div>
          </section>
        );
      })}
      <Inquiry locale={locale} nodes={inquiry.nodes} />
    </div>
  );
}

function Inquiry({ locale, nodes }: { locale: Locale; nodes: ContentNode[] }) {
  const content = contentItems(nodes);
  const paragraphs = content.items[0]?.paragraphs ?? content.intro;
  const headingParts = locale === "en" ? ["Looking for the", "Right Fit?"] : ["Mencari Solusi yang", "Sesuai?"];
  return (
    <section className="sec gut inquirySection">
      <h2 className="disp2">{headingParts[0]}<br /><PointType>{headingParts[1]}</PointType></h2>
      <div><div className="staticCopy">{paragraphs.map((text) => <p className="lead" key={text}>{text}</p>)}</div><ButtonLink href={localizeHref("/businesses#contact", locale)}>{locale === "en" ? "Start a Business Inquiry" : "Mulai Diskusi Bisnis"}</ButtonLink></div>
    </section>
  );
}

const businessHeadingParts: Record<Locale, Record<string, readonly [string, string]>> = {
  en: {
    "The Corporate Engine Behind the Group": ["The Corporate Engine", "Behind the Group"],
    "Where Capability Becomes Real-World Value": ["Where Capability Becomes", "Real-World Value"],
  },
  id: {
    "Mesin Korporat di Balik Grup": ["Mesin Korporat", "di Balik Grup"],
    "Kapabilitas yang Menjadi Nilai Nyata": ["Kapabilitas yang Menjadi", "Nilai Nyata"],
  },
};

export function BusinessesPageBody({ locale }: { locale: Locale }) {
  const groups = businessesContent[locale].filter((section) => section.name !== "Hero" && section.name !== "Contact / Business Inquiry");
  return (
    <div className="staticPage businessesPage">
      {groups.map((group) => {
        const content = contentItems(group.nodes);
        const [displayHeading, ...items] = content.items;
        const businessItems = items.filter((item) => businessPages.some((business) => business.name === item.title));
        const headingParts = displayHeading ? businessHeadingParts[locale][displayHeading.title] : undefined;
        const headingWords = (headingParts?.join(" ") ?? displayHeading?.title ?? "").split(" ");
        const pointWord = headingParts ? headingParts[0].split(" ").length : headingWords.length;
        const rows = businessItems.length === 2 ? [businessItems] : [businessItems.slice(0, 2), businessItems.slice(2)];
        return (
          <section className="businessGroup" key={group.name} aria-label={displayHeading?.title}>
            {rows.map((row, rowIndex) => (
              <div className="businessReadingStage" key={rowIndex}>
                <div className="businessReadingView gut">
                  {rowIndex === 0 ? <div className="businessGroupHeading">
                    <h2 className="disp2">
                      {headingWords.map((word, index) => (
                        <span key={index}><span
                          className={`businessHeadingWord${index >= pointWord ? " dots" : ""}`}
                          style={{ "--word-start": `${18 + index / headingWords.length * 60}%`, "--word-end": `${18 + (index + 1) / headingWords.length * 60}%` } as CSSProperties}
                        >{word}</span>{" "}</span>
                      ))}
                    </h2>
                    {displayHeading?.paragraphs.map((text) => <p className="lead" key={text}>{text}</p>)}
                  </div> : null}
                  <div className={`businessGrid ${row.length === 2 ? "twoBusinessGrid" : "threeBusinessGrid"}`}>
                    {row.map((item) => {
                      const business = businessPages.find((candidate) => candidate.name === item.title)!;
                      return <BusinessPlate businessSlug={business.slug} ctaLabel={locale === "en" ? "View business" : "Lihat bisnis"} description={item.paragraphs.join(" ")} href={localizeHref(`/businesses/${business.slug}`, locale)} imageAlt="" key={item.title} locale={locale} name={item.title} specimenIndex={business.specimenIndex} />;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

export function BusinessDetailBody({ business, locale }: { business: BusinessPage; locale: Locale }) {
  const sections = businessDetailContent[business.slug][locale].filter((section) => section.nodes.length);
  const overview = sections.find((section) => section.name === "Business Overview")!;
  const inquiry = sections.find((section) => section.name === "Business Inquiry");
  const detailSections = sections.filter((section) => section !== overview && section !== inquiry);
  const overviewParagraphs = overview.nodes.filter((node): node is Extract<ContentNode, { kind: "paragraph" }> => node.kind === "paragraph");
  const firstOverview = overviewParagraphs[0]?.text ?? "";
  const sentenceEnd = firstOverview.search(/[.!?](?=\s|$)/);
  const statement = sentenceEnd < 0 ? firstOverview : firstOverview.slice(0, sentenceEnd + 1);
  const overviewSupport = [
    ...(sentenceEnd < 0 ? [] : [firstOverview.slice(sentenceEnd + 1).trim()].filter(Boolean).map((text) => ({ kind: "paragraph" as const, text }))),
    ...overviewParagraphs.slice(1),
  ];
  const capabilityParts = locale === "en" ? ["Capa", "bilities"] : ["Kapa", "bilitas"];
  const inquiryContent = inquiry ? contentItems(inquiry.nodes) : undefined;
  const inquiryTitle = inquiryContent?.items[0]?.title;
  const inquiryTitleWords = inquiryTitle?.trim().split(/\s+/) ?? [];
  const inquirySplit = Math.ceil(inquiryTitleWords.length / 2);
  const inquiryParts = [inquiryTitleWords.slice(0, inquirySplit).join(" "), inquiryTitleWords.slice(inquirySplit).join(" ")];
  const nextNameParts = splitBusinessName(businessPages[(businessPages.findIndex((item) => item.slug === business.slug) + 1) % businessPages.length].name);
  const index = businessPages.findIndex((item) => item.slug === business.slug);
  const next = businessPages[(index + 1) % businessPages.length];
  return (
    <div className="staticPage businessDetail">
      <BusinessReadingSection className="overviewSection"><WordStatement text={statement} className="detailStatementWord" />{overviewSupport.length ? <Paragraphs nodes={overviewSupport} /> : null}</BusinessReadingSection>
      {detailSections.map((section, sectionIndex) => {
        const content = contentItems(section.nodes);
        const statementIntro = business.slug === "general-trading-supply-chain" && section.name === "How We Support the Supply Chain";
        const introAsLead = content.intro.length > 0 && content.items.length > 0 && !statementIntro;
        return (
          <Fragment key={section.name}>
            {statementIntro && content.intro.length ? <BusinessReadingSection className="detailSection detailContinuation detailStatementSection">
              {content.intro.map((text) => <div className="detailStatement" key={text}><WordStatement text={text} className="detailStatementWord" /></div>)}
            </BusinessReadingSection> : null}
            <BusinessReadingSection className={`detailSection${sectionIndex ? " detailContinuation" : ""}${content.items.length ? " detailListSection" : " detailStatementSection"}${!inquiry && sectionIndex === detailSections.length - 1 ? " detailActionSection" : ""}`}>
              {sectionIndex === 0 ? <div className="detailSectionHeading">
                <h2 className="disp2">{capabilityParts[0]}<PointType>{capabilityParts[1]}</PointType></h2>
              </div> : null}
              <div className="detailSectionContent">
                {introAsLead
                  ? <div className="staticCopy">{content.intro.map((text) => <p className="lead" key={text}>{text}</p>)}</div>
                  : !statementIntro ? content.intro.map((text) => <div className="detailStatement" key={text}><WordStatement text={text} className="detailStatementWord" /></div>) : null}
                {content.items.length ? <div className="detailGrid">{content.items.map((item) => <article key={item.title}><h3 className="h3">{item.title}</h3>{item.paragraphs.map((text) => <p className="body" key={text}>{text}</p>)}</article>)}</div> : null}
                {!inquiry && sectionIndex === detailSections.length - 1 ? <BusinessDetailActions locale={locale} /> : null}
              </div>
            </BusinessReadingSection>
          </Fragment>
        );
      })}
      {inquiry ? <BusinessReadingSection className="detailInquiry">
        <div><h2 className="disp2">{inquiryParts[0]}<br /><PointType>{inquiryParts[1]}</PointType></h2></div>
        <div>{(inquiryContent?.items[0]?.paragraphs ?? inquiryContent?.intro ?? []).map((text) => <p className="lead" key={text}>{text}</p>)}<BusinessDetailActions locale={locale} /></div>
      </BusinessReadingSection> : null}
      <div className="businessDetailStage businessNextStage">
        <Link aria-label={`${locale === "en" ? "Next:" : "Berikutnya:"} ${next.name}`} className="nextBusiness gut" href={localizeHref(`/businesses/${next.slug}`, locale)}>
          <span className="disp2">{locale === "en" ? "Next:" : "Berikutnya:"} {nextNameParts[0]}<br /><PointType>{nextNameParts[1]}</PointType></span>
          <div className="nextSpecimen"><BusinessesCardViewer locale={locale} name={next.name} slug={next.slug} specimenIndex={next.specimenIndex} /></div>
        </Link>
      </div>
    </div>
  );
}

function BusinessReadingSection({ className, children }: { className: string; children: ReactNode }) {
  return <div className="businessDetailStage"><section className={`sec gut businessDetailSection ${className}`}>{children}</section></div>;
}

function splitBusinessName(name: string) {
  const ampersand = name.indexOf("&");
  return ampersand < 0 ? [name, ""] : [name.slice(0, ampersand + 1), name.slice(ampersand + 1).trim()];
}

function BusinessDetailActions({ locale }: { locale: Locale }) {
  return <div className="detailActions"><ButtonLink href={localizeHref("/businesses#contact", locale)}>{locale === "en" ? "Start a Business Inquiry" : "Mulai Diskusi Bisnis"}</ButtonLink><TextLink href={localizeHref("/products-services", locale)}>{locale === "en" ? "Explore Products & Services" : "Jelajahi Produk & Layanan"}</TextLink></div>;
}

export function BusinessHeroArt({ business, locale }: { business: BusinessPage; locale: Locale }) {
  return <BusinessesCardViewer hero locale={locale} name={business.name} rotating slug={business.slug} specimenIndex={business.specimenIndex} />;
}
