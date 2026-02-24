# ⚡ FreelanceFinder
### *Discovering Opportunities, Unlocking Potential*

A production-ready full-stack freelance marketplace platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Bootstrap.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, Bootstrap 5, React Router v6 |
| **Styling** | Custom CSS (dark editorial theme), Google Fonts (Syne + DM Sans) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **HTTP Client** | Axios |
| **Notifications** | React Toastify |

---

## 📁 Project Structure

```
freelancefinder/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (freelancers & clients)
│   │   ├── Job.js           # Job listing schema
│   │   └── Proposal.js      # Proposal submission schema
│   ├── routes/
│   │   ├── auth.js          # Register, login, profile update
│   │   ├── jobs.js          # CRUD + search + save
│   │   ├── proposals.js     # Submit, accept, reject, withdraw
│   │   ├── users.js         # Browse freelancers, dashboard stats
│   │   └── categories.js    # Category aggregation
│   ├── middleware/
│   │   └── auth.js          # JWT protect + role authorization
│   ├── server.js            # Express app entry point
│   ├── seed.js              # Database seeder
│   ├── .env.example         # Environment variables template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js   # Global auth state (React Context)
    │   ├── components/
    │   │   ├── Navbar.js        # Sticky navigation with auth menu
    │   │   └── Footer.js        # Site footer with links
    │   ├── pages/
    │   │   ├── Home.js          # Landing page with hero, stats, featured
    │   │   ├── Jobs.js          # Job listings with sidebar filters
    │   │   ├── JobDetail.js     # Full job view + proposal form
    │   │   ├── Freelancers.js   # Freelancer browse with filters
    │   │   ├── FreelancerProfile.js  # Individual freelancer page
    │   │   ├── Login.js         # Sign in form
    │   │   ├── Register.js      # Sign up with role selector
    │   │   ├── Dashboard.js     # User dashboard (client/freelancer)
    │   │   ├── PostJob.js       # Job creation form
    │   │   └── Profile.js       # Profile edit page
    │   ├── App.js               # Routes + protected routes
    │   ├── index.js             # Entry point
    │   └── index.css            # Global styles + design system
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repo-url>
cd freelancefinder
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database with demo data
node seed.js

# Start backend server
npm run dev    # Development (nodemon)
# or
npm start      # Production
```

Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start React development server
npm start
```

Frontend runs on **http://localhost:3000**

---

## 🔧 Environment Variables

Create `backend/.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelancefinder
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 🎭 Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| **Client** | techcorp@example.com | password123 |
| **Client** | startup@example.com | password123 |
| **Freelancer** | sarah@example.com | password123 |
| **Freelancer** | aisha@example.com | password123 |
| **Freelancer** | james@example.com | password123 |

---

## 🌟 Features

### For Clients
- ✅ Post detailed job listings with budget, skills, timeline
- ✅ Browse and search freelancer profiles
- ✅ Review incoming proposals with bids and cover letters
- ✅ Accept/reject proposals to hire freelancers
- ✅ Dashboard to manage all postings and their status

### For Freelancers
- ✅ Browse hundreds of job listings
- ✅ Advanced search with filters (category, budget, experience, duration)
- ✅ Submit proposals with custom bid and cover letter
- ✅ Save favorite jobs
- ✅ Dashboard to track all submitted proposals and their status
- ✅ Rich profile with portfolio, skills, and social links

### Platform
- ✅ JWT-based authentication
- ✅ Role-based access control (client/freelancer/admin)
- ✅ Responsive dark theme UI
- ✅ Real-time proposal count tracking
- ✅ Full-text search on jobs (MongoDB text index)
- ✅ Pagination on all listings
- ✅ Toast notifications for all actions

---

## 📡 API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| PUT | `/api/auth/update-profile` | Protected |

### Jobs
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/jobs` | Public |
| GET | `/api/jobs/featured` | Public |
| GET | `/api/jobs/:id` | Public |
| POST | `/api/jobs` | Client only |
| PUT | `/api/jobs/:id` | Owner/Admin |
| DELETE | `/api/jobs/:id` | Owner/Admin |
| POST | `/api/jobs/:id/save` | Protected |

### Proposals
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/proposals/job/:jobId` | Job owner |
| GET | `/api/proposals/my` | Protected |
| POST | `/api/proposals` | Freelancer only |
| PUT | `/api/proposals/:id/status` | Job owner |
| DELETE | `/api/proposals/:id` | Proposal owner |

### Users
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/users/freelancers` | Public |
| GET | `/api/users/:id` | Public |
| GET | `/api/users/:id/jobs` | Public |

---

## 🎨 Design System

The UI uses a custom **dark editorial** design theme:

- **Colors:** Deep navy + purple accent + emerald green highlights
- **Typography:** Syne (headings) + DM Sans (body) — distinctive, professional
- **Components:** Custom cards, badges, buttons, forms, modals — no generic Bootstrap defaults
- **Animations:** CSS keyframe fade-ins, hover transforms, skeleton loading states
- **Grid:** Fully responsive Bootstrap 5 grid system

---

## 🔐 Security Features

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens with configurable expiry
- Route-level authentication middleware
- Role-based authorization (client/freelancer/admin)
- Input validation with express-validator
- CORS configured for specific origins
- Unique constraint on proposals (one per freelancer per job)

---

## 📈 Scaling Considerations

- MongoDB text indexes for fast search
- Pagination on all list endpoints
- Proposal count denormalized on jobs for performance
- Stateless JWT auth (easy to scale horizontally)
- Modular Express router architecture

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use for personal and commercial projects.

---

*Built with ❤️ using the MERN Stack*
