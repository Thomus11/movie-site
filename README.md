
# 🎬 Movie Reservation Web Application

Live Site: 🌍 [https://movie-site-khaki-six.vercel.app/](https://movie-site-khaki-six.vercel.app/)

---

## 📖 Overview

The **Movie Reservation Web App** is a modern, full-stack movie booking system where users can browse, reserve, and pay for movie tickets using **M-Pesa**. It features a secure **admin dashboard** for managing movie listings, bookings, and more.

---

## ⚙️ Tech Stack

### 🔧 Frontend (Client)
- **React** with **Vite**
- **Tailwind CSS** for responsive styling
- **React Router DOM** for navigation
- **React Toastify** for notifications
- **M-Pesa Payment Integration**
- **Role-based Routing & Protection**

### 🗄️ Backend (Server)
- **Python (Flask)**
- **PostgreSQL** database
- **SQLAlchemy** ORM
- **Alembic** for migrations
- **JWT Authentication**
- **Hosted via Render or Vercel (frontend)**

---

## 🌟 Features

### 🧑‍💼 Users
- View movies currently showing or coming soon
- View available cinemas
- Book tickets for a selected movie
- Pay using **M-Pesa**
- View payment confirmation
- Authenticated access to **User Dashboard**

### 🔐 Admins
- Secure two-step admin login
- View, add, update, or delete movies
- Manage available cinemas
- Monitor bookings and payments
- Access **Admin Dashboard** with role protection

---

## 🔐 Authentication Guide

### ▶️ Admin Login

1. Navigate to the live app:  
   👉 [https://movie-site-khaki-six.vercel.app/](https://movie-site-khaki-six.vercel.app/)
2. Click on **Login** and use the following credentials:

   ```
   Email: adminthomas827@gmail.com  
   Password: Admin12.?/
   ```

3. You’ll be redirected to the `Admin Auth Page`.
4. Input the **branch credentials**:

   ```
   Branch: Panari  
   Code: SECRET123
   ```

5. Upon successful verification, you will be taken to the **Admin Dashboard**.

---

### ▶️ User Login

1. From the homepage, click **Login**.
2. Sign in or sign up with a standard user account.
3. Upon login, you'll be redirected to your personalized **User Dashboard**.
4. From there, you can:
   - Browse movies
   - Book and reserve tickets
   - Make **M-Pesa payments**

---

## 💳 Payment Integration

This app uses **Safaricom M-Pesa (Daraja API)** for secure mobile payments.

- After selecting a movie and number of tickets, users are prompted to enter their M-Pesa number.
- Payment is simulated with success/failure messages.
- Upon confirmation, tickets are reserved and stored in the backend database.


---

## 💻 Local Development Setup

### 🧾 Prerequisites

- Node.js & Yarn/NPM
- Python 3 & pip
- PostgreSQL installed and configured
- `virtualenv` or `poetry` for dependency management

---

### 🔁 Clone the Repository

```bash
git clone https://github.com/Thomus11/movie-site.git
cd movie-site
```

---

## ⚛️ Frontend Setup

```bash
cd client
npm install         
npm run dev             
```

Runs at: `http://localhost:5173`

---

## 🐍 Backend Setup

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### ⚙️ Configure PostgreSQL Connection

In `.env` file:

```
DATABASE_URL=postgresql://thomas:fluffy254@localhost:5432/cinema_db
SECRET_KEY=e725f8afb4615812b52e75c787d8bf9b3963ea1fdd2ac0d7978db9f6cce2ca0e
```

---

### 🔄 Run Migrations & Seed Database

```bash
alembic upgrade head
python seed.py
```

---

### ▶️ Start Backend Server

```bash
python app.py
```

Runs at: `http://localhost:5000/`

---

## 🗂 Folder Structure

### 📁 Frontend (`client/`)
```
client/
├── public/
│   ├── images/
│   └── vite.svg
├── src/
│   ├── Pages/
│   │   ├── AvailableCinemas.jsx
│   │   ├── AvailableNow.jsx
│   │   ├── Carousel.jsx
│   │   ├── ComingSoon.jsx
│   │   ├── Footer.jsx
│   │   ├── Home.jsx
│   │   ├── MpesaPayment.jsx
│   │   ├── Navbar.jsx
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── AdminAuthPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AuthModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── UserDashboard.jsx
│   ├── contexts/AuthContext.jsx
│   ├── assets/
│   ├── api.js
│   ├── config.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
└── README.md
```

---

### 📁 Backend (`server/`)
```
server/
├── alembic/
│   └── migrations/
├── app.py
├── models.py
├── seed.py
├── requirements.txt
├── app.db
├── .env
├── render.yaml
├── Pipfile / poetry.lock
└── alembic.ini
```

---

## 🧪 Testing

- Test your API endpoints using **Insomnia** (import `insomnia_movie_site.json`)
- Use test users for booking/reservation logic.
- Test M-Pesa simulations via the payment flow in the frontend.

---

## 🧑‍💻 Contributors

- **Lead Developer**: Thomas
- **Frontend + Backend Integration**: Leslie + Thomas + Ryan + Elijah + Enock
- **Design + UI/UX**: Leslie + Elijah

---

## 🔗 Live Link

✨ [https://movie-site-khaki-six.vercel.app/](https://movie-site-khaki-six.vercel.app/)
