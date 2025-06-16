# Learning Management System (LMS)

A full-stack Learning Management System built with React, Node.js, Express, and MongoDB. This application allows students to enroll in courses, track their progress, and learn through video content, while administrators can manage courses, categories, and monitor student progress.

## Features

- User authentication (Student and Admin roles)
- Course browsing and enrollment
- Video-based course content
- Progress tracking
- Course analytics
- Category and subcategory management
- Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-app
```

2. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

3. Create a `.env` file in the root directory for the frontend:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## Installation

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database with initial data:
```bash
node seed.js
```

This will create:
- An admin user (email: admin@example.com, password: admin123)
- A student user (email: student@example.com, password: student123)
- Sample categories and courses

### Frontend Setup

1. Navigate to the root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

1. In the server directory:
```bash
cd server
npm start
```

The backend server will start on http://localhost:5000

### Start the Frontend Development Server

1. In a new terminal, from the root directory:
```bash
npm start
```

The frontend application will start on http://localhost:3000

## Accessing the Application

1. Open your browser and navigate to http://localhost:3000

2. You can log in with the following credentials:

   **Admin Account:**
   - Email: admin@example.com
   - Password: admin123

   **Student Account:**
   - Email: student@example.com
   - Password: student123

## Available Scripts

### Backend (server directory)

- `npm start` - Start the backend server
- `npm run dev` - Start the server in development mode with nodemon
- `node seed.js` - Seed the database with initial data

### Frontend (root directory)

- `npm start` - Start the frontend development server
- `npm build` - Build the frontend for production
- `npm test` - Run frontend tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
lms-app/
├── server/                 # Backend directory
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js         # Main server file
│   └── seed.js           # Database seeder
├── src/                   # Frontend directory
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── utils/            # Utility functions
│   └── App.js            # Main App component
├── public/               # Static files
└── package.json         # Project dependencies
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Courses
- GET `/api/courses` - Get all courses
- GET `/api/courses/:courseId` - Get course details
- POST `/api/courses/:courseId/enroll` - Enroll in a course
- POST `/api/courses/:courseId/progress` - Update course progress

### Admin Routes
- POST `/api/admin/courses` - Create a new course
- PUT `/api/admin/courses/:id` - Update a course
- DELETE `/api/admin/courses/:id` - Delete a course
- GET `/api/admin/analytics` - Get course analytics

## Troubleshooting

1. **Database Connection Issues**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file
   - Verify network connectivity

2. **Authentication Issues**
   - Check JWT_SECRET in .env
   - Verify user credentials
   - Clear browser cookies/local storage

3. **API Connection Issues**
   - Ensure backend server is running
   - Check REACT_APP_API_URL in frontend .env
   - Verify CORS settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
