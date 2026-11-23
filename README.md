# MERN Stack Blog Application

A production-ready, containerized full-stack MERN (MongoDB, Express.js, React, Node.js) Blog Application featuring TanStack Query for frontend-backend integration, Docker & Docker Compose orchestration, GitHub Actions CI/CD automation, and seamless cloud deployment on Render.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TanStack Query v5 | Real-time state management, optimistic caching, automatic refetching, responsive UI |
| **Backend** | Node.js 20, Express.js, Mongoose | RESTful API, express-validator, Helmet security headers, Morgan logging, `/health` endpoint |
| **Database** | MongoDB 7.0 (Local / Atlas) | Document store with indexing on timestamps, replica set & Atlas cloud support |
| **Containerization** | Docker, Docker Compose | Multi-stage builds, non-root runner user, alpine base images, service healthchecks |
| **CI/CD** | GitHub Actions | Automated linting, unit/integration tests, Docker Hub image build & push |
| **Cloud Hosting** | Render (Web Service + Static Site) | Automatic GitHub deployments via `render.yaml` Blueprint |

---

## 📁 Repository Directory Structure

```text
mern-blog-app/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated testing & build pipeline
│       └── cd.yml                 # Docker Hub push & deployment pipeline
├── backend/
│   ├── src/
│   │   ├── config/db.js           # Resilient MongoDB connection logic
│   │   ├── controllers/postController.js # RESTful CRUD logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js    # Centralized 404 & error handling
│   │   │   └── validatePost.js    # Express-validator input sanitization
│   │   ├── models/Post.js         # Mongoose Schema & indexes
│   │   ├── routes/
│   │   │   ├── healthRoutes.js    # /health & /api/health probes
│   │   │   └── postRoutes.js      # /api/posts endpoints
│   │   └── server.js              # Express app bootstrap & graceful shutdown
│   ├── tests/
│   │   └── api.test.js            # In-memory MongoDB integration test suite
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                 # Multi-stage, non-root Node runner
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/postsApi.js        # Axios instance & TanStack Query services
│   │   ├── components/
│   │   │   ├── Header.jsx         # Live backend status indicator
│   │   │   ├── PostCard.jsx       # Individual post card with tag selection
│   │   │   ├── PostForm.jsx       # Mutating form for creating posts
│   │   │   └── PostList.jsx       # Paginated & filtered post viewer
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tests/
│   │   ├── App.test.jsx
│   │   └── setup.js
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                 # Multi-stage: Vite build -> Nginx Alpine
│   ├── nginx.conf                 # SPA fallback & reverse proxy configuration
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── docker-compose.yml             # Full-stack local orchestration (Mongo + API + Web)
├── render.yaml                    # Declarative Infrastructure Blueprint for Render
└── README.md
```

---

## 🚀 Quickstart: Running Locally

### Option 1: Full-Stack Docker Compose (Recommended)

Run all 3 services (`mongo`, `backend`, `frontend`) in one command:

```bash
docker compose up --build -d
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend Healthcheck**: [http://localhost:5000/health](http://localhost:5000/health)
- **Backend API**: [http://localhost:5000/api/posts](http://localhost:5000/api/posts)
- **MongoDB**: `localhost:27017`

To check container health status and logs:
```bash
docker compose ps
docker compose logs -f backend
```

To stop all services:
```bash
docker compose down -v
```

---

### Option 2: Standalone Local Development

#### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🧪 Running Tests

### Backend Tests (Integration & Unit with In-Memory MongoDB)
```bash
cd backend
npm test
```

### Frontend Tests (React Testing Library & Vitest)
```bash
cd frontend
npm test
```

---

## 🌐 Deploying to Render

### Step 1: Deploy with Render Blueprint (`render.yaml`)
1. Push your repository to GitHub.
2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New** > **Blueprint**.
4. Select your GitHub repository. Render will automatically parse `render.yaml` and create:
   - `mern-blog-backend` (Node Web Service)
   - `mern-blog-frontend` (Static Site)

### Step 2: Configure Environment Variables on Render
- **In `mern-blog-backend`**:
  - `MONGO_URI`: Your MongoDB Atlas connection URI (`mongodb+srv://<user>:<password>@cluster0.mongodb.net/mern_blog?retryWrites=true&w=majority`)
  - `CORS_ORIGIN`: Your deployed frontend URL (e.g. `https://mern-blog-frontend.onrender.com`)
- **In `mern-blog-frontend`**:
  - `VITE_API_BASE_URL`: Your deployed backend URL with `/api` suffix (e.g. `https://mern-blog-backend.onrender.com/api`)
