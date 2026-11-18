# ResumeSynth Pro 🚀

A powerful, accessible AI-powered resume optimization tool built with **React 19**, **TypeScript**, **Vite 6**, and **Tailwind CSS v4**.

## ✨ Features

- **ATS Scoring Engine** — Weighted scoring across 6 role presets (Backend, Full-Stack, AI/ML, DevOps, Analytics, Product Manager)
- **Vocabulary Gap Map** — Identifies missing keywords from job descriptions
- **STAR Bullet Optimizer** — Transforms weak bullet points into impact-driven statements
- **Resume Health Section** — Detects and flags common resume issues
- **Live Resume Editor** — Real-time preview with keyword highlighting
- **Interview Prep Radar** — AI-generated interview questions with timer
- **Application Tracker** — Kanban-style job application tracker
- **Export Modal** — Export resume as plain text or formatted copy

## ♿ Accessibility

Built with full WCAG 2.1 AA compliance:
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- Skip-to-content link
- All interactive elements keyboard accessible
- `aria-live` regions for dynamic content
- Focus-visible outlines
- `prefers-reduced-motion` support
- Minimum 44×44px tap targets
- Color + icon + text for status indicators (never color alone)

## 🛠️ Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| TypeScript | 5.x |
| Vite | 6 |
| Tailwind CSS | 4 |
| Lucide React | latest |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/resumesynth-pro.git

# Navigate into the project
cd resumesynth-pro

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder — ready to deploy on Vercel, Netlify, or any static host.

### Deploy to Vercel (one click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📁 Project Structure

```
resumesynth-pro/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── tailwind.config.js
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # Root component & layout
    ├── index.css             # Global styles + Tailwind
    ├── types.ts              # TypeScript interfaces
    ├── components/
    │   ├── Header.tsx
    │   ├── Sidebar.tsx
    │   ├── HeroSection.tsx
    │   ├── InputWorkspace.tsx
    │   ├── ScoreRing.tsx
    │   ├── SignalGraph.tsx
    │   ├── VocabularyGapMap.tsx
    │   ├── StarBulletOptimizer.tsx
    │   ├── ResumeHealthSection.tsx
    │   ├── ResumeEditorLivePreview.tsx
    │   ├── InterviewPrepRadar.tsx
    │   ├── ApplicationTracker.tsx
    │   └── ExportModal.tsx
    ├── data/
    │   └── presets.ts        # Role presets & keyword banks
    └── utils/
        └── atsEngine.ts      # ATS scoring engine
```

## 📄 License

MIT — feel free to use, modify, and share.
