# TaskPilot

A full-stack project management platform for teams to manage projects, tasks, subtasks, notes, and team members with role-based access control.

## Features

- JWT-based authentication with access & refresh tokens
- Email verification and password reset
- Role-based access control (RBAC)
- Project creation and member management
- Task and subtask management
- Kanban-style task workflow
- Task file attachments
- Project notes
- Request validation and centralized error handling
- Secure cookies and CORS configuration

## Tech Stack

**Frontend**
- React
- Vite
- Context API
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

## Architecture

```text
React Frontend
      ↓
Express REST API
      ↓
Authentication / RBAC
      ↓
Validation
      ↓
Controllers
      ↓
Mongoose Models
      ↓
MongoDB










TaskPilot/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validators/
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── routes/
    │   └── utils/
    ├── .env.example
    └── package.json