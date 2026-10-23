# Modern Online Wedding Invitation

A modern, responsive, and customizable online wedding invitation web application built with **React 19**, **TypeScript 5.8**, and **Vite 8**. It features a multi-design template architecture with a live Design Studio customizer, elegant typography, offline resilience, and Google Calendar integration.

---

## ✨ Features

- **Multi-Design Template System**:
  - **Royal Champagne Filigree**: Golden filigree archway, swan lake illustration, scalloped vintage lace Quranic verse frame, and colon countdown.
  - **Crimson Velvet & Wax Seal**: Burgundy floral-lace envelope with embossed 3D gold heart wax seal and rising ivory parchment letter card.
  - **Botanical Sage Editorial**: Deep forest sage and bronze editorial magazine layout with architectural arch geometry.
  - **Classic Split-Wave**: Dual-panel desktop showcase with layered animated SVG waves and clean timeline.
- **Interactive Design Studio**: Slide-over drawer to switch templates in real time, customize color tokens, change typography pairings, and adjust countdown presentation styles.
- **Optional Love Story Video & Quranic Message Fallback**: Provide an optional video URL or let the invitation automatically display a Quranic verse in Arabic calligraphy (*Surah Ar-Rum 30:21*).
- **Personalized Guest Salutation**: Automatically personalizes the invitation via URL query parameters (e.g., `?to=Guest+Name`).
- **Interactive Features**:
  - Background audio player with smooth fade and offline pause
  - Confetti celebration on opening
  - Countdown timer to the wedding date
  - One-click Google Calendar integration
  - Interactive image lightbox modal with download capability
  - Auto and dark/light theme toggle

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- `npm`

### Installation

```bash
# Clone the repository
git clone https://github.com/Ahmedhassanin12/wedding.git

# Navigate to the project directory
cd wedding

# Install dependencies
npm install
```

### Local Development

Start the Vite development server with hot-module replacement:

```bash
npm run dev
```

Open your browser at `http://localhost:8080`.

---

## 🛠️ Verification & Testing

Run the automated test suite and code quality linters:

```bash
# Run unit and integration tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Run JavaScript/TypeScript linter
npm run lint:js

# Run CSS linter
npm run lint:css

# Run HTML linter
npm run lint:html

# Check for circular dependencies
npm run circular
```

---

## 🌐 Deployment to Vercel

This repository includes a preconfigured `vercel.json` file for automated deployment:

```json
{
  "buildCommand": "npm run build:public",
  "outputDirectory": "public"
}
```

### Deploying via Vercel Dashboard

1. Import your repository into Vercel.
2. In **Build and Output Settings**:
   - **Build Command**: `npm run build:public`
   - **Output Directory**: `public`
3. Click **Deploy**.

---

## ⚙️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript 5.8
- **Bundler & Dev Server**: Vite 8
- **Testing**: Vitest + Testing Library
- **UI & Grid**: Bootstrap 5.3
- **Icons**: Font Awesome 7.1
- **Animations**: AOS 2.3 & Canvas Confetti 1.9
- **Fonts**: Cormorant Garamond, Playfair Display, Josefin Sans, Noto Naskh Arabic

---

## 📜 License

This project is open-sourced under the [MIT License](LICENSE).
