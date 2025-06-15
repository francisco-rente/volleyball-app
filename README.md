# Volleyball Tournament Management System

![Volleyball Tournament Management System](https://example.com/logo.png)

## Disclaimer

Made with Cursor IDE, an AI-powered IDE that helps you code faster and smarter. [Try Cursor IDE](https://cursor.so).

A MERN stack application for managing volleyball tournaments, including game scheduling, score tracking, and referee verification.

## Features

- Tournament dashboard with game schedules and scores
- User authentication and role-based access control
- Score submission and referee verification system
- Game scheduling interface for administrators
- Real-time updates for game status and scores

## Tech Stack

- MongoDB: Database
- Express.js: Backend framework
- React.js: Frontend framework
- Node.js: Runtime environment

## System Architecture

```mermaid
graph TB
    subgraph Frontend
        UI[React UI]
        Auth[Authentication]
        Dashboard[Dashboard]
        Games[Games Management]
        Teams[Teams Management]
        Tournaments[Tournaments Management]
    end

    subgraph Backend
        API[Express API]
        AuthMiddleware[Auth Middleware]
        Routes[API Routes]
    end

    subgraph Database
        Users[(Users Collection)]
        Teams[(Teams Collection)]
        Games[(Games Collection)]
        Tournaments[(Tournaments Collection)]
    end

    subgraph User Roles
        Admin[Admin User]
        Referee[Referee User]
        Regular[Regular User]
    end

    %% Frontend connections
    UI --> Auth
    UI --> Dashboard
    UI --> Games
    UI --> Teams
    UI --> Tournaments

    %% Backend connections
    Auth --> API
    Dashboard --> API
    Games --> API
    Teams --> API
    Tournaments --> API

    %% API to Database
    API --> AuthMiddleware
    AuthMiddleware --> Routes
    Routes --> Users
    Routes --> Teams
    Routes --> Games
    Routes --> Tournaments

    %% User Roles permissions
    Admin --> Games
    Admin --> Teams
    Admin --> Tournaments
    Referee --> Games
    Regular --> Dashboard
```

## Database Schema

```mermaid
erDiagram
    User {
        ObjectId _id
        String username
        String email
        String password
        String role
        Date createdAt
    }

    Team {
        ObjectId _id
        String name
        String coach
        Array players
        Number wins
        Number losses
        Number points
        Date createdAt
    }

    Game {
        ObjectId _id
        ObjectId tournament
        ObjectId team1
        ObjectId team2
        Date scheduledTime
        String status
        Object scores
        ObjectId winner
        ObjectId referee
        Boolean scoreVerified
        ObjectId scoreSubmittedBy
        ObjectId scoreVerifiedBy
        Date createdAt
        Date updatedAt
    }

    Tournament {
        ObjectId _id
        String name
        Date startDate
        Date endDate
        String status
        Array teams
        Array games
        String format
        String location
        ObjectId createdBy
        Date createdAt
        Date updatedAt
    }

    User ||--o{ Game : "referees"
    User ||--o{ Game : "submits_scores"
    User ||--o{ Game : "verifies_scores"
    User ||--o{ Tournament : "creates"
    Team ||--o{ Game : "plays"
    Tournament ||--o{ Game : "contains"
    Tournament ||--o{ Team : "includes"
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## Running the Application

1. Start both frontend and backend:
   ```bash
   npm start
   ```
2. Or run them separately:
   - Backend: `npm run server`
   - Frontend: `npm run client`

## Project Structure

```
volleyball-tournament-app/
├── frontend/          # React frontend
├── backend/           # Express backend
└── package.json       # Root package.json
```

## License

ISC 
