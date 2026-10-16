<div align="center">

# 🚀 StartupSync

### *Next-Generation Founder Matching & Startup Team Collaboration Platform*

[![Java](https://img.shields.io/badge/Java-21-orange.svg?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP%20%2F%20SockJS-yellow.svg)](https://stomp.github.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)

[Explore Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [API Reference](#-api-endpoints) • [Seeded Accounts](#-pre-seeded-test-accounts)

</div>

---

## 📖 Overview

**StartupSync** is an all-in-one ecosystem connecting ambitious startup founders, engineers, designers, and domain specialists. It combines intelligent co-founder matching algorithms with collaborative team workspaces, real-time messaging, task management boards, and activity telemetry to take early-stage ventures from concept to execution.

Built with a high-performance **Spring Boot 3 (Java 21)** REST & WebSocket backend and a modern **React 18 TypeScript** single-page application styled with **TailwindCSS**.

---

## ✨ Features

- 🤝 **Intelligent Co-Founder Matching**: Algorithmic recommendations matching founders with complementary skills, industry backgrounds, and shared project vision.
- 🏢 **Startup Workspaces**: Comprehensive startup profiles, company stages, pitch decks, industry taxonomies, and team directories.
- 👥 **Team & Roster Management**: Organize team rosters, assign role-based permissions (`FOUNDER`, `ADMIN`, `MEMBER`), and handle team invitations and applications.
- 📋 **Project Task Boards**: Integrated Kanban-style task workflows, status tracking (To-Do, In Progress, Done), and priority management.
- 💬 **Real-Time Chat & Direct Messaging**: Low-latency communication powered by WebSocket (STOMP + SockJS) with dedicated chat rooms and channel subscriptions.
- 🔔 **Instant Notifications**: Live push notifications for incoming invitations, application updates, team changes, and direct mentions.
- 📊 **Growth & Engagement Analytics**: Visualized performance dashboards with interactive charts (via Recharts) tracking user growth, activity levels, and team metrics.
- 🛡️ **Enterprise-Grade Security**: Stateless JWT authentication with access & refresh token rotation, password hashing, and role-based route guards.

---

## 🏗️ System Architecture

```
                      ┌────────────────────────────────────────┐
                      │          React 18 Frontend             │
                      │   (TypeScript, TailwindCSS, Recharts)  │
                      └──────────────┬──────────────────┬──────┘
                                     │ HTTP (Axios)     │ WebSocket (STOMP/SockJS)
                                     ▼                  ▼
                      ┌────────────────────────────────────────┐
                      │          Spring Boot 3 API             │
                      │     (Java 21, Spring Security, JWT)    │
                      └───────┬──────────────┬──────────┬──────┘
                              │              │          │
                              ▼              ▼          ▼
                      ┌──────────────┐ ┌──────────┐ ┌───────────┐
                      │  PostgreSQL  │ │ WebSocket│ │ Actuator  │
                      │  15 (JPA)    │ │ Broker   │ │ & Health  │
                      └──────────────┘ └──────────┘ └───────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2.0, Spring Data JPA, Spring Security, Flyway, MapStruct, Lombok |
| **Frontend** | React 18, TypeScript, TailwindCSS 3.3, Lucide React, Recharts, Axios |
| **Realtime** | Spring WebSocket, STOMP Protocol, SockJS |
| **Database** | PostgreSQL 15 |
| **Authentication** | JWT (JSON Web Tokens) with `jjwt 0.12.3`, Argon2/BCrypt |
| **DevOps / Containers** | Docker, Docker Compose, PowerShell Orchestration Scripts |

---

## 📂 Project Structure

```
StartupSync/
├── docker-compose.yml                 # Multi-container Docker deployment
├── run-backend.ps1                    # Quick-start script for backend
├── run-frontend.ps1                   # Quick-start script for frontend
│
├── startupsync-backend/               # Spring Boot 3 Java 21 Backend
│   ├── pom.xml                        # Maven dependencies & build config
│   ├── src/main/java/com/startupsync/
│   │   ├── activity/                  # Activity logging & stream
│   │   ├── admin/                     # Admin management & system oversight
│   │   ├── analytics/                 # Growth and platform metrics
│   │   ├── application/               # Startup job applications & processing
│   │   ├── auth/                      # JWT auth, user entities, security filters
│   │   ├── chat/                      # Real-time WebSocket chat rooms & messaging
│   │   ├── config/                    # Security, CORS, WebSocket, DataInitializer
│   │   ├── invitation/                # Workspace & team invitations
│   │   ├── matching/                  # Founder/talent matching algorithms
│   │   ├── notification/              # Real-time and persistent notification delivery
│   │   ├── search/                    # Unified search indexing
│   │   ├── settings/                  # User account and preference settings
│   │   ├── skill/                     # Platform skill taxonomies
│   │   ├── startup/                   # Startup entity models and controllers
│   │   ├── task/                      # Task boards and status tracking
│   │   └── team/                      # Team rosters and memberships
│   └── src/main/resources/
│       ├── application.properties     # Core configuration
│       ├── application-dev.properties # Local development configuration
│       └── application-prod.properties# Production configuration
│
└── startupsync-frontend/              # React 18 TypeScript Frontend
    ├── package.json                   # NPM packages and build scripts
    ├── tailwind.config.js             # Tailwind design system tokens
    ├── tsconfig.json                  # TypeScript compiler settings
    ├── .env                           # Environment endpoints
    └── src/
        ├── api/                       # Typed Axios HTTP client services
        ├── components/                # Reusable UI components (buttons, cards, headers)
        ├── context/                   # AuthContext, NotificationContext, ThemeContext
        ├── hooks/                     # Custom hooks (useAuth, useStomp, useForm)
        ├── pages/                     # Application pages and route handlers
        ├── types/                     # Shared TypeScript interfaces & DTOs
        └── utils/                     # Formatting, validation, and error helpers
```

---

## 🚀 Quick Start

### 📋 Prerequisites

Make sure the following tools are installed:
- **Java**: JDK 21+ (`java -version`)
- **Maven**: 3.9+ (`mvn -v`)
- **Node.js**: v18+ / v20+ (`node -v`)
- **PostgreSQL**: v14+ or Docker installed

---

### Option 1: One-Click Run (PowerShell)

**1. Start the Backend:**
```powershell
.\run-backend.ps1
```
*(Runs on [http://localhost:8080](http://localhost:8080))*

**2. Start the Frontend:**
```powershell
.\run-frontend.ps1
```
*(Opens at [http://localhost:3000](http://localhost:3000))*

---

### Option 2: Run with Docker Compose

Spin up PostgreSQL and the backend API containerized with a single command:

```bash
docker-compose up -d
```

---

### Option 3: Manual Step-by-Step Setup

#### 1. Setup PostgreSQL Database
Create a database named `startupsync`:
```sql
CREATE DATABASE startupsync;
```
Ensure your credentials match `startupsync-backend/src/main/resources/application-dev.properties` (Default: user `postgres`, password `Shashi@123`).

#### 2. Run the Backend
```bash
cd startupsync-backend
mvn clean package -DskipTests
java -jar target/startupsync-backend-1.0.0.jar --spring.profiles.active=dev
```

#### 3. Run the Frontend
```bash
cd startupsync-frontend
npm install
npm start
```

Frontend will launch at **`http://localhost:3000`**.

---

## 🔑 Pre-Seeded Test Accounts

The platform auto-seeds with ready-to-test accounts on launch. All pre-seeded accounts share the same password:

> **Password:** `Test@123!`

| Name | Email | Role | Bio / Description |
| :--- | :--- | :--- | :--- |
| **Test User** | `test@example.com` | `STARTUP_FOUNDER` | Primary workspace owner with seeded startups, teams & tasks |
| **Alice Smith** | `founder1@example.com` | `STARTUP_FOUNDER` | Founder & CEO at EcoSphere (CleanTech) |
| **Bob Jones** | `founder2@example.com` | `STARTUP_FOUNDER` | Co-Founder at AuraAI (Machine Learning) |
| **Charlie Brown** | `candidate1@example.com` | `MEMBER` | Full Stack Developer seeking early-stage startup team |
| **Diana Prince** | `candidate2@example.com` | `MEMBER` | Product Designer & UI/UX Specialist |

---

## 🌐 Application Routes

| Path | View | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | Landing / Login | Public | Platform landing page & authentication |
| `/login` | Sign In | Public | User authentication with JWT |
| `/register` | Sign Up | Public | User registration & OTP verification |
| `/dashboard` | Dashboard | Protected | Central workspace with KPI widgets & active feeds |
| `/startups` | Explore Startups | Protected | Directory of registered ventures with search & filters |
| `/startups/my` | My Startups | Protected | Manage owned startup workspaces and settings |
| `/teams` | Teams | Protected | View teams, rosters, and open positions |
| `/matching` | Co-Founder Match | Protected | Algorithmic founder & talent matching engine |
| `/chat` | Messages | Protected | Real-time chat channels and direct messaging |
| `/profile` | Profile | Protected | Edit portfolio, skills, experience, and links |
| `/admin` | Administration | Admin Only | System user overview, metrics, and logs |

---

## 📡 Key API Endpoints

All REST APIs are prefixed with `/api`.

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/verify-email` — Verify email via OTP
- `POST /api/auth/login` — Login and receive access & refresh tokens
- `POST /api/auth/refresh-token` — Refresh expired JWT token
- `POST /api/auth/logout` — Invalidate current session

### 🏢 Startups (`/api/startups`)
- `GET /api/startups` — Paginated list of all startups
- `GET /api/startups/my` — Get user's created startups
- `GET /api/startups/{id}` — Get single startup profile
- `POST /api/startups` — Create a new startup profile
- `GET /api/startups/trending` — Discover trending startups

### 👥 Teams & Members (`/api/teams`)
- `GET /api/teams` — Retrieve paginated teams
- `GET /api/teams/my-teams` — Get teams user belongs to
- `POST /api/teams/startup/{startupId}` — Create team under a startup
- `POST /api/teams/{teamId}/members` — Add member to team
- `PATCH /api/teams/{teamId}/members/{memberId}/role` — Update member role

### 💬 Real-Time WebSockets
- **Chat Broker Endpoint**: `ws://localhost:8080/api/ws/chat`
  - Topic: `/topic/chat/{roomId}`
  - Send destination: `/app/chat.sendMessage`
- **Notification Broker Endpoint**: `ws://localhost:8080/api/ws/notifications`
  - Queue: `/user/queue/notifications`

---

## ⚙️ Environment Configuration

### Frontend (`startupsync-frontend/.env`)
```properties
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_WS_CHAT_URL=http://localhost:8080/api/ws/chat
REACT_APP_WS_NOTIFICATIONS_URL=http://localhost:8080/api/ws/notifications
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
```

### Backend Dev Profile (`application-dev.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/startupsync
spring.datasource.username=postgres
spring.datasource.password=Shashi@123
spring.jpa.hibernate.ddl-auto=update
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
