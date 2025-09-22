# Chat App (Frontend)

This is the **Next.js frontend** for the Chat App project.  
It provides the user interface and connects to the backend API and Firebase services.

---

## 🚀 Tech Stack
- **Next.js** (React framework)
- **Node.js** (runtime)
- **Firebase** (authentication, storage, messaging)
- **Docker** (containerization)
- **npm / yarn / pnpm** (package manager)

---

## 📦 Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended: 18+)
- [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/))
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

---

## ⚙️ Environment Variables

The application requires the following environment variables to be set:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_BE_HOST=http://localhost:5000
Local Setup
Create a .env.local file in the project root and add the above variables.

Production Setup
For production (Docker, Vercel, or other hosting), define these in your environment configuration.
Do not commit .env.local or production .env files to GitHub.

🖥️ Local Development
Clone the repository

bash
Copy code
git clone https://github.com/Samanvith20/chat-app.git
cd chat-app
Install dependencies

bash
Copy code
npm install
Create .env.local

bash
Copy code
cp .env.example .env.local
Fill in your Firebase credentials and backend host URL.

Run the development server

bash
Copy code
npm run dev
App runs at http://localhost:3000.

🔨 Production Build (local)
Build the project:

bash
Copy code
npm run build
Start the production server:

bash
Copy code
npm start
App runs at http://localhost:3000.

🐳 Run with Docker
Build the Docker image
bash
Copy code
docker build -t chat-app-frontend .
Run the container
