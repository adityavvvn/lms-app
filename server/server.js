const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://lms-app-cb9n.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set JWT secret with fallback
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not set, using default secret (not recommended for production)');
  process.env.JWT_SECRET = 'your-secret-key-change-this-in-production';
}

// Model declarations
const User = require('./models/User');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const Course = require('./models/Course');
const Progress = require('./models/Progress');

// Authentication middleware
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body); // Debug log
    let { name, email, password, role = 'student' } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password: !!password, role });
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Only allow 'admin' role if there are no admins in the database
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        // If an admin already exists, force role to 'student'
        role = 'student';
      }
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
    });

    console.log('Attempting to save new user:', { name, email, role }); // Debug log
    await user.save();
    console.log('User saved successfully'); // Debug log

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error details:', error); // Detailed error log
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.email, 'Role:', user.role);

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected route example
app.get('/api/auth/me', isAuth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Update current user's profile
app.put('/api/auth/me', isAuth, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (password) user.password = password; // Will be hashed by pre-save hook
    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Admin Routes

// Create Category
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

app.post('/api/categories', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
});

app.delete('/api/categories/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Also delete associated subcategories and courses
    await Subcategory.deleteMany({ categoryId: req.params.id });
    await Course.deleteMany({ categoryId: req.params.id });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

// Create Subcategory
app.post('/api/subcategories', isAuth, isAdmin, async (req, res) => {
  try {
    console.log('Creating subcategory with data:', req.body);
    const { name, description, categoryId } = req.body;
    
    // Validate category exists and log its details
    const category = await Category.findById(categoryId);
    console.log('Found category:', category);
    
    if (!category) {
      console.error('Category not found:', categoryId);
      return res.status(400).json({ message: 'Category not found' });
    }

    const subcategory = new Subcategory({
      name,
      description,
      categoryId: category._id, // Ensure we're using the ObjectId
    });
    
    console.log('Subcategory before save:', JSON.stringify(subcategory, null, 2));
    await subcategory.save();
    
    const populatedSubcategory = await Subcategory.findById(subcategory._id)
      .populate('categoryId', 'name');
    console.log('Created subcategory:', JSON.stringify(populatedSubcategory, null, 2));
    
    res.status(201).json(populatedSubcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ 
      message: 'Error creating subcategory',
      error: error.message 
    });
  }
});

app.delete('/api/subcategories/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    // Also delete associated courses
    await Course.deleteMany({ subcategoryId: req.params.id });
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Error deleting subcategory' });
  }
});

// Create Course
app.post('/api/courses', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, description, categoryId, subcategoryId, thumbnail, chapters = [] } = req.body;
    
    console.log('Creating course with data:', {
      name,
      description: description?.substring(0, 50) + '...',
      categoryId,
      subcategoryId,
      thumbnail,
      chaptersCount: chapters?.length || 0
    });
    
    if (chapters && chapters.length > 0) {
      console.log('Chapters data:', chapters.map(ch => ({
        title: ch.title,
        videoUrl: ch.videoUrl,
        order: ch.order
      })));
    }
    
    // Validate category and subcategory
    const category = await Category.findById(categoryId);
    const subcategory = await Subcategory.findById(subcategoryId);
    
    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }
    if (!subcategory) {
      return res.status(400).json({ message: 'Subcategory not found' });
    }
    if (subcategory.categoryId.toString() !== categoryId) {
      return res.status(400).json({ message: 'Subcategory does not belong to the selected category' });
    }

    // Process chapters to ensure proper _id fields
    const processedChapters = chapters.map((chapter, index) => {
      // Ensure each chapter has a proper _id (use timestamp if not present or invalid)
      if (!chapter._id || typeof chapter._id !== 'string') {
        chapter._id = (Date.now() + index).toString();
      }
      return chapter;
    });

    const course = new Course({
      name,
      description,
      categoryId,
      subcategoryId,
      thumbnail,
      chapters: processedChapters,
      enrolledStudents: [],
      analytics: {
        totalEnrollments: 0,
        averageProgress: 0,
        chapterViews: []
      },
      admin: req.user._id,
    });

    console.log('Course object before save:', {
      name: course.name,
      chaptersCount: course.chapters?.length || 0
    });

    await course.save();
    await course.populate('categoryId', 'name');
    await course.populate('subcategoryId', 'name');
    
    console.log('Course saved successfully:', {
      courseId: course._id,
      name: course.name,
      chaptersCount: course.chapters?.length || 0
    });
    
    res.status(201).json(course);
  } catch (err) {
    console.error('Error creating course:', err);
    if (err.name === 'ValidationError') {
      console.error('Validation errors:', err.errors);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
});

// Get all courses (admin only sees their own)
app.get('/api/courses', isAuth, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find({ admin: req.user._id })
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('reviews.user', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get single course details
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    console.log('Fetching course details:', {
      courseId: req.params.courseId,
      headers: req.headers,
      query: req.query,
      timestamp: new Date().toISOString(),
      isValidObjectId: mongoose.Types.ObjectId.isValid(req.params.courseId)
    });
    
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      console.error('Invalid course ID format:', {
        courseId: req.params.courseId,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ 
        message: 'Invalid course ID format',
        courseId: req.params.courseId 
      });
    }

    const course = await Course.findById(req.params.courseId)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('enrolledStudents.student', 'name email');

    console.log('Database query result:', {
      found: !!course,
      courseId: req.params.courseId,
      timestamp: new Date().toISOString()
    });

    if (!course) {
      console.error('Course not found:', {
        courseId: req.params.courseId,
        isValidObjectId: mongoose.Types.ObjectId.isValid(req.params.courseId),
        timestamp: new Date().toISOString()
      });
      return res.status(404).json({ 
        message: 'Course not found',
        courseId: req.params.courseId
      });
    }

    console.log('Found course:', {
      courseId: course._id,
      name: course.name,
      chapters: course.chapters?.length || 0,
      enrolledStudents: course.enrolledStudents?.length || 0,
      category: course.categoryId?.name,
      subcategory: course.subcategoryId?.name,
      timestamp: new Date().toISOString()
    });

    // Log the full course object for debugging
    console.log('Full course object:', JSON.stringify(course, null, 2));

    res.json(course);
  } catch (err) {
    console.error('Error fetching course details:', {
      error: err.message,
      stack: err.stack,
      courseId: req.params.courseId,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      message: 'Error fetching course details', 
      error: err.message,
      courseId: req.params.courseId
    });
  }
});

// Course enrollment route
app.post('/api/courses/:courseId/enroll', isAuth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Enrollment request received:', {
      courseId: req.params.courseId,
      userId: req.user._id,
      userRole: req.user.role,
      headers: req.headers
    });

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      console.error('Invalid course ID format:', req.params.courseId);
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    // Find course with session
    const course = await Course.findById(req.params.courseId).session(session);
    if (!course) {
      console.error('Course not found:', req.params.courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('Found course:', {
      courseId: course._id,
      name: course.name,
      enrolledStudents: course.enrolledStudents?.length || 0
    });

    // Check if student is already enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.user._id.toString()
    );

    if (isEnrolled) {
      console.log('User already enrolled:', {
        userId: req.user._id,
        courseId: course._id
      });
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Find user with session
    const user = await User.findById(req.user._id).session(session);
    if (!user) {
      console.error('User not found:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Add student to enrolled students
    course.enrolledStudents.push({
      student: req.user._id,
      enrolledAt: new Date(),
      progress: {
        completedChapters: [],
        lastAccessedChapter: null,
        lastAccessedAt: null
      }
    });
    console.log('Added student to course.enrolledStudents');

    // Add course to user's enrolledCourses
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }
    if (!user.enrolledCourses.includes(course._id)) {
      user.enrolledCourses.push(course._id);
      await user.save({ session });
      console.log('Added course to user\'s enrolledCourses:', {
        userId: user._id,
        courseId: course._id
      });
    }

    // Create initial progress record
    const progress = new Progress({
      user: req.user._id,
      course: course._id,
      completedChapters: [],
      progress: 0
    });
    await progress.save({ session });
    console.log('Created initial progress record:', {
      userId: req.user._id,
      courseId: course._id
    });

    // Save course and update analytics
    await course.save({ session });
    await course.updateAnalytics();
    console.log('Successfully saved course and updated analytics:', {
      courseId: course._id,
      totalEnrollments: course.analytics?.totalEnrollments,
      averageProgress: course.analytics?.averageProgress
    });

    // Commit the transaction
    await session.commitTransaction();
    console.log('Transaction committed successfully');
    
    res.json({ message: 'Successfully enrolled in course' });
  } catch (err) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Error enrolling in course:', {
      error: err.message,
      stack: err.stack,
      userId: req.user?._id,
      courseId: req.params.courseId,
      name: err.name,
      code: err.code
    });
    res.status(500).json({ 
      message: 'Error enrolling in course', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    session.endSession();
  }
});

// Update progress
app.post('/api/courses/:courseId/progress', isAuth, async (req, res) => {
  try {
    const { chapterId } = req.body;
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === req.user._id.toString()
    );

    if (!enrollment) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    if (!enrollment.progress.completedChapters.includes(chapterId)) {
      enrollment.progress.completedChapters.push(chapterId);
    }

    enrollment.progress.lastAccessedChapter = chapterId;
    enrollment.progress.lastAccessedAt = new Date();

    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    progress.progress = (progress.completedChapters.length / course.chapters.length) * 100;
    progress.updatedAt = new Date();

    await progress.save();
    await course.updateAnalytics();
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
});

// Get user's enrolled courses
app.get('/api/user/courses', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses',
        populate: [
          { path: 'categoryId', select: 'name' },
          { path: 'subcategoryId', select: 'name' }
        ]
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get progress for each course
    const progress = await Progress.find({
      user: req.user._id,
      course: { $in: user.enrolledCourses.map(course => course._id) }
    }).populate('course', '_id');

    res.json({
      courses: user.enrolledCourses,
      progress: progress
    });
  } catch (err) {
    console.error('Error fetching user courses:', err);
    res.status(500).json({ 
      message: 'Error fetching enrolled courses', 
      error: err.message 
    });
  }
});

// Subcategory routes
app.get('/api/subcategories', async (req, res) => {
  try {
    console.log('Fetching subcategories...');
    const subcategories = await Subcategory.find()
      .populate('categoryId', 'name')
      .sort({ name: 1 });
    
    // Log the exact structure of each subcategory
    console.log('Subcategories raw data:', JSON.stringify(subcategories, null, 2));
    console.log('First subcategory categoryId type:', typeof subcategories[0]?.categoryId);
    console.log('First subcategory categoryId value:', subcategories[0]?.categoryId);
    
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});

// Update course (admin can only update their own)
app.put('/api/courses/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    const { name, description, categoryId, subcategoryId, thumbnail, chapters } = req.body;
    
    // Validate category and subcategory if they're being updated
    if (categoryId && categoryId !== course.categoryId.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }
    
    if (subcategoryId && subcategoryId !== course.subcategoryId.toString()) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(400).json({ message: 'Subcategory not found' });
      }
      if (subcategory.categoryId.toString() !== categoryId) {
        return res.status(400).json({ message: 'Subcategory does not belong to the selected category' });
      }
    }

    // Update course fields
    course.name = name || course.name;
    course.description = description || course.description;
    course.categoryId = categoryId || course.categoryId;
    course.subcategoryId = subcategoryId || course.subcategoryId;
    course.thumbnail = thumbnail || course.thumbnail;
    
    // Update chapters if provided
    if (chapters) {
      // Validate chapter data and ensure proper _id fields
      for (const chapter of chapters) {
        if (!chapter.title || !chapter.videoUrl) {
          return res.status(400).json({ message: 'Each chapter must have a title and video URL' });
        }
        if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(chapter.videoUrl)) {
          return res.status(400).json({ message: 'Invalid YouTube URL in chapter' });
        }
        
        // Ensure each chapter has a proper _id (use timestamp if not present or invalid)
        if (!chapter._id || typeof chapter._id !== 'string') {
          chapter._id = Date.now().toString();
        }
      }
      course.chapters = chapters;
    }

    await course.save();
    await course.populate('categoryId', 'name');
    await course.populate('subcategoryId', 'name');
    await course.populate('enrolledStudents.student', 'name email');
    
    // Update analytics
    await course.updateAnalytics();
    
    res.json(course);
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});

// Delete course (admin can only delete their own)
app.delete('/api/courses/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// Temporary seed endpoint (remove after use)
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create admin user (don't hash password - let the model do it)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    
    // Create student user (don't hash password - let the model do it)
    const student = await User.create({
      name: 'Student User',
      email: 'student@example.com',
      password: 'student123',
      role: 'student'
    });
    
    res.json({ 
      message: 'Database seeded successfully',
      users: [
        { email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { email: 'student@example.com', password: 'student123', role: 'student' }
      ]
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Error seeding database' });
  }
});

// Admin creates a new admin user
app.post('/api/admin/users', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    // Create new admin user
    const user = new User({
      name,
      email,
      password,
      role: 'admin',
    });
    await user.save();
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

// Get all reviews for a course
app.get('/api/courses/:id/reviews', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('reviews.user', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.reviews || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Submit a review for a course (enrolled users only, one per user)
app.post('/api/courses/:id/reviews', isAuth, async (req, res) => {
  try {
    const { rating, text } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // Check if user is enrolled
    const isEnrolled = course.enrolledStudents.some(e => e.student.toString() === req.user._id.toString());
    if (!isEnrolled) {
      return res.status(403).json({ message: 'Only enrolled users can submit reviews' });
    }
    // Check if user already reviewed
    const alreadyReviewed = course.reviews.some(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }
    // Add review
    course.reviews.push({ user: req.user._id, rating, text });
    await course.save();
    await course.populate('reviews.user', 'name');
    res.status(201).json(course.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Get all users (optionally filter by role)
app.get('/api/users', async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Public: Get all courses (for students and guests)
app.get('/api/public-courses', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 