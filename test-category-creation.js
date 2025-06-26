const axios = require('axios');

const testCategoryCreation = async () => {
  try {
    console.log('Testing category creation...');
    
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
    const categoryData = {
      name: 'Test Category Frontend',
      description: 'Test category description from frontend'
    };
    
    console.log('Sending category data:', categoryData);
    
    const categoryResponse = await axios.post('http://localhost:5000/api/categories', categoryData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Category created successfully:', categoryResponse.data);
    
  } catch (error) {
    console.error('❌ Category creation failed:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Message:', error.response?.data);
    console.error('Full Error:', error.message);
    
    if (error.response?.status === 401) {
      console.error('Authentication failed - check if you\'re logged in as admin');
    } else if (error.response?.status === 400) {
      console.error('Bad request - check the data being sent');
    } else if (error.response?.status === 500) {
      console.error('Server error - check backend logs');
    }
  }
};

testCategoryCreation(); 