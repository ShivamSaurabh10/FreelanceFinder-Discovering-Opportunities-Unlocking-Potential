const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freelancefinder';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const clients = await User.create([
      { name: 'TechCorp Inc.', email: 'techcorp@example.com', password: hashedPassword, role: 'client', isVerified: true, location: 'San Francisco, CA', bio: 'Building the future of enterprise software.', rating: 4.8, reviewCount: 24, completedJobs: 18 },
      { name: 'StartupHub', email: 'startup@example.com', password: hashedPassword, role: 'client', isVerified: true, location: 'New York, NY', bio: 'Innovative startup looking for top talent.', rating: 4.5, reviewCount: 12, completedJobs: 9 },
      { name: 'Creative Agency', email: 'agency@example.com', password: hashedPassword, role: 'client', isVerified: false, location: 'Austin, TX', bio: 'Full-service creative and digital agency.', rating: 4.2, reviewCount: 8, completedJobs: 6 },
    ]);

    const freelancers = await User.create([
      { name: 'Sarah Chen', email: 'sarah@example.com', password: hashedPassword, role: 'freelancer', isVerified: true, location: 'Seattle, WA', bio: 'Full-stack developer with 7+ years experience. Specializing in React, Node.js, and cloud architecture. I build scalable, beautiful web applications.', skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'GraphQL'], hourlyRate: 95, experience: 'expert', rating: 4.9, reviewCount: 47, completedJobs: 89, socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com', website: 'https://sarahchen.dev' } },
      { name: 'Marcus Williams', email: 'marcus@example.com', password: hashedPassword, role: 'freelancer', isVerified: true, location: 'Chicago, IL', bio: 'Mobile developer crafting exceptional iOS and Android experiences. 5 years of React Native and Swift expertise.', skills: ['React Native', 'iOS', 'Android', 'Swift', 'Kotlin', 'Firebase'], hourlyRate: 80, experience: 'expert', rating: 4.7, reviewCount: 31, completedJobs: 52 },
      { name: 'Aisha Patel', email: 'aisha@example.com', password: hashedPassword, role: 'freelancer', isVerified: true, location: 'Remote', bio: 'UI/UX designer passionate about creating intuitive and beautiful digital experiences. Figma expert with a strong eye for detail.', skills: ['Figma', 'UI/UX Design', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'], hourlyRate: 70, experience: 'intermediate', rating: 4.8, reviewCount: 38, completedJobs: 71 },
      { name: 'James Rodriguez', email: 'james@example.com', password: hashedPassword, role: 'freelancer', isVerified: false, location: 'Miami, FL', bio: 'Data scientist and ML engineer. Turning data into actionable insights with Python, TensorFlow, and advanced analytics.', skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL', 'Pandas'], hourlyRate: 110, experience: 'expert', rating: 4.6, reviewCount: 19, completedJobs: 35 },
      { name: 'Emma Thompson', email: 'emma@example.com', password: hashedPassword, role: 'freelancer', isVerified: true, location: 'London, UK', bio: 'Content strategist and copywriter helping brands tell compelling stories. SEO expert with conversion optimization background.', skills: ['Content Writing', 'SEO', 'Copywriting', 'Content Strategy', 'Blog Writing', 'Email Marketing'], hourlyRate: 55, experience: 'intermediate', rating: 4.9, reviewCount: 62, completedJobs: 120 },
      { name: 'David Kim', email: 'david@example.com', password: hashedPassword, role: 'freelancer', isVerified: false, location: 'Toronto, Canada', bio: 'Backend developer specializing in microservices, APIs, and cloud infrastructure. Python and Go expert.', skills: ['Python', 'Go', 'Docker', 'Kubernetes', 'PostgreSQL', 'REST API'], hourlyRate: 85, experience: 'expert', rating: 4.5, reviewCount: 24, completedJobs: 41 },
    ]);

    console.log(`✅ Created ${clients.length} clients and ${freelancers.length} freelancers`);

    // Create jobs
    const jobs = await Job.create([
      {
        title: 'Senior React Developer for SaaS Dashboard',
        description: 'We are building a comprehensive SaaS analytics dashboard and need an experienced React developer. You will work closely with our design team to implement pixel-perfect UI components, integrate REST APIs, and ensure optimal performance.\n\nKey responsibilities:\n- Develop reusable React components\n- Implement state management with Redux/Zustand\n- Integrate REST and GraphQL APIs\n- Write unit and integration tests\n- Optimize for performance and accessibility',
        client: clients[0]._id,
        category: 'Web Development',
        skills: ['React.js', 'TypeScript', 'Redux', 'REST APIs', 'CSS'],
        budget: { type: 'fixed', min: 8000, max: 15000 },
        duration: '3-6-months',
        experienceLevel: 'expert',
        status: 'open',
        isFeatured: true,
        location: 'Remote',
        proposalCount: 14,
        views: 342,
        tags: ['React', 'Frontend', 'SaaS', 'Dashboard']
      },
      {
        title: 'Mobile App Development - Health & Fitness Tracker',
        description: 'Looking for an experienced mobile developer to build a health and fitness tracking app for iOS and Android. The app should include workout logging, nutrition tracking, progress visualization, and social features.\n\nMust have:\n- 3+ years React Native experience\n- Experience with health APIs (HealthKit, Google Fit)\n- Firebase backend experience\n- App store submission experience',
        client: clients[1]._id,
        category: 'Mobile Development',
        skills: ['React Native', 'iOS', 'Android', 'Firebase', 'HealthKit'],
        budget: { type: 'fixed', min: 12000, max: 25000 },
        duration: '3-6-months',
        experienceLevel: 'expert',
        status: 'open',
        isFeatured: true,
        location: 'Remote',
        proposalCount: 8,
        views: 215,
        tags: ['Mobile', 'iOS', 'Android', 'Health']
      },
      {
        title: 'UI/UX Designer for E-commerce Platform Redesign',
        description: 'Our e-commerce platform needs a complete UX overhaul. We have extensive user research data and need a talented designer to translate insights into an intuitive, conversion-optimized design system.\n\nProject scope:\n- Complete design audit of current platform\n- New design system and component library\n- Mobile-first responsive designs\n- Prototype and user testing support',
        client: clients[2]._id,
        category: 'Design & Creative',
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
        budget: { type: 'fixed', min: 5000, max: 10000 },
        duration: '1-3-months',
        experienceLevel: 'intermediate',
        status: 'open',
        location: 'Remote',
        proposalCount: 22,
        views: 489,
        tags: ['UX', 'Design', 'E-commerce', 'Figma']
      },
      {
        title: 'Backend API Development - Node.js & MongoDB',
        description: 'Need an experienced backend developer to build RESTful APIs for our new marketplace platform. Must design scalable architecture with proper authentication, authorization, and data modeling.',
        client: clients[0]._id,
        category: 'Web Development',
        skills: ['Node.js', 'MongoDB', 'Express.js', 'JWT', 'REST API'],
        budget: { type: 'hourly', min: 60, max: 90 },
        duration: '1-3-months',
        experienceLevel: 'intermediate',
        status: 'open',
        location: 'Remote',
        proposalCount: 11,
        views: 178,
        tags: ['Backend', 'API', 'Node.js', 'MongoDB']
      },
      {
        title: 'Python Data Science - Customer Churn Prediction Model',
        description: 'We need a data scientist to build a machine learning model to predict customer churn. You will work with our existing data infrastructure, clean and analyze datasets, and deploy a production-ready model.',
        client: clients[1]._id,
        category: 'Data Science & ML',
        skills: ['Python', 'Machine Learning', 'Scikit-learn', 'Pandas', 'Data Analysis'],
        budget: { type: 'fixed', min: 6000, max: 12000 },
        duration: '1-3-months',
        experienceLevel: 'expert',
        status: 'open',
        isFeatured: true,
        location: 'Remote',
        proposalCount: 5,
        views: 124,
        tags: ['Python', 'ML', 'Data Science', 'AI']
      },
      {
        title: 'Content Writer - Tech Blog & SEO Articles',
        description: 'Looking for a skilled tech content writer to produce 8-12 high-quality articles per month. Topics include cloud computing, AI/ML, cybersecurity, and software development. Must be SEO-savvy and able to explain complex topics simply.',
        client: clients[2]._id,
        category: 'Writing & Content',
        skills: ['Content Writing', 'SEO', 'Technical Writing', 'Blog Writing'],
        budget: { type: 'hourly', min: 40, max: 60 },
        duration: 'more-than-6-months',
        experienceLevel: 'intermediate',
        status: 'open',
        location: 'Remote',
        proposalCount: 31,
        views: 267,
        tags: ['Content', 'Writing', 'SEO', 'Tech Blog']
      },
      {
        title: 'Full Stack Developer - Real Estate Platform',
        description: 'Building a modern real estate listing and management platform. Need a full-stack developer comfortable with React frontend and Node.js backend, map integrations, and image optimization.',
        client: clients[0]._id,
        category: 'Web Development',
        skills: ['React.js', 'Node.js', 'PostgreSQL', 'Google Maps API', 'AWS S3'],
        budget: { type: 'fixed', min: 10000, max: 20000 },
        duration: '3-6-months',
        experienceLevel: 'expert',
        status: 'open',
        location: 'Remote',
        proposalCount: 17,
        views: 398,
        tags: ['Full Stack', 'React', 'Node.js', 'Real Estate']
      },
      {
        title: 'Digital Marketing Specialist - Paid Ads & Growth',
        description: 'We need a growth marketing specialist to manage our Google Ads, Facebook/Instagram campaigns, and growth initiatives. Must have proven track record with B2B SaaS companies.',
        client: clients[1]._id,
        category: 'Digital Marketing',
        skills: ['Google Ads', 'Facebook Ads', 'Growth Marketing', 'Analytics', 'A/B Testing'],
        budget: { type: 'hourly', min: 50, max: 80 },
        duration: 'more-than-6-months',
        experienceLevel: 'intermediate',
        status: 'open',
        location: 'Remote',
        proposalCount: 9,
        views: 156,
        tags: ['Marketing', 'PPC', 'Growth', 'SaaS']
      }
    ]);

    console.log(`✅ Created ${jobs.length} jobs`);
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Demo Accounts:');
    console.log('Client: techcorp@example.com / password123');
    console.log('Freelancer: sarah@example.com / password123');
    console.log('Admin: marcus@example.com / password123');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
