# **PureNote**

A minimal, secure full-stack encrypted diary and note-taking platform.

**Backend:** ASP.NET Core 10 · EF Core 10 · Identity · JWT · PostgreSQL · Scalar  
**Frontend:** React 19 · TypeScript · Vite · Tailwind CSS · Zustand

---

## **Features**

### Backend
* Register & login using **email or username**
* JWT-based authentication with refresh tokens
* End-to-end encryption for diary entries
* EF Core with PostgreSQL
* Clean layered architecture (Entities, DTOs, Services, Endpoints, Validators)
* Automatic OpenAPI generation + **Scalar UI**
* FluentValidation for request validation

### Frontend
* Modern React with TypeScript
* Secure authentication flow
* Diary CRUD operations (Create, Read, Update, Delete)
* Zustand state management
* Tailwind CSS styling
* HTTPS development environment

---

## **Requirements**

### **Backend**
* **.NET 10 SDK**
* **PostgreSQL 18**
* EF Core tools:
```sh
dotnet tool install --global dotnet-ef
```

### **Frontend**
* **Node.js 18+*
* **npm** or **pnpm**

### **Linux / Arch Users**
Install backend dependencies:
```sh
sudo pacman -S dotnet-sdk aspnet-runtime postgresql
```

Install frontend dependencies:
```sh
sudo pacman -S nodejs npm
```

Docs:
* [.NET on Arch Linux](https://wiki.archlinux.org/title/.NET)
* [PostgreSQL on Arch Linux](https://wiki.archlinux.org/title/PostgreSQL)

### **Windows Users**
* .NET 10: [https://dotnet.microsoft.com](https://dotnet.microsoft.com)
* PostgreSQL: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
* Node.js: [https://nodejs.org](https://nodejs.org)

---

## **Configuration**

### **Backend (appsettings.json)**

**Database:**
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=purenote;Username=YOUR_USER;Password=YOUR_PASS"
}
```

**JWT:**
```json
"Jwt": {
  "Key": "your-super-long-unique-32-byte-secret-key-here",
  "Issuer": "PureNote",
  "Audience": "PureNoteUsers",
  "ExpiryInMinutes": 60
}
```

**CORS:**
```json
"AllowedOrigins": [
  "https://localhost:3000"
]
```

### **Frontend (src/services/api.ts)**

Update the API base URL if needed:
```typescript
const API_BASE_URL = "https://localhost:7000/api";
```

---

## **Setup & Running**

### **1. Backend Setup**

```sh
cd PureNote.Api

# Apply migrations
dotnet ef database update

# Run the API
dotnet run
```

API will be available at:
* **HTTPS:** `https://localhost:7000`
* **Scalar Docs:** `https://localhost:7000/scalar`

### **2. Frontend Setup**

```sh
cd purenote-web

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at:
* **HTTPS:** `https://localhost:3000`

---

## **Development**

### **Backend**

**Run with hot reload:**
```sh
dotnet watch
```

### **Frontend**

**Development mode:**
```sh
npm run dev
```

---

## **API Documentation**

Interactive API documentation is available via **Scalar**:

```
https://localhost:7000/scalar
```

Explore endpoints, test requests, and view schemas directly in the browser.

---

## **Tech Stack**

### Backend
* **ASP.NET Core 10** - Minimal APIs
* **EF Core 10** - ORM with PostgreSQL
* **Identity 10.0.0** - User management
* **JWT Authentication 10.0.0** - Secure token-based auth
* **Npgsql 10.0.0** - PostgreSQL provider
* **Scalar.AspNetCore 2.11.0** - API documentation
* **FluentValidation 12.1.0** - Request validation

### Frontend
* **React 19** - UI library
* **TypeScript** - Type safety
* **Vite** - Build tool & dev server
* **Tailwind CSS 4** - Utility-first styling
* **Zustand** - Lightweight state management
* **React Router 7** - Client-side routing
* **Axios** - HTTP client

---

## **Security**

* **End-to-end encryption** for diary entries
* **JWT authentication** with secure token handling
* **HTTPS-only** in development and production
* **Input validation** with FluentValidation
* **CORS** configured for frontend origin
* **Password hashing** via ASP.NET Core Identity

---

## **License**

Licensed under the **[GNU GPLv3](LICENSE)**.
