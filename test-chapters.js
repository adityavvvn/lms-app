const axios = require('axios');

const testChapters = async () => {
  try {
    console.log('🔍 Testing if chapters were saved with courses...\n');
    
    // Get all courses
    const response = await axios.get('https://lms-app-backend-nobf.onrender.com/api/courses');
    const courses = response.data;
    
    console.log(`📚 Found ${courses.length} courses\n`);
    
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.name}`);
      console.log(`   📖 Chapters: ${course.chapters?.length || 0}`);
      
      if (course.chapters && course.chapters.length > 0) {
        course.chapters.forEach((chapter, chIndex) => {
          console.log(`      ${chIndex + 1}. ${chapter.title} (${chapter.duration})`);
        });
      } else {
        console.log('      ❌ No chapters found');
      }
      console.log('');
    });
    
    // Test getting a specific course with full details
    if (courses.length > 0) {
      const firstCourse = courses[0];
      console.log(`🔍 Testing detailed view for: ${firstCourse.name}`);
      
      const detailResponse = await axios.get(`https://lms-app-backend-nobf.onrender.com/api/courses/${firstCourse._id}`);
      const courseDetail = detailResponse.data;
      
      console.log(`   📖 Total chapters: ${courseDetail.chapters?.length || 0}`);
      if (courseDetail.chapters && courseDetail.chapters.length > 0) {
        console.log('   📋 Chapter list:');
        courseDetail.chapters.forEach((chapter, index) => {
          console.log(`      ${index + 1}. ${chapter.title}`);
          console.log(`         Description: ${chapter.description}`);
          console.log(`         Duration: ${chapter.duration}`);
          console.log(`         Order: ${chapter.order}`);
          console.log('');
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing chapters:', error.response?.data || error.message);
  }
};

testChapters(); 