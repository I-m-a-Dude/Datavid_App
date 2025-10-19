# Birthday Manager - Frontend

A web interface in Vite React Typescript for the challenge.


## 🏗️ Architecture

The frontend follows a **component-based architecture** with clear separation of concerns:

- **Pages**: Top-level route components
- **Components**: Reusable UI components
- **Services**: API communication layer
- **Types**: TypeScript type definitions
- **Styles**: CSS styling

### Architecture Diagram

```
┌─────────────────────────────────────┐
│          App.tsx (Root)             │
│  ┌─────────────────────────────┐   │
│  │  Header (Navigation)        │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Main Content Area          │   │
│  │  ┌───────────┬───────────┐  │   │
│  │  │ Members   │ Birthdays │  │   │
│  │  │   Page    │   Page    │  │   │
│  │  └───────────┴───────────┘  │   │
│  └─────────────────────────────┘   │
└────────────┬────────────────────────┘
             │
    ┌────────┴──────────┐
    ▼                   ▼
┌─────────┐      ┌──────────────┐
│Components│      │   Services   │
│  Layer   │      │  (API calls) │
└──────────┘      └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Backend    │
                  │  REST API    │
                  └──────────────┘
```

## 📁 Project Structure

```
frontend/
│
├── public/                          # Static assets
│   └── vite.svg                    # Vite logo
│
├── src/                            # Source code
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Root component with routing
│   ├── App.css                     # Global styles
│   ├── index.css                   # CSS reset & base styles
│   │
│   ├── components/                 # Reusable components
│   │   ├── MemberForm.tsx         # Form for create/edit member
│   │   ├── MemberList.tsx         # Display list of members
│   │   └── BirthdayList.tsx       # Display upcoming birthdays
│   │
│   ├── pages/                      # Page-level components
│   │   ├── MembersPage.tsx        # Members management page
│   │   └── UpcomingBirthdaysPage.tsx # Birthday calendar page
│   │
│   ├── services/                   # API communication
│   │   └── api.ts                 # API service functions
│   │
│   ├── types/                      # TypeScript definitions
│   │   └── index.ts               # Type definitions
│   │
│   └── assets/                     # Images & icons
│       └── react.svg              # React logo
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── eslint.config.js               # ESLint configuration
```



## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on port 8000

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:5173
   ```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 📦 Dependencies

### Core
- **react**: ^19.1.1 - UI library
- **react-dom**: ^19.1.1 - React DOM renderer
- **lucide-react**: ^0.546.0 - Icon library

### Development
- **vite**: ^7.1.7 - Build tool and dev server
- **typescript**: ~5.9.3 - Type checking
- **@vitejs/plugin-react**: ^5.0.4 - React plugin for Vite
- **eslint**: ^9.36.0 - Code linting
- **typescript-eslint**: ^8.45.0 - TypeScript ESLint rules

