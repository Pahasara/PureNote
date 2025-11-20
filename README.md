# **PureNote**

A minimal, secure full-stack encrypted diary and note-taking platform.
Built with **ASP.NET Core 10**, **EF Core 10**, **Identity**, **JWT**, **PostgreSQL**, and documented using **Scalar**.

A React-based frontend will be available soon, integrating directly with this API.

---

## **Features**

* Register & login using **email or username**
* JWT-based authentication
* EF Core (PostgreSQL provider)
* Clean layered structure (Entities, DTOs, Services, Endpoints, Validators)
* Automatic OpenAPI generation + **Scalar UI**
* CORS configuration for SPA frontends
* Development-mode DB migrations (manual by default)

---

## **Requirements**

### **Core tools**

* **.NET 10 SDK**
* **PostgreSQL 18**
* EF Core tools:

```sh
dotnet tool install --global dotnet-ef
```

### **Linux / Arch Users**

Install:

```sh
yay -S dotnet-sdk-10.0-bin
sudo pacman -S postgresql
```

.NET setup docs:
[https://wiki.archlinux.org/title/.NET](https://wiki.archlinux.org/title/.NET)

PostgreSQL setup docs:
[https://wiki.archlinux.org/title/PostgreSQL](https://wiki.archlinux.org/title/PostgreSQL)

### **Windows Users**

* Install .NET 10 via: [https://dotnet.microsoft.com](https://dotnet.microsoft.com)
* Install PostgreSQL via: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

---

## **Configuration**

### **Database**

Update your PostgreSQL connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=purenote;Username=YOUR_USER;Password=YOUR_PASS"
}
```

### **JWT**

Use a strong 32B+ key:

```json
"Jwt": {
  "Key": "your-super-long-unique-32-byte-secret-key-here",
  "Issuer": "PureNote",
  "Audience": "PureNoteUsers",
  "ExpiryInMinutes": 60
}
```

---

## **Database Setup**

### Apply existing migrations:

```sh
dotnet ef database update
```

### Add new migration:

```sh
dotnet ef migrations add MigrationName -o Data/Migrations
```

---

## **Running the API**

```
dotnet run
```

---

## **Scalar Documentation**

```
https://localhost:7000/scalar
```

---

## **Tech Stack**

* **ASP.NET Core 10**
* **EF Core 10**
* **Identity 10.0.0**
* **JWT Authentication 10.0.0**
* **PostgreSQL (Npgsql 10.0.0-rc.2)**
* **Scalar.AspNetCore 2.11.0**
* **FluentValidation 12.1.0**

---

## **License**

Licensed under the **[GNU GPLv3](LICENSE)**.

