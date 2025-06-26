// Test script to verify frontend authentication
console.log('Testing frontend authentication...');

// Check if user is logged in
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Token exists:', !!token);
console.log('User exists:', !!user);

if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('User role:', userData.role);
    console.log('User email:', userData.email);
    
    if (userData.role === 'admin') {
      console.log('✅ User is logged in as admin');
    } else {
      console.log('❌ User is not admin, role is:', userData.role);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
} else {
  console.log('❌ No user data found - please login first');
}

// Test making a request with the current token
if (token) {
  fetch('http://localhost:5000/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Test Category from Frontend',
      description: 'Testing frontend authentication'
    })
  })
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
  })
  .catch(error => {
    console.error('Request failed:', error);
  });
} else {
  console.log('❌ No token found - cannot test API request');
} 