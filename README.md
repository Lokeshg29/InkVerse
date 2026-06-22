# 🎨 InkVerse
### Where Every Tattoo Tells a Story.

InkVerse is a modern full-stack tattoo discovery and booking platform that connects tattoo enthusiasts with professional tattoo artists through a visually immersive experience.

The platform combines artist discovery, tattoo gallery exploration, favorites management, appointment booking, secure authentication, and AI-powered tattoo recommendations into a single seamless application.

---

# 🌐 Live Demo

🔗 Frontend: https://inkverse-on6k.onrender.com

---

# 📖 Project Overview

Finding the right tattoo artist and design can be overwhelming. Most platforms either focus on artist directories or image galleries, forcing users to switch between multiple platforms.

InkVerse solves this problem by providing:

- A curated tattoo gallery
- Professional artist profiles
- Personalized tattoo discovery
- Appointment booking
- Favorite collections
- AI-powered tattoo matching
- Secure user authentication

All within a single platform.

---

# ✨ Core Features

## 🖼️ Tattoo Gallery

Explore a curated collection of tattoo designs from artists worldwide.

### Features

- Browse tattoo designs
- Search tattoos by keyword
- Filter by tattoo style
- Responsive gallery layout
- Detailed tattoo cards
- Favorite tattoo designs

### Supported Styles

- Traditional
- Japanese
- Blackwork
- Geometric
- Tribal
- Watercolor
- Realism
- Minimalist
- Anime

---

## 👨‍🎨 Artist Discovery

Discover talented tattoo artists and their specialties.

### Artist Profile Includes

- Profile image
- Biography
- Location
- Experience
- Rating
- Specialties
- Portfolio previews

### Artist Information

Users can explore:

- Artist background
- Tattoo style expertise
- Professional experience
- Portfolio work

---

## ❤️ Favorites System

Registered users can create their own tattoo inspiration collection.

### Features

- Add tattoos to favorites
- Remove tattoos from favorites
- Personal favorites dashboard
- Persistent user storage

---

## 📅 Tattoo Booking System

Book tattoo sessions directly through the platform.

### Features

- Select tattoo designs
- Book appointments
- Track booking status
- View booking history
- User booking dashboard

### Booking Status Workflow

- Pending
- Confirmed
- Cancelled

---

## 🤖 AI Match System

InkVerse includes an AI-powered tattoo recommendation engine.

### Purpose

Helps users discover tattoo styles that best match their preferences.

### Current Functionality

- User preference analysis
- Style recommendations
- Tattoo category matching
- Personalized suggestions

---

## 🔐 Authentication & Security

Secure authentication system built using JWT.

### Features

- User registration
- User login
- JWT token generation
- Protected routes
- Persistent sessions
- Secure API communication

### Security Measures

- Password hashing
- Token validation
- Protected endpoints
- Authorization middleware

---

# 🏗️ System Architecture

```text
Client (Next.js Frontend)
        │
        ▼
 REST API Requests
        │
        ▼
Node.js + Express Backend
        │
        ▼
MongoDB Atlas Database
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| Next.js | React Framework |
| React | UI Development |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Context API | State Management |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | API Framework |
| JWT | Authentication |
| Middleware | Route Protection |

---

## Database

| Technology | Purpose |
|------------|----------|
| MongoDB Atlas | Cloud Database |
| Mongoose | ODM |

---

## Deployment

| Service | Purpose |
|----------|----------|
| Render | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Database Hosting |

---

# 📂 Project Structure

```text
InkVerse
│
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── context
│   │   ├── lib
│   │   └── types
│   │
│   ├── public
│   │   ├── artists
│   │   ├── tattoos
│   │   └── images
│   │
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── seed
│   │   └── utils
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🗄️ Database Design

## Users Collection

```javascript
{
  name,
  email,
  password,
  favorites[],
  createdAt
}
```

---

## Artists Collection

```javascript
{
  name,
  bio,
  photoUrl,
  location,
  specialties[],
  rating,
  experienceYears
}
```

---

## Tattoos Collection

```javascript
{
  title,
  imageUrl,
  style,
  artist,
  description
}
```

---

## Bookings Collection

```javascript
{
  user,
  artist,
  tattoo,
  bookingDate,
  status
}
```

---

# 🚀 API Modules

### Authentication API

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

---

### Artists API

```text
GET /api/artists
GET /api/artists/:id
```

---

### Tattoos API

```text
GET /api/tattoos
GET /api/tattoos/:id
```

---

### Favorites API

```text
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:id
```

---

### Booking API

```text
GET  /api/bookings
POST /api/bookings
```

---

### AI Match API

```text
POST /api/ai/match
```

---

# 🎯 Key Challenges Solved

During development and deployment:

### Frontend

- Dynamic routing
- State management
- Responsive UI
- API integration
- TypeScript type safety

### Backend

- REST API design
- JWT authentication
- Route protection
- MongoDB integration
- Data validation

### Deployment

- Production build optimization
- Environment variable management
- CORS configuration
- MongoDB Atlas connectivity
- Render deployment

---

# 📈 Future Enhancements

### Planned Features

- Artist availability calendar
- Real-time booking updates
- Tattoo image uploads
- User reviews & ratings
- Payment gateway integration
- AI image generation
- AI tattoo preview system
- Artist verification badges
- Email notifications
- Admin dashboard
- Recommendation engine improvements

---

# 💻 Local Setup

## Clone Repository

```bash
git clone <repository-url>
cd InkVerse
```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
```

---

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# 📸 Screenshots

Add screenshots here after deployment.

### Home Page

![Home](assets/home.png)

### Gallery

![Gallery](assets/gallery.png)

### Artists

![Artists](assets/artists.png)

### AI Match

![AI Match](assets/ai-match.png)

### Dashboard

![Dashboard](assets/dashboard.png)

---

# 👨‍💻 Developer

### Lokesh

B.Tech Computer Science Engineering  
Anurag University (2023 – 2027)

### Interests

- Artificial Intelligence
- Machine Learning
- Full Stack Development
- Data Science
- Cloud Technologies

---

# ⭐ Project Highlights

✅ Full Stack Architecture

✅ JWT Authentication

✅ MongoDB Atlas Integration

✅ RESTful API Design

✅ AI Recommendation Module

✅ Responsive UI

✅ Artist Discovery Platform

✅ Favorites Management

✅ Booking Workflow

✅ Cloud Deployment

✅ Production Ready

---

## "Where Every Tattoo Tells a Story."
