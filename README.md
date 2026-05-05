#  YouTube Clone – Full Stack Application
---

##  Live Demo / Links

-  GitHub Repository:  
 https://github.com/Praveen775D/youtube-clone  

-  Demo Video:  
  https://drive.google.com/file/d/1GOhgaAn_cBCUveL6nKoq9bH2Qgd_XBS-/view?usp=drive_link 

---
---

##  1. Project Overview

This project is a **full-stack YouTube Clone application** that allows users to upload, watch, and interact with videos. It replicates key functionalities of a real video streaming platform including authentication, video playback, and channel management.

---

##  2. Objectives of the Project

- Build a real-world full-stack web application  
- Implement secure authentication using JWT  
- Enable video upload and streaming functionality  
- Create channel-based content management  
- Design a responsive and modern user interface  

---

##  3. Tech Stack

### 3.1 Client
- React.js (Vite)  
- Tailwind CSS  
- Axios  
- React Router  

### 3.2 Server
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Multer (File Uploads)  

---

##  4. System Architecture

The application follows a **client-server architecture**:

User → Frontend (React) → Backend (Node.js/Express) → MongoDB  
                        ↓  
                     File Storage (Uploads)

---

##  5. Project Structure

### 5.1 Client (Frontend)
  client/
│
├── public/
├── src/
│   ├── api/
│   │   └── axios.js            # API config + interceptors
│   ├── assets/                # Images/icons
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── VideoCard.jsx
│   │   ├── CategoryBar.jsx
│   │   └── CommentSection.jsx
│   ├── context/               # Global state
│   │   ├── AuthContext.jsx
│   │   └── PreviewContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/                 # Main pages
│   │   ├── Home.jsx
│   │   ├── VideoPage.jsx
│   │   ├── UploadVideo.jsx
│   │   ├── ChannelPage.jsx
│   │   ├── CreateChannel.jsx
│   │   ├── EditChannel.jsx
│   │   ├── EditVideo.jsx
│   │   ├── Studio.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── utils/
│   │   └── media.js           # media helpers
│   ├── App.jsx                # Routing
│   ├── main.jsx               # Entry point
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js


---

### 5.2 Server (Backend)

server/
│
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/             # Business logic (core functionality)
│   ├── authController.js
│   ├── channelController.js
│   ├── commentController.js
│   └── videoController.js
├── middleware/              # Reusable middlewares
│   ├── authMiddleware.js    # JWT protection
│   └── uploadMiddleware.js   # File upload (Multer)
├── models/                  # MongoDB schemas
│   ├── User.js
│   ├── Channel.js
│   ├── Video.js
│   └── Comment.js
├── routes/                  # API routes
│   ├── authRoutes.js
│   ├── channelRoutes.js
│   ├── commentRoutes.js
│   └── videoRoutes.js
├── uploads/                 # Stored media files
│   ├── avatars/
│   ├── banners/
│   ├── thumbnails/
│   └── videos/
├── seeder/
│   └── seedVideos.js        # Dummy data script
├── utils/
│   └── generateToken.js     # JWT token generation
├── .env                     # Environment variables
├── server.js                # Entry point
├── package.json
└── package-lock.json


---

##  6. Features

### 6.1 Authentication

#### 6.1.1 Registration
- User registers with username, email, and password  
- Option to register using Google  

#### 6.1.2 Login
- Login with email and password  
- Google login supported  
- JWT-based authentication  

---

### 6.2 Home Page

#### 6.2.1 Features
- Displays all videos  
- Category filtering  
- Search functionality  

#### 6.2.2 Navigation
- Sidebar navigation  
- Responsive layout  

---

### 6.3 Video System

- Users can upload videos with thumbnails  
- Videos are stored on the server  

Users can:
- Play videos  
- Like / Dislike  
- View count increases automatically  
- Recommended videos are shown  

---

### 6.4 Channel System

#### 6.4.1 Channel Creation
- Each user can create one channel  
- Channel includes name, description, avatar, banner  

#### 6.4.2 Channel Page Features
- Displays uploaded videos  
- Shows subscriber count  
- Users can subscribe/unsubscribe  

---

### 6.5 Video Upload & Streaming Flow

- User uploads video and thumbnail  
- Backend stores files using Multer  
- Metadata stored in MongoDB  
- Video displayed on video page  

---

### 6.6 Comment System Flow

- Users can add comments  
- Comments linked to videos  
- Comment count updated  

---

##  7. API Endpoints Explanation

### 7.1 Authentication APIs
- Register user  
- Login user  

### 7.2 Video APIs
- Get videos  
- Upload video  
- Like / Dislike  

### 7.3 Channel APIs
- Create channel  
- Subscribe / Unsubscribe  

---

##  8. File Upload System

### 8.1 Storage
- Videos → uploads/videos  
- Thumbnails → uploads/thumbnails  

### 8.2 Future Location
- Cloud storage integration (AWS / Cloudinary)  

---

##  9. Database Schema Overview

### User
- username  
- email  
- password  
- channelId  

### Video
- title  
- videoUrl  
- thumbnailUrl  
- views  
- likes  

### Channel
- name  
- subscribers  
- videos  

---

##  10. Installation & Setup

## Clone Repository

- git clone https://github.com/Praveen775D/youtube-clone
- cd youtube-clone

### Server (Backend)
cd server
npm install
npm run dev

### Client (Frontend)
cd client
npm install
npm run dev

## Create .env:

- PORT=5000
- MONGO_URI=your_mongodb_url
- JWT_SECRET=your_secret

---

## 11. API Overview

- Auth
- POST /api/auth/register
- POST /api/auth/login

## Videos
- GET /api/videos
- POST /api/videos/upload
- PUT /api/videos//like
## Channels
- POST /api/channels
- GET /api/channels/

## Author
- Name : praveen
- GitHub: https://github.com/Praveen775D
- Project: YouTube Clone (MERN Stack)
---