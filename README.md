# Network Scanner

An interactive, responsive network discovery application designed to discover hosts, identify running services, analyze open ports, and present scan results through a clean, intuitive interface.

## 🌟 Project Purpose & Scope

The backend models scan behavior using a `MockScanService` that generates realistic, structured scan output for safe testing on localhost or private networks. The system does not execute external scanning binaries against remote targets.

Network Scanner is useful for:
- Discovering active hosts and open services on local networks.
- Generating readable reports of open ports and services.
- Demonstrating common scan techniques and result interpretation.

---

## 🛠 Tech Stack

### Frontend
- **React + Vite** (Hot Module Replacement, fast compilation)
- **TypeScript** (Strong typing, runtime safety)
- **Tailwind CSS** (Vercel-inspired dark theme, custom glows)
- **Framer Motion** (Visual transitions, terminal streams)
- **Lucide React** (Security & system icons)
- **html2canvas / jsPDF** (Dynamic client-side PDF reporting)

### Backend
- **Node.js + Express** (Type-safe REST API server)
- **Zod** (Input validation and target sanitization)
- **Helmet / CORS** (Security-hardened headers)
- **express-rate-limit** (Scan request frequency controls)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Installation

1. Install root dependencies (like `concurrently`):
   ```bash
   npm install
   ```

2. Bootstrap all sub-projects (frontend and backend package managers):
   ```bash
   npm run install:all
   ```

### Running the Project

Start both the React development server and the Express API server concurrently with a single command in the root folder:
```bash
npm run dev
```

- **Frontend Interface**: Runs on [http://localhost:3000](http://localhost:3000)
- **Express Backend API**: Runs on [http://localhost:5000](http://localhost:5000)

### Building for Production

Compile both the frontend bundle and backend TypeScript files for production:
```bash
npm run build
```

---

## 🔒 Security Measures & Sanitization

1. **Input Sanitization**: The Express router processes all target host strings against a strict validation pattern (Zod verification). Any inputs with spaces, semicolons, shell pipes (`|`), or execution markers (`&`, `;`) are instantly rejected with client notifications. This prevents command injection vulnerabilities common in network tooling wrappers.
2. **API Rate Limiting**: The server limits client requests to 30 requests per minute per IP address, preventing resource exhaustion.
3. **HTTP Hardening**: Helmet applies standard security settings including Content-Security-Policy, X-Content-Type-Options, and referrer controls.
