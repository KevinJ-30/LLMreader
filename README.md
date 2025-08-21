# Research Paper Reading Assistant

Next.js (App Router) + TypeScript app for reading PDFs with an AI assistant. Upload a PDF, select text, and get contextual explanations via a backend API.

## Getting Started

1. Install deps

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open `http://localhost:3000` and upload a PDF.

## Tech
- Next.js 14 + App Router
- PDF.js (`pdfjs-dist`)
- Tailwind CSS

## Notes
- API route at `src/app/api/process/route.ts` currently returns mocked responses. Replace with your FastAPI endpoint or wire to a serverless function.