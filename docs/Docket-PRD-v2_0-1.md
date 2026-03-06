

| ![][image1] DOCKET Legal Case Management Platform ──────────────────────────────────────── PRODUCT REQUIREMENTS DOCUMENT PRD v1.0  ·  Capstone Project  ·  March 2026 Prepared by Docket Capstone Product Team Status: ACTIVE  ·  Presentation: 20–21 March 2026  |
| :---- |

# **Document Information**

| Field | Detail |
| :---- | :---- |
| Document Title | Docket — Legal Case Management Platform PRD |
| Version | 1.0 — Initial Release |
| Status | Active / In Development |
| Author(s) | Docket Capstone Product Team |
| Stakeholders | All Tracks: Frontend, Backend, Mobile, UI/UX, Product, Technical Writing |
| Last Updated | March 2026 |
| Presentation Date | Friday 20 & Saturday 21 March 2026 |
| Review Cycle | Weekly — every Monday before standup |

| 1\.  Executive Summary What Docket is and why it exists |
| :---- |

Docket is a web-based legal case management platform designed to help law firms and legal practitioners in Nigeria efficiently track clients, cases, assigned lawyers, and court dates from a single unified dashboard.

Today, most small and mid-size law firms rely on spreadsheets, physical files, and memory to manage their caseload. This leads to missed court hearings, poor visibility into case status, chaotic client records, and no accountability trail. Docket replaces this with a purpose-built digital solution that is fast to learn and immediately practical.

|  | *Docket's core promise: zero missed court dates, full visibility into every case, and clear ownership of every client relationship.* |
| :---- | :---- |

| 2\.  Problem Statement The pain we are solving |
| :---- |

## **2.1  Current State**

Law firms managing more than 10 active cases simultaneously face significant operational friction:

* Court dates are tracked in spreadsheets, calendars, or sticky notes — no single source of truth

* Lawyers have no structured way to see their full caseload at a glance

* Senior partners cannot get a real-time overview of all active cases across the firm

* Client contact information is scattered across emails, notebooks, and phone contacts

* When a lawyer leaves or transfers a case, critical context is lost

* No prioritisation system exists — urgent cases look the same as closed ones

## **2.2  Problem Impact**

| Problem | Estimated Impact |
| :---- | :---- |
| Missed court hearings | Case dismissals, legal liability, loss of client trust |
| No caseload visibility | Overloaded lawyers, uneven workload distribution |
| Scattered client data | Time wasted locating contact info before calls or hearings |
| No audit trail | Disputes over what was agreed or actioned, compliance risk |
| Manual status tracking | Hours wasted on internal status update meetings weekly |

## **2.3  Opportunity**

A focused, well-designed case management tool built specifically for Nigerian law firms — one that is mobile-aware, fast to set up, and requires no legal tech expertise — can capture this underserved market. Docket is that product.

| 3\.  Goals & Success Metrics What success looks like for V1 |
| :---- |

## **3.1  Product Goals**

* Enable law firms to go from zero to fully operational on Docket within 30 minutes

* Eliminate missed court dates through visible urgency indicators and upcoming hearing tracking

* Give senior partners real-time visibility into every case across the firm

* Reduce time spent on internal case status meetings by 60%

* Provide a reliable audit trail for all case actions and status changes

## **3.2  Success Metrics**

| Metric | Target | How Measured |
| :---- | :---- | :---- |
| Case creation time | \< 2 minutes end-to-end | User testing stopwatch |
| Hearing visibility | 100% of upcoming hearings visible on dashboard | QA testing |
| Filter response time | \< 300ms after user input | Frontend performance test |
| Onboarding time | New firm operational in ≤ 30 minutes | Demo scenario testing |
| Error recovery | All errors surfaced with actionable message | Test all error states |
| Role enforcement | 0 unauthorised actions succeed | Security testing |
| Mobile app usability | All 5 main tabs functional on device/simulator | Mobile track demo |
| Mobile auth | Login and JWT session work end-to-end on mobile | Integration test |
| Presentation readiness | All 5 pages functional for demo on Mar 20 | Full demo run-through |

## **3.3  Non-Goals for V1**

* Client-facing portal (clients logging in to see their case)

* Document upload and file management

* Invoicing, billing, or payment tracking

* Email or SMS notification system

* Native iOS / Android App Store publishing — the React Native app is built as a V1 deliverable but store submission is V2

* Multi-firm / SaaS multi-tenancy

| 4\.  User Personas Who uses Docket and what they need |
| :---- |

## **4.1  Persona 1 — The Senior Partner**

| Attribute | Detail |
| :---- | :---- |
| Name / Role | Chukwuemeka — Senior Partner, Firm Owner |
| Age / Experience | 47 years old, 20+ years in practice |
| Firm Size | 8–15 lawyers, 60–100 active cases at any time |
| Tech Comfort | Moderate — uses WhatsApp and email daily, minimal SaaS tools |
| Primary Goal | Oversee the firm's entire caseload without needing to ask each lawyer for updates |
| Secondary Goal | Ensure no hearing is ever missed by any team member |
| Biggest Frustration | Has no real-time visibility — learns about problems only after they happen |
| How Docket Helps | Dashboard with firm-wide stats, case status overview, and upcoming hearings in one view |

## **4.2  Persona 2 — The Associate Lawyer**

| Attribute | Detail |
| :---- | :---- |
| Name / Role | Adaeze — Associate Lawyer, Civil Litigation |
| Age / Experience | 31 years old, 5 years post-call |
| Caseload | 10–20 active cases simultaneously |
| Tech Comfort | High — uses smartphone heavily, comfortable with web apps |
| Primary Goal | See all my assigned cases and never miss a hearing date |
| Secondary Goal | Quickly update case status after a hearing without paperwork |
| Biggest Frustration | Manually tracking 15 cases across WhatsApp messages and a notebook |
| How Docket Helps | Cases page filtered to her cases, colour-coded urgency, one-click status update |

## **4.3  Persona 3 — The Legal Secretary**

| Attribute | Detail |
| :---- | :---- |
| Name / Role | Tunde — Legal Secretary / Office Admin |
| Age / Experience | 26 years old, 2 years at the firm |
| Responsibilities | Onboarding clients, creating cases, scheduling hearings, updating records |
| Tech Comfort | High — manages firm calendar and communications |
| Primary Goal | Create and update client/case records quickly and accurately |
| Secondary Goal | Ensure lawyers are notified of upcoming hearings |
| Biggest Frustration | Re-entering the same client data across multiple files and spreadsheets |
| How Docket Helps | Single case creation form, client directory, hearing scheduler all in one place |

## **4.4  Persona 4 — The On-The-Go Lawyer (Mobile Primary User)**

| Attribute | Detail |
| :---- | :---- |
| Name / Role | Ngozi — Associate Lawyer, frequently in court |
| Age / Experience | 29 years old, 4 years post-call |
| Device Usage | Primarily smartphone — travels between courts, rarely at a desk |
| Tech Comfort | Very high — early adopter, comfortable with mobile apps |
| Primary Goal | Check upcoming hearings and update case status from her phone while in court |
| Secondary Goal | Quickly pull up client or case detail before walking into a courtroom |
| Biggest Frustration | Must wait until back at the office to update anything — risks forgetting |
| How Docket Helps | Mobile app with bottom tab navigation, urgency indicators, one-tap status update |

| 5\.  User Stories What each persona needs the product to do |
| :---- |

## **5.1  Case Management**

| ID | Role | I want to... | So that... | P |
| :---- | :---- | :---- | :---- | ----- |
| US-01 | **Senior Partner** | view all cases in the firm with their current status | I can oversee firm operations without chasing individual lawyers for updates | **Must** |
| US-02 | **Legal Secretary** | create a new case and assign it to a lawyer | the right lawyer is notified and the case is trackable from day one | **Must** |
| US-03 | **Associate Lawyer** | see only my assigned cases filtered by default | I can focus on my workload without distraction from others' cases | **Must** |
| US-04 | **Any User** | update the status of a case (Active, Pending, Closed, etc.) | the team always has an accurate view of where each case stands | **Must** |
| US-05 | **Senior Partner** | mark a case as Urgent | the team knows it requires immediate attention and it's visually highlighted | **Must** |
| US-06 | **Legal Secretary** | search for a case by title, client name, or case ID | I can find any case in seconds without scrolling through all records | **Must** |
| US-07 | **Any User** | filter cases by status and case type simultaneously | I can focus on a specific segment of the caseload at any time | **Must** |
| US-08 | **Associate Lawyer** | view the full details of a case in a modal without leaving the table | I can quickly check case info without disrupting my workflow | **Should** |
| US-09 | **Legal Secretary** | edit case details after creation | mistakes or updates can be corrected without creating a duplicate case | **Must** |
| US-10 | **Senior Partner** | delete a case (with confirmation) | erroneous or test cases don't clutter the system | **Should** |

## **5.2  Client Management**

| ID | Role | I want to... | So that... | P |
| :---- | :---- | :---- | :---- | ----- |
| US-11 | **Legal Secretary** | create a new client profile with contact information | clients are on record before their case is filed | **Must** |
| US-12 | **Any User** | view a client's profile and all cases linked to them | I have full context on a client before a call or meeting | **Must** |
| US-13 | **Legal Secretary** | search the client directory by name or email | I can find a client record in seconds | **Must** |
| US-14 | **Legal Secretary** | edit a client's contact information | records stay accurate when clients change phone numbers or addresses | **Must** |

## **5.3  Hearings & Court Dates**

| ID | Role | I want to... | So that... | P |
| :---- | :---- | :---- | :---- | ----- |
| US-15 | **Associate Lawyer** | schedule a hearing date for a case | the date is visible to the whole team and won't be missed | **Must** |
| US-16 | **Any User** | see all upcoming hearings sorted by date on the dashboard | the most urgent hearings are always front and centre | **Must** |
| US-17 | **Any User** | see hearings colour-coded by urgency (≤3 days \= red) | I can instantly tell which hearings need immediate attention | **Must** |
| US-18 | **Any User** | filter hearings by 'This Week' on the hearings page | I can prepare for the near-term without being distracted by distant dates | **Should** |
| US-19 | **Associate Lawyer** | add notes to a scheduled hearing | context about the hearing is preserved for the assigned lawyer | **Should** |
| US-20 | **Legal Secretary** | edit or reschedule a hearing date | changes to court dates are reflected immediately system-wide | **Must** |

## **5.4  Dashboard & Reporting**

| ID | Role | I want to... | So that... | P |
| :---- | :---- | :---- | :---- | ----- |
| US-21 | **Senior Partner** | see key metrics on a dashboard (total cases, active, urgent, this week's hearings) | I get a firm health snapshot the moment I log in | **Must** |
| US-22 | **Any User** | see recent cases on the dashboard without navigating away | I can pick up where I left off immediately after login | **Should** |
| US-23 | **Senior Partner** | see which lawyer has the most active cases | I can rebalance workload if someone is overloaded | **Could** |

## **5.5  Mobile App**

| ID | Role | I want to... | So that... | P |
| :---- | :---- | :---- | :---- | ----- |
| US-24 | **On-The-Go Lawyer** | log in securely from my phone and have my session remembered | I don't have to re-enter credentials every time I open the app | **Must** |
| US-25 | **On-The-Go Lawyer** | see all my upcoming hearings in a mobile-optimised list | I can check my schedule before entering a courtroom without opening a laptop | **Must** |
| US-26 | **Any User** | update a case status from the mobile app with one tap | case records stay current even when I'm out of the office | **Must** |
| US-27 | **On-The-Go Lawyer** | see hearing urgency clearly on mobile (red/orange/green) | I can immediately spot the most pressing matter on a small screen | **Must** |
| US-28 | **Legal Secretary** | create a new case from my phone using a bottom-sheet form | I can register a walk-in client without being tied to a desktop | **Should** |
| US-29 | **Any User** | pull to refresh any list screen | I always see the latest data without manually navigating away and back | **Must** |
| US-30 | **On-The-Go Lawyer** | use the app in low-connectivity conditions with cached data | I can still view case and hearing info even with poor network in the courthouse | **Should** |

| 6\.  Feature Requirements (MoSCoW) Prioritised list of all product features |
| :---- |

Priority key:  Must \= launch blocker  ·  Should \= high value, not blocking  ·  Could \= nice to have  ·  Won't \= explicitly out of scope for V1

## **6.1  Core Features**

| ID | Feature | Description | Priority | Owner |
| :---- | :---- | :---- | ----- | :---- |
| F-01 | **Case Creation** | Form to create a case with title, client, lawyer, type, status, description, and hearing date | **Must** | Frontend / Backend |
| F-02 | **Case List \+ Table** | Paginated table of all cases with case ID, title, client, lawyer, status, and next hearing | **Must** | Frontend / Backend |
| F-03 | **Case Detail Modal** | Click a row to open a full case detail view without page navigation | **Must** | Frontend |
| F-04 | **Case Status Update** | Update status from Active, Pending, In Review, Urgent, or Closed | **Must** | Frontend / Backend |
| F-05 | **Case Edit** | Edit all case fields after creation with pre-filled form | **Must** | Frontend / Backend |
| F-06 | **Case Delete** | Soft-delete a case with confirmation dialog (senior partner only) | **Should** | Frontend / Backend |
| F-07 | **Lawyer Assignment** | Assign or reassign a lawyer to any case from the case detail | **Must** | Frontend / Backend |
| F-08 | **Case Search** | Real-time text search across case title, ID, and client name (debounced 300ms) | **Must** | Frontend |
| F-09 | **Status Filter** | Dropdown filter for case status with multi-select option | **Must** | Frontend |
| F-10 | **Case Type Filter** | Dropdown filter for case type (Civil, Criminal, Corporate, etc.) | **Must** | Frontend |
| F-11 | **Client Creation** | Form to create a client with name, email, phone, type (individual/corporate) | **Must** | Frontend / Backend |
| F-12 | **Client Directory** | Searchable table of all clients with linked case count | **Must** | Frontend / Backend |
| F-13 | **Client Edit** | Edit client contact info and type after creation | **Must** | Frontend / Backend |
| F-14 | **Lawyer Directory** | Card grid of all lawyers with specialty and active case count | **Must** | Frontend / Backend |
| F-15 | **Hearing Scheduler** | Schedule a hearing date \+ optional time and court name for any non-closed case | **Must** | Frontend / Backend |
| F-16 | **Hearings Page** | Dedicated page listing all upcoming hearings with urgency indicators and week filter | **Must** | Frontend / Backend |
| F-17 | **Dashboard — Stat Cards** | Four KPI cards: Total Cases, Active Cases, Pending, Hearings This Week | **Must** | Frontend / Backend |
| F-18 | **Dashboard — Recent Cases** | Table of the 6 most recently updated cases on the dashboard | **Must** | Frontend / Backend |
| F-19 | **Dashboard — Upcoming Hearings** | Sidebar list of the next 6 upcoming hearings sorted by date | **Must** | Frontend / Backend |
| F-20 | **Urgency Colour Coding** | Red for ≤3 days, orange for ≤7 days, green for \>7 days on all hearing dates | **Must** | Frontend |
| F-21 | **Toast Notifications** | In-app success and error toast messages for all create/update/delete actions | **Must** | Frontend |
| F-22 | **Role-Based Permissions** | Senior Partner / Associate / Secretary roles with enforced access rules | **Must** | Backend / Frontend |
| F-23 | **Authentication** | Email \+ password login with JWT session management | **Must** | Backend |
| F-24 | **Mobile-Responsive Web Layout** | Usable layout at tablet viewport (768px); hamburger menu on mobile web | **Should** | Frontend |
| F-25 | **Mobile App — Auth** | React Native login screen with JWT stored in expo-secure-store | **Must** | Mobile / Backend |
| F-26 | **Mobile App — Dashboard** | Home tab with 2x2 stat grid and upcoming hearings list | **Must** | Mobile / Backend |
| F-27 | **Mobile App — Cases List** | Scrollable cases list with search, status filter chips, pull-to-refresh | **Must** | Mobile |
| F-28 | **Mobile App — Case Detail** | Case detail screen showing all fields, status badge, hearing date | **Must** | Mobile |
| F-29 | **Mobile App — Hearings Tab** | Upcoming hearings list with urgency colour strips and week toggle | **Must** | Mobile |
| F-30 | **Mobile App — Clients Tab** | Searchable client list with avatar initials and contact shortcuts | **Must** | Mobile |
| F-31 | **Mobile App — Lawyers Tab** | Lawyer cards with specialty and active case count | **Must** | Mobile |
| F-32 | **Mobile App — Add Case Form** | Bottom-sheet form to create a new case from mobile | **Should** | Mobile |
| F-33 | **Mobile App — Offline Cache** | Last-fetched data visible offline; 'You are offline' banner shown | **Should** | Mobile |
| F-34 | **Mobile App — Swipe Actions** | Swipe left on case card for Edit and Change Status shortcuts | **Could** | Mobile |
| F-35 | **Case Activity Log** | Timestamped log of status changes and lawyer assignments per case | **Should** | Backend / Frontend |
| F-36 | **Hearing Reschedule** | Edit or delete an existing scheduled hearing from the case detail | **Should** | Frontend / Backend |
| F-37 | **Lawyer Workload View** | Show active case count per lawyer on the lawyers page | **Could** | Frontend / Backend |
| F-38 | **Export to CSV** | Download filtered case list as a CSV file | **Could** | Frontend |
| F-39 | **Client Portal / Login** | Clients log in to view their own case status | **Won't** | — |
| F-40 | **Document Upload** | Attach files and documents to cases | **Won't** | — |
| F-41 | **SMS / Email Notifications** | Automated reminders for upcoming hearings | **Won't** | — |
| F-42 | **Billing & Invoicing** | Fee tracking and invoice generation | **Won't** | — |

| 7\.  Information Architecture & Navigation How the product is structured |
| :---- |

## **7.1  Site Map**

| Route | Page | Key Components |
| :---- | :---- | :---- |
| /dashboard | Dashboard | Stat cards, recent cases table, upcoming hearings list |
| /cases | Cases | Search bar, status filter, type filter, cases table, New Case button |
| /cases/:id | Case Detail (modal) | Full case info, edit form, status update, hearing scheduler |
| /clients | Clients | Search bar, clients table, Add Client button |
| /clients/:id | Client Detail (modal) | Profile info, linked cases list, edit form |
| /lawyers | Lawyers | Lawyer cards grid, specialty, active case count, Add Lawyer button |
| /hearings | Hearings | Tab filters (All / This Week), hearings table with urgency labels |
| /settings | Settings | User profile, firm settings, role management (V1 minimal) |
| /login | Login | Email \+ password form, redirect to dashboard on success |

## **7.2  Navigation Structure — Web**

The web application uses a fixed left sidebar (260px on desktop) as the primary navigation mechanism. The sidebar contains:

* Logo / brand mark at the top

* Main menu section: Dashboard, Cases, Clients, Lawyers, Hearings

* System section: Reports (disabled V1), Settings

* User profile card at the bottom with name, role, and logout

The top bar (sticky, 64px tall) contains the page title, subtitle, and the primary CTA button ('+ New Case') which is always accessible regardless of current page.

## **7.3  Navigation Structure — Mobile App**

The React Native mobile app uses a Bottom Tab Navigator as the root navigation with 5 tabs:

| Tab | Icon | Stack Screens | Badge |
| :---- | :---- | :---- | :---- |
| Home | Dashboard | Dashboard screen only | None |
| Cases | Briefcase | Cases List → Case Detail → New Case | Urgent count (red) |
| Hearings | Calendar | Hearings List | This-week count |
| Clients | People | Clients List → Client Detail | None |
| Settings | Cog | Profile / Logout | None |

Each tab maintains its own navigation stack. The New Case form and case filters open as bottom sheets, not full-screen navigation pushes, to preserve context.

| 8\.  Functional Requirements Detailed behaviour specifications |
| :---- |

## **8.1  Case Status Lifecycle**

| From Status | Allowed Transitions | Who Can Trigger |
| :---- | :---- | :---- |
| (New Case) | Pending, Active | Legal Secretary, Senior Partner |
| Pending | Active, In Review, Closed | Legal Secretary, Senior Partner, Assigned Lawyer |
| Active | Pending, In Review, Urgent, Closed | Assigned Lawyer, Senior Partner, Legal Secretary |
| In Review | Active, Pending, Closed | Senior Partner, Legal Secretary |
| Urgent | Active, In Review, Closed | Any user |
| Closed | Active (reopen) | Senior Partner only |

## **8.2  Hearing Date Rules**

* A hearing can only be scheduled for a case that is NOT in Closed status

* Hearing date must be a future date — past dates are rejected with inline error

* A case may have multiple hearings over its lifetime (history preserved)

* Only the next/most upcoming hearing is shown in the cases table and dashboard

* If a hearing is within 3 days, it renders in red across all views

* If a hearing is within 7 days, it renders in orange across all views

* All other upcoming hearings render in green or neutral slate colour

## **8.3  Search Behaviour**

* Search is client-side, real-time, and debounced at 300ms to avoid jank

* Search matches against: case title, case ID (partial), and client name

* Search combines with active dropdown filters (AND logic, not OR)

* Clearing the search box immediately restores all results matching active filters

* If no results match, an empty state is shown: icon \+ 'No cases match your filters'

## **8.4  Role Permission Matrix**

| Action | Senior Partner | Associate Lawyer | Legal Secretary |
| :---- | :---- | :---- | :---- |
| View all cases | ✅ Full access | ✅ Full access | ✅ Full access |
| Create new case | ✅ Yes | ❌ No | ✅ Yes |
| Edit any case | ✅ Yes | Own cases only | ✅ Yes |
| Delete a case | ✅ Yes | ❌ No | ❌ No |
| Assign / reassign lawyer | ✅ Yes | ❌ No | ✅ Yes |
| Reopen a Closed case | ✅ Yes | ❌ No | ❌ No |
| Create / edit client | ✅ Yes | ❌ No | ✅ Yes |
| Delete client | ✅ Yes | ❌ No | ❌ No |
| Schedule hearing | ✅ Yes | ✅ Yes | ✅ Yes |
| Edit / delete hearing | ✅ Yes | Own cases only | ✅ Yes |
| Add / deactivate lawyer | ✅ Yes | ❌ No | ❌ No |
| View dashboard | ✅ All stats | Personal stats only | ✅ All stats |
| Access settings | ✅ Full access | Profile only | Profile only |

| 9\.  Non-Functional Requirements Performance, security, and quality standards |
| :---- |

| Category | Requirement | Target |
| :---- | :---- | :---- |
| Performance | Filter/search response time | \< 300ms after user input |
| Performance | Page initial load time | \< 2 seconds on standard connection |
| Performance | API response time | \< 500ms for all CRUD operations |
| Usability | Case creation flow | Completable in \< 2 minutes by new user |
| Usability | Onboarding a new firm | Fully operational in ≤ 30 minutes |
| Reliability | Form data preservation | No data lost on failed API call — form stays populated |
| Security | Authentication | JWT tokens, expiry enforced, no sensitive data in localStorage |
| Security | Role enforcement | Unauthorised API calls return 403 Forbidden at the server |
| Security | Password storage | Bcrypt hashed, never stored or transmitted in plain text |
| Accessibility | Keyboard navigation | All interactive elements reachable via Tab and Enter |
| Accessibility | Colour contrast | Minimum 4.5:1 ratio for all body text |
| Compatibility | Browser support | Chrome, Firefox, Safari, Edge — latest 2 major versions |
| Responsiveness | Tablet support | Layout usable and readable at 768px viewport |
| Maintainability | Code structure | Components \< 200 lines; business logic separated from UI |

| 10\.  Sprint Roadmap 4-week delivery plan to presentation day |
| :---- |

| Sprint | Dates | Theme | Key Deliverables |
| :---- | :---- | :---- | :---- |
| Sprint 1 | Mar 3 – 7 | Foundation | DB schema finalised, wireframes approved, design system defined, project repo set up, auth scaffold, PRD signed off |
| Sprint 2 | Mar 10 – 14 | Core Build | Auth (login/logout/JWT), Cases CRUD \+ API, Clients CRUD \+ API, Lawyers module, Dashboard stats API, Base UI with sidebar navigation |
| Sprint 3 | Mar 17 – 19 | Polish & Wire | Hearings module, All filters functional, Urgency indicators, Role-based access enforcement, Toast system, Mobile responsiveness |
| Sprint 4 | Mar 20 – 21 | Presentation | Demo run-through, final bug fixes, slide deck, API docs, user manual, video walkthrough, team presentation rehearsal |

## **Track-Specific Sprint 4 Checklist**

| Track | Presentation Deliverable |
| :---- | :---- |
| Product Management | PRD v1.0 \+ user story map \+ problem/solution slide \+ success metrics |
| Backend Development | Working REST API \+ Postman collection or Swagger docs \+ DB ERD diagram |
| Frontend Development | React web app with all 5 pages functional \+ search, filter, and modal flows |
| Mobile Development | React Native app with all 5 tabs \+ login flow \+ urgency indicators \+ device demo |
| UI/UX Design | Wireframes for web \+ mobile screens \+ Figma component library \+ design rationale |
| Technical Writing | API reference \+ web user manual \+ mobile user manual \+ README |

| 11\.  Risks & Assumptions What could go wrong and what we're betting on |
| :---- |

## **11.1  Risks**

| Risk | Likelihood | Impact | Mitigation |
| :---- | :---- | :---- | :---- |
| Backend not ready before frontend needs API | Medium | High | Frontend uses mock data (sample JSON) as a fallback; integrate API in Sprint 3 |
| Scope creep from adding new features mid-sprint | High | Medium | PRD is locked after Sprint 1; new ideas go to V2 backlog |
| Role permissions not enforced at API level | Medium | High | Backend validates role on every request; frontend also hides disallowed actions |
| Mobile API integration fails close to demo | Medium | High | Mobile track uses seeded mock data as fallback if backend integration is incomplete |
| React Native build issues on demo device | Medium | Medium | Test on iOS simulator and Android device by Mar 19; prepare screen recording as backup |
| Team member not completing their track's deliverable | Medium | High | Cross-track dependencies flagged in Monday standups; escalate to supervisor by Mar 17 |

## **11.2  Assumptions**

* Web users have reliable internet access on desktop or laptop devices

* Mobile users may have intermittent connectivity — the app handles this gracefully with cached data

* The firm has a designated admin (Legal Secretary or Senior Partner) who onboards the team

* Case IDs will be auto-generated in the format SLT-001, SLT-002, etc.

* A single lawyer can be assigned to a case (no co-counsel assignment in V1)

* All hearing dates are local to Nigeria (WAT, UTC+1) — no timezone handling required in V1

* No data migration from existing spreadsheets is needed for the demo

| 12\.  Glossary Key terms used in this document |
| :---- |

| Term | Definition |
| :---- | :---- |
| Case | A legal matter filed on behalf of a client, tracked from open to close |
| Hearing | A scheduled court appearance linked to a specific case |
| Case Status | The current state of a case: Active, Pending, In Review, Urgent, or Closed |
| Senior Partner | The highest-permission user role; typically the firm owner or lead lawyer |
| Associate Lawyer | A lawyer assigned to cases; limited to editing their own assigned cases |
| Legal Secretary | Admin staff who creates and manages cases and clients but cannot delete |
| V1 | Version 1 — the initial release built during this capstone project |
| MoSCoW | Prioritisation framework: Must have, Should have, Could have, Won't have |
| PRD | Product Requirements Document — the single source of truth for what to build and why |
| JWT | JSON Web Token — the authentication mechanism used to manage user sessions |
| CTA | Call to Action — a button or link prompting the user to take a specific action |
| CRUD | Create, Read, Update, Delete — the four fundamental data operations |
| React Native | A framework for building cross-platform mobile apps using JavaScript and React |
| Expo | A managed React Native toolchain that simplifies build, test, and deployment |
| Bottom Tab Navigator | Mobile navigation pattern with tabs at the bottom of the screen for switching views |
| Bottom Sheet | A mobile UI panel that slides up from the bottom of the screen for forms or actions |
| expo-secure-store | Expo library for encrypted key-value storage on the device — used to store JWT tokens |
| ERD | Entity Relationship Diagram — a visual map of the database schema |
| WAT | West Africa Time (UTC+1) — the timezone used for all date/time values in V1 |

| DOCKET  ·  Legal Case Management Platform Product Requirements Document v1.0  ·  Capstone 2026 Final Presentation: Friday 20 & Saturday 21 March 2026 |
| :---: |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABbCAYAAAAcNvmZAAADX0lEQVR4Xu2ZPWsUURSG01sIdmLAQhSNxiCRGE2iCa4oRkVTKAiiKUSiiDYpVLRSsFAQG7FS8APBzj8gCCL+qtEJZDf7nJ2dj5177sy954Wnu+frKZZld2ysofn77UJSFfayIBRWJ5wVZShFA+4QdHi8T7hbMOGhTYK7tjY8rMlw99aEh7QJ3tLocPk2wpsaFy4cAryxEeGSIcFbvYWLhQxvVw2XiQE6UAmXiAm6cBoOjxE6cRIOjRm6qTUcZjgSziFGD7oaORxg9KCrkcLmhoTOKoVNjWzornTY0MiG7kqFzYx86LBQ2MQoDl3mhg2M4tDl0LDYKA+dZoaFRnnodGBYZFSHbkVYYFSHbvvCx3WzbecB5/z5Kuf6hI674cO6Gd93SMhxxfravJjvAzruhg9ds3JpRkgiW9+/f346ObU4Ld4M48X6opirCR1vhI80KCub/Hh3TrzPgrWa0HUrZW+yY/eEqCOdzlFRpwVdt1p2yu8vy6KWTE5PiToNvItOqVN2CmsHwRotgpOdwvpBsEaDIGXfuDYrehDWaBCk7BT2IFdXjoka13gVneJLdtW+o2KyFQlS9uzcEdGH/Px4XtS5JkjZH152RB9y5f9s1rkmSNkp7DMI1rjGZCtishUx2YqYbEVMtiLRyt5zcFLUuCZa2c8enBQ1rglS9punS6IPYY0GQcretTf/X3zWaBCkbPYYBGs08Pozqy/Zn1+dETWuifbPA77XIEjZ39+eFT0IazQIUjbrCd9r0ZXtS3jdsvO+hazdOiFqNOgTHYLsu6tzonYrj+8viBot6LrVsllDto9PiBpN6HojfOSaIrJT9k8dTi5fnEke3p5PHt1bSFavHxdvsnj9ZEnM1YSOu+HDuqEIl9y56efzmdBxN3xYNxTigl+flsVcn9BxX/jYqA7dirDAqA7dDgyLjPLQaWZYaJSHToeGxUZx6DI3bGAUhy4LhU2MfOiwVNjMyIbuSocNjWzorlLY1JDQ2Uhhc6MHXY0cDjB60FUt4RDDkejNcFjM0I2TcGiM0InTcHhM0IVKuEQM0IFquEzI8HZv4WIhwVsbES4ZAryxceHCbYQ3NTpcvk3wltaEhzQZ7t7a8LAmwV2DCQ/1CXcLOjxeA+4QZSilTjjLglBYGdirKfkHrnXeXgJ3gT8AAAAASUVORK5CYII=>