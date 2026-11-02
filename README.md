# Ek Sathe Jabo — Bangladesh Bus Ticket Booking Platform
> **Tagline:** "Travel Smart, Ek Sathe Jabo"  
> **Brand Mission:** Connecting intercity passengers, bus operators, and travel agencies across all 64 districts of Bangladesh with real-time seat inventory, verified coaches, and instant QR e-tickets.

---

## 🚌 Overview

**Ek Sathe Jabo** is a production-minded, full-stack Bangladesh-based bus ticket booking SaaS platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Firebase (Authentication, Cloud Firestore, Storage, and Security Rules)**.

The system is designed specifically for the transportation ecosystem of Bangladesh, supporting primary highways (Dhaka ⇄ Chattogram, Cox's Bazar, Sylhet, Rajshahi, Khulna via Padma Bridge, Barishal, Rangpur, and Cumilla), verified coach operators (Green Line, Shohagh, Hanif, Shyamoli, Desh Travels, Saintmartin), and local MFS payment gateways (bKash, Nagad, Rocket, NexusPay, Cards).

---

## 🌟 Key Features

### 1. 🏠 Homepage & Search
- **Responsive Sticky Navigation:** Official branding, 24/7 hotline (`16234`), language toggle (English / বাংলা), 1-click demo persona switcher, and responsive mobile drawer.
- **Hero Showcase:** Official high-fidelity visual artwork featuring Bangladesh national landmarks, map, luxury coach, and mobile app mockup.
- **Interactive Bus Search Form:** Searchable cities, date picker with past-date prevention, origin-destination conflict prevention, passenger counter, and 1-click swap.
- **Popular Routes Showcase:** Dhaka ⇄ Chattogram, Cox's Bazar, Sylhet, Rajshahi, Khulna, and Barishal with starting fares and duration.
- **Authorized Operator Fleet:** Profiles for Green Line, Shohagh, Hanif, Shyamoli, Desh Travels, and Saintmartin Paribahan.
- **4-Step Visual Journey:** 1. Select Route ➔ 2. Choose Seat ➔ 3. Pay Securely ➔ 4. Get Your Ticket.
- **Promotional Coupons Section:** Live coupons (`FIRST50`, `SAVE100`, `TRAVEL10`) with copy-to-clipboard action and server-side validation.
- **Testimonials & Trust Badges:** Verified passenger stories and safety guarantees.

### 2. 🔍 Bus Search Results (`/search`)
- Live filtering by:
  - **Bus Type:** AC / Non-AC / All
  - **Coach Category:** Sleeper Coach / Business Class / Executive Chair / Economy Seater
  - **Departure Time:** Morning (6 AM - 12 PM), Noon (12 PM - 6 PM), Night (6 PM - 6 AM)
  - **Operator:** Filter by specific bus operator
  - **Price Range:** Interactive slider (৳300 to ৳3,000)
  - **Amenities:** High-Speed Wi-Fi, USB Charging Outlets, Mineral Water, Soft Blanket
- Sorting:
  - Cheapest Fare
  - Earliest Departure
  - Latest Departure
  - Top Rated
- Bus cards with real-time seat counters, boarding points, duration, and direct "View Seats" CTA.

### 3. 💺 Interactive Seat Selection (`/bus/[tripId]/seats`)
- **Realistic Coach Layout:** Driver steering cabin at front right, entrance door indicator, 2x2 or 2x1 sleeper layout, and aisle labels.
- **Color Legend:**
  - ⚪ **Available:** White with blue border
  - 🟠 **Selected:** Orange with checkmark
  - 🔘 **Booked:** Gray (disabled)
  - 🟡 **Reserved / Held:** Yellow with lock
  - 🌸 **Ladies Seat:** Pink with female indicator
- **Double-Booking Prevention & Hold Mechanism:**
  - 5-minute temporary seat hold with live countdown clock (`Timer`).
  - Automatic expiration and inventory release back to available pool.
  - Multi-seat selection (up to 4 seats per booking).
  - Live subtotal and service fee computation.

### 4. 📝 Passenger Details (`/booking/passengers`)
- React Hook Form + Zod validation.
- Bangladesh phone number validation (`^(?:\+?880|0)1[3-9]\d{8}$`).
- Co-passenger names for multi-seat bookings.
- Boarding and dropping point selection.
- Promo coupon code applicator with real-time discount calculation.

### 5. 💳 Payment Gateway Architecture (`/booking/payment`)
- Supported channels:
  - **bKash** (Account, OTP, PIN simulation)
  - **Nagad** (Account, OTP, PIN simulation)
  - **Rocket** (Account, OTP, PIN simulation)
  - **Debit / Credit Cards** (Visa, Mastercard, Amex)
  - **Fast 1-Click Simulated Payment** (Auto-Approve for testing)
- **Strict Server-Side Verification (`/api/payments/verify`):**
  - Amount and currency validation.
  - Idempotent transaction verification.
  - Permanent seat locking in coach inventory.
  - Status updated to `VERIFIED` and booking to `CONFIRMED`.

### 6. 🎟️ Digital E-Ticket & Conductor Verification (`/booking/confirmation` & `/verify/[bookingRef]`)
- High-fidelity printable and downloadable E-Ticket.
- Unique booking reference (e.g., `ESJ-2026-X9K4`).
- **Authentic Scannable QR Code** linking to `/verify/[bookingRef]`.
- Conductor boarding portal to verify ticket validity, passenger manifest, and mark boarding check-in.

### 7. 👤 User Dashboard (`/dashboard`)
- Upcoming trips with direct E-Ticket view and cancellation request.
- Booking history and past trips.
- Ticket & PNR direct lookup tool.
- Customer support ticket creation and reply history.
- Profile settings and language switcher.

### 8. 🛡️ Admin Dashboard (`/admin`)
- Real-time business metrics (Revenue, Bookings, Passengers, Active Operators).
- Modules:
  - **Booking Management:** Search, status filtering, details inspection.
  - **Schedule Management:** Create new trips, assign bus & operator, departure date/time, ticket fare, and auto-generated seat layouts.
  - **Operator Management:** Operator directory and statuses.
  - **Fleet Management:** Bus registration numbers, types, seat capacities.
  - **Route Management:** Distances, boarding/dropping points, base fares.
  - **Coupons Management:** Create and toggle promotional discount codes.
  - **Customer Support Desk:** View inquiries and reply directly.
  - **Reports & CSV Export:** 1-click booking data download.

### 9. 🚚 Operator Portal (`/operator`)
- Fleet management for assigned operator (e.g., Green Line Paribahan).
- Trip manifests showing real passenger lists, seats, and contact info.
- 1-click boarding check-in for passengers.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Forms & Validation** | React Hook Form + Zod |
| **QR Code Engine** | qrcode.react (SVG rendering) |
| **Celebration FX** | canvas-confetti |
| **Backend / DB** | Firebase Client SDK + Cloud Firestore + Storage |
| **Security** | Production Firestore Security Rules (`firestore.rules`) & Storage Rules (`storage.rules`) |

---

## 📂 Project Structure

```
ek-sathe-jabo/
├── public/
│   ├── assets/
│   │   ├── logo.png             # Official Ek Sathe Jabo Logo
│   │   └── hero-banner.jpg      # Official Hero Visual Art
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Root Layout with AuthProvider
│   │   ├── globals.css          # Theme tokens & custom scrollbars
│   │   ├── search/              # Bus search & filters page
│   │   ├── bus/[tripId]/seats/  # Interactive coach seat selector
│   │   ├── booking/
│   │   │   ├── passengers/      # Passenger details form & coupons
│   │   │   ├── payment/         # Payment checkout & MFS simulation
│   │   │   └── confirmation/   # Printable E-Ticket with QR code
│   │   ├── verify/[bookingRef]/ # Conductor ticket verification
│   │   ├── login/               # Authentication & Demo switcher
│   │   ├── register/            # Passenger registration
│   │   ├── forgot-password/     # Password reset
│   │   ├── dashboard/           # Passenger dashboard
│   │   ├── admin/               # Super Admin control center
│   │   ├── operator/            # Bus operator management portal
│   │   └── api/
│   │       └── payments/verify/ # Server-side payment verification API
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   └── booking/             # SearchForm
│   ├── lib/
│   │   ├── auth/                # AuthContext with 1-click demo personas
│   │   ├── data/                # Bangladesh cities, routes, operators seed
│   │   ├── firebase/            # Firebase client config
│   │   ├── i18n/                # English / বাংলা translation dictionary
│   │   └── services/            # DataService (trips, holds, bookings, admin)
│   └── types/                   # Complete TypeScript interfaces
├── firestore.rules              # Production-grade Firestore Security Rules
├── storage.rules                # Firebase Storage Security Rules
├── firebase.json                # Firebase configuration
├── firestore.indexes.json       # Composite query indexes
├── .env.example                 # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd C:\ek-sathe-jabo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 👥 Demo Accounts & Testing Personas

The platform includes a built-in **1-Click Demo Persona Switcher** located in the top bar of the website. You can also log in directly via `/login`:

| Persona | Email | Password | Role / Access |
|---|---|---|---|
| **Passenger** | `passenger@eksathejabo.com` | `123456` | Passenger dashboard, bookings, tickets |
| **Operator** | `operator@greenline.com` | `123456` | Green Line fleet, manifests, check-ins |
| **Super Admin** | `admin@eksathejabo.com` | `123456` | Full administrative control, route creator |

### 🏷️ Active Promo Coupons
- `FIRST50`: Flat ৳50 discount for first-time bookings (Min. purchase ৳500).
- `SAVE100`: Flat ৳100 discount on bookings of ৳1,000 or more.
- `TRAVEL10`: 10% instant discount up to ৳250 on bookings of ৳800 or more.

---

## 🔒 Firebase Security Rules Summary

The application includes hardened rules in `firestore.rules` and `storage.rules`:
- **Role Isolation:** Non-admins cannot elevate their role to `admin` or `operator`.
- **Booking Immutability:** Passengers cannot alter `paymentStatus` or `bookingStatus` from the client.
- **Double-Booking Protection:** Holds expire automatically and cannot overlap.
- **PII Protection:** Passengers can only read their own bookings; operators only see their assigned manifests.
- **Default Deny:** Unspecified collections are closed by default.

To deploy rules to Firebase:
```bash
firebase deploy --only firestore:rules,storage
```

---

## 🚢 Deployment

### Deploying to Vercel
1. Push the code to a GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete Ek Sathe Jabo platform"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Import the project in [Vercel](https://vercel.com).
3. Add the environment variables from `.env.example` in the Vercel project settings.
4. Deploy!

---

## 📄 License & Rights

© 2026 Ek Sathe Jabo Ltd. All rights reserved.  
Built for the passengers and coach operators of Bangladesh.
