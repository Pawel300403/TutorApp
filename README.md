# TutorApp

TutorApp is a full-stack web application built with **Django REST Framework** (backend) and **Vite** (frontend).
The project demonstrates a secure and modern authentication flow using **JWT access tokens** and **refresh tokens stored in HttpOnly cookies**.

This repository is intended for **educational purposes** and as a **portfolio project**.

---

## ✨ Features
- User authentication (login / refresh / logout)
- JWT access token sent via `Authorization: Bearer <token>` header
- Refresh token stored securely in **HttpOnly cookie**
- Refresh token rotation on every refresh
- REST API built with Django REST Framework
- Modern frontend powered by Vite
- Clear separation of backend and frontend environments

---

## 🛠 Tech Stack

### Backend
- Python 3.12
- Django
- Django REST Framework
- SimpleJWT
- SQLite (development database)

### Frontend
- Vite
- JavaScript / TypeScript
- Axios

### CI
- GitHub Actions (basic Python environment check)

---

## 🔐 Authentication Model

- **Access Token**
  - Short-lived JWT
  - Sent in `Authorization: Bearer <token>` header
- **Refresh Token**
  - Stored in **HttpOnly cookie**
  - Not accessible from JavaScript
  - Rotated on every successful refresh request
- Secure CORS configuration
- CSRF-safe design for cookie-based refresh endpoint

---

## 🚀 Getting Started (Development)

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm

---

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Create a `.env` file based on `.env.example`.

Backend will be available at:
```
http://localhost:8000
```

---

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file based on `.env.example`.

Frontend will be available at:
```
http://localhost:5173
```

---

## 📡 Authentication API Endpoints

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/api/auth/login/` | User login |
| POST | `/api/auth/refresh/` | Refresh access token |
| POST | `/api/auth/logout/` | Logout |
| GET  | `/api/auth/me/` | Get current authenticated user |

---

## 📁 Project Structure

```
TutorApp/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── package.json
│   ├── .env.example
│   └── ...
├── .github/
│   └── workflows/
├── .gitignore
└── README.md
```

---

## 🧪 CI

The repository includes a minimal GitHub Actions workflow that verifies the Python runtime environment.
This ensures the CI pipeline is correctly configured without enforcing test execution.

---

## 📄 License & Notes

This project was created for **educational and portfolio purposes**.
It is not intended for production use without further security hardening and configuration.
