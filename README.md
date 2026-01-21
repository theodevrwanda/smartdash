# 📊 SmartDash - Super Admin Infrastructure

SmartDash is a premium, high-performance administrative control center designed for the **SmartStock** ecosystem. It provides system administrators and collaborators with real-time oversight of business registrations, financial transactions, and platform health.

## 🌟 System Overview

SmartDash serves as the "brain" of SmartStock, offering a centralized interface to:
- **Monitor Growth:** Track business onboarding and user registrations via interactive Recharts dashboards.
- **Financial Oversight:** Audit every transaction, subscription renewal, and payment across the platform.
- **Account Management:** Approve, deactivate, or manage business profiles and their associated branches.
- **Security & Auditing:** Maintain a comprehensive log of all administrative actions for transparency and security.
- **Role-Based Access:** Support for multiple administrator tiers and regional collaborators.

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note:** These variables are required for Firebase Authentication and Firestore database connectivity.

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository-url>
cd smartdash
npm install
```

### 3. Setup Environment
Create a `.env` file in the root directory and paste your Firebase configuration (as shown in the section above).

### 4. Run Development Server
Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist/` folder.

---

## 🛠 Tech Stack

- **Core:** React 19 + Vite
- **Styling:** Tailwind CSS (Custom Premium Theme)
- **Database/Auth:** Google Firebase
- **Icons:** Lucide React
- **Analytics:** Recharts

---

## ☕ Support the Developer

If you find this project helpful or want to support my work in building innovative software solutions for the Rwanda tech ecosystem, consider buying me a coffee!

<a href="https://buymeacoffee.com/theodevrwanda" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

**Theogene Iradukunda (theodevrwanda)**
*Founder @ RwandaScratch*

---
© 2026 RwandaScratch. All rights reserved.
