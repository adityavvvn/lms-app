# MERN Stack Learning Management System (LMS)

This is a feature-rich, full-stack Learning Management System (LMS) built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform provides a seamless experience for both students and administrators. Students can browse courses, enroll, and track their learning progress, while administrators have a comprehensive dashboard to manage courses, users, and view analytics.

## ✨ Features

### For Students:
*   **User Authentication:** Secure registration and login (including Google OAuth).
*   **Course Catalog:** Browse and search for available courses.
*   **Course Enrollment:** Easily enroll in courses with a single click.
*   **Video Content Delivery:** Stream course videos directly in the app.
*   **Progress Tracking:** Monitor completion status for each course.
*   **Personalized Dashboard:** View enrolled courses and progress at a glance.

### For Administrators:
*   **Secure Admin Login:** Separate and secure access for administrators.
*   **Course Management:** Create, Read, Update, and Delete (CRUD) courses.
*   **Category Management:** Organize courses into categories and subcategories.
*   **User Management:** View and manage all registered users.
*   **Advanced Analytics:** Get insights into course popularity and student enrollment data.
*   **Admin Dashboard:** A central hub for all administrative tasks.

## 🚀 Tech Stack

### Frontend
*   **React:** A JavaScript library for building user interfaces.
*   **React Router:** For declarative routing in React.
*   **Material-UI (MUI):** A popular React UI framework for faster and easier web development.
*   **Axios:** For making promise-based HTTP requests.
*   **Context API:** For state management.
*   **React Google OAuth:** For Google-based authentication.

### Backend
*   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL document database.
*   **Mongoose:** An elegant MongoDB object modeling tool for Node.js.
*   **JSON Web Tokens (JWT):** For secure user authentication.
*   **bcrypt.js:** For hashing passwords.
*   **CORS:** For handling Cross-Origin Resource Sharing.
*   **Dotenv:** For managing environment variables.

## 🏗️ Project Structure

Here is an overview of the project's file structure:

```
lms-app/
├── server/                 # Backend (Node.js/Express)
│   ├── models/             # Mongoose schemas (Category, Course, Progress, User, etc.)
│   ├── server.js           # Main Express server entry point
│   └── seed.js             # Script to seed the database with initial data
│
├── src/                    # Frontend (React)
│   ├── app/
│   │   └── api/
│   │       └── auth/       # NextAuth.js route handlers
│   ├── components/         # Reusable React components (Navbar, PrivateRoute, etc.)
│   ├── contexts/           # React Context for state management (AuthContext)
│   ├── lib/                # Library files (mongodb connection)
│   ├── models/             # Frontend data models
│   ├── pages/              # Page components for different routes
│   │   ├── admin/          # Admin-specific pages (AdminDashboard)
│   │   └── student/        # Student-specific pages (StudentDashboard)
│   ├── utils/              # Utility functions (auth, axios instances)
│   ├── App.js              # Main application component with routing
│   ├── index.js            # Frontend entry point
│   └── middleware.js       # Next.js middleware
│
├── public/                 # Public assets (icons, index.html)
├── .env.example            # Example environment file
├── cleanup-database.js     # Utility script for database cleanup
├── DEPLOYMENT.md           # Deployment instructions
├── package.json            # Frontend dependencies and scripts
└── README.md               # This file
```

## ⚙️ Setup and Installation

### Prerequisites
*   Node.js (v16 or higher)
*   npm (or yarn)
*   MongoDB

### Backend Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `server` directory and add the following variables. See `.env.example` if available.
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    PORT=5000
    ```
4.  **Seed the database** (optional, but recommended):
    This script creates a default admin user, a student user, and some sample courses.
    ```bash
    node seed.js
    ```

### Frontend Setup

1.  **Navigate to the root directory:**
    ```bash
    cd ..
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root directory and add your API URL and Google Client ID.
    ```env
    REACT_APP_API_URL=http://localhost:5000
    REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
    ```

## 🏃 Running the Application

1.  **Start the Backend Server:**
    In the `/server` directory, run:
    ```bash
    npm start
    ```
    The backend will be running on `http://localhost:5000`.

2.  **Start the Frontend Server:**
    In the root directory, run:
    ```bash
    npm start
    ```
    The frontend will be running on `http://localhost:3000`.

## Default Login Credentials

After seeding the database, you can use these credentials to log in:

*   **Admin Account:**
    *   **Email:** `admin@example.com`
    *   **Password:** `admin123`
*   **Student Account:**
    *   **Email:** `student@example.com`
    *   **Password:** `student123`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/your-amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details. 
