# 🩺 MediCare Connect

### Modern Healthcare Appointment & Management Platform

**MediCare Connect** is a modern full-stack healthcare management platform that connects patients with verified doctors through a centralized and user-friendly system. Patients can discover doctors, book appointments, make secure payments, manage their appointments, write reviews, and access prescriptions.

Doctors can manage their professional profiles, schedules, appointment requests, and prescriptions, while administrators can manage users, verify doctors, monitor appointments and payments, and analyze platform performance.

---

## 🌐 Live Website

🔗 **Live Site:** `https://medicare-client-kappa.vercel.app/`

---

# ✨ Key Features

## 👤 Patient Features

* Secure registration and login
* Google authentication
* Browse and search doctors
* Search doctors by name and specialization
* Sort doctors by:

  * Consultation fee
  * Experience
  * Highest rating
* Pagination on Find Doctors page
* View detailed doctor profiles
* Check doctor availability
* Book appointments
* Secure Stripe payment
* View upcoming appointments
* View appointment history
* Reschedule appointments
* Cancel appointments
* View payment history
* Add doctor reviews
* Update reviews
* Delete reviews
* Manage favorite doctors
* View prescriptions
* Manage personal profile

---

## 👨‍⚕️ Doctor Features

* Doctor registration
* Professional profile management
* Verification by admin
* Manage qualifications
* Manage experience
* Manage consultation fee
* Manage available schedules
* Add, update and delete schedules
* View appointment requests
* Accept appointments
* Reject appointments
* Mark appointments as completed
* Create prescriptions
* Update prescriptions
* View patient information
* View received reviews
* Dashboard statistics

---

## 👨‍💼 Admin Features

* Admin dashboard
* View all users
* Suspend users
* Delete users
* View registered doctors
* Verify doctors
* Reject doctor verification
* Cancel doctor verification
* Monitor all appointments
* Monitor payment records
* Platform statistics
* Doctor performance analytics
* Patient statistics
* Appointment statistics
* Interactive charts using Recharts

---

# 🔐 Authentication & Security

MediCare Connect implements secure authentication and authorization to protect private resources.

### Authentication

* Email & Password Authentication
* Google Authentication
* JWT-based API authentication
* Secure token verification
* Protected routes

### Role-Based Authorization

The system supports three roles:

```text
Patient
Doctor
Admin
```

Private APIs are protected using JWT middleware.

```text
Client Request
      ↓
JWT Token
      ↓
Backend Token Verification
      ↓
User Identification
      ↓
Role Verification
      ↓
Authorized API Access
```

### Authorization Examples

```text
Patient
 ├── Book Appointment
 ├── Manage Own Appointments
 ├── Make Payment
 ├── Manage Reviews
 └── View Prescriptions

Doctor
 ├── Manage Schedule
 ├── Manage Appointments
 ├── Create Prescriptions
 └── Manage Professional Profile

Admin
 ├── Manage Users
 ├── Verify Doctors
 ├── Manage Appointments
 ├── Monitor Payments
 └── View Analytics
```

---

# 💳 Payment System

MediCare Connect integrates **Stripe** for secure consultation fee payments.

### Payment Flow

```text
Select Doctor
      ↓
Choose Date & Time
      ↓
Enter Symptoms
      ↓
Confirm Appointment
      ↓
Stripe Checkout
      ↓
Payment Successful
      ↓
Payment Record Saved
      ↓
Appointment Confirmed
```
---

# 🛠️ Technology Stack

## Frontend

| Technology      | Purpose            |
| --------------- | ------------------ |
| Next.js         | Frontend Framework |
| React           | UI Development     |
| Tailwind CSS    | Styling            |
| HeroUI          | UI Components      |
| Framer Motion   | Animations         |
| Recharts        | Analytics & Charts | 
| React Hook Form | Form Management    |

## Backend

| Technology  | Purpose           |
| ----------- | ----------------- |
| Node.js     | Runtime           |
| Express.js  | Backend Framework |
| MongoDB     | Database          |
| JWT         | Authentication    |
| Stripe      | Payment Gateway   |
| Better Auth | Authentication    |

---

# 📱 Responsive Design

The entire application is designed to work across:

* 📱 Mobile
* 📲 Tablet
* 💻 Desktop
* 🖥️ Large Screens

The dashboard includes a responsive sidebar and adaptive layouts for different screen sizes.

---

# 🎨 UI & Design

MediCare Connect uses a modern healthcare-focused design system.

### Design Principles

* Clean healthcare aesthetic
* Consistent typography
* Consistent button styles
* Responsive cards
* Proper spacing
* Modern dashboard
* Light & dark theme
* Accessible color contrast
* Smooth animations
* User-friendly navigation

### Animation

Framer Motion is used in multiple sections including:

* Hero/Banner
* Featured Doctors
* Additional interactive sections

---

# 📊 Admin Analytics

The Admin Dashboard includes interactive analytics using **Recharts**.

Analytics include:

* Total Doctors
* Total Patients
* Total Appointments
* Doctor Performance
* Rating-based performance
* Payment statistics

---

# 📄 Main Pages

## Public Pages

```text
Home
Find Doctors
Doctor Details
About Us
Contact Us
Login
Register
```

## Patient Dashboard

```text
Dashboard
My Profile
My Appointments
Payment History
My Reviews
Favorite Doctors
Prescriptions
```

## Doctor Dashboard

```text
Dashboard
Profile Management
Manage Schedule
Appointment Requests
Prescription Management
Reviews
```

## Admin Dashboard

```text
Dashboard
Manage Users
Manage Doctors
Manage Appointments
Payment Management
Analytics
```

---

# ⚡ Loading & Error Handling

The application includes meaningful loading states for:

* Route loading
* API/data fetching
* Dashboard loading
* Authentication loading

A custom 404 page is also implemented with:

* Healthcare-themed illustration
* Error message
* Back to Home button

---

# 🔔 Notifications

The application uses toast/alert notifications for important user actions.

Examples:

* Registration successful
* Login successful
* Appointment booked
* Appointment cancelled
* Payment successful
* Review added
* Review updated
* Review deleted
* Doctor verified
* Schedule updated
* Prescription created

---

# 🔒 Environment Variables

Environment variables are used to protect sensitive credentials.

---

# 🚀 Installation & Setup

## 1. Clone the Client Repository

```bash
git clone YOUR_CLIENT_GITHUB_URL
cd medicare-client
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create:

```text
.env.local
```

and add the required frontend environment variables.

## 4. Start Development Server

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

---

# 🖥️ Backend Setup

## 1. Clone Server Repository

```bash
git clone https://github.com/mdshihabshahriar/MediCare-Client/
cd medicare-server
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create:

```text
.env
```

and add MongoDB, JWT, Stripe and authentication credentials.

## 4. Start Server

```bash
npm run dev
```

---

# 🌟 Optional Features

Additional features implemented/planned:

* 🌙 Dark / Light Theme
* 📅 Doctor Availability Calendar

---

# 📈 Future Improvements

Possible future improvements include:

* Video consultation
* Real-time doctor-patient chat
* Email and SMS notifications
* Advanced medical record management
* AI-powered symptom assistance
* Hospital management module
* Prescription PDF generation
* Doctor availability calendar
* Online consultation

---

# 🎯 Project Goals

MediCare Connect aims to:

* Digitize healthcare appointment booking
* Reduce patient waiting time
* Improve doctor schedule management
* Simplify healthcare administration
* Securely manage medical information
* Provide seamless online payments
* Improve communication between patients and doctors

---

# 👨‍💻 Developer

**Shihab Shahriar**

Computer Science & Engineering Student

### Connect With Me

* GitHub: `https://github.com/mdshihabshahriar`
* LinkedIn: `https://www.linkedin.com/in/mdshihabshahriar/`
* Portfolio: `https://mdshihabshahriar.vercel.app/`

---

# 📜 License

This project was developed for educational and portfolio purposes.

© 2026 MediCare Connect. All rights reserved.
