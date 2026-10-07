import Image, { type StaticImageData } from "next/image";

import { localizeHref, type Locale } from "@/content/site";
import { ButtonLink, PointType } from "./ui";
import "./home-catalogue.css";

import edBusinessConsulting from "../../resources/assets/partners-logo-transparent/partners-ed-business-consulting.png";
import gerakanPembaru from "../../resources/assets/partners-logo-transparent/partners-gerakan-pembaru.png";
import iMercy from "../../resources/assets/partners-logo-transparent/partners-imercy.png";
import lenteraAlamNusantara from "../../resources/assets/partners-logo-transparent/partners-lentera-alam-nusantara.png";
import markasWalet from "../../resources/assets/partners-logo-transparent/partners-markas-walet.png";
import petambakNusantara from "../../resources/assets/partners-logo-transparent/partners-petambak-nusantara.png";
import rendangAmbo from "../../resources/assets/partners-logo-transparent/partners-rendang-ambo.png";
import sabarIkhlasSyukur from "../../resources/assets/partners-logo-transparent/partners-sabar-ikhlas-sukur.png";
import sygmaDental from "../../resources/assets/partners-logo-transparent/partners-sygma-dental.png";
import triasSpunindoIndustri from "../../resources/assets/partners-logo-transparent/partners-trias-spunindo-industri.png";
import vistaTeknik from "../../resources/assets/partners-logo-transparent/partners-vista-teknik.png";

type ProductStream = { name: string; description: string; count: number };
type HomeCopy = {
  headingSolid: string;
  headingPoint: string;
  description: string;
  action: string;
  partnersSolid: string;
  partnersPoint: string;
};

const partners: ReadonlyArray<readonly [StaticImageData, string]> = [
  [edBusinessConsulting, "ED Business Consulting"],
  [gerakanPembaru, "Gerakan Pembaru"],
  [iMercy, "iMercy"],
  [lenteraAlamNusantara, "Lentera Alam Nusantara"],
  [markasWalet, "Markas Walet"],
  [petambakNusantara, "Petambak Nusantara"],
  [rendangAmbo, "Rendang Ambo"],
  [sabarIkhlasSyukur, "Sabar Ikhlas Syukur"],
  [sygmaDental, "Sygma Dental"],
  [triasSpunindoIndustri, "Trias Spunindo Industri"],
  [vistaTeknik, "Vista Teknik"],
];

function PartnerLogoSet({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div aria-hidden={duplicate || undefined} className="partnerLogoSet">
      {partners.map(([source, name]) => (
        <span
          aria-label={name}
          className="partnerLogo"
          key={name}
          role="img"
        >
          <Image alt="" className="partnerLogoImage" sizes="(max-width: 820px) 164px, 250px" src={source} />
        </span>
      ))}
    </div>
  );
}

export function HomeCatalogue({
  locale,
  copy,
  streams,
}: {
  locale: Locale;
  copy: HomeCopy;
  streams: ProductStream[];
}) {
  return (
    <>
      <section aria-labelledby="home-catalogue-title" className="homeCatalogue">
        <div className="homeCataloguePin">
          <div className="homeCatalogueTrack">
            <div className="homeCatalogueIntro">
              <h2 className="disp2" id="home-catalogue-title">
                {copy.headingSolid}<br /><PointType>{copy.headingPoint}</PointType>
              </h2>
              <div className="homeCatalogueIntroCopy">
                <p className="lead">{copy.description}</p>
                <ButtonLink href={localizeHref("/products-services", locale)}>
                  {copy.action}
                </ButtonLink>
              </div>
            </div>
            {streams.map((stream, index) => (
              <article
                aria-labelledby={`home-stream-${index + 1}`}
                className="homeCataloguePanel"
                data-count={stream.count}
                key={stream.name}
                tabIndex={0}
              >
                <span aria-label={`${stream.count} ${locale === "en" ? "catalogue items" : "item katalog"}`} className="homeCatalogueCount" role="img">
                  <span aria-hidden="true" className="homeCatalogueCountDotted dots">{stream.count}</span>
                  <span aria-hidden="true" className="homeCatalogueCountSolid">{stream.count}</span>
                </span>
                <div className="homeCataloguePanelCopy">
                  <h3 className="homeCatalogueStreamName" id={`home-stream-${index + 1}`}>{stream.name}</h3>
                  <p className="homeCatalogueDescription">{stream.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="home-partners-title" className="homePartners sec gut">
        <h2 className="h2" id="home-partners-title">
          {copy.partnersSolid} <PointType>{copy.partnersPoint}</PointType>
        </h2>
        <div className="partnerMarquee">
          <div className="partnerTrack">
            <PartnerLogoSet />
            <PartnerLogoSet duplicate />
          </div>
        </div>
      </section>
    </>
  );
}
