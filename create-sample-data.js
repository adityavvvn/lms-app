const axios = require('axios');

const sampleData = {
  categories: [
    { name: 'Programming', description: 'Learn programming languages and development' },
    { name: 'Web Development', description: 'Master web development technologies' },
    { name: 'Data Science', description: 'Explore data analysis and machine learning' },
    { name: 'Mobile Development', description: 'Build mobile applications' },
    { name: 'DevOps & Cloud', description: 'Learn deployment and cloud technologies' }
  ],
  
  subcategories: [
    // Programming
    { name: 'JavaScript', description: 'Learn JavaScript programming', categoryIndex: 0 },
    { name: 'Python', description: 'Master Python programming', categoryIndex: 0 },
    { name: 'Java', description: 'Learn Java programming', categoryIndex: 0 },
    
    // Web Development
    { name: 'React', description: 'Learn React framework', categoryIndex: 1 },
    { name: 'Node.js', description: 'Master Node.js backend development', categoryIndex: 1 },
    { name: 'Vue.js', description: 'Learn Vue.js framework', categoryIndex: 1 },
    
    // Data Science
    { name: 'Machine Learning', description: 'Learn machine learning algorithms', categoryIndex: 2 },
    { name: 'Data Analysis', description: 'Master data analysis techniques', categoryIndex: 2 },
    
    // Mobile Development
    { name: 'React Native', description: 'Build cross-platform mobile apps', categoryIndex: 3 },
    { name: 'Flutter', description: 'Learn Flutter development', categoryIndex: 3 },
    
    // DevOps & Cloud
    { name: 'Docker', description: 'Learn containerization with Docker', categoryIndex: 4 },
    { name: 'AWS', description: 'Master Amazon Web Services', categoryIndex: 4 }
  ],
  
  courses: [
    {
      name: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming language with hands-on projects. Learn variables, functions, objects, arrays, and modern ES6+ features.',
      categoryIndex: 0,
      subcategoryIndex: 0,
      thumbnail: 'https://via.placeholder.com/300x140?text=JavaScript+Fundamentals',
      chapters: [
        {
          title: 'Introduction to JavaScript',
          description: 'Overview of JavaScript, its history, and why it\'s essential for web development',
          videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
          order: 1,
          duration: '15:30'
        },
        {
          title: 'Variables and Data Types',
          description: 'Learn about var, let, const, and different data types in JavaScript',
          videoUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
          order: 2,
          duration: '20:15'
        },
        {
          title: 'Functions and Scope',
          description: 'Understanding function declarations, expressions, and variable scope',
          videoUrl: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY',
          order: 3,
          duration: '18:45'
        },
        {
          title: 'Objects and Arrays',
          description: 'Working with objects, arrays, and array methods',
          videoUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
          order: 4,
          duration: '25:20'
        },
        {
          title: 'ES6+ Features',
          description: 'Modern JavaScript features: arrow functions, destructuring, spread operator',
          videoUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
          order: 5,
          duration: '22:10'
        },
        {
          title: 'DOM Manipulation',
          description: 'Interacting with the Document Object Model',
          videoUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
          order: 6,
          duration: '28:35'
        }
      ]
    },
    {
      name: 'React for Beginners',
      description: 'Start your journey with React framework and build modern web applications. Learn components, state management, and hooks.',
      categoryIndex: 1,
      subcategoryIndex: 3,
      thumbnail: 'https://via.placeholder.com/300x140?text=React+for+Beginners',
      chapters: [
        {
          title: 'What is React?',
          description: 'Introduction to React, its benefits, and the virtual DOM concept',
          videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
          order: 1,
          duration: '12:20'
        },
        {
          title: 'Setting Up React',
          description: 'Creating a new React project with Create React App',
          videoUrl: 'https://www.youtube.com/watch?v=DLX62G4lc44',
          order: 2,
          duration: '15:45'
        },
        {
          title: 'Components and Props',
          description: 'Building reusable React components and passing data with props',
          videoUrl: 'https://www.youtube.com/watch?v=DLX62G4lc44',
          order: 3,
          duration: '25:10'
        },
        {
          title: 'State and Lifecycle',
          description: 'Understanding React state and component lifecycle methods',
          videoUrl: 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
          order: 4,
          duration: '22:35'
        },
        {
          title: 'React Hooks',
          description: 'Using useState and useEffect hooks for state management',
          videoUrl: 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
          order: 5,
          duration: '30:15'
        },
        {
          title: 'Event Handling',
          description: 'Handling user interactions and events in React',
          videoUrl: 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
          order: 6,
          duration: '18:40'
        },
        {
          title: 'Conditional Rendering',
          description: 'Rendering components conditionally based on state',
          videoUrl: 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
          order: 7,
          duration: '16:25'
        },
        {
          title: 'Lists and Keys',
          description: 'Rendering lists of components with proper keys',
          videoUrl: 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
          order: 8,
          duration: '14:30'
        }
      ]
    },
    {
      name: 'Python for Data Science',
      description: 'Learn Python programming specifically for data analysis and visualization. Master pandas, numpy, matplotlib, and scikit-learn.',
      categoryIndex: 2,
      subcategoryIndex: 7,
      thumbnail: 'https://via.placeholder.com/300x140?text=Python+Data+Science',
      chapters: [
        {
          title: 'Python Basics for Data Science',
          description: 'Essential Python concepts and syntax for data analysis',
          videoUrl: 'https://www.youtube.com/watch?v=WGJJIrtnfpk',
          order: 1,
          duration: '30:00'
        },
        {
          title: 'NumPy Fundamentals',
          description: 'Working with numerical arrays and mathematical operations',
          videoUrl: 'https://www.youtube.com/watch?v=WGJJIrtnfpk',
          order: 2,
          duration: '35:20'
        },
        {
          title: 'Pandas Library',
          description: 'Data manipulation and analysis with pandas DataFrames',
          videoUrl: 'https://www.youtube.com/watch?v=dcqPhpY7tWk',
          order: 3,
          duration: '35:15'
        },
        {
          title: 'Data Cleaning',
          description: 'Cleaning and preprocessing data for analysis',
          videoUrl: 'https://www.youtube.com/watch?v=dcqPhpY7tWk',
          order: 4,
          duration: '28:45'
        },
        {
          title: 'Data Visualization with Matplotlib',
          description: 'Creating charts and graphs for data visualization',
          videoUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4',
          order: 5,
          duration: '28:45'
        },
        {
          title: 'Seaborn Visualization',
          description: 'Advanced statistical visualizations with Seaborn',
          videoUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4',
          order: 6,
          duration: '32:10'
        },
        {
          title: 'Statistical Analysis',
          description: 'Performing statistical analysis on datasets',
          videoUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4',
          order: 7,
          duration: '40:25'
        },
        {
          title: 'Introduction to Scikit-learn',
          description: 'Getting started with machine learning using scikit-learn',
          videoUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4',
          order: 8,
          duration: '45:30'
        }
      ]
    },
    {
      name: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express. Learn REST APIs, authentication, and database integration.',
      categoryIndex: 1,
      subcategoryIndex: 4,
      thumbnail: 'https://via.placeholder.com/300x140?text=Node.js+Backend',
      chapters: [
        {
          title: 'Introduction to Node.js',
          description: 'Understanding Node.js, its ecosystem, and event-driven programming',
          videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
          order: 1,
          duration: '18:30'
        },
        {
          title: 'Express.js Framework',
          description: 'Building web applications and REST APIs with Express',
          videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
          order: 2,
          duration: '32:20'
        },
        {
          title: 'Middleware and Routing',
          description: 'Understanding Express middleware and route handling',
          videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
          order: 3,
          duration: '25:15'
        },
        {
          title: 'Database Integration',
          description: 'Connecting to MongoDB and other databases with Node.js',
          videoUrl: 'https://www.youtube.com/watch?v=WDrU305J1yw',
          order: 4,
          duration: '26:15'
        },
        {
          title: 'Authentication & Authorization',
          description: 'Implementing JWT authentication and user authorization',
          videoUrl: 'https://www.youtube.com/watch?v=WDrU305J1yw',
          order: 5,
          duration: '35:40'
        },
        {
          title: 'Error Handling',
          description: 'Proper error handling and validation in Node.js applications',
          videoUrl: 'https://www.youtube.com/watch?v=WDrU305J1yw',
          order: 6,
          duration: '22:30'
        },
        {
          title: 'Testing with Jest',
          description: 'Writing unit and integration tests for Node.js applications',
          videoUrl: 'https://www.youtube.com/watch?v=WDrU305J1yw',
          order: 7,
          duration: '28:45'
        },
        {
          title: 'Deployment and Production',
          description: 'Deploying Node.js applications to production environments',
          videoUrl: 'https://www.youtube.com/watch?v=WDrU305J1yw',
          order: 8,
          duration: '30:20'
        }
      ]
    },
    {
      name: 'Machine Learning Basics',
      description: 'Introduction to machine learning algorithms and concepts. Learn supervised and unsupervised learning techniques.',
      categoryIndex: 2,
      subcategoryIndex: 6,
      thumbnail: 'https://via.placeholder.com/300x140?text=Machine+Learning',
      chapters: [
        {
          title: 'What is Machine Learning?',
          description: 'Understanding the basics of ML, types of learning, and applications',
          videoUrl: 'https://www.youtube.com/watch?v=KNAWp2S3w94',
          order: 1,
          duration: '20:00'
        },
        {
          title: 'Data Preprocessing',
          description: 'Preparing data for machine learning algorithms',
          videoUrl: 'https://www.youtube.com/watch?v=KNAWp2S3w94',
          order: 2,
          duration: '25:30'
        },
        {
          title: 'Linear Regression',
          description: 'Implementing and understanding linear regression algorithms',
          videoUrl: 'https://www.youtube.com/watch?v=zPG4NjIkCjc',
          order: 3,
          duration: '45:30'
        },
        {
          title: 'Logistic Regression',
          description: 'Classification problems with logistic regression',
          videoUrl: 'https://www.youtube.com/watch?v=zPG4NjIkCjc',
          order: 4,
          duration: '38:15'
        },
        {
          title: 'Decision Trees',
          description: 'Understanding and implementing decision tree algorithms',
          videoUrl: 'https://www.youtube.com/watch?v=HZGCoVF3YvM',
          order: 5,
          duration: '42:20'
        },
        {
          title: 'Random Forest',
          description: 'Ensemble methods with Random Forest',
          videoUrl: 'https://www.youtube.com/watch?v=HZGCoVF3YvM',
          order: 6,
          duration: '35:45'
        },
        {
          title: 'Support Vector Machines',
          description: 'Understanding SVM for classification and regression',
          videoUrl: 'https://www.youtube.com/watch?v=HZGCoVF3YvM',
          order: 7,
          duration: '40:10'
        },
        {
          title: 'Model Evaluation',
          description: 'Evaluating machine learning models with metrics',
          videoUrl: 'https://www.youtube.com/watch?v=HZGCoVF3YvM',
          order: 8,
          duration: '32:25'
        }
      ]
    },
    {
      name: 'React Native Mobile Development',
      description: 'Build cross-platform mobile applications with React Native. Learn navigation, state management, and native features.',
      categoryIndex: 3,
      subcategoryIndex: 8,
      thumbnail: 'https://via.placeholder.com/300x140?text=React+Native',
      chapters: [
        {
          title: 'React Native Setup',
          description: 'Setting up your development environment for React Native',
          videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
          order: 1,
          duration: '15:45'
        },
        {
          title: 'Components and Styling',
          description: 'Building UI components and styling in React Native',
          videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
          order: 2,
          duration: '28:30'
        },
        {
          title: 'Navigation with React Navigation',
          description: 'Implementing navigation between screens',
          videoUrl: 'https://www.youtube.com/watch?v=ANdSdIlgsEw',
          order: 3,
          duration: '32:15'
        },
        {
          title: 'State Management',
          description: 'Managing state in React Native applications',
          videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
          order: 4,
          duration: '22:15'
        },
        {
          title: 'API Integration',
          description: 'Making HTTP requests and integrating with backend APIs',
          videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
          order: 5,
          duration: '25:40'
        },
        {
          title: 'AsyncStorage and Local Data',
          description: 'Storing data locally on the device',
          videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
          order: 6,
          duration: '18:25'
        },
        {
          title: 'Native Features',
          description: 'Accessing device features like camera, location, and notifications',
          videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
          order: 7,
          duration: '35:20'
        },
        {
          title: 'Testing and Debugging',
          description: 'Testing React Native apps and debugging common issues',
          videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
          order: 8,
          duration: '28:45'
        }
      ]
    },
    {
      name: 'Docker Containerization',
      description: 'Learn Docker containerization for application deployment. Master containers, images, and orchestration.',
      categoryIndex: 4,
      subcategoryIndex: 10,
      thumbnail: 'https://via.placeholder.com/300x140?text=Docker+Containers',
      chapters: [
        {
          title: 'Docker Fundamentals',
          description: 'Understanding containers, images, and Docker basics',
          videoUrl: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
          order: 1,
          duration: '25:00'
        },
        {
          title: 'Docker Installation and Setup',
          description: 'Installing Docker and setting up your development environment',
          videoUrl: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
          order: 2,
          duration: '18:30'
        },
        {
          title: 'Docker Images',
          description: 'Creating and managing Docker images with Dockerfile',
          videoUrl: 'https://www.youtube.com/watch?v=p28piYY_wvU',
          order: 3,
          duration: '30:45'
        },
        {
          title: 'Docker Containers',
          description: 'Running and managing Docker containers',
          videoUrl: 'https://www.youtube.com/watch?v=p28piYY_wvU',
          order: 4,
          duration: '22:15'
        },
        {
          title: 'Docker Compose',
          description: 'Multi-container applications with Docker Compose',
          videoUrl: 'https://www.youtube.com/watch?v=DM65_JyGxCo',
          order: 5,
          duration: '20:30'
        },
        {
          title: 'Docker Networks',
          description: 'Understanding Docker networking and communication between containers',
          videoUrl: 'https://www.youtube.com/watch?v=DM65_JyGxCo',
          order: 6,
          duration: '25:45'
        },
        {
          title: 'Docker Volumes',
          description: 'Persistent data storage with Docker volumes',
          videoUrl: 'https://www.youtube.com/watch?v=DM65_JyGxCo',
          order: 7,
          duration: '19:20'
        },
        {
          title: 'Docker in Production',
          description: 'Best practices for running Docker in production environments',
          videoUrl: 'https://www.youtube.com/watch?v=DM65_JyGxCo',
          order: 8,
          duration: '32:10'
        }
      ]
    },
    {
      name: 'Vue.js Frontend Framework',
      description: 'Build modern web applications with Vue.js framework. Learn components, routing, and state management.',
      categoryIndex: 1,
      subcategoryIndex: 5,
      thumbnail: 'https://via.placeholder.com/300x140?text=Vue.js+Framework',
      chapters: [
        {
          title: 'Vue.js Introduction',
          description: 'Getting started with Vue.js and its core concepts',
          videoUrl: 'https://www.youtube.com/watch?v=4deVCNJq3qc',
          order: 1,
          duration: '18:20'
        },
        {
          title: 'Vue Components',
          description: 'Building reusable Vue components and component communication',
          videoUrl: 'https://www.youtube.com/watch?v=Wy9q22isx3U',
          order: 2,
          duration: '24:15'
        },
        {
          title: 'Vue Router',
          description: 'Implementing navigation and routing with Vue Router',
          videoUrl: 'https://www.youtube.com/watch?v=5LYrN_cAJoA',
          order: 3,
          duration: '19:45'
        },
        {
          title: 'Vuex State Management',
          description: 'Managing application state with Vuex',
          videoUrl: 'https://www.youtube.com/watch?v=5LYrN_cAJoA',
          order: 4,
          duration: '28:30'
        },
        {
          title: 'Composition API',
          description: 'Using Vue 3 Composition API for better code organization',
          videoUrl: 'https://www.youtube.com/watch?v=5LYrN_cAJoA',
          order: 5,
          duration: '35:15'
        },
        {
          title: 'Vue.js Forms',
          description: 'Building forms and handling user input in Vue.js',
          videoUrl: 'https://www.youtube.com/watch?v=5LYrN_cAJoA',
          order: 6,
          duration: '22:40'
        },
        {
          title: 'API Integration',
          description: 'Making HTTP requests and integrating with backend APIs',
          videoUrl: 'https://www.youtube.com/watch?v=5LYrN_cAJoA',
          order: 7,
          duration: '26:25'
        },
        {
          title: 'Testing Vue.js Applications',
          description: 'Writing unit tests for Vue.js components and applications',
          videoUrl: 'https://www.youtube.com/watch?v=5LYrN_cAJoA',
          order: 8,
          duration: '31:20'
        }
      ]
    },
    {
      name: 'Java Programming Essentials',
      description: 'Master Java programming language fundamentals and object-oriented concepts. Learn classes, inheritance, and collections.',
      categoryIndex: 0,
      subcategoryIndex: 2,
      thumbnail: 'https://via.placeholder.com/300x140?text=Java+Programming',
      chapters: [
        {
          title: 'Java Basics',
          description: 'Introduction to Java programming, syntax, and development environment',
          videoUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
          order: 1,
          duration: '35:00'
        },
        {
          title: 'Variables and Data Types',
          description: 'Understanding Java variables, data types, and operators',
          videoUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
          order: 2,
          duration: '28:15'
        },
        {
          title: 'Control Flow',
          description: 'Conditional statements and loops in Java',
          videoUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
          order: 3,
          duration: '32:40'
        },
        {
          title: 'Object-Oriented Programming',
          description: 'Classes, objects, and basic OOP concepts in Java',
          videoUrl: 'https://www.youtube.com/watch?v=WJm9KJgKtQY',
          order: 4,
          duration: '42:30'
        },
        {
          title: 'Inheritance and Polymorphism',
          description: 'Understanding inheritance, interfaces, and polymorphism',
          videoUrl: 'https://www.youtube.com/watch?v=WJm9KJgKtQY',
          order: 5,
          duration: '38:25'
        },
        {
          title: 'Java Collections',
          description: 'Working with Java collections framework (List, Set, Map)',
          videoUrl: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
          order: 6,
          duration: '28:15'
        },
        {
          title: 'Exception Handling',
          description: 'Proper exception handling and error management in Java',
          videoUrl: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
          order: 7,
          duration: '25:45'
        },
        {
          title: 'File I/O and Streams',
          description: 'Reading and writing files, working with streams',
          videoUrl: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
          order: 8,
          duration: '30:20'
        }
      ]
    },
    {
      name: 'AWS Cloud Computing',
      description: 'Learn Amazon Web Services for cloud infrastructure and deployment. Master EC2, S3, and cloud architecture.',
      categoryIndex: 4,
      subcategoryIndex: 11,
      thumbnail: 'https://via.placeholder.com/300x140?text=AWS+Cloud',
      chapters: [
        {
          title: 'AWS Fundamentals',
          description: 'Introduction to AWS cloud services and global infrastructure',
          videoUrl: 'https://www.youtube.com/watch?v=ulprqHHWlng',
          order: 1,
          duration: '40:00'
        },
        {
          title: 'IAM and Security',
          description: 'Identity and Access Management in AWS',
          videoUrl: 'https://www.youtube.com/watch?v=ulprqHHWlng',
          order: 2,
          duration: '35:15'
        },
        {
          title: 'EC2 and VPC',
          description: 'Working with EC2 instances and Virtual Private Cloud',
          videoUrl: 'https://www.youtube.com/watch?v=ITcH6l15O7o',
          order: 3,
          duration: '45:20'
        },
        {
          title: 'S3 and Cloud Storage',
          description: 'Managing data with Amazon S3 and other storage services',
          videoUrl: 'https://www.youtube.com/watch?v=77lMCiiMilo',
          order: 4,
          duration: '32:45'
        },
        {
          title: 'Load Balancing and Auto Scaling',
          description: 'Setting up load balancers and auto-scaling groups',
          videoUrl: 'https://www.youtube.com/watch?v=77lMCiiMilo',
          order: 5,
          duration: '38:30'
        },
        {
          title: 'Database Services',
          description: 'Working with RDS, DynamoDB, and other AWS database services',
          videoUrl: 'https://www.youtube.com/watch?v=77lMCiiMilo',
          order: 6,
          duration: '42:15'
        },
        {
          title: 'Lambda and Serverless',
          description: 'Building serverless applications with AWS Lambda',
          videoUrl: 'https://www.youtube.com/watch?v=77lMCiiMilo',
          order: 7,
          duration: '36:40'
        },
        {
          title: 'Monitoring and Logging',
          description: 'Using CloudWatch for monitoring and logging AWS resources',
          videoUrl: 'https://www.youtube.com/watch?v=77lMCiiMilo',
          order: 8,
          duration: '29:25'
        }
      ]
    }
  ]
};

const createSampleData = async () => {
  try {
    console.log('🚀 Starting sample data creation...');
    
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
    
    // Step 2: Create categories
    console.log('\n2. Creating categories...');
    const createdCategories = [];
    for (const category of sampleData.categories) {
      const response = await axios.post('https://lms-app-backend-nobf.onrender.com/api/categories', category, { headers });
      createdCategories.push(response.data);
      console.log(`✅ Created category: ${category.name}`);
    }
    
    // Step 3: Create subcategories
    console.log('\n3. Creating subcategories...');
    const createdSubcategories = [];
    for (const [i, subcategory] of sampleData.subcategories.entries()) {
      const categoryId = createdCategories[subcategory.categoryIndex]._id;
      const response = await axios.post('https://lms-app-backend-nobf.onrender.com/api/subcategories', {
        ...subcategory,
        categoryId
      }, { headers });
      createdSubcategories.push({
        ...response.data,
        categoryIndex: subcategory.categoryIndex,
        subcategoryIndex: i
      });
      console.log(`✅ Created subcategory: ${subcategory.name}`);
    }
    
    // Step 4: Create courses with chapters
    console.log('\n4. Creating courses with chapters...');
    for (let i = 0; i < sampleData.courses.length; i++) {
      const course = sampleData.courses[i];
      const categoryId = createdCategories[course.categoryIndex]._id;
      // Find the subcategory by name and categoryIndex
      const subcat = createdSubcategories.find(
        (sc) => sc.name === sampleData.subcategories[course.subcategoryIndex].name && sc.categoryIndex === course.categoryIndex
      );
      if (!subcat) {
        console.error(`❌ Could not find subcategory for course: ${course.name}`);
        continue;
      }
      const subcategoryId = subcat._id;
      
      const courseData = {
        name: course.name,
        description: course.description,
        categoryId,
        subcategoryId,
        thumbnail: course.thumbnail,
        chapters: course.chapters
      };
      
      const response = await axios.post('https://lms-app-backend-nobf.onrender.com/api/courses', courseData, { headers });
      console.log(`✅ Created course ${i + 1}/10: ${course.name} with ${course.chapters.length} chapters`);
    }
    
    console.log('\n🎉 Sample data creation completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${createdCategories.length} categories`);
    console.log(`   - ${createdSubcategories.length} subcategories`);
    console.log(`   - ${sampleData.courses.length} courses with chapters`);
    
    console.log('\n📋 Summary of created courses:');
    sampleData.courses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.name} (${course.chapters.length} chapters)`);
    });
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('Authentication failed - make sure you\'re logged in as admin');
    }
  }
};

createSampleData(); 