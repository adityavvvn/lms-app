# LMS App Deployment Guide for Render

## Deployed URLs

- **Frontend:** https://lms-app-cb9n.onrender.com
- **Backend:** https://lms-app-backend-nobf.onrender.com

## Prerequisites
1. MongoDB Atlas account (for database)
2. Render account
3. Google OAuth credentials (for authentication)

## Step 1: Set up MongoDB Atlas
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Replace `your_username`, `your_password`, and `your_cluster` with your actual values

## Step 2: Deploy Backend API on Render

### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically detect the `render.yaml` file and create both services

### Option B: Manual Setup
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `lms-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
   - **Plan**: Free

### Environment Variables for Backend
Add these environment variables in Render dashboard:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string (use a password generator)
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override this)

## Step 3: Deploy Frontend on Render

### Option A: Using render.yaml (Recommended)
The frontend will be deployed automatically with the backend.

### Option B: Manual Setup
1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `lms-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

### Environment Variables for Frontend
Add these environment variables in Render dashboard:
- `REACT_APP_API_URL`: `https://lms-app-backend-nobf.onrender.com`
- `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

## Step 4: Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 5: Update Google OAuth
1. Go to Google Cloud Console
2. Update your OAuth 2.0 client credentials
3. Add your Render frontend URL to authorized origins
4. Add your Render frontend URL + `/callback` to authorized redirect URIs

## Step 6: Test Your Deployment
1. Visit your frontend URL: `http://localhost:3000`
2. Test registration, login, and course functionality
3. Check that the API calls are working correctly

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your backend CORS settings include your frontend URL
2. **Database Connection**: Verify your MongoDB URI is correct
3. **JWT Errors**: Ensure JWT_SECRET is set and consistent
4. **Build Failures**: Check that all dependencies are in package.json

### Environment Variables Checklist:
- [ ] MONGODB_URI (Backend)
- [ ] JWT_SECRET (Backend)
- [ ] NODE_ENV=production (Backend)
- [ ] REACT_APP_API_URL (Frontend)
- [ ] REACT_APP_GOOGLE_CLIENT_ID (Frontend)

## Local Development Setup
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Both services configured for local development 