# Implementation Plan - Network Scanner

Build a complete, responsive network discovery and reporting web application using React + Vite + TypeScript (Frontend) and Node.js + Express + TypeScript (Backend).

To ensure safety for local testing, the backend provides a mock `MockScanService` that models scan behavior for localhost and private network targets. It generates realistic, structured scan data and serves it via secure API endpoints.

## User Review Required

> [!IMPORTANT]
> **No Active Scanning:** This project models scan behavior and does not execute external scanning binaries against remote targets. This ensures safety and prevents abuse while allowing safe local testing.
> **Single Command Startup:** We will set up a root-level `package.json` that concurrently boots both the frontend and the backend using a single command: `npm run dev`.

## Open Questions

None. The user has explicitly requested to build this as an educational demonstration with a clean mock abstraction for the scanning engine.

---

## Proposed Changes

We will organize the repository as a monorepo with `frontend` and `backend` subdirectories, managed by concurrent script execution in the root.

### Project Root

#### [NEW] [package.json](file:///c:/Cyber Project/network scan/package.json)
Contains root script configurations to run both frontend and backend concurrently during development using `npm run dev`.

#### [NEW] [README.md](file:///c:/Cyber Project/network scan/README.md)
Comprehensive installation and theoretical documentation.

---

### Backend Components
Located in `c:\Cyber Project\network scan\backend`.

#### [NEW] [package.json](file:///c:/Cyber Project/network scan/backend/package.json)
Backend node dependencies including `express`, `cors`, `helmet`, `express-rate-limit`, `zod` (validation), `typescript`, `@types/node`, etc.

#### [NEW] [tsconfig.json](file:///c:/Cyber Project/network scan/backend/tsconfig.json)
TypeScript configuration for Node.js.

#### [NEW] [server.ts](file:///c:/Cyber Project/network scan/backend/server.ts)
Initializes the Express server, applies security middlewares (`cors`, `helmet`, rate limiting), and sets up routing.

#### [NEW] [scanService.ts](file:///c:/Cyber Project/network scan/backend/scanService.ts)
Defines the `ScanService` interface and implements `MockScanService`. It simulates different scan modes (`quick`, `service`, `os`, `aggressive`, `udp`) with realistic latency and result matrices based on target types (e.g., localhost, private range IP, virtual machines).

#### [NEW] [scanRouter.ts](file:///c:/Cyber Project/network scan/backend/scanRouter.ts)
Defines the `POST /api/scan` route, performs input sanitization and schema validation (using `zod`), and interfaces with the simulated scanner.

---

### Frontend Components
Located in `c:\Cyber Project\network scan\frontend`. Created using Vite with React and TypeScript.

#### [NEW] [package.json](file:///c:/Cyber Project/network scan/frontend/package.json)
Vite and React dependencies, Tailwind CSS, Lucide icons, Framer Motion, and html2canvas/jspdf for PDF reporting.

#### [NEW] [tailwind.config.js](file:///c:/Cyber Project/network scan/frontend/tailwind.config.js) & [postcss.config.js](file:///c:/Cyber Project/network scan/frontend/postcss.config.js)
Tailwind configurations to establish the sleek, dark cyber-security theme (SaaS/Vercel styling, custom emerald/green glows, and glassmorphic panels).

#### [NEW] [vite.config.ts](file:///c:/Cyber Project/network scan/frontend/vite.config.ts) & [tsconfig.json](file:///c:/Cyber Project/network scan/frontend/tsconfig.json)
Vite and TypeScript project configs.

#### [NEW] [index.html](file:///c:/Cyber Project/network scan/frontend/index.html) & [src/index.css](file:///c:/Cyber Project/network scan/frontend/src/index.css)
Main stylesheet declaring base custom variables, modern fonts (e.g., Inter), and glowing class modifiers.

#### [NEW] [src/App.tsx](file:///c:/Cyber Project/network scan/frontend/src/App.tsx)
Main React Router container establishing layout grids, navigation bars, and footer components.

#### [NEW] [src/pages/Home.tsx](file:///c:/Cyber Project/network scan/frontend/src/pages/Home.tsx)
Sleek home page presenting the project hero section, cybersecurity theme, feature breakdown, and quick access.

#### [NEW] [src/pages/Scanner.tsx](file:///c:/Cyber Project/network scan/frontend/src/pages/Scanner.tsx)
Interactive scanning terminal where users input targets, configure scans, watch real-time console logs, visualize results in charts and tables, and export reports.

#### [NEW] [src/pages/About.tsx](file:///c:/Cyber Project/network scan/frontend/src/pages/About.tsx)
Informational page describing network scanning concepts (SYN vs Connect, UDP, OS detection), and ethical guidelines.

#### [NEW] [src/pages/Documentation.tsx](file:///c:/Cyber Project/network scan/frontend/src/pages/Documentation.tsx)
Detailed technical docs showcasing frontend/backend flow diagrams, API requests, parameters, and developer installation steps.

---

## Verification Plan

### Automated Tests
- Build verification: Run production build steps on both frontend (`npm run build`) and backend.
- TypeScript compiler checks (`tsc --noEmit`).

### Manual Verification
1. Verify that the server starts and binds to `http://localhost:5000`.
2. Verify frontend starts and proxies or requests to the backend server.
3. Test that inputting invalid target formats (e.g., invalid IP / malicious characters) triggers proper validation errors.
4. Run multiple scan modes, watching progress bars and checking tabular data outputs.
5. Export reports as PDF and check alignment and details.
