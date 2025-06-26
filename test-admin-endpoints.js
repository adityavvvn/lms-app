const axios = require('axios');

const testAdminEndpoints = async () => {
  try {
    console.log('Testing admin endpoints...');
    
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');
    
    // Step 2: Test creating a category
    console.log('2. Testing category creation...');
    const categoryResponse = await axios.post('http://localhost:5000/api/categories', {
      name: 'Test Category',
      description: 'Test category description'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Category created:', categoryResponse.data);
    
    // Step 3: Test creating a subcategory
    console.log('3. Testing subcategory creation...');
    const subcategoryResponse = await axios.post('http://localhost:5000/api/subcategories', {
      name: 'Test Subcategory',
      description: 'Test subcategory description',
      categoryId: categoryResponse.data._id
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Subcategory created:', subcategoryResponse.data);
    
    // Step 4: Test creating a course
    console.log('4. Testing course creation...');
    const courseResponse = await axios.post('http://localhost:5000/api/courses', {
      name: 'Test Course',
      description: 'Test course description',
      categoryId: categoryResponse.data._id,
      subcategoryId: subcategoryResponse.data._id,
      thumbnail: 'https://via.placeholder.com/300x140?text=Test+Course'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Course created:', courseResponse.data);
    
    console.log('🎉 All admin endpoints working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('Authentication failed - make sure you\'re logged in as admin');
    }
  }
};

testAdminEndpoints(); 