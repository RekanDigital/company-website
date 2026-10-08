import Image from "next/image";
import Link from "next/link";

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

  return (
    <div className="staticPage aboutPage">
      <AboutSlideshow locale={locale} paragraphs={storyParagraphs.map((node) => node.text)} />
      <section className="sec gut staticSection staticStory">
        {storyStatement ? <Statement>{pointTail(storyStatement, locale === "en" ? "RekanMU continues" : "RekanMU terus")}</Statement> : null}
      </section>
      <section className="sec gut staticSection atGlance">
        <div className="atGlanceIntro">{glance.intro.map((text) => <p className="lead" key={text}>{text}</p>)}</div>
        <div className="figureGrid">
          {glance.items.map((item, index) => (
            <article className={index === 2 ? "focusFigure" : undefined} key={item.title}>
              <Figure
                description={item.paragraphs.map((text) => <p key={text}>{text}</p>)}
                point={index === 1}
                title={item.title}
                value={index < 2 ? String(index === 0 ? 7 : 5) : undefined}
              />
            </article>
          ))}
        </div>
      </section>
      <section className="sec gut staticSection visionMission">
        {visionItem ? <Statement>{pointTail(visionItem.paragraphs[0], locale === "en" ? "based on Indonesia’s resources" : "berbasis sumber daya Indonesia")}</Statement> : null}
        <div className="missionBlock">
          <h2 className="disp2">{missionItem?.title}</h2>
          <ul className="missionList body">{missionItem?.paragraphs.map((text) => <li key={text}>{text}</li>)}</ul>
        </div>
      </section>
      <section className="sec gut staticSection valueSection">
        <div className="valueGrid">
          {values.items.map((item, index) => <article className="valueItem" key={item.title}><h3 className="disp2">{index === 1 || index === 3 ? <PointType>{item.title}</PointType> : item.title}</h3><p className="body">{item.paragraphs[0]}</p></article>)}
        </div>
      </section>
      <section className="sec gut staticSection corporateSection">
        <h2 className="disp2">{locale === "en" ? "Corporate" : "Informasi"}<br /><PointType>{locale === "en" ? "Information" : "Perusahaan"}</PointType></h2>
        <dl className="corporateGrid">
          {corporate.items.map((item) => <div key={item.title}><dt className="mono">{item.title}</dt><dd className="body">{item.paragraphs.join(" ")}</dd></div>)}
        </dl>
      </section>
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
    <div className="staticPage">
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
              <h2 className="disp2">{solid}<br /><PointType>{point}</PointType></h2>
              {content.intro.map((text) => <p className="lead" key={text}>{text}</p>)}
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
    <div className="staticPage">
      {groups.map((group) => {
        const content = contentItems(group.nodes);
        const [displayHeading, ...items] = content.items;
        const businessItems = items.filter((item) => businessPages.some((business) => business.name === item.title));
        const headingParts = displayHeading ? businessHeadingParts[locale][displayHeading.title] : undefined;
        return (
          <section className="sec gut businessGroup" key={group.name}>
            <div className="businessGroupHeading">
              <h2 className="disp2">{headingParts ? <>{headingParts[0]}<br /><PointType>{headingParts[1]}</PointType></> : displayHeading?.title}</h2>
              {displayHeading?.paragraphs.map((text) => <p className="lead" key={text}>{text}</p>)}
            </div>
            <div className={`businessGrid ${businessItems.length === 2 ? "twoBusinessGrid" : "fiveBusinessGrid"}`}>
              {businessItems.map((item) => {
                const business = businessPages.find((candidate) => candidate.name === item.title)!;
                return <BusinessPlate businessSlug={business.slug} ctaLabel={locale === "en" ? "View business" : "Lihat bisnis"} description={item.paragraphs.join(" ")} href={localizeHref(`/businesses/${business.slug}`, locale)} imageAlt="" key={item.title} locale={locale} name={item.title} specimenIndex={business.specimenIndex} />;
              })}
            </div>
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
      <section className="sec gut overviewSection"><Statement>{statement}</Statement>{overviewSupport.length ? <Paragraphs nodes={overviewSupport} /> : null}</section>
      {detailSections.map((section, sectionIndex) => {
        const content = contentItems(section.nodes);
        return (
          <section className={`sec gut detailSection${sectionIndex ? " detailContinuation" : ""}`} key={section.name}>
            {sectionIndex === 0 ? <div className="detailSectionHeading">
              <h2 className="disp2">{capabilityParts[0]}<PointType>{capabilityParts[1]}</PointType></h2>
            </div> : null}
            {content.intro.length ? content.items.length ? <div className="staticCopy">{content.intro.map((text) => <p className="lead" key={text}>{text}</p>)}</div> : content.intro.map((text) => <div className="detailStatement" key={text}><Statement>{text}</Statement></div>) : null}
            {content.items.length ? <div className="detailGrid">{content.items.map((item) => <article key={item.title}><h3 className="h3">{item.title}</h3>{item.paragraphs.map((text) => <p className="body" key={text}>{text}</p>)}</article>)}</div> : null}
            {!inquiry && sectionIndex === detailSections.length - 1 ? <BusinessDetailActions locale={locale} /> : null}
          </section>
        );
      })}
      {inquiry ? <section className="sec gut detailInquiry">
        <div><h2 className="disp2">{inquiryParts[0]}<br /><PointType>{inquiryParts[1]}</PointType></h2></div>
        <div>{(inquiryContent?.items[0]?.paragraphs ?? inquiryContent?.intro ?? []).map((text) => <p className="lead" key={text}>{text}</p>)}<BusinessDetailActions locale={locale} /></div>
      </section> : null}
      <Link aria-label={`${locale === "en" ? "Next:" : "Berikutnya:"} ${next.name}`} className="nextBusiness gut" href={localizeHref(`/businesses/${next.slug}`, locale)}>
        <span className="disp2">{locale === "en" ? "Next:" : "Berikutnya:"} {nextNameParts[0]}<br /><PointType>{nextNameParts[1]}</PointType></span>
        <div className="nextSpecimen"><BusinessesCardViewer locale={locale} name={next.name} slug={next.slug} specimenIndex={next.specimenIndex} /></div>
      </Link>
    </div>
  );
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
