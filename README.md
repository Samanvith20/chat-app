# 💬 Chat App Frontend

> A sleek, modern real-time chat application built with Next.js and powered by Firebase

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9+-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)](https://www.docker.com/)


---

## ✨ What Makes This Special

🚀 **Lightning Fast** - Real-time messaging with instant delivery  
🔐 **Secure Authentication** - Firebase-powered user management  
📱 **Mobile First** - Responsive design that works everywhere  
⚡ **Easy Deploy** - One-click deployment with Vercel or Docker  
🏗️ **Scalable Architecture** - Built for growth from day one

---

## 🛠️ Built With

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 13+ |
| **Node.js** | Runtime Environment | 18+ LTS |
| **Firebase** | Backend Services | 9+ |
| **Docker** | Containerization | Latest |


---

## 🎯 Prerequisites

Make sure you have these installed before starting:

```bash
✅ Node.js (v18+ LTS)
✅ Package Manager (npm/yarn/pnpm)
✅ Git
✅ Docker (optional)
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Backend Configuration  
NEXT_PUBLIC_BE_HOST=http://localhost:5000
```

> 🚨 **Security Note**: Never commit `.env.local` to version control!

---

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/Samanvith20/chat-app.git
cd chat-app

# Install dependencies
npm install
# or yarn install
# or pnpm install
```

### 2️⃣ Development Server

```bash
npm run dev
# or yarn dev  
# or pnpm dev
```

🎉 **Ready!** Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📦 Production Deployment

### Traditional Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### 🐳 Docker Deployment

#### Quick Docker Run
```bash
# Build image
docker build -t chat-app-frontend .

# Run container
docker run --rm -it -p 3000:3000 --env-file .env.production chat-app-frontend
```


---

## 📋 Important Notes

| ⚠️ | **Backend Connection** | Ensure your backend API is running at `localhost:5000` |
|---|---|---|
| 🔥 | **Firebase Setup** | Get credentials from [Firebase Console](https://console.firebase.google.com/) |
| 🔒 | **Environment Security** | Use platform-specific env vars for production |

---


---

## 📞 Support & Contact

- 📧 **Email**: Samanvith2005@gmail.com


---

<div align="center">

**Happy Coding! 🎉**

Made with ❤️ by the Chat App Team

[⭐ Star this repo](https://github.com/Samanvith20/chat-app) • [🍴 Fork it](https://github.com/Samanvith20/chat-app/fork) • [📚 Documentation](https://github.com/Samanvith20/chat-app/wiki)

</div>
