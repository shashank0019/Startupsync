# StartupSync — Complete Project Documentation (shashanksss.md)

**StartupSync** is an end-to-end founder matching and startup team collaboration platform built with **Spring Boot 3 (Java 21)** on the backend and **React 18 (TypeScript & TailwindCSS)** on the frontend, backed by **PostgreSQL** and real-time **WebSocket** communication.

---

## 🚀 Quick Run Guide

### 1. Prerequisites
- **Java**: JDK 21+ (`java -version`)
- **Maven**: 3.9+ (`mvn -v`)
- **Node.js**: v18+ / v20+ / v22+ (`node -v`)
- **PostgreSQL**: Running locally on port `5432` with database `startupsync`

### 2. Services & Ports

| Service | Port / URL | Details |
| :--- | :--- | :--- |
| **PostgreSQL** | `localhost:5432` | DB: `startupsync`, User: `postgres`, Password: `Shashi@123` |
| **Backend API** | `http://localhost:8080/api` | Spring Boot 3 (`dev` profile) |
| **Frontend App** | `http://localhost:3000` | React 18 SPA (Webpack dev server) |
| **WebSocket Chat** | `http://localhost:8080/api/ws/chat` | SockJS / STOMP |
| **WebSocket Notifications** | `http://localhost:8080/api/ws/notifications` | SockJS / STOMP |

---

## 🏃 Running the Application

### Option A: Running from Pre-built Executables (Fastest)

**Terminal 1 — Backend:**
```powershell
cd "startupsync-backend"
java -jar ".\target\startupsync-backend-1.0.0.jar" --spring.profiles.active=dev
```
*Wait until Tomcat starts on port 8080.*

**Terminal 2 — Frontend:**
```powershell
cd "startupsync-frontend"
$env:BROWSER = "none"
npm.cmd start
```
*Webpack compiles and the app becomes accessible at [http://localhost:3000](http://localhost:3000).*

---

### Option B: Building from Source

**Backend Build & Run:**
```powershell
cd "startupsync-backend"
mvn clean package -DskipTests
java -jar ".\target\startupsync-backend-1.0.0.jar" --spring.profiles.active=dev
```

**Frontend Install & Run:**
```powershell
cd "startupsync-frontend"
npm install
npm.cmd start
```

---

## 🔑 Pre-Seeded Test Credentials

The database auto-seeds on initial startup with test accounts. All pre-seeded accounts share the same password:

> **Password for all accounts:** `Test@123!`

| Name | Email | Password | Role | Bio / Description |
| :--- | :--- | :--- | :--- | :--- |
| **Test User** | `test@example.com` | `Test@123!` | `STARTUP_FOUNDER` | Primary test account with seeded workspaces, team, and tasks |
| **Alice Smith** | `founder1@example.com` | `Test@123!` | `STARTUP_FOUNDER` | Founder & CEO at EcoSphere (CleanTech) |
| **Bob Jones** | `founder2@example.com` | `Test@123!` | `STARTUP_FOUNDER` | Co-Founder at AuraAI (Machine Learning) |
| **Charlie Brown** | `candidate1@example.com` | `Test@123!` | `MEMBER` | Full Stack Web Developer (Looking for startup team) |
| **Diana Prince** | `candidate2@example.com` | `Test@123!` | `MEMBER` | Lead UI/UX Designer & Product Lead |

### New Account Registration:
- Open [http://localhost:3000/register](http://localhost:3000/register)
- Register with any valid email
- The email verification OTP will be printed to the backend console logs / `application.log`.

---

## 📁 Project Architecture & Structure

```
SSS/
├── shashanksss.md                     # Single Master Documentation
├── docker-compose.yml                 # Docker service definition for PostgreSQL & API
├── run-backend.ps1                    # PowerShell backend run script
├── run-frontend.ps1                   # PowerShell frontend run script
│
├── startupsync-backend/               # Spring Boot 3 Java 21 Backend
│   ├── pom.xml                        # Maven configuration
│   ├── src/main/java/com/startupsync/
│   │   ├── activity/                  # Activity logging & stream
│   │   ├── admin/                     # Admin dashboard & user management
│   │   ├── analytics/                 # Growth & engagement analytics
│   │   ├── application/               # Startup job / role applications
│   │   ├── auth/                      # JWT auth, user entities, security filters
│   │   ├── chat/                      # Real-time WebSocket chat & rooms
│   │   ├── config/                    # Security, CORS, WebSocket, DataInitializer
│   │   ├── invitation/                # Startup team invitations
│   │   ├── matching/                  # Founder/talent matching algorithms
│   │   ├── notification/              # Real-time & persistent notifications
│   │   ├── search/                    # Startup & candidate search
│   │   ├── settings/                  # User account & app preferences
│   │   ├── skill/                     # Platform skills taxonomy
│   │   ├── startup/                   # Startup workspaces & profiles
│   │   ├── task/                      # Project management task boards
│   │   └── team/                      # Team creation & member management
│   └── src/main/resources/
│       ├── application.properties     # Shared application configuration
│       ├── application-dev.properties # Development environment settings
│       └── application-prod.properties# Production environment settings
│
└── startupsync-frontend/              # React 18 TypeScript Single Page App
    ├── package.json                   # NPM dependencies & scripts
    ├── tailwind.config.js             # TailwindCSS design tokens
    ├── tsconfig.json                  # TypeScript compiler settings
    ├── .env                           # API and WebSocket environment URLs
    ├── public/                        # Public assets, icons & HTML template
    └── src/
        ├── api/                       # Axios service clients for all backend endpoints
        ├── components/                # Reusable UI components & layouts
        ├── context/                   # AuthContext, NotificationContext, ThemeContext
        ├── pages/                     # Application routes & dashboard views
        ├── types/                     # TypeScript definitions for entities & DTOs
        └── utils/                     # Formatters, validators & helper utilities
```

---

## 🌐 Application Routes (Frontend)

| Path | View | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | Landing / Login | Public | Platform landing page & authentication |
| `/login` | Login | Public | User authentication with JWT |
| `/register` | Register | Public | Account creation & OTP verification |
| `/dashboard` | Dashboard | Protected | Central user dashboard with KPI widgets |
| `/startups` | Startups Explore | Protected | Browse, search, and filter startups |
| `/startups/my` | My Startups | Protected | Founder workspace and management |
| `/teams` | Teams Dashboard | Protected | Team listings, member rosters, and creation |
| `/chat` | Messages & Chat | Protected | Real-time messaging with WebSocket support |
| `/matching` | Co-Founder Match | Protected | Algorithmic talent and co-founder recommendations |
| `/profile` | User Profile | Protected | Profile editor, resume, skills, and links |
| `/admin` | Admin Dashboard | Admin Only | User administration and platform metrics |

---

## 🛠️ Key REST API Endpoints

All backend endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register user account
- `POST /api/auth/verify-email` — Verify account with OTP code
- `POST /api/auth/login` — Login and receive JWT access & refresh tokens
- `POST /api/auth/refresh-token` — Refresh expired JWT token
- `POST /api/auth/logout` — Invalidate user token
- `POST /api/auth/change-password` — Update user password

### Teams (`/api/teams`)
- `GET /api/teams?pageNumber=0&pageSize=10` — Paginated list of all teams
- `GET /api/teams/my-teams` — List teams for authenticated user
- `GET /api/teams/{teamId}` — Team details
- `GET /api/teams/startup/{startupId}` — Teams under a specific startup
- `POST /api/teams/startup/{startupId}` — Create team for a startup
- `GET /api/teams/{teamId}/members` — List members of a team
- `POST /api/teams/{teamId}/members` — Add member to team
- `PATCH /api/teams/{teamId}/members/{memberId}/role` — Change member role
- `DELETE /api/teams/{teamId}/members/{memberId}` — Remove member

### Notifications (`/api/notifications`)
- `GET /api/notifications?page=0&size=20` — List notifications
- `GET /api/notifications/unread/count` & `GET /api/notifications/unread-count` — Unread notification counter
- `PATCH /api/notifications/{id}/read` & `PUT /api/notifications/{id}/read` — Mark notification as read
- `PATCH /api/notifications/mark-all-read` & `PUT /api/notifications/read-all` — Mark all as read
- `DELETE /api/notifications/{id}` — Delete notification

### Startups (`/api/startups`)
- `GET /api/startups?page=0&size=20` — Browse startups
- `GET /api/startups/my` — Get authenticated user's startups
- `GET /api/startups/{id}` — Get startup details
- `POST /api/startups` — Create new startup
- `PUT /api/startups/{id}` — Update startup details
- `GET /api/startups/trending` — Trending startups
- `GET /api/startups/industry/{industry}` — Filter startups by industry

---

## 🔧 Resolved Issues & Stability Enhancements

1. **`TeamDashboardPage` Crash**:
   - Fixed `Cannot read properties of undefined (reading 'firstName')` by safely extracting names from flat `TeamMemberDTO` or nested `User` objects.
   - Guarded member initials generation and avatar lists with null-safe fallbacks.

2. **Missing `GET /teams` Backend Endpoint**:
   - Implemented `getAllTeams(Pageable pageable)` in `TeamService` and `TeamServiceImpl`.
   - Exposed `@GetMapping` in `TeamController` to return paginated `Page<TeamResponse>` to avoid 404/500 errors.

3. **Notification Endpoint & Method Alignment**:
   - Supported both `/notifications/unread/count` and `/notifications/unread-count`.
   - Enabled both `PATCH` and `PUT` handlers for mark-as-read endpoints to ensure complete compatibility between frontend axios calls and backend Spring security controllers.

---

## ⚙️ Configuration Files

### Frontend Environment (`startupsync-frontend/.env`):
```properties
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_WS_CHAT_URL=http://localhost:8080/api/ws/chat
REACT_APP_WS_NOTIFICATIONS_URL=http://localhost:8080/api/ws/notifications
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
```

### Backend Dev Properties (`startupsync-backend/src/main/resources/application-dev.properties`):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/startupsync
spring.datasource.username=postgres
spring.datasource.password=Shashi@123
spring.jpa.hibernate.ddl-auto=update
cors.allowed-origins=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
```
