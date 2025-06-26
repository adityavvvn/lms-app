const axios = require('axios');

const cleanupDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('https://lms-app-backend-nobf.onrender.com/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Step 2: Get all courses and delete them
    console.log('\n2. Deleting all courses...');
    const coursesResponse = await axios.get('https://lms-app-backend-nobf.onrender.com/api/courses');
    const courses = coursesResponse.data;
    
    for (const course of courses) {
      try {
        await axios.delete(`https://lms-app-backend-nobf.onrender.com/api/courses/${course._id}`, { headers });
        console.log(`✅ Deleted course: ${course.name}`);
      } catch (error) {
        console.log(`⚠️ Could not delete course: ${course.name} - ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Step 3: Get all subcategories and delete them
    console.log('\n3. Deleting all subcategories...');
    const subcategoriesResponse = await axios.get('https://lms-app-backend-nobf.onrender.com/api/subcategories');
    const subcategories = subcategoriesResponse.data;
    
    for (const subcategory of subcategories) {
      try {
        await axios.delete(`https://lms-app-backend-nobf.onrender.com/api/subcategories/${subcategory._id}`, { headers });
        console.log(`✅ Deleted subcategory: ${subcategory.name}`);
      } catch (error) {
        console.log(`⚠️ Could not delete subcategory: ${subcategory.name} - ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Step 4: Get all categories and delete them
    console.log('\n4. Deleting all categories...');
    const categoriesResponse = await axios.get('https://lms-app-backend-nobf.onrender.com/api/categories');
    const categories = categoriesResponse.data;
    
    for (const category of categories) {
      try {
        await axios.delete(`https://lms-app-backend-nobf.onrender.com/api/categories/${category._id}`, { headers });
        console.log(`✅ Deleted category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Could not delete category: ${category.name} - ${error.response?.data?.message || error.message}`);
      }
    }
    
    console.log('\n🎉 Database cleanup completed!');
    console.log('📊 Deleted:');
    console.log(`   - ${courses.length} courses`);
    console.log(`   - ${subcategories.length} subcategories`);
    console.log(`   - ${categories.length} categories`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.response?.data || error.message);
  }
};

cleanupDatabase(); 