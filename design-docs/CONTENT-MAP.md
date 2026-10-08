# CONTENT-MAP.md — where the copy comes from


The mockups contain real copy, taken from the page-map documents. **The documents are the authority, not the mockups.** Take every string from the documents at build time. This file says which document feeds which page, and lists everything in the mockups that is *not* approved content.


**Integration lock — 6 October 2026:** owner-side exceptions are resolved below.


## 1. Sources


Project Drive folder: `company-profile-website`
https://drive.google.com/drive/folders/1yFTz_32GJBcD4YdiKrkGoAEL1ekaKU3F


| Document | Path in the folder | Feeds |
|---|---|---|
| `PROJECT-BRIEF.md` | root | Scope and intent |
| `TECH-STACK.md` | root | Engineering baseline |
| `PAGE-MAP.md` | `plans/page-maps/` | Routes and page list |
| `HOME.md` | `plans/page-maps/` | Home |
| `ABOUT.md` | `plans/page-maps/` | About |
| `BUSINESSES.md` | `plans/page-maps/` | Businesses |
| `PRODUCTS-SERVICES.md` | `plans/page-maps/` | Products & Services, and the Home section |
| `TECHNOLOGY-DIGITALIZATION.md` | `plans/page-maps/` | Business detail |
| `DATA-BUSINESS-INTELLIGENCE.md` | `plans/page-maps/` | Business detail |
| `GENERAL-TRADING-SUPPLY-CHAIN.md` | `plans/page-maps/` | Business detail |
| `FISHERIES-SEAWEED-BLUE-ECONOMY.md` | `plans/page-maps/` | Business detail |
| `HEALTH-BIOSCIENCE.md` | `plans/page-maps/` | Business detail |
| `AGRICULTURE-GREEN-ECONOMY.md` | `plans/page-maps/` | Business detail |
| `FOOD-BEVERAGE.md` | `plans/page-maps/` | Business detail. This document is the primary reference for Food & Beverage. |
| Partner logos | `resources/assets/partners-logo-transparent/` | Home partner line |
| Legal screenshots | `resources/assets/legal-screenshots/` | Not used in the design |
| `plans/asset-maps/HOME.md` | | **Ignore.** It describes an earlier Home concept that was set aside. |


The documents carry English and Bahasa Indonesia side by side. Their section headings are for organising content only: they are not eyebrow text.


Any older `design.md` or `design-system.md` in the Drive root is superseded by the two in this package.


## 2. Page by page


### Home


| Part | Copy |
|---|---|
| Hero | Headline "Beyond Technology. Building Strategic Industries." and the link label `About RekanMU`. |
| Scene, positioning | One paragraph from HOME.md. |
| Scene, seven stops | Each business name and its one-line summary from HOME.md, business overview. |
| Scene, two closing chapters | "From Intelligence to Execution" and "From Source to Market", each a heading and a paragraph. |
| Products & Services | Heading, one paragraph, button `Explore Products & Services`. Stream names and one-line stream descriptions from PRODUCTS-SERVICES.md. |
| Partners | Heading "Built Through Collaboration". Partner names and logos. |
| Closing card | "Start a Conversation", one paragraph, button `Contact RekanMU`. |


### Businesses


| Part | Copy |
|---|---|
| Hero | Title only: "A Portfolio Built to Work Together." |
| Opening paragraph | The hero paragraph from BUSINESSES.md. |
| Two group sections | Group heading, group paragraph, and for each business its name and description. Button label `View business`. |
| Closing card | "Let's Explore What Fits", paragraph, email, phone, location, button `Start a Business Inquiry`. |


### Business detail


From the business's own document: name, tagline, lead paragraph, overview, capabilities (name and description each), experience statements, inquiry heading and paragraph. Button `Start a Business Inquiry`; link `Explore Products & Services`; "Next:" plus the next business name.


### Products & Services


From PRODUCTS-SERVICES.md: hero headline and paragraph; five streams, each with name, paragraph, optional sub-groups and items (name and description); inquiry heading, paragraph and button.


### About


From ABOUT.md: hero; story (three paragraphs and one closing statement); at a glance (one paragraph and three items); vision; mission (five); values (five); corporate information (eight rows). The closing card uses the same copy as Home.


## 3. In the mockups but not approved content


| # | Where | What | Do this |
|---|---|---|---|
| C1 | Footer, first column | Heading "Have something to explore?" | Replace with the approved heading **"Start a Conversation"** / **"Mulai Percakapan"**. |
| C2 | Home, stream panels | Numbers 13, 9, 16, 6, 10 | Counted from the catalogue in PRODUCTS-SERVICES.md. Compute from the data; do not hard-code. |
| C3 | About, at a glance | The figure "2024" above the item "Focus" | **Resolved:** show Focus without a numeric figure. Keep 7 for Business Pillars and 5 for Operational Reach. Do not use 2024 or invent a Focus count. |
| C4 | Footer and menu | Instagram, LinkedIn, WhatsApp icons | Hide the social column/links until real URLs are supplied. Do not ship placeholders. |
| C5 | Footer | "Site map.", "Social.", "Language." column labels; "English.", "Indonesia." | Interface labels. Translate with the rest of the interface. |
| C6 | Mockup pages | The line of explanation and three small stills under the Businesses hero; the line of explanation between the two parts of Home's Products & Services | Annotations for the reader of the mockup. Not part of the site. |
| C7 | Home partner line | Partner names in place of logos | **Resolved:** use all eleven approved logo files. Names are fallback text only. |
| C8 | Menu | The headline shown for each entry | Taken from each page's hero. Keep them in sync with the page-map documents. |


## 4. Contact details


| Item | Value | Note |
|---|---|---|
| Email | rekanmu.digital@gmail.com | |
| Phone | 0899 9933 349 | Where documents disagree, this is the number to use. |
| Location | Sidoarjo, East Java, Indonesia | |
| Legal name | PT Rekan Makmur Utama | |
| NIB | 2302240059465 | Shown in the footer and in corporate information. |


Contact buttons open email. There is no form.


## 5. Rules for copy


- Do not rewrite approved copy to fit a layout. Change the layout.
- Do not add taglines, eyebrows, counters or helper sentences.
- If a section's content is missing from its document, leave the section out.
- Product and package names stay exactly as written, including Indonesian names inside English text.