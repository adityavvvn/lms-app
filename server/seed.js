const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const Course = require('./models/Course');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user (don't hash password - let the model do it)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Created admin user');

    // Create student user (don't hash password - let the model do it)
    const student = await User.create({
      name: 'Student User',
      email: 'student@example.com',
      password: 'student123',
      role: 'student'
    });
    console.log('Created student user');

    // Create categories
    const programmingCategory = await Category.create({
      name: 'Programming',
      description: 'Learn programming languages and development'
    });

    const webDevCategory = await Category.create({
      name: 'Web Development',
      description: 'Master web development technologies'
    });
    console.log('Created categories');

    // Create subcategories
    const javascriptSubcategory = await Subcategory.create({
      name: 'JavaScript',
      description: 'Learn JavaScript programming',
      categoryId: programmingCategory._id
    });

    const reactSubcategory = await Subcategory.create({
      name: 'React',
      description: 'Learn React framework',
      categoryId: webDevCategory._id
    });
    console.log('Created subcategories');

    // Create courses
    const courses = [
      {
        name: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming language',
        categoryId: programmingCategory._id,
        subcategoryId: javascriptSubcategory._id,
        thumbnail: 'https://via.placeholder.com/300x140?text=JavaScript+Fundamentals',
        chapters: [
          {
            title: 'Introduction to JavaScript',
            description: 'Overview of JavaScript and its features',
            videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            order: 1,
            duration: '15:00'
          },
          {
            title: 'Variables and Data Types',
            description: 'Learn about variables and different data types in JavaScript',
            videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            order: 2,
            duration: '20:00'
          }
        ],
        admin: admin._id
      },
      {
        name: 'React for Beginners',
        description: 'Start your journey with React framework',
        categoryId: webDevCategory._id,
        subcategoryId: reactSubcategory._id,
        thumbnail: 'https://via.placeholder.com/300x140?text=React+for+Beginners',
        chapters: [
          {
            title: 'Introduction to React',
            description: 'What is React and why use it?',
            videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            order: 1,
            duration: '15:00'
          },
          {
            title: 'Components and Props',
            description: 'Learn about React components and props',
            videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            order: 2,
            duration: '20:00'
          }
        ],
        admin: admin._id
      }
    ];

    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();
      // Enroll the student in each course
      course.enrolledStudents.push({
        student: student._id,
        enrolledAt: new Date(),
        progress: { completedChapters: [], lastAccessedChapter: null, lastAccessedAt: null }
      });
      await course.save();
      // Populate the student reference so analytics and UI can access name/email
      await course.populate('enrolledStudents.student', 'name email');
      await course.updateAnalytics();
    }
    console.log('Created courses');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 