

| ![][image1] DOCKET Legal Case Management Platform ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ CROSS-TEAM ALIGNMENT DOCUMENT Product · Backend · Frontend · Mobile · UI/UX · Technical Writing Version 1.0  |  Capstone Project  |  March 2026 |
| :---: |

| 01 — PRODUCT MANAGEMENT Problem definition · User personas · V1 features · Permissions |
| :---- |

## **Problem Statement**

Law firms and legal practitioners in Nigeria and across Africa manage complex caseloads using spreadsheets, paper files, and disconnected tools. This results in missed court dates, poor client communication, untracked case progress, and no audit trail. Docket solves this by providing a unified digital platform for case tracking, hearing management, and team coordination.

### **Primary Problem Being Prioritised**

* Missed and poorly tracked court hearing dates causing case lapses

* No centralised visibility into which lawyer is handling which case

* Manual, error-prone client-case association with no history tracking

* Inability to filter and prioritise urgent cases from a cluttered workload

## **Primary User Personas**

| Persona | Role | Primary Goal | Pain Point |
| :---- | :---- | :---- | :---- |
| Senior Partner | Principal lawyer, firm owner | Oversee all cases and team performance | No real-time visibility into team workload |
| Associate Lawyer | Assigned case handler | Manage my assigned cases and upcoming hearings | Loses track of dates across multiple active cases |
| Legal Secretary | Admin, scheduling | Create cases, schedule hearings, update statuses | Manually cross-referencing spreadsheets daily |
| Client | Case owner (future v2) | Track the status of my own case | No transparency into case progress |

## **V1 Mandatory Features**

### **Must Have (Launch Blockers)**

* Case creation with title, type, client, assigned lawyer, status, description

* Client profile management (create, view, edit)

* Lawyer directory with specialty and active case count

* Court date / hearing scheduling per case

* Case status management: Active, Pending, In Review, Urgent, Closed

* Dashboard with key metrics and upcoming hearings

* Filtering by case status, case type, and search by title/client/ID

* Case detail modal / view page

### **Should Have (Sprint 2\)**

* Notifications for upcoming hearings (3-day and 1-day alerts)

* Case activity log / audit trail

* Lawyer reassignment flow

* Hearing history per case

### **Won't Have in V1**

* Client portal / login

* Document uploads and file management

* Billing and invoicing

* Mobile native app — React Native app is a V1 deliverable for the Mobile track; native iOS/Android store publishing is V2

## **Role-Based Permissions**

| Action | Senior Partner | Associate Lawyer | Legal Secretary |
| :---- | :---- | :---- | :---- |
| View all cases | ✅ Yes | ✅ Yes | ✅ Yes |
| Create new case | ✅ Yes | ❌ No | ✅ Yes |
| Edit any case | ✅ Yes | Own cases only | ✅ Yes |
| Delete a case | ✅ Yes | ❌ No | ❌ No |
| Assign / reassign lawyers | ✅ Yes | ❌ No | ✅ Yes |
| Add / edit client profiles | ✅ Yes | ❌ No | ✅ Yes |
| Schedule court dates | ✅ Yes | ✅ Yes | ✅ Yes |
| View dashboard analytics | ✅ Yes | Own only | ✅ Yes |
| Manage lawyer accounts | ✅ Yes | ❌ No | ❌ No |

Note: Role permissions apply equally to the mobile app — the same JWT-based auth and role enforcement used by the web frontend is consumed by the React Native mobile client.

| 02 — BACKEND DEVELOPMENT Database structure · Fields · API endpoints · Validation |
| :---- |

## **Database Schema**

### **clients**

| Field | Type | Constraints | Notes |
| :---- | :---- | :---- | :---- |
| id | UUID | PRIMARY KEY | Auto-generated |
| full\_name | VARCHAR(255) | NOT NULL | Client full name or company name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Used for communication |
| phone | VARCHAR(20) | NOT NULL | Nigerian format: \+234... |
| address | TEXT | NULLABLE | Physical address |
| client\_type | ENUM | NOT NULL | individual | corporate |
| created\_at | TIMESTAMP | DEFAULT NOW() | Auto |
| updated\_at | TIMESTAMP | DEFAULT NOW() | Auto-updated |

### **lawyers**

| Field | Type | Constraints | Notes |
| :---- | :---- | :---- | :---- |
| id | UUID | PRIMARY KEY | Auto-generated |
| full\_name | VARCHAR(255) | NOT NULL |  |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login credential |
| phone | VARCHAR(20) | NULLABLE |  |
| specialty | VARCHAR(100) | NOT NULL | e.g. Criminal Law |
| role | ENUM | NOT NULL | senior\_partner | associate | secretary |
| is\_active | BOOLEAN | DEFAULT TRUE | Soft delete flag |
| created\_at | TIMESTAMP | DEFAULT NOW() |  |

### **cases**

| Field | Type | Constraints | Notes |
| :---- | :---- | :---- | :---- |
| id | VARCHAR(20) | PRIMARY KEY | e.g. SLT-001 (auto-generated) |
| title | VARCHAR(300) | NOT NULL | Full case name |
| description | TEXT | NULLABLE | Case summary |
| case\_type | ENUM | NOT NULL | Civil, Criminal, Corporate, Family, Property... |
| status | ENUM | NOT NULL, DEFAULT 'Pending' | See status table below |
| client\_id | UUID | FK → clients.id, NOT NULL |  |
| lawyer\_id | UUID | FK → lawyers.id, NULLABLE | Can be unassigned initially |
| filed\_date | DATE | DEFAULT TODAY | Date case was opened |
| closed\_date | DATE | NULLABLE | Set when status \= Closed |
| created\_at | TIMESTAMP | DEFAULT NOW() |  |
| updated\_at | TIMESTAMP | DEFAULT NOW() |  |

### **hearings**

| Field | Type | Constraints | Notes |
| :---- | :---- | :---- | :---- |
| id | UUID | PRIMARY KEY |  |
| case\_id | VARCHAR(20) | FK → cases.id, NOT NULL |  |
| hearing\_date | DATE | NOT NULL |  |
| hearing\_time | TIME | NULLABLE | Optional time component |
| court\_name | VARCHAR(255) | NULLABLE | e.g. High Court Lagos |
| notes | TEXT | NULLABLE | Pre-hearing notes |
| outcome | TEXT | NULLABLE | Post-hearing result |
| created\_by | UUID | FK → lawyers.id | Who scheduled it |
| created\_at | TIMESTAMP | DEFAULT NOW() |  |

## **Case Status Options**

| Status | Color | Description |
| :---- | :---- | :---- |
| **Active** | ●●● | Case is ongoing and lawyers are actively working |
| **Pending** | ●●● | Awaiting assignment, documents, or client action |
| **In Review** | ●●● | Under internal review before next step |
| **Urgent** | ●●● | Requires immediate legal attention |
| **Closed** | ●●● | Case resolved, archived, or dismissed |

## **API Endpoints**

### **Authentication**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **POST** | /api/auth/login | Login with email \+ password, returns JWT |
| **POST** | /api/auth/logout | Invalidate current session token |
| **GET** | /api/auth/me | Get current authenticated user profile |

### **Cases**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/cases | List all cases (supports filters: status, type, lawyer\_id, search) |
| **POST** | /api/cases | Create a new case |
| **GET** | /api/cases/:id | Get single case with full details |
| **PUT** | /api/cases/:id | Update case fields (title, status, description, etc.) |
| **DELETE** | /api/cases/:id | Soft-delete a case (senior\_partner only) |
| **PATCH** | /api/cases/:id/assign | Assign or reassign a lawyer to a case |
| **PATCH** | /api/cases/:id/status | Update case status only |
| **GET** | /api/cases/:id/hearings | List all hearings for a specific case |

### **Clients**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/clients | List all clients with optional search |
| **POST** | /api/clients | Create a new client |
| **GET** | /api/clients/:id | Get client details and associated cases |
| **PUT** | /api/clients/:id | Update client profile |
| **DELETE** | /api/clients/:id | Soft-delete client (senior\_partner only) |

### **Lawyers**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/lawyers | List all active lawyers |
| **POST** | /api/lawyers | Create new lawyer account (senior\_partner only) |
| **GET** | /api/lawyers/:id | Get lawyer profile and assigned cases |
| **PUT** | /api/lawyers/:id | Update lawyer profile |
| **PATCH** | /api/lawyers/:id/deactivate | Deactivate lawyer account |

### **Hearings**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/hearings | List all hearings (filters: upcoming, this\_week, case\_id) |
| **POST** | /api/hearings | Schedule a new hearing |
| **GET** | /api/hearings/:id | Get single hearing detail |
| **PUT** | /api/hearings/:id | Update hearing date, notes, or outcome |
| **DELETE** | /api/hearings/:id | Remove a scheduled hearing |

### **Dashboard**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/dashboard/stats | Return totals: cases by status, upcoming hearings count |
| **GET** | /api/dashboard/upcoming-hearings | Next 10 hearings sorted by date |
| **GET** | /api/dashboard/recent-cases | Last 10 created/updated cases |

## **Validation Rules**

### **Case Creation**

* title: required, min 5 chars, max 300 chars

* client\_id: required, must reference existing active client

* case\_type: required, must be one of the defined ENUM values

* status: defaults to 'Pending' if not provided

* lawyer\_id: optional at creation, must reference active lawyer if provided

* filed\_date: defaults to today, cannot be a future date

### **Hearing Scheduling**

* case\_id: required, case must not be Closed

* hearing\_date: required, must be a future date

* hearing\_time: optional, if provided must be valid HH:MM 24hr format

* Only one upcoming hearing allowed per case at a time (warn, not block)

### **Client Creation**

* full\_name: required, min 2 chars

* email: required, valid email format, must be unique

* phone: required, validated against \+234 Nigerian format or international

* client\_type: required, must be 'individual' or 'corporate'

| 03 — FRONTEND DEVELOPMENT User flows · Confirmations · Error messages · Filters · Dashboard |
| :---- |

## **Core User Flows**

### **Flow 1: Create a New Case**

* **User clicks '+ New Case' button (topbar or cases page)** 1\.

* **Modal opens with case creation form** 2\.

* **User fills: Title, Client (dropdown), Lawyer (dropdown), Type, Status, Hearing Date, Description** 3\.

* **On submit — validate required fields client-side before API call** 4\.

* **Success: modal closes, case appears at top of cases table, toast: 'Case SLT-XXX created'** 5\.

* **Error: inline field errors shown, form stays open** 6\.

### **Flow 2: Filter Cases**

* **User is on /cases page** 1\.

* **Types in search box → results filter in real-time (debounced 300ms)** 2\.

* **Selects status from dropdown → table re-renders with matching cases** 3\.

* **Selects case type from dropdown → combined with other active filters** 4\.

* **Empty state shown if no results match: 'No cases match your filters'** 5\.

* **Active filter count shown as badge on filter button** 6\.

### **Flow 3: View Case Detail**

* **User clicks any row in the cases table** 1\.

* **Case detail modal opens with full info (ID, title, client, lawyer, status, dates, description)** 2\.

* **Edit button opens editable form (same modal, prefilled)** 3\.

* **Status can be changed from the detail view via a status dropdown** 4\.

* **Closing modal returns user to same filtered table state** 5\.

### **Flow 4: Schedule a Hearing**

* **User opens case detail, clicks 'Schedule Hearing'** 1\.

* **Date picker appears — only future dates selectable** 2\.

* **Optional time and court name fields** 3\.

* **On save: hearing appears in the Hearings page and Dashboard upcoming list** 4\.

* **If hearing is within 3 days, it renders in red in all views** 5\.

## **Confirmation Messages (Toast Notifications)**

| Action | Success Message | Duration |
| :---- | :---- | :---- |
| Create case | 'Case SLT-XXX created successfully' | 4 seconds |
| Update case status | 'Case status updated to \[Status\]' | 3 seconds |
| Assign lawyer | '\[Lawyer name\] assigned to case' | 3 seconds |
| Schedule hearing | 'Hearing scheduled for \[Date\]' | 4 seconds |
| Delete case | 'Case deleted. Undo?' | 6 seconds \+ undo |
| Create client | 'Client profile created' | 3 seconds |
| Create lawyer | 'Lawyer account created' | 3 seconds |

## **Error Messages**

| Trigger | Error Message Shown |
| :---- | :---- |
| Empty required field on submit | 'This field is required' |
| Invalid email format | 'Please enter a valid email address' |
| Hearing date in the past | 'Hearing date must be a future date' |
| Case title too short | 'Case title must be at least 5 characters' |
| API call fails (network) | 'Something went wrong. Please try again.' |
| Unauthorized action | 'You don't have permission to perform this action' |
| Client not found | 'Client record not found. It may have been deleted' |
| Session expired | 'Your session has expired. Please log in again.' |
| Duplicate email on client create | 'A client with this email already exists' |

## **Filters Implemented**

* **Text search across case title, case ID, and client name. Real-time, debounced 300ms.** Search:

* **Dropdown — All, Active, Pending, In Review, Urgent, Closed** Status Filter:

* **Dropdown — All, Civil Litigation, Criminal Law, Corporate, Family, Property** Case Type Filter:

* **Tabs — All Upcoming / This Week / All Cases** Hearing Filter (Hearings page):

* **Available on /cases — filter by assigned lawyer** Lawyer Filter:

* **Table columns sortable by Case ID, Filed Date, Next Hearing Date** Sort:

## **Dashboard Structure**

The dashboard is the landing page after login. It is structured in two tiers:

### **Tier 1 — Stat Cards (top row, 4 columns)**

* **— all cases in the system** Total Cases

* **— status \= Active, with urgent sub-count in red** Active Cases

* **— cases awaiting action** Pending

* **— hearings within the next 7 days** Hearings This Week

### **Tier 2 — Main Content (2-column grid)**

* **Recent Cases — table showing last 6 cases with status badges** Left panel (2/3 width):

* **Upcoming Hearings — timeline list sorted by date, with urgency color indicators** Right panel (1/3 width):

| 04 — UI/UX DESIGN Navigation · Emphasis · Visual alerts · Mobile responsiveness |
| :---- |

## **Primary Navigation Flow**

Navigation is a fixed left sidebar (260px) on desktop. The flow is linear: user lands on Dashboard and branches to any section via sidebar links. No drill-down breadcrumbs are needed for V1 — all detail is shown in modals.

| Nav Item | Icon | Route | Primary Action Available |
| :---- | :---- | :---- | :---- |
| Dashboard | ◈ | /dashboard | View stats, click to Cases or Hearings |
| Cases | ⚖ | /cases | Search, filter, create case, view detail |
| Clients | 👥 | /clients | Search, add client, view profile |
| Lawyers | 👔 | /lawyers | View team, add lawyer |
| Hearings | 🏛 | /hearings | View upcoming dates, filter by week |
| Reports | 📊 | /reports | Coming in V2 — disabled in V1 |
| Settings | ⚙ | /settings | Profile, firm settings, permissions |

## **Actions to Emphasise (CTA Hierarchy)**

### **Primary CTA — Gold filled button**

* '+ New Case' — always visible in topbar

* 'Create Case' — form submit

* 'Save Changes' — edit form submit

### **Secondary CTA — Ghost / outlined button**

* 'Add Client', 'Add Lawyer' — in their respective pages

* 'Schedule Hearing' — inside case detail

* 'Export', 'Filter' — utility actions

### **Destructive CTA — Red text, no fill**

* 'Delete Case' — requires confirmation dialog before executing

* 'Close Case' — status change to Closed, requires note

## **Visual Alerts & Urgency Indicators**

| Alert Type | Trigger Condition | Visual Treatment |
| :---- | :---- | :---- |
| Urgent case badge | Case status \= Urgent | Red badge with pulse dot in cases table |
| Hearing today | Hearing date \= today | 'Today' label in red — Hearings page |
| Hearing tomorrow | Hearing date \= tomorrow | 'Tomorrow' label in orange |
| Hearing ≤ 3 days | Days until hearing ≤ 3 | Red countdown label, red hearing date in table |
| Hearing ≤ 7 days | Days until hearing ≤ 7 | Orange countdown label |
| Hearing \> 7 days | Normal future date | Green or neutral label |
| Sidebar badge | Count of Urgent cases \> 0 | Red numeric badge on 'Cases' nav item |
| Empty state | No results from filter/search | Centered icon \+ helper text |
| Toast errors | API failures, validation errors | Red toast bottom-right, auto-dismiss 4s |
| Toast success | Successful create/update | Green toast bottom-right, auto-dismiss 3s |

## **Design System — Colour Tokens**

| Token Name | Hex Value | Usage |
| :---- | :---- | :---- |
| Navy / Background | \#0B1929 | App background, sidebar base |
| Navy Light | \#0F2236 | Cards, panels, table backgrounds |
| Gold Primary | \#C9A84C | CTA buttons, active nav, accents, logo |
| Gold Light | \#E8C96A | Hover states on gold elements |
| Slate | \#8A9BB0 | Secondary text, inactive nav items |
| Slate Dark | \#4A6080 | Tertiary text, labels, metadata |
| Cream | \#FAF7F0 | Primary body text on dark backgrounds |
| Status Green | \#3DB87A | Active status badge, success toasts |
| Status Orange | \#E8894A | Pending status, 7-day hearing warning |
| Status Red | \#E05252 | Urgent status, 3-day hearing alert, errors |
| Status Blue | \#4A90D9 | In Review status |

## **Typography**

| Element | Font | Weight | Size |
| :---- | :---- | :---- | :---- |
| Page Titles / Headings | Playfair Display | 600–700 | 22–32px |
| Body Text | DM Sans | 400 | 13–14px |
| Labels / Metadata | DM Sans | 500 | 11–12px |
| Case IDs / Code | Monospace (system) | 400 | 11px |
| Navigation Items | DM Sans | 400–500 | 14px |
| Stat Numbers | Playfair Display | 700 | 32px |
| Table Headers | DM Sans | 600 | 11px uppercase |

## **Mobile Responsiveness**

V1 targets desktop-first (law firm office use). Mobile is a stretch goal for V1 with the following breakpoint behaviour:

| Breakpoint | Behaviour |
| :---- | :---- |
| ≥ 1024px (Desktop) | Full sidebar \+ main content two-column layout as designed |
| 768–1023px (Tablet) | Sidebar collapses to icon-only mode (48px wide). Stats grid drops to 2 columns. |
| \< 768px (Mobile) | Sidebar hidden behind hamburger menu. Single-column layout. Tables scroll horizontally. Stat cards stack vertically. |

Minimum target: The app should be usable (not broken) on a tablet. Full native mobile experience is delivered separately by the Mobile Development track using React Native.

| 05 — MOBILE DEVELOPMENT React Native app · Screens · Navigation · Device features |
| :---- |

## **Tech Stack**

* **React Native (Expo managed workflow)** Framework:

* **React Navigation v6 — Bottom Tab Navigator \+ Stack Navigator** Navigation:

* **React Context API or Zustand for lightweight global state** State Management:

* **Axios — consumes the same REST API built by Backend track** API Layer:

* **JWT stored securely using expo-secure-store (not AsyncStorage)** Auth:

* **React Native Paper or custom component library matching Docket design tokens** UI Components:

* **Expo Notifications for hearing reminders (V1 stretch goal)** Push Notifications:

## **Mobile Screens — V1 Scope**

| Screen | Route / Stack | Description | Priority |
| :---- | :---- | :---- | :---- |
| Login | Auth Stack | Email \+ password login, JWT token stored on device | Must |
| Dashboard (Home) | Main Tab — Home | Stat cards (2x2 grid), upcoming hearings list, recent cases | Must |
| Cases List | Main Tab — Cases | Scrollable list with search bar, status filter chips, pull-to-refresh | Must |
| Case Detail | Cases Stack → Detail | Full case info, status badge, hearing date, lawyer, description | Must |
| Add New Case | Cases Stack → New Case | Form sheet — title, client picker, lawyer picker, type, status | Must |
| Clients List | Main Tab — Clients | Searchable client list with initials avatars | Must |
| Client Detail | Clients Stack → Detail | Profile card, linked cases count, contact actions (call/email) | Should |
| Lawyers Directory | Main Tab — Lawyers | Card list of lawyers with specialty and case count | Must |
| Hearings | Main Tab — Hearings | Upcoming hearings list with urgency colour strips, week filter toggle | Must |
| Settings / Profile | Settings Tab | User profile, logout, app version | Must |

## **Mobile Navigation Structure**

The mobile app uses a Bottom Tab Navigator as the primary navigation with 5 tabs:

* Home (Dashboard icon)

* Cases (briefcase icon) — with badge for Urgent case count

* Hearings (calendar icon) — with badge for this-week count

* Clients (people icon)

* Settings (cog icon)

Each tab has its own Stack Navigator for drill-down screens. Case Detail, Client Detail, and the New Case form are pushed onto their respective stacks.

## **Mobile-Specific UI Patterns**

| Pattern | Implementation |
| :---- | :---- |
| Status filter chips | Horizontally scrollable pill chips above the cases list (not a dropdown) |
| Urgency indicators | Left-border colour strip on case/hearing cards (red / orange / green) |
| Pull-to-refresh | All list screens support pull-to-refresh to re-fetch data |
| Empty states | Illustrated empty state with CTA button (e.g. '+ Add your first case') |
| Loading skeletons | Skeleton placeholder cards shown while API data loads |
| Bottom sheet | New Case and filters open as a slide-up bottom sheet, not a new screen |
| Haptic feedback | Light haptic tap on status change, success save actions |
| Toast / Snackbar | Bottom snackbar for success/error messages (auto-dismiss 3s) |
| Swipe actions | Swipe left on a case card to reveal 'Edit' and 'Change Status' shortcuts |

## **API Consumption**

The mobile app consumes the same REST API as the web frontend. No mobile-specific endpoints are needed for V1. Key integration points:

* All requests include Authorization: Bearer \<JWT\> header

* Token stored in expo-secure-store, refreshed on app resume

* Offline state: show last-cached data with 'You are offline' banner when no connection

* Error handling: network errors show a retry button; 401 errors redirect to Login screen

## **Mobile Track Presentation Checklist**

* React Native / Expo app running on simulator or physical device

* All 5 main tabs functional with real or mock data

* Login flow with JWT auth working end-to-end

* Case creation form functional (bottom sheet or screen)

* Urgency colour indicators working on cases and hearings lists

* Pull-to-refresh working on at least 2 list screens

* Screen recording / demo video prepared as backup

| 06 — PROJECT TIMELINE 4-week sprint plan to March 20–21 presentation |
| :---- |

## **Sprint Plan**

| Week | Dates | Focus | Deliverables |
| :---- | :---- | :---- | :---- |
| Week 1 | Mar 3–7 | Research, Architecture, Design | DB schema, wireframes (web \+ mobile), design system, project setup, PRD, Expo project scaffold |
| Week 2 | Mar 10–14 | Core Build | Auth, Cases CRUD, Clients CRUD, Lawyers module, API endpoints, Mobile: Login \+ Dashboard \+ Cases List |
| Week 3 | Mar 17–19 | Hearings, Filters, Polish | Hearings module, filters, dashboard stats, UI refinement, Mobile: Hearings \+ Clients \+ Settings \+ urgency indicators |
| Week 4 | Mar 20–21 | PRESENTATION | Demo build, slide deck, video walkthrough, technical docs, Mobile: final polish \+ demo recording |

## **Track Presentation Checklist**

### **Product Management**

* PRD document with problem statement, personas, V1 feature list

* User story map (as a \[persona\], I want to \[action\] so that \[outcome\])

* Success metrics defined (e.g. reduce missed hearings by 80%)

### **Backend Development**

* Working REST API deployed (local or hosted)

* Database with seeded sample data

* Postman collection or Swagger docs for all endpoints

### **Frontend Development**

* React app running with all 5 pages functional

* Connected to backend API (or mock data if backend not ready)

* Filter, search, modal flows all working

### **Mobile Development**

* React Native / Expo app running on simulator or physical Android/iOS device

* All 5 main tabs functional with real or seeded data

* Login flow with JWT auth working end-to-end

* Case creation form working (bottom sheet or dedicated screen)

* Urgency colour coding applied to cases and hearings list

* Screen recording or live device demo prepared as backup

### **UI/UX Design**

* Wireframes for all 5 core web screens AND key mobile screens

* Figma (or equivalent) design file with component library

* Design decisions document explaining color, type, layout choices

* Mobile-specific UI patterns documented (chips, bottom sheet, swipe)

### **Technical Writing**

* API documentation (endpoints, request/response examples)

* User manual — web version (create case, schedule hearing, etc.)

* User manual — mobile version (login, view cases, use hearings tab)

* README with setup instructions for web, API, and mobile app

| DOCKET — Built by Docket Capstone Team  |  Final Presentation: Friday 20 & Saturday 21 March 2026 Tracks: Product · Backend · Frontend · Mobile · UI/UX · Technical Writing |
| :---: |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABbCAYAAAAcNvmZAAADX0lEQVR4Xu2ZPWsUURSG01sIdmLAQhSNxiCRGE2iCa4oRkVTKAiiKUSiiDYpVLRSsFAQG7FS8APBzj8gCCL+qtEJZDf7nJ2dj5177sy954Wnu+frKZZld2ysofn77UJSFfayIBRWJ5wVZShFA+4QdHi8T7hbMOGhTYK7tjY8rMlw99aEh7QJ3tLocPk2wpsaFy4cAryxEeGSIcFbvYWLhQxvVw2XiQE6UAmXiAm6cBoOjxE6cRIOjRm6qTUcZjgSziFGD7oaORxg9KCrkcLmhoTOKoVNjWzornTY0MiG7kqFzYx86LBQ2MQoDl3mhg2M4tDl0LDYKA+dZoaFRnnodGBYZFSHbkVYYFSHbvvCx3WzbecB5/z5Kuf6hI674cO6Gd93SMhxxfravJjvAzruhg9ds3JpRkgiW9+/f346ObU4Ld4M48X6opirCR1vhI80KCub/Hh3TrzPgrWa0HUrZW+yY/eEqCOdzlFRpwVdt1p2yu8vy6KWTE5PiToNvItOqVN2CmsHwRotgpOdwvpBsEaDIGXfuDYrehDWaBCk7BT2IFdXjoka13gVneJLdtW+o2KyFQlS9uzcEdGH/Px4XtS5JkjZH152RB9y5f9s1rkmSNkp7DMI1rjGZCtishUx2YqYbEVMtiLRyt5zcFLUuCZa2c8enBQ1rglS9punS6IPYY0GQcretTf/X3zWaBCkbPYYBGs08Pozqy/Zn1+dETWuifbPA77XIEjZ39+eFT0IazQIUjbrCd9r0ZXtS3jdsvO+hazdOiFqNOgTHYLsu6tzonYrj+8viBot6LrVsllDto9PiBpN6HojfOSaIrJT9k8dTi5fnEke3p5PHt1bSFavHxdvsnj9ZEnM1YSOu+HDuqEIl9y56efzmdBxN3xYNxTigl+flsVcn9BxX/jYqA7dirDAqA7dDgyLjPLQaWZYaJSHToeGxUZx6DI3bGAUhy4LhU2MfOiwVNjMyIbuSocNjWzorlLY1JDQ2Uhhc6MHXY0cDjB60FUt4RDDkejNcFjM0I2TcGiM0InTcHhM0IVKuEQM0IFquEzI8HZv4WIhwVsbES4ZAryxceHCbYQ3NTpcvk3wltaEhzQZ7t7a8LAmwV2DCQ/1CXcLOjxeA+4QZSilTjjLglBYGdirKfkHrnXeXgJ3gT8AAAAASUVORK5CYII=>