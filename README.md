<div align="center">

# 🚀 SHIFT (shiftFinance)

### *Financial Security for People Who Earn Differently*

[![React](https://img.shields.io/badge/Frontend-React_18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/Auth-JWT_&_Bcrypt-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <b>A full-stack financial wellness and cash-flow platform tailor-made for India's gig workers, delivery partners, drivers, and freelancers.</b>
</p>

[Explore Capabilities](#-what-shift-does) • [Scope & Disclaimers](#-what-shift-does-not-do) • [Scoring Algorithm](#-financial-health-score-algorithm) • [Tech Architecture](#️-architecture--tech-stack) • [Installation Guide](#-getting-started) • [API Specs](#-api-reference)

---

</div>

## 📌 Executive Summary

Traditional retail banking and credit models are built on a single, outdated assumption: **a fixed, predictable monthly salary slip**.

India's gig economy represents millions of delivery partners, cab and auto drivers, freelance specialists, and home-service professionals whose income changes daily, fluctuates seasonally, and comes from multiple disparate sources. One medical emergency or vehicle breakdown can wipe out months of progress.

**SHIFT** solves this fundamental disconnect. It is a full-stack financial intelligence application designed to help gig workers record multi-platform earnings, cushion against lean weeks, grow emergency pots, calculate realistic loan EMIs, and understand their financial resilience through a transparent **Health Score**.

---

## 🎯 What SHIFT Does (Core Capabilities)

SHIFT provides a comprehensive suite of financial management tools engineered specifically around volatile income streams:

### 1. 💼 Dynamic Multi-Source Income & Expense Hub (`/money`)
* **Multi-Platform Earning Records**: Log income in seconds with categorized sources (Delivery work, Driving, Freelance projects, Other).
* **Granular Expense Tracking**: Categorize daily operational expenses (Fuel, Vehicle maintenance, Phone recharges, Food, Rent, Family).
* **Multi-Period Analytics**: Compare income and spending against previous weeks and rolling 6-month historical trends.
* **Instant Filtering & Search**: Filter transactions by date range, income vs. expense, category, or keyword queries with dynamic totals.
* **Full Data Ownership**: Add, edit, and delete any transaction record directly connected to the MongoDB Atlas database.

### 2. 🎯 Targeted Savings Pots & Goal Planning (`/save`)
* **Purpose-Driven Pots**: Create earmarked savings pots for *Emergency Funds*, *Vehicle Repairs*, *Smartphone Upgrades*, *Education*, or *Family Needs*.
* **Micro-Deposits & Withdrawals**: Seamlessly deposit surplus cash into specific pots or withdraw money back into spendable cash flow.
* **Daily & Weekly Target Calculator**: Input a desired target amount and deadline to compute the exact daily and weekly savings required to achieve it.
* **Visual Progress Trackers**: Instant percentage-based completion metrics for each goal.

### 3. 📊 Algorithmic Financial Health Score (`/health`)
* **100-Point Transparent Metric**: A proprietary financial score built for variable earners rather than traditional salaried credit scoring.
* **Component-by-Component Breakdown**: Real-time evaluation of Savings Rate (30 pts), Spending vs. Income (25 pts), Emergency Coverage (25 pts), and Income Consistency (20 pts).
* **Tailored Coaching & Action Items**: Identifies the user's highest non-essential expenditure and flags high income volatility with actionable tips for lean weeks.

### 4. 💳 Credit Readiness & EMI Protection Simulator (`/credit`)
* **Alternative Credit Readiness Checklist**: 5-point self-assessment checklist (persisted to the user's profile in the database) preparing workers for formal borrowing without relying on salary slips.
* **Insurance Protection Checklist**: 4-point risk assessment covering accident cover, income loss buffers, health coverage, and asset protection.
* **Reducing-Balance EMI Calculator**: Calculate estimated monthly installments, total repayment amount, and total interest for potential vehicle or personal loans.

### 5. 🤖 Context-Aware Financial Assistant ("Ask SHIFT") (`/ask`)
* **Interactive Guidance**: Answers critical gig-worker financial questions in plain, accessible language without financial jargon.
* **User-Data Aware**: Calculates the user's actual 4-week rolling average income to give personalized weekly savings targets (e.g., 10–15% recommendations).
* **Pre-Set Scenario Chips**: Quick shortcuts for emergency fund planning, dealing with sudden income drops, vehicle maintenance budgeting, and EMI basics.

### 6. 🧪 One-Click Interactive Sandbox Simulation
* **Instant Sample Data Seeding**: Users and evaluators can click **"Load sample data"** on the dashboard to populate realistic multi-month gig transactions and active goals.
* **Clean Reset**: A single click on **"Clear sample data"** purges all demo transactions while keeping real user data intact.

### 7. 🔐 Secure User Authentication & Profile Customization
* **Tailored Onboarding**: Captures gig work category (*Delivery partner, Cab/bike driver, Freelancer, Home-service professional, Creator, etc.*) and monthly earnings bracket.
* **Encrypted Security**: Passwords hashed using bcrypt; authenticated sessions handled through cryptographically signed JSON Web Tokens (JWT).

### 8. 📩 Direct Feedback & Support Pipeline (`/help`)
* **Integrated Support Desk**: Contact form saving inquiries and feedback directly to the backend database via MongoDB Mongoose models.

---

## 🚫 What SHIFT Does NOT Do (Explicit Boundaries & Disclaimers)

To ensure regulatory clarity, transparent expectations, and user safety, the following items are **explicitly out of scope** or **not supported**:

| ❌ Limitation / Non-Feature | 🔍 Explanation & Boundary |
| :--- | :--- |
| **NOT a Licensed Bank or NBFC** | SHIFT is an academic and educational concept platform. It does not hold an RBI banking license, does not hold deposit accounts, and does not disburse regulated credit. |
| **NO Real Banking Transactions or UPI Transfers** | SHIFT does **not** initiate real-money bank transfers (UPI, IMPS, NEFT, RTGS). Adding money to or withdrawing from a "Savings Pot" updates internal tracking records only. |
| **NO Direct Loan Approvals or Underwriting** | The Credit Readiness checklist and EMI calculator are educational tools. SHIFT does not issue loans, partner with loan sharks, or guarantee any credit line approvals. |
| **NO Formal Credit Bureau Reporting** | SHIFT does **not** pull or report credit scores to bureaus like CIBIL, Experian, Equifax, or CRIF High Mark. |
| **NO Insurance Brokerage or Policy Issuance** | SHIFT does not sell insurance policies, underwrite risk, collect insurance premiums, or process insurance claims. |
| **NEVER Asks for Sensitive Banking Credentials** | SHIFT strictly **never** collects, requires, or stores Aadhaar cards, PAN cards, UPI PINs, ATM PINs, CVVs, or online banking passwords. |
| **NO Regulated Financial Advice** | SHIFT does **not** provide SEBI-registered financial advisory, wealth management, or stock/crypto trading recommendations. |
| **NO Automated Gig-App Webhook Scraping** | Transactions are recorded manually or via sample seeding; SHIFT does not currently scrape or connect to live driver APIs (e.g., Zomato, Swiggy, Uber, Ola, Urban Company). |

---

## 🧮 Financial Health Score Algorithm

Unlike traditional credit scores that penalize variable earners, SHIFT assesses financial health using a four-pillar model evaluated over a rolling 3-month and 8-week horizon:

```
Total Financial Health Score = S_rate + S_ratio + S_cover + S_consistency   (Max: 100)
```

| Pillar | Max Pts | Weight | Mathematical Condition | Rationale for Gig Earners |
| :--- | :---: | :---: | :--- | :--- |
| **Savings Rate** | 30 | 30% | $\text{Score} = \text{clamp}\left(\frac{\text{Rate}}{0.20}\right) \times 30$ | Full points awarded when $\ge 20\%$ of 3-month net income is retained. |
| **Spending Ratio** | 25 | 25% | $\text{Score} = \text{clamp}\left(\frac{1 - \text{Ratio}}{0.50}\right) \times 25$ | Full points awarded when total expenses stay $\le 50\%$ of earnings. |
| **Emergency Coverage** | 25 | 25% | $\text{Score} = \text{clamp}\left(\frac{\text{Months Covered}}{3.0}\right) \times 25$ | Evaluates savings in emergency pots against 3 months of essential spending. |
| **Income Consistency** | 20 | 20% | $\text{Score} = \text{clamp}(1 - CV) \times 20$ | Measures Coefficient of Variation ($CV = \frac{\sigma}{\mu}$) over 8 rolling weeks; steadier cash flow scores higher. |

### 💡 Dynamic Coaching Logic
* If **Emergency Coverage < 3 months**: Prompts the user to prioritize building their emergency fund to an exact target in INR.
* If **Savings Rate < 10%**: Recommends micro-saving habits (e.g., setting aside ₹50–₹100 daily).
* If **Spending Ratio > 80%**: Analyzes the highest non-essential expense (*Entertainment, Shopping, Other*) and advises cutbacks.
* If **Income Volatility ($CV$) > 40%**: Recommends building surplus reserves during high-earning festival/peak weeks to cushion off-peak drops.

---

## 🛠️ Architecture & Tech Stack

```
 ┌────────────────────────────────────────────────────────┐
 │                   SHIFT Client (React 18)              │
 │   Vite 5 • HashRouter • Vanilla CSS Design System      │
 │   AuthContext (JWT State) • DataContext (Analytics)    │
 └──────────────────────────┬─────────────────────────────┘
                            │ HTTP / REST (Bearer JWT)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                 SHIFT Server (Express.js)              │
 │   Node.js • CORS • Error Middleware • JWT Verification  │
 ├────────────────────────────────────────────────────────┤
 │ Controllers: authController • transactionController    │
 │              goalController • contactController        │
 └──────────────────────────┬─────────────────────────────┘
                            │ Mongoose ODM
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                 MongoDB Atlas Database                 │
 │   Collections: Users • Transactions • Goals • Messages │
 └────────────────────────────────────────────────────────┘
```

### Component Details

| Layer | Technologies & Packages | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, React Router DOM v6, Vite 5 | High-performance SPA, mobile-first design, custom charts, modal popups, and toast alerts. |
| **Styling** | Pure Vanilla CSS (`index.css`) | Curated dark-slate slate design system, responsive grid layouts, and zero heavy CSS bloat. |
| **Backend API** | Node.js, Express.js (v4.21) | MVC architecture, RESTful routing, centralized error handlers, and security middleware. |
| **Database** | MongoDB Atlas, Mongoose (v8.9) | Document models with data sanitization, schema constraints, and compound indexing. |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` | Stateless authentication, salt-hashed passwords, and route-level bearer token protection. |

---

## 📂 Project Directory Structure

```text
shift-website/
├── README.md                      # Project documentation and specifications
├── .gitignore                     # Git ignore rules for node_modules and secrets
├── backend/                       # Express.js REST API
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas Mongoose connection helper
│   ├── controllers/
│   │   ├── authController.js      # Register, login, user profile & checklists
│   │   ├── transactionController.js # Transaction CRUD & sample data seeding
│   │   ├── goalController.js      # Savings pots CRUD & deposit/withdraw logic
│   │   └── contactController.js   # Contact form submission processor
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification & route protection
│   │   └── errorMiddleware.js     # 404 handler & centralized error responder
│   ├── models/
│   │   ├── User.js                # User schema (work type, income, checklists)
│   │   ├── Transaction.js         # Income/expense transactions with indexes
│   │   ├── Goal.js                # Savings goals & progress tracking schema
│   │   └── ContactMessage.js      # User inquiry message storage schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── transactionRoutes.js   # /api/transactions routes
│   │   ├── goalRoutes.js          # /api/goals routes
│   │   └── contactRoutes.js       # /api/contact routes
│   ├── .env.example               # Backend environment variables template
│   ├── package.json               # Backend dependencies & npm scripts
│   └── server.js                  # Application entry point & health check
└── frontend/                      # React SPA (Vite)
    ├── index.html                 # Main HTML entry template
    ├── vite.config.js             # Vite config with backend API proxy (/api -> :5000)
    ├── package.json               # Frontend dependencies & scripts
    └── src/
        ├── main.jsx               # React DOM bootstrapping
        ├── App.jsx                # Route definitions & public/protected guards
        ├── index.css              # Custom responsive stylesheet & design system
        ├── assests/
        │   └── shiftLogo.png      # SHIFT brand emblem
        ├── components/
        │   ├── Header.jsx         # Responsive navbar with auth state awareness
        │   ├── Footer.jsx         # Footer with quick links & academic notice
        │   ├── BarChart.jsx       # Custom SVG-based bar chart for monthly comparisons
        │   ├── Modal.jsx          # Dynamic modal form dialog for transactions/goals
        │   └── Toast.jsx          # Ephemeral floating notification component
        ├── context/
        │   ├── AuthContext.jsx    # Authentication provider & profile state
        │   └── DataContext.jsx    # Transactions, goals, math helpers & AI assistant
        ├── services/
        │   └── api.js             # Unified Fetch wrapper with Bearer token handling
        └── pages/
            ├── Home.jsx           # Landing hero, value props, FAQs & preview
            ├── About.jsx          # Mission statement & gig economy problem thesis
            ├── Dashboard.jsx      # Financial summary, quick actions & sample loader
            ├── Money.jsx          # Transaction history, search & monthly charts
            ├── Savings.jsx        # Savings pots, deposit modal & goal calculator
            ├── Health.jsx         # Health score breakdown & actionable coaching
            ├── Credit.jsx         # Credit readiness checklists & EMI calculator
            ├── Ask.jsx            # Context-aware financial assistant with prompt chips
            ├── Help.jsx           # FAQ accordions & MongoDB contact form
            ├── Login.jsx          # Existing member login screen
            ├── Signup.jsx         # New worker onboarding with role & income bracket
            ├── Privacy.jsx        # Data privacy disclosure
            └── Terms.jsx          # Platform usage terms & educational disclaimer
```

---

## 🚀 Getting Started

Follow the steps below to run both the backend server and frontend client locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* [npm](https://www.npmjs.com/) (bundled with Node.js)
* A [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI (or local MongoDB server)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/kachhadiyajanvi/shiftFinanace.git
cd shiftFinanace
```

---

### Step 2: Configure & Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your actual MongoDB connection string and a secret key:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shift_db?retryWrites=true&w=majority
   JWT_SECRET=shift_super_secret_jwt_key_2026
   NODE_ENV=development
   ```

5. Launch the backend server:
   ```bash
   # Development mode with auto-reload:
   npm run dev

   # Or standard production start:
   npm start
   ```
   *The server runs on **http://localhost:5000** with the health check available at `http://localhost:5000/api/health`.*

---

### Step 3: Configure & Start the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   *(Requests to `/api` are automatically proxied to the backend on `http://localhost:5000` via Vite configuration).*

---

### Step 4: Explore with the Interactive Sandbox

1. Go to the **Sign Up** page (`/#/signup`) and create an account (e.g. Work: *Delivery partner*, Income: *₹15,000 – ₹30,000*).
2. On your **Dashboard**, click the **"Load sample data"** button.
3. This immediately populates your account with realistic gig transactions across multiple months and sets up pre-configured savings pots.
4. Visit the **Money**, **Savings**, and **Health** pages to explore all charts, algorithms, and coaching tips.
5. Click **"Clear sample data"** at any point to reset your account.

---

## ⚙️ Environment Variables Reference

The backend uses the following environment variables (stored in `backend/.env`):

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | Port on which the Express server listens. |
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas connection string with database name. |
| `JWT_SECRET` | **Yes** | — | Private key used to sign and verify JSON Web Tokens. |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`). |

---

## 📡 API Reference

All protected routes require a Bearer token in the `Authorization` header:  
`Authorization: Bearer <your_jwt_token>`

### 1. System Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | Returns server status, database connection state, and timestamp. |

### 2. Authentication & User Profile
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Create a new user with name, email, password, work, and income bracket. |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return a signed JWT token. |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile and saved checklists. |
| `PUT` | `/api/auth/checklist` | Protected | Toggle credit readiness or insurance checklist items (`key`, `checked`). |

### 3. Transactions (Cash Flow & Income Hub)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/transactions` | Protected | Retrieve all transactions for the authenticated user (sorted by date desc). |
| `POST` | `/api/transactions` | Protected | Add a new transaction (`type`: 'in'\|'ex', `amt`, `date`, `cat`, `desc`). |
| `PUT` | `/api/transactions/:id`| Protected | Update an existing transaction record. |
| `DELETE` | `/api/transactions/:id`| Protected | Remove a transaction record by its ID. |
| `POST` | `/api/transactions/sample` | Protected | Seed 20+ realistic sample transactions spanning recent months. |
| `POST` | `/api/transactions/clear-sample` | Protected | Delete all seeded sample transactions for the current user. |

### 4. Savings Goals & Pots
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/goals` | Protected | Retrieve all savings goals for the user. |
| `POST` | `/api/goals` | Protected | Create a new savings goal (`name`, `target`, `saved`, `date`). |
| `PUT` | `/api/goals/:id` | Protected | Update goal details (name, target, or target date). |
| `DELETE` | `/api/goals/:id` | Protected | Delete a savings goal. |
| `POST` | `/api/goals/:id/add` | Protected | Deposit funds into a goal pot (`amount`). |
| `POST` | `/api/goals/:id/withdraw` | Protected | Withdraw funds from a goal pot (`amount`). |

### 5. Support & Inquiries
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/contact` | Public | Submit a contact or help inquiry message (`name`, `email`, `message`). |

---

## 👥 Target Personas & Use Cases

| Persona | Typical Profile | Primary Value Received from SHIFT |
| :--- | :--- | :--- |
| **🛵 Quick-Commerce & Food Delivery** | Zomato, Swiggy, Zepto, Blinkit partners | Tracks daily fluctuating payouts, records fuel/maintenance expenses, and builds emergency repairs buffer. |
| **🚖 Ride-Hailing Drivers** | Uber, Ola, Rapido drivers | Calculates vehicle loan EMI burden against weekly net earnings; tracks CNG/petrol outlays. |
| **💻 Digital Freelancers** | Designers, developers, translators | Manages project milestone invoices, smooths out dry/lean months, and tracks tax/savings buffers. |
| **🔧 On-Demand Home Pros** | Electricians, plumbers, salon partners | Sets aside small daily amounts towards toolkit upgrades and family safety nets. |

---

## 🛡️ Security, Privacy & Design Principles

1. **Zero Financial Credential Collection**: We never store, process, or ask for payment credentials, banking passwords, PINs, or government identity tokens.
2. **Transparent Mathematical Formulas**: Every calculation on the platform—from loan EMIs to financial health scores—explains its methodology and assumptions openly.
3. **Encrypted Passwords**: Passwords are never saved in plaintext; they are salted and hashed using `bcryptjs` before persisting to MongoDB Atlas.
4. **Resilient Offline-First UX**: Responsive, lightweight CSS ensures the dashboard loads quickly even on slower 3G/4G mobile connections used in the field.

---

## 📄 License & Attribution

This project is developed under the **ISC License**.  
Academic concept & prototype designed to explore financial resilience solutions for the Indian gig economy.

---

<div align="center">
  <sub>Built with ❤️ for India's hardworking gig workforce.</sub>
</div>
