import { localizeHref, type Locale } from "@/content/site";
import { pageHeroes, type PagePath } from "@/content/pages";
import { businessPages, homeProductStreams } from "@/content/static-pages";
import { homeCatalogueCopy } from "@/content/home";

import { ClosingCard } from "./closing-card";
import { BusinessesHero } from "./businesses-hero";
import { HomeCatalogue } from "./home-catalogue";
import { HomeScene } from "./home-scene";
import {
  AboutPageBody,
  BusinessDetailBody,
  BusinessHeroArt,
  BusinessesPageBody,
  ProductsPageBody,
} from "./static-pages";
import {
  BusinessPlate,
  ButtonLink,
  Figure,
  PointType,
  RollLink,
  RuledList,
  Statement,
  Tag,
  TextLink,
} from "./ui";

const samples = {
  en: {
    businessDescription:
      "We build digital systems, automation, intelligent solutions, IoT, and supporting infrastructure that help businesses operate more efficiently and connect processes that would otherwise remain fragmented.",
    businessName: "Technology & Digitalization",
    capabilityItems: [
      {
        title: "Enterprise Software & Applications",
        description:
          "Development of websites, internal management systems, public-service portals, B2B platforms, mobile applications, and other custom software for business and operational requirements.",
      },
      {
        title: "Digital Platforms & Process Automation",
        description:
          "Development of connected digital workflows for areas such as document processing, administration, field operations, customer support, contracts, HR processes, and other repeatable business activities.",
      },
    ],
    figureDescription:
      "Our seven business pillars connect different capabilities and markets, allowing RekanMU to participate across technology, supply chains, resource development, and downstream industries.",
    figureTitle: "Business Pillars",
    focusDescription:
      "Our work is built around data, technology, automation, and strategic industries, with a focus on improving how businesses operate and creating greater value from Indonesia’s resources and productive sectors.",
    focusTitle: "Focus",
    imageAlt:
      "The technology site drawn in points: a tower, a parabolic antenna and an operations building",
    primaryAction: "About RekanMU",
    rollAction: "Businesses.",
    secondaryAction: "Explore Products & Services",
    statement:
      "To become a leading international-scale business that integrates data intelligence, technology, and strategic industries based on Indonesia’s resources to create sustainable added value.",
    viewBusiness: "View business",
  },
  id: {
    businessDescription:
      "Kami membangun sistem digital, otomasi, solusi cerdas, IoT, dan infrastruktur pendukung untuk membantu bisnis bekerja lebih efisien serta menghubungkan proses yang sebelumnya berjalan terpisah.",
    businessName: "Technology & Digitalization",
    capabilityItems: [
      {
        title: "Perangkat Lunak & Aplikasi Enterprise",
        description:
          "Pengembangan website, sistem manajemen internal, portal layanan publik, platform B2B, aplikasi mobile, dan perangkat lunak khusus lainnya untuk kebutuhan bisnis dan operasional.",
      },
      {
        title: "Platform Digital & Otomasi Proses",
        description:
          "Pengembangan alur kerja digital yang terhubung untuk kebutuhan seperti pemrosesan dokumen, administrasi, operasional lapangan, layanan pelanggan, kontrak, proses HR, dan berbagai aktivitas bisnis berulang lainnya.",
      },
    ],
    figureDescription:
      "Tujuh pilar bisnis kami menghubungkan berbagai kapabilitas dan pasar, memungkinkan RekanMU untuk berperan dalam teknologi, rantai pasok, pengembangan sumber daya, dan industri hilir.",
    figureTitle: "Pilar Bisnis",
    focusDescription:
      "Kami berfokus pada data, teknologi, otomasi, dan industri strategis untuk meningkatkan cara bisnis beroperasi serta menciptakan nilai yang lebih besar dari sumber daya dan sektor produktif Indonesia.",
    focusTitle: "Fokus",
    imageAlt:
      "Lokasi teknologi yang digambar dengan titik: menara, antena parabola, dan gedung operasional",
    primaryAction: "Tentang RekanMU",
    rollAction: "Bisnis.",
    secondaryAction: "Jelajahi Produk & Layanan",
    statement:
      "Menjadi Leading Business skala Internasional terkemuka yang mengintegrasikan kecerdasan data, teknologi, dan industri strategis berbasis sumber daya Indonesia untuk menciptakan nilai tambah yang berkelanjutan.",
    viewBusiness: "Lihat bisnis",
  },
} as const;

function ComponentPreview({ locale }: { locale: Locale }) {
  const sample = samples[locale];

  return (
    <aside aria-label="Component preview" className="componentPreview gut">
      <section>
        <h2 className="h2 componentPreviewHeading">Buttons and links</h2>
        <div className="componentPreviewFlow">
          <ButtonLink href={localizeHref("/about", locale)}>{sample.primaryAction}</ButtonLink>
          <TextLink href={localizeHref("/products-services", locale)}>
            {sample.secondaryAction}
          </TextLink>
          <RollLink href={localizeHref("/businesses", locale)}>{sample.rollAction}</RollLink>
        </div>
      </section>

      <section>
        <h2 className="h2 componentPreviewHeading">Tags</h2>
        <div className="componentPreviewTags">
          <Tag selected>Website</Tag>
          <Tag>Media Production</Tag>
          <Tag>Hardware &amp; IoT</Tag>
          <Tag>Data &amp; Spatial</Tag>
        </div>
      </section>

      <section>
        <h2 className="h2 componentPreviewHeading">Ruled list</h2>
        <RuledList highlightedIndex={1} items={sample.capabilityItems} />
      </section>

      <section>
        <h2 className="h2 componentPreviewHeading">Plate and figure</h2>
        <div className="componentPreviewGrid">
          <BusinessPlate
            ctaLabel={sample.viewBusiness}
            description={sample.businessDescription}
            href={localizeHref("/businesses/technology-digitalization", locale)}
            imageAlt={sample.imageAlt}
            name={sample.businessName}
            specimenIndex={1}
          />
          <Figure
            description={sample.figureDescription}
            point
            title={sample.figureTitle}
            value="7"
          />
          <Figure
            description={sample.focusDescription}
            title={sample.focusTitle}
          />
        </div>
      </section>

      <section>
        <h2 className="h2 componentPreviewHeading">Statement</h2>
        <Statement>{sample.statement}</Statement>
      </section>
    </aside>
  );
}

export function FoundationPage({
  locale,
  path,
  showComponents = false,
}: {
  locale: Locale;
  path: string;
  showComponents?: boolean;
}) {
  const hero = pageHeroes[path as PagePath][locale];
  const hasClosingCard = path === "/" || path === "/about" || path === "/businesses";
  const businessesOverview = path === "/businesses";
  const business = businessPages.find((item) => path === `/businesses/${item.slug}`);

  return (
    <>
      {path === "/" ? (
        <HomeScene locale={locale} />
      ) : businessesOverview ? (
        <BusinessesHero title={hero.title} sites={businessPages.map(({ slug, name }) => ({ slug, name }))} />
      ) : (
        <section className={`foundationHero gut${business ? " businessDetailHero" : ""}`}>
          {business ? <BusinessHeroArt business={business} locale={locale} /> : null}
          <h1 className="disp">
            <span className="routeHeroLine routeHeroLine--solid">{hero.title.solid}</span>
            <br />
            <span className="routeHeroLine routeHeroLine--point"><PointType>{hero.title.point}</PointType></span>
          </h1>

          {hero.tagline || hero.lead ? (
            <div className="split foundationHeroCopy">
              {hero.tagline ? <h2 className="h3">{hero.tagline}</h2> : null}
              {hero.lead ? <p className="lead">{hero.lead}</p> : null}
            </div>
          ) : null}

          {hero.cta ? (
            <div className="foundationHeroActions">
              <ButtonLink href={localizeHref(hero.cta.href, locale)}>{hero.cta.label}</ButtonLink>
            </div>
          ) : null}
        </section>
      )}

      {businessesOverview && hero.lead ? <section className="businessOpening gut"><p className="lead">{hero.lead}</p></section> : null}

      {path === "/" ? (
        <HomeCatalogue copy={homeCatalogueCopy[locale]} locale={locale} streams={homeProductStreams(locale)} />
      ) : null}

      {showComponents ? <ComponentPreview locale={locale} /> : null}

      {path === "/about" ? <AboutPageBody locale={locale} /> : null}
      {path === "/products-services" ? <ProductsPageBody locale={locale} /> : null}
      {path === "/businesses" ? <BusinessesPageBody locale={locale} /> : null}
      {business ? <BusinessDetailBody business={business} locale={locale} /> : null}

      {hasClosingCard ? (
        <ClosingCard locale={locale} variant={path === "/businesses" ? "businesses" : "standard"} />
      ) : null}
    </>
  );
}
