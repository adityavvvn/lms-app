const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const Course = require('./models/Course');
const Progress = require('./models/Progress');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

// Subcategory Schema
const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  createdAt: { type: Date, default: Date.now },
});

// Remove duplicate schemas and use the ones from models/
const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);
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
    const { name, email, password, role = 'student' } = req.body;

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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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
app.post('/api/admin/subcategories', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    const subcategory = new Subcategory({
      name,
      description,
      categoryId,
    });
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subcategory' });
  }
});

// Create Course
app.post('/api/admin/courses', isAuth, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      subcategoryId,
      chapters,
      thumbnail,
      price,
    } = req.body;

    const course = new Course({
      title,
      description,
      instructor: req.user._id,
      category: categoryId,
      subcategory: subcategoryId,
      chapters,
      thumbnail,
      price,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Student Routes

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    console.log('Fetching courses...');
    const courses = await Course.find()
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('enrolledStudents.student', 'name email')
      .sort({ createdAt: -1 });
    console.log(`Found ${courses.length} courses`);
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
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

// Course routes
app.post('/api/courses', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, description, categoryId, subcategoryId, thumbnail } = req.body;
    
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

    const course = new Course({
      name,
      description,
      categoryId,
      subcategoryId,
      thumbnail,
      chapters: [],
      enrolledStudents: [],
      analytics: {
        totalEnrollments: 0,
        averageProgress: 0,
        chapterViews: []
      }
    });

    await course.save();
    await course.populate('categoryId', 'name');
    await course.populate('subcategoryId', 'name');
    
    res.status(201).json(course);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
});

app.put('/api/courses/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, description, categoryId, subcategoryId, thumbnail, chapters } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

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
      // Validate chapter data
      for (const chapter of chapters) {
        if (!chapter.title || !chapter.videoUrl) {
          return res.status(400).json({ message: 'Each chapter must have a title and video URL' });
        }
        if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(chapter.videoUrl)) {
          return res.status(400).json({ message: 'Invalid YouTube URL in chapter' });
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

app.delete('/api/courses/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 