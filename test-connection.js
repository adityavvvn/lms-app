const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test categories endpoint
    const response = await axios.get('http://localhost:5000/api/categories');
    console.log('✅ Categories endpoint working:', response.data);
    
    // Test login endpoint
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('✅ Login endpoint working:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
};

testAPI(); 