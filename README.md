Chat App (Frontend)
Welcome to the Chat App Frontend, a modern and responsive user interface built with Next.js. This project connects seamlessly to a backend API and leverages Firebase for authentication, storage, messaging, and analytics.

🚀 Features

Real-time chat functionality
User authentication via Firebase
Responsive design for all devices
Easy deployment with Vercel or Docker
Modular and scalable codebase


🛠 Tech Stack

Next.js: React framework for server-side rendering and static site generation
Node.js: JavaScript runtime (LTS version 18+ recommended)
Firebase: Handles authentication, storage, messaging, and analytics
Docker: Containerization for consistent environments
Package Managers: npm, yarn, or pnpm
Vercel: Optional deployment platform for simplified hosting


📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS version 18+)
npm, yarn, or pnpm
Docker (optional for containerized setup)
Git for version control


🔧 Environment Setup
To configure the project, create a .env.local file in the project root and add the following Firebase credentials and backend host URL:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_BE_HOST=http://localhost:5000


Note: For production (e.g., Docker or Vercel), define these variables in your hosting platform's environment configuration. Do not commit .env.local or .env.production to Git.


🖥️ Local Development

Clone the Repository
git clone https://github.com/Samanvith20/chat-app.git
cd chat-app


Install Dependencies
npm install
# or
yarn install
# or
pnpm install


Run the Development Server
npm run dev
# or
yarn dev
# or
pnpm dev

The app will be available at http://localhost:3000.



🔨 Production Build

Build the Project
npm run build
# or
yarn build
# or
pnpm build


Start the Production Server
npm start
# or
yarn start
# or
pnpm start

The app will run at http://localhost:3000.



🐳 Docker Setup

Build the Docker Image
docker build -t chat-app-frontend .


Run the Container
docker run --rm -it -p 3000:3000 --env-file .env.production chat-app-frontend


Optional: Use Docker ComposeCreate a docker-compose.yml file:
version: "3.8"
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production

Run the application:
docker-compose up --build




🌐 Deployment on Vercel

Push your repository to GitHub.
Connect your repository to Vercel.
Configure the environment variables in Vercel's dashboard.
Deploy the app with a single click!


📝 Notes

Ensure your backend API is running and accessible at the URL specified in NEXT_PUBLIC_BE_HOST.
For Firebase setup, refer to the Firebase Console to obtain your credentials.
Avoid exposing sensitive environment variables in public repositories.


🤝 Contributing
We welcome contributions! To get started:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.


📧 Contact
For questions or support, reach out to the project maintainer at your-email@example.com.

Happy coding! 🎉
