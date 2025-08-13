import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting simplified portfolio database seeding...");

  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
  await prisma.metadata.deleteMany();
  await prisma.project.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.language.deleteMany();
  await prisma.service.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.cVInfo.deleteMany();

  console.log("🗑️ Cleared existing data");

  // 0. Seed Admin User (for authentication)
  console.log("👤 Creating admin user...");
  
  // Generate a proper bcrypt hash for "admin123"
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash("admin123", 12);
  
  await prisma.user.create({
    data: {
      email: "ammarhanyezeldin@gmail.com",
      firstName: "Ammar",
      lastName: "Hany",
      // Default password: "admin123" - should be changed after first login
      passwordHash,
      isActive: true,
      emailVerified: true,
      lastLoginAt: null,
    },
  });

  console.log("✅ Admin user created: ammarhanyezeldin@gmail.com (password: admin123)");

  // 1. Seed Metadata (Shortcode system for dynamic content)
  console.log("📋 Seeding metadata shortcodes...");

  const metadataEntries = [
    // Personal Information
    { key: "fullName", value: "Ammar Hany", type: "string", category: "personal", description: "Full name displayed across the site", isRequired: true },
    { key: "firstName", value: "Ammar", type: "string", category: "personal", description: "First name" },
    { key: "lastName", value: "Hany", type: "string", category: "personal", description: "Last name" },
    { key: "title", value: "Dynamic Senior-track Software Engineer | Backend & Full-Stack Specialist", type: "string", category: "personal", description: "Professional title", isRequired: true },
    { key: "email", value: "ammarhanyezeldin@gmail.com", type: "string", category: "contact", description: "Primary email address", isRequired: true },
    { key: "phone", value: "+20 106 188 8476", type: "string", category: "contact", description: "Primary phone number" },
    { key: "location", value: "New Cairo, Egypt | Available in Sweden & Turkey", type: "string", category: "contact", description: "Current location and availability" },
    { key: "availability", value: "Open for senior roles, tech lead positions, and consulting opportunities", type: "string", category: "contact", description: "Current availability status" },

    // Hero Section
    { key: "heroGreeting", value: "Hi, I'm Ammar Hany", type: "string", category: "hero", description: "Hero section greeting" },
    { key: "heroSubtitle", value: "Dynamic Senior-track Software Engineer | Backend & Full-Stack Specialist", type: "string", category: "hero", description: "Hero subtitle" },
    {
      key: "heroDescription",
      value: "4+ years of experience in full-stack development, backend engineering, system architecture, computer vision, and cloud DevOps. Expert in Python & C#, building scalable solutions that bridge cloud, web, mobile, and IoT.",
      type: "string",
      category: "hero",
      description: "Hero description",
    },
    { key: "heroCallToAction", value: "Looking for a senior engineer or tech lead? Let's build something exceptional together!", type: "string", category: "hero", description: "Hero call to action" },
    { key: "heroPrimaryButton", value: JSON.stringify({ text: "Get In Touch", href: "/contact" }), type: "json", category: "hero", description: "Primary button configuration" },
    { key: "heroSecondaryButton", value: JSON.stringify({ text: "Download CV", href: "/cv-download" }), type: "json", category: "hero", description: "Secondary button configuration" },

    // Contact Section
    { key: "contactTitle", value: "Let's Connect & Collaborate", type: "string", category: "contact", description: "Contact section title" },
    { key: "contactSubtitle", value: "Ready to discuss your next project or explore opportunities? I'd love to hear from you!", type: "string", category: "contact", description: "Contact section subtitle" },

    // Social Links
    { key: "linkedInUrl", value: "https://linkedin.com/in/ammarhany", type: "string", category: "social", description: "LinkedIn profile URL" },
    { key: "githubUrl", value: "https://github.com/ammarhany", type: "string", category: "social", description: "GitHub profile URL" },
    { key: "websiteUrl", value: "https://ammarhany.dev", type: "string", category: "social", description: "Personal website URL" },
    { key: "twitterUrl", value: "https://twitter.com/ammarhany", type: "string", category: "social", description: "Twitter profile URL" },

    // Professional Summary
    {
      key: "professionalSummary",
      value: "Experienced software engineer with 4+ years in full-stack development, backend systems, and computer vision. Proven track record in building scalable applications, leading technical projects, and mentoring development teams.",
      type: "string",
      category: "professional",
      description: "Professional summary",
    },
    {
      key: "careerObjective",
      value: "Seeking senior software engineering or technical leadership roles where I can leverage my expertise in Python, C#, and cloud technologies to drive innovation and build exceptional digital solutions.",
      type: "string",
      category: "professional",
      description: "Career objective",
    },
  ];

  for (const meta of metadataEntries) {
    await prisma.metadata.create({
      data: {
        key: meta.key,
        value: meta.value,
        type: meta.type,
        category: meta.category,
        description: meta.description,
        isRequired: meta.isRequired || false,
        isActive: true,
      },
    });
  }

  // 2. Seed Professional Experience
  console.log("💼 Seeding professional experience...");
  const experiences = [
    {
      company: "The Home Co EG",
      position: "IT Manager & Full-Stack Developer",
      duration: "Apr 2025 - Present",
      location: "New Cairo, Egypt (Remote)",
      type: "Full-time",
      description: "Leading digital transformation across Google Workspace, CRM/ERP, and WooCommerce development. Driving strategic growth through market research and direct support to CEO in technical decision-making.",
      achievements: JSON.stringify(["Spearheading company-wide digital transformation initiatives", "Designing main website using Next.js and Headless WordPress", "Creating comprehensive template libraries and SOPs", "Coaching staff in technology adoption and optimization"]),
      skills: JSON.stringify(["Next.js", "WordPress", "Google Workspace", "CRM/ERP", "WooCommerce", "Digital Transformation"]),
      companyUrl: "https://thehomeco.eg",
      displayOrder: 0,
      isActive: true,
    },
    {
      company: "Kiwify Tech Company",
      position: "Co-founder & CTO",
      duration: "Jun 2024 - Present",
      location: "Mersin, Turkey",
      type: "Co-founder",
      description: "Leading full-stack development and technical strategy. Managing complete project lifecycle from conception to deployment for 10+ client projects.",
      achievements: JSON.stringify([
        "Led development of 10+ full client projects using WordPress, ASP.NET & Flutter",
        "Built custom APIs in ASP.NET Core with PostgreSQL integration",
        "Managed web hosting, server administration, mail hosting, and domain management",
        "Established CI/CD pipelines and coding standards for team",
      ]),
      skills: JSON.stringify(["ASP.NET Core", "Flutter", "WordPress", "PostgreSQL", "Docker", "System Architecture"]),
      companyUrl: "https://kiwifytech.com",
      displayOrder: 1,
      isActive: true,
    },
    {
      company: "Domogreen",
      position: "Backend & Application Engineer",
      duration: "Jul 2024 - Apr 2025",
      location: "Lund, Sweden",
      type: "Full-time",
      description: "Built scalable backend REST API integrating WebSockets for real-time data streaming. Designed cross-platform chatbot app contributing to physics research company in Europe.",
      achievements: JSON.stringify(["Built modular Django REST API with WebSocket data streams", "Implemented role-based JWT authentication with Firebase Auth", "Designed cross-platform chatbot using .NET MAUI", "Contributed to particle physics research tooling for EU partners"]),
      skills: JSON.stringify(["Django", "Python", "WebSockets", "PostgreSQL", "Firebase", ".NET MAUI", "JWT"]),
      companyUrl: "https://domogreen.com",
      displayOrder: 2,
      isActive: true,
    },
    {
      company: "Animals AI",
      position: "Computer Vision & Backend Engineer",
      duration: "Aug 2023 - Apr 2024",
      location: "Helsingborg, Sweden",
      type: "Full-time",
      description: "Developed 30+ computer vision models and 50+ image processing algorithms. Built company's backend using Python Flask on GCP with Firebase integration.",
      achievements: JSON.stringify([
        "Developed and deployed 30+ CV models and 50+ image processing algorithms",
        "Built Flask-based REST backend on GCP with Firebase integration",
        "Implemented AI/IoT camera system using Nvidia Jetson (12 cameras)",
        "Mentored interns and collaborated with farmers/researchers for precision agriculture",
      ]),
      skills: JSON.stringify(["Python", "Computer Vision", "YOLO", "Flask", "GCP", "Firebase", "Nvidia Jetson"]),
      companyUrl: "https://animals.ai",
      displayOrder: 3,
      isActive: true,
    },
    {
      company: "Toros University",
      position: "IT Intern",
      duration: "Mar 2023 - Jul 2023 & Jul 2022 - Sep 2022",
      location: "Mersin, Turkey",
      type: "Internship",
      description: "Provided comprehensive IT support for staff and students, managing server and network tasks, and user account administration.",
      achievements: JSON.stringify([
        "Provided campus-wide IT support (Windows, Office, networking, VoIP)",
        "Refurbished 50%+ of lab PCs and strengthened server infrastructure",
        "Managed router/switch configuration and user account administration",
        "Assisted with printer management and technical troubleshooting",
      ]),
      skills: JSON.stringify(["Windows Server", "Networking", "VoIP", "System Administration", "Hardware"]),
      companyUrl: "https://toros.edu.tr",
      displayOrder: 4,
      isActive: true,
    },
    {
      company: "Freelance",
      position: "Full-Stack Web Developer",
      duration: "Sep 2021 - Sep 2022",
      location: "Mersin, Turkey",
      type: "Freelance",
      description: "Developed full-stack websites and optimized SEO in collaboration with marketing agencies. Delivered custom solutions using modern web technologies.",
      achievements: JSON.stringify(["Delivered custom websites using HTML/CSS/JS, PHP/Laravel, and WordPress", "Integrated SEO best practices for improved search rankings", "Collaborated with marketing agencies on digital campaigns", "Built responsive designs with cross-browser compatibility"]),
      skills: JSON.stringify(["HTML5", "CSS3", "JavaScript", "PHP", "Laravel", "WordPress", "SEO"]),
      companyUrl: null,
      displayOrder: 5,
      isActive: true,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  // 3. Seed Education
  console.log("🎓 Seeding education...");
  await prisma.education.create({
    data: {
      institution: "Toros University",
      degree: "Bachelor of Science",
      field: "Computer and Software Engineering",
      duration: "Sep 2019 - Jul 2023",
      location: "Mersin, Turkey",
      gpa: "3.77/4.00",
      description: "Graduated 1st in department and faculty with honours. Focused on software engineering, algorithms, system architecture, and computer vision.",
      achievements: JSON.stringify([
        "Graduated 1st in department & faculty with GPA 3.77/4.00",
        "Honours every semester throughout the program",
        "Administrative Board Member, Computer Sciences Community",
        "Led programming club and mentored junior students",
        "Teknofest 2023 finalist - Autonomous Harvesting Robot project",
      ]),
      courses: JSON.stringify([
        "Data Structures and Algorithms",
        "Software Engineering Principles",
        "Database Systems & Design",
        "Computer Networks & Security",
        "Artificial Intelligence & Machine Learning",
        "System Architecture & Design Patterns",
        "Mobile Application Development",
        "Web Technologies & Frameworks",
      ]),
      thesis: "Autonomous Harvesting Robot with Computer Vision - Teknofest 2023 Project",
      displayOrder: 0,
      isActive: true,
    },
  });

  // 4. Seed Skills with Categories
  console.log("🛠️ Seeding technical skills...");
  const skillCategories = [
    {
      name: "programming",
      title: "Programming Languages",
      icon: "💻",
      skills: [
        { name: "Python", level: 95, experience: "4+ years", isCoreSkill: true },
        { name: "C#/.NET", level: 93, experience: "4+ years", isCoreSkill: true },
        { name: "Go", level: 85, experience: "1+ years", isCoreSkill: false },
        { name: "JavaScript/TypeScript", level: 88, experience: "3+ years", isCoreSkill: true },
        { name: "Dart", level: 82, experience: "2+ years", isCoreSkill: false },
        { name: "PHP", level: 85, experience: "3+ years", isCoreSkill: false },
        { name: "SQL", level: 90, experience: "4+ years", isCoreSkill: true },
        { name: "HTML5/CSS3", level: 92, experience: "4+ years", isCoreSkill: false },
      ],
    },
    {
      name: "backend",
      title: "Backend & APIs",
      icon: "⚙️",
      skills: [
        { name: "Flask", level: 92, experience: "3+ years", isCoreSkill: true },
        { name: "Django/DRF", level: 88, experience: "2+ years", isCoreSkill: true },
        { name: "FastAPI", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "ASP.NET Core", level: 90, experience: "3+ years", isCoreSkill: true },
        { name: "Gin (Go)", level: 80, experience: "1+ years", isCoreSkill: false },
        { name: "Laravel", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "REST APIs", level: 95, experience: "4+ years", isCoreSkill: true },
        { name: "GraphQL", level: 75, experience: "1+ years", isCoreSkill: false },
      ],
    },
    {
      name: "frontend",
      title: "Frontend & Mobile",
      icon: "🎨",
      skills: [
        { name: "React/Next.js", level: 88, experience: "2+ years", isCoreSkill: true },
        { name: "Flutter", level: 87, experience: "2+ years", isCoreSkill: true },
        { name: "WordPress/Elementor", level: 92, experience: "3+ years", isCoreSkill: false },
        { name: "Bootstrap/Tailwind", level: 90, experience: "3+ years", isCoreSkill: false },
        { name: "WPF", level: 88, experience: "3+ years", isCoreSkill: false },
        { name: ".NET MAUI", level: 82, experience: "1+ years", isCoreSkill: false },
        { name: "Tkinter", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "Android (Java)", level: 75, experience: "1+ years", isCoreSkill: false },
      ],
    },
    {
      name: "database",
      title: "Databases & Storage",
      icon: "🗄️",
      skills: [
        { name: "PostgreSQL", level: 90, experience: "3+ years", isCoreSkill: true },
        { name: "MySQL", level: 88, experience: "4+ years", isCoreSkill: false },
        { name: "MSSQL", level: 85, experience: "3+ years", isCoreSkill: false },
        { name: "SQLite", level: 92, experience: "4+ years", isCoreSkill: false },
        { name: "Firestore", level: 87, experience: "2+ years", isCoreSkill: false },
        { name: "Firebase RTDB", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "Redis", level: 80, experience: "2+ years", isCoreSkill: false },
      ],
    },
    {
      name: "ai_cv",
      title: "AI & Computer Vision",
      icon: "🤖",
      skills: [
        { name: "PyTorch", level: 88, experience: "2+ years", isCoreSkill: false },
        { name: "TensorFlow/Keras", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "OpenCV", level: 90, experience: "3+ years", isCoreSkill: true },
        { name: "YOLO (v8)", level: 92, experience: "2+ years", isCoreSkill: true },
        { name: "Scikit-learn", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "Supervision", level: 87, experience: "1+ years", isCoreSkill: false },
      ],
    },
    {
      name: "cloud_devops",
      title: "Cloud & DevOps",
      icon: "☁️",
      skills: [
        { name: "Google Cloud Platform", level: 88, experience: "2+ years", isCoreSkill: true },
        { name: "Firebase", level: 90, experience: "2+ years", isCoreSkill: false },
        { name: "Docker", level: 85, experience: "2+ years", isCoreSkill: true },
        { name: "Kubernetes", level: 75, experience: "1+ years", isCoreSkill: false },
        { name: "GitHub Actions", level: 87, experience: "2+ years", isCoreSkill: false },
        { name: "DigitalOcean", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "Linux (Ubuntu)", level: 88, experience: "3+ years", isCoreSkill: false },
        { name: "cPanel/WHM", level: 90, experience: "3+ years", isCoreSkill: false },
      ],
    },
    {
      name: "tools",
      title: "Tools & Productivity",
      icon: "🔧",
      skills: [
        { name: "Git & GitHub", level: 95, experience: "4+ years", isCoreSkill: false },
        { name: "VS Code", level: 92, experience: "4+ years", isCoreSkill: false },
        { name: "Visual Studio", level: 90, experience: "3+ years", isCoreSkill: false },
        { name: "PyCharm/IntelliJ", level: 85, experience: "2+ years", isCoreSkill: false },
        { name: "Postman", level: 88, experience: "3+ years", isCoreSkill: false },
        { name: "Figma", level: 80, experience: "2+ years", isCoreSkill: false },
        { name: "Google Workspace", level: 90, experience: "3+ years", isCoreSkill: false },
        { name: "Microsoft 365", level: 88, experience: "4+ years", isCoreSkill: false },
      ],
    },
  ];

  for (let catIndex = 0; catIndex < skillCategories.length; catIndex++) {
    const category = skillCategories[catIndex];
    const createdCategory = await prisma.skillCategory.create({
      data: {
        name: category.name,
        title: category.title,
        icon: category.icon,
        displayOrder: catIndex,
        isActive: true,
      },
    });

    for (let skillIndex = 0; skillIndex < category.skills.length; skillIndex++) {
      const skill = category.skills[skillIndex];
      await prisma.skill.create({
        data: {
          name: skill.name,
          level: skill.level,
          experience: skill.experience,
          isCoreSkill: skill.isCoreSkill,
          categoryId: createdCategory.id,
          displayOrder: skillIndex,
          isActive: true,
        },
      });
    }
  }

  // 5. Seed Certificates
  console.log("📜 Seeding certificates...");
  const certificates = [
    {
      name: "AI Engineer Internship",
      issuer: "Animals AI",
      date: "Aug 2023 - Oct 2023",
      credential: "ANIMALS-AI-2023",
      description: "Completed comprehensive AI engineering internship focusing on computer vision and machine learning applications in agriculture.",
      skills: JSON.stringify(["Computer Vision", "Machine Learning", "Python", "YOLO", "Agriculture AI"]),
      image: "/certificates/animals-ai.png",
      verifyUrl: "https://animals.ai/certificates/ammar-hany",
      displayOrder: 0,
      isActive: true,
    },
    {
      name: "AI Engineer - Teknofest Finalist",
      issuer: "Toros University Smart Lab",
      date: "May 2023",
      credential: "TEKNOFEST-2023",
      description: "Ranked 25th in Teknofest 2023 Autonomous Harvesting Robot competition with 2.5M visitors. Led computer vision development.",
      skills: JSON.stringify(["Autonomous Systems", "Computer Vision", "Robotics", "Python", "Team Leadership"]),
      image: "/certificates/teknofest.png",
      verifyUrl: "https://teknofest.org/verify/2023-autonomous",
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "Python Bootcamp: Zero to Hero",
      issuer: "Udemy",
      date: "May 2024",
      credential: "UDEMY-PYTHON-2024",
      description: "Complete Python programming bootcamp covering advanced concepts, frameworks, and real-world applications.",
      skills: JSON.stringify(["Python", "Web Development", "Data Science", "Automation"]),
      image: "/certificates/python-bootcamp.png",
      verifyUrl: "https://udemy.com/certificate/UDEMY-PYTHON-2024",
      displayOrder: 2,
      isActive: true,
    },
    {
      name: "Go – The Complete Guide",
      issuer: "Udemy",
      date: "Mar 2025",
      credential: "UDEMY-GO-2025",
      description: "Comprehensive Go programming course covering concurrent programming, web development, and microservices.",
      skills: JSON.stringify(["Go", "Concurrent Programming", "Microservices", "Web APIs"]),
      image: "/certificates/go-complete.png",
      verifyUrl: "https://udemy.com/certificate/UDEMY-GO-2025",
      displayOrder: 3,
      isActive: true,
    },
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: cert });
  }

  // 6. Seed Services
  console.log("🛠️ Seeding professional services...");
  const services = [
    {
      title: "Full-Stack Web Development",
      description: "End-to-end web application development using modern technologies like React, Next.js, Django, and ASP.NET Core.",
      icon: "🌐",
      features: JSON.stringify(["Custom web applications with modern UI/UX", "Responsive design across all devices", "REST API development and integration", "Database design and optimization", "Authentication and authorization systems", "Performance optimization and SEO"]),
      technologies: JSON.stringify(["React", "Next.js", "Django", "ASP.NET Core", "PostgreSQL", "TypeScript"]),
      pricing: JSON.stringify({
        type: "project",
        starting: "$3,000",
        description: "Starting price for comprehensive web applications",
      }),
      displayOrder: 0,
      isActive: true,
    },
    {
      title: "AI & Computer Vision Solutions",
      description: "Custom AI models and computer vision systems for agriculture, livestock monitoring, and industrial applications.",
      icon: "🤖",
      features: JSON.stringify(["Custom computer vision model development", "Real-time object detection and tracking", "Agricultural and livestock AI solutions", "IoT integration with AI cameras", "Model optimization for edge devices", "Data annotation and pipeline setup"]),
      technologies: JSON.stringify(["Python", "PyTorch", "YOLO", "OpenCV", "Nvidia Jetson", "GCP"]),
      pricing: JSON.stringify({
        type: "project",
        starting: "$5,000",
        description: "AI and computer vision project development",
      }),
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Backend API Development",
      description: "Scalable backend systems with comprehensive APIs, real-time features, and cloud deployment.",
      icon: "⚙️",
      features: JSON.stringify(["RESTful API design and development", "WebSocket integration for real-time features", "Database schema design and optimization", "JWT authentication and RBAC systems", "Cloud deployment with Docker/Kubernetes", "API documentation and testing"]),
      technologies: JSON.stringify(["Python", "C#", "Go", "PostgreSQL", "Docker", "GCP", "Firebase"]),
      pricing: JSON.stringify({
        type: "hourly",
        starting: "$60/hour",
        description: "Backend development and API services",
      }),
      displayOrder: 2,
      isActive: true,
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  // 7. Seed Languages
  console.log("🌐 Seeding languages...");
  const languages = [
    {
      name: "English",
      level: "C2 – Full professional proficiency",
      proficiency: 95,
      description: "Fluent in technical communication, presentations, and documentation",
      certificate: "C2 Professional Level",
      flag: "🇬🇧",
      displayOrder: 0,
      isActive: true,
    },
    {
      name: "Arabic",
      level: "Native – Mother tongue",
      proficiency: 100,
      description: "Native Arabic speaker with excellent literary and communication skills",
      certificate: "Native Speaker",
      flag: "🇪🇬",
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "Turkish",
      level: "B2 – Upper intermediate",
      proficiency: 80,
      description: "Strong conversational Turkish for business and daily communication",
      certificate: "B2 Level Certificate",
      flag: "🇹🇷",
      displayOrder: 2,
      isActive: true,
    },
  ];

  for (const lang of languages) {
    await prisma.language.create({ data: lang });
  }

  // 8. Seed Major Projects
  console.log("🚀 Seeding major projects...");
  const projects = [
    {
      title: "Eggersmann UAE - Luxury Kitchen Website",
      description: "High-end multilingual website for Eggersmann UAE representing the global luxury kitchen brand with premium digital presence.",
      longDescription: "Developed a sophisticated WordPress website using Elementor Pro and custom PHP enhancements. Featured multilingual support, dynamic content management with Pods, and performance optimization with Varnish and Redis caching.",
      image: "/projects/eggersmann.jpg",
      gallery: JSON.stringify(["/projects/eggersmann/gallery1.jpg", "/projects/eggersmann/gallery2.jpg"]),
      technologies: JSON.stringify(["WordPress", "Elementor Pro", "Pods", "Custom PHP", "MySQL", "Cloudways"]),
      features: JSON.stringify(["Multilingual support (English, Arabic)", "Custom post types for projects and materials", "Performance optimization with Varnish/Redis", "Responsive design across all devices"]),
      demoUrl: "https://eggersmann.ae",
      githubUrl: null,
      category: "Web Development",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-09-15"),
      displayOrder: 0,
      isActive: true,
    },
    {
      title: "Animals AI - Computer Vision Platform",
      description: "30+ computer vision models and 50+ algorithms for agricultural AI applications with GCP deployment.",
      longDescription: "Built comprehensive computer vision platform for livestock monitoring including estrus detection, health analysis, and behavioral monitoring using YOLO models and Jetson devices.",
      image: "/projects/animals-ai.jpg",
      gallery: JSON.stringify(["/projects/animals-ai/cv-models.jpg", "/projects/animals-ai/jetson-setup.jpg"]),
      technologies: JSON.stringify(["Python", "YOLO v8", "OpenCV", "Flask", "GCP", "Nvidia Jetson", "Firebase"]),
      features: JSON.stringify(["30+ computer vision models deployed", "50+ image processing algorithms", "AI/IoT camera system (12 cameras)", "Real-time livestock monitoring"]),
      demoUrl: null,
      githubUrl: null,
      category: "AI/Computer Vision",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2024-04-30"),
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Teknofest 2023 - Autonomous Harvesting Robot",
      description: "Computer vision system for autonomous fruit harvesting robot. Ranked 25th nationally with 2.5M visitors.",
      longDescription: "Led computer vision development for autonomous harvesting robot using YOLO v8 architecture. Implemented automatic object detection, cropping, and color analysis for fruit classification.",
      image: "/projects/teknofest.jpg",
      gallery: JSON.stringify(["/projects/teknofest/robot.jpg", "/projects/teknofest/cv-system.jpg"]),
      technologies: JSON.stringify(["Python", "YOLO v8", "OpenCV", "Flask", "Computer Vision", "Robotics"]),
      features: JSON.stringify(["Autonomous fruit detection and harvesting", "Real-time object classification", "Color-based ripeness detection", "Robot navigation integration"]),
      demoUrl: null,
      githubUrl: "https://github.com/amarhany20/Teknofest-Autonomous-Harvesting-Robot-Computer-Vision-Backend",
      category: "AI/Robotics",
      startDate: new Date("2023-03-01"),
      endDate: new Date("2023-05-30"),
      displayOrder: 2,
      isActive: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  // 9. Seed Recommendations
  console.log("💬 Seeding recommendations...");
  const recommendations = [
    {
      name: "Yuan Xiong",
      position: "CTO",
      company: "Animals AI",
      relationship: "Direct Manager",
      content: "Ammar demonstrated exceptional technical skills and leadership during his time with us. His expertise in computer vision and backend development significantly contributed to our agricultural AI solutions. He successfully deployed 30+ CV models and mentored our intern team.",
      rating: 5,
      date: "Apr 2024",
      linkedin: "https://www.linkedin.com/in/yuan-xiong-cto",
      photo: "/testimonials/yuan-xiong.jpg",
      displayOrder: 0,
      isActive: true,
    },
    {
      name: "Ahmed Hassan",
      position: "CEO",
      company: "The Home Co EG",
      relationship: "Direct Manager",
      content: "Ammar has been leading our digital transformation with exceptional skill and vision. His technical expertise in Next.js and WordPress, combined with his strategic thinking, has transformed our online presence. A true technical leader.",
      rating: 5,
      date: "Present",
      linkedin: "https://www.linkedin.com/in/ahmed-hassan-ceo",
      photo: "/testimonials/ahmed-hassan.jpg",
      displayOrder: 1,
      isActive: true,
    },
  ];

  for (const rec of recommendations) {
    await prisma.recommendation.create({ data: rec });
  }

  // 10. Seed CV Information
  console.log("📄 Seeding CV information...");
  await prisma.cVInfo.create({
    data: {
      title: "Ammar Hany - Senior Software Engineer CV",
      subtitle: "Complete Professional Resume & Portfolio",
      description: "Comprehensive CV showcasing 4+ years of experience in full-stack development, backend engineering, AI/Computer Vision, and technical leadership.",
      downloadUrl: "/files/cv/Ammar_Hany_CV_Egypt_2025_v1.43.pdf",
      viewUrl: "/cv-preview",
      fileSize: "2.1 MB",
      lastUpdated: "July 2025",
      version: "2025.1.4",
      downloadCount: 0,
    },
  });

  // 11. Seed Blog Posts
  console.log("📝 Seeding technical blog posts...");
  const blogPosts = [
    {
      title: "Building Scalable Computer Vision Pipelines with YOLO and Flask",
      slug: "scalable-cv-pipelines-yolo-flask",
      excerpt: "Learn how to build production-ready computer vision systems using YOLO models and Flask APIs, deployed on Google Cloud Platform.",
      content: "# Building Scalable Computer Vision Pipelines with YOLO and Flask\n\nDuring my time at Animals AI, I developed and deployed 30+ computer vision models...",
      coverImage: "/blog/cv-pipelines.jpg",
      author: "Ammar Hany",
      publishedAt: new Date("2024-05-15"),
      category: "AI/Computer Vision",
      tags: JSON.stringify(["Computer Vision", "YOLO", "Flask", "Python", "GCP", "AI"]),
      readTime: 12,
      isPublished: true,
    },
    {
      title: "From Django to ASP.NET Core: Backend Architecture Patterns",
      slug: "django-aspnet-backend-patterns",
      excerpt: "Comparing backend architectures and design patterns between Django REST Framework and ASP.NET Core based on real-world projects.",
      content: "# From Django to ASP.NET Core: Backend Architecture Patterns\n\nHaving worked extensively with both Django and ASP.NET Core...",
      coverImage: "/blog/backend-patterns.jpg",
      author: "Ammar Hany",
      publishedAt: new Date("2024-08-20"),
      category: "Backend Development",
      tags: JSON.stringify(["Django", "ASP.NET Core", "Backend", "Architecture", "Python", "C#"]),
      readTime: 10,
      isPublished: true,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  console.log("✅ Simplified portfolio database seeding completed successfully!");
  console.log("📊 Summary:");
  console.log("- 1 Admin user account (ammarhanyezeldin@gmail.com)");
  console.log("- 22 Metadata entries (shortcode system)");
  console.log("- 6 Professional experiences with enhanced fields");
  console.log("- 1 Education entry (Toros University)");
  console.log("- 7 Skill categories with 40+ skills (including isCoreSkill)");
  console.log("- 4 Professional certificates");
  console.log("- 3 Professional services");
  console.log("- 3 Languages");
  console.log("- 3 Major projects");
  console.log("- 2 Professional recommendations");
  console.log("- 1 CV information entry");
  console.log("- 2 Technical blog posts");
  console.log("🔐 Default admin login: ammarhanyezeldin@gmail.com / admin123");
  console.log("🔄 All models use displayOrder and isActive for better organization!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
