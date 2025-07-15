// src/data/profile.ts - Single source of truth for all profile data

export const personalInfo = {
  fullName: "Ammar Hany Ezeldin Abdelrazik",
  displayName: "Ammar Hany",
  professionalTitle: "Dynamic Senior-track Software Engineer | Backend & Full Stack Specialist | AI / Computer Vision Engineer | IT Manager & Tech Lead",
  tagline: "Dynamic Senior-track Software Engineer | Backend & Full Stack Specialist | AI / Computer Vision Engineer | IT Manager & Tech Lead",
  summary: `Dynamic Software Engineer approaching senior level, with 4+ years experience in full-stack and backend development, system architecture, and AI/computer vision. Expert in Python & C#, strong in Go, TypeScript/JS, Dart, and PHP. Led teams, delivered 30+ production-grade CV models, and architected scalable cloud/web/mobile/IoT solutions across Egypt, Turkey, and Sweden. Ranked 1st in B.Sc. cohort, Teknofest 2023 finalist, and mentored developers and interns internationally.`,
  photo: "/2024%20Ammar%20Personal%20Photo.jpg",
  location: "Istanbul, Turkey / New Cairo, Egypt / Helsingborg, Sweden",
  addresses: ["New Cairo, Egypt", "Mersin, Turkey", "Helsingborg 25476, Sweden", "Kilafors (Gävleborg), Sweden (wife's residence)"],
  email: "ammarhanyezeldin@gmail.com",
  phoneNumbers: [
    { label: "Egypt (WhatsApp)", number: "+20 106 188 8476" },
    { label: "Turkey (WhatsApp)", number: "+90 539 577 5990" },
    { label: "Sweden (WhatsApp)", number: "+46 73 979 3588" },
  ],
  personalWebsite: "https://ammarhany.com",
  linkedin: "https://www.linkedin.com/in/ammar-hany/",
  github: "https://github.com/amarhany20",
  youtube: "https://www.youtube.com/@TheChillTechgineer",
  whatsapp: "https://wa.me/905395775990",
  workEligibility: "Eligible to work in Egypt, Turkey, Sweden (residence permit in process); married to Swedish citizen; open to onsite Sweden or global remote roles.",
  relocation: "Married to a Swedish citizen; frequent/long-term stays in Sweden; legal work eligibility in Egypt, Turkey, and Sweden.",
  lastUpdated: "10 July 2025",
};

// Hero Section Content
export const heroContent = {
  greeting: "Hello, I'm Ammar Hany",
  subtitle: "Full-Stack Engineer building scalable web apps & modern experiences.",
  description: "I design, develop, and optimize digital products that delight users and drive results.",
  callToAction: "Let's build something amazing together!",
  primaryButton: {
    text: "Get In Touch",
    href: "/contact",
  },
  secondaryButton: {
    text: "Download Resume",
    href: "/resume.pdf",
  },
};

// Core Skills (ordered by strength/relevance)
export const coreSkills = ["Python", "C# /.NET", "Go", "TypeScript", "JavaScript", "Dart", "PHP", "SQL", "HTML/CSS"];

export const frameworks = ["Flask", "Django", "FastAPI", "ASP.NET Core", "Gin", "Laravel", "Node.js", "Express", ".NET MAUI", "WPF", "React", "Next.js", "TailwindCSS", "Bootstrap", "Elementor", "WordPress (PHP/Gutenberg)", "Flutter", "Android (Java)", "Tkinter"];

export const aiSkills = ["PyTorch", "TensorFlow/Keras", "OpenCV", "Ultralytics YOLOv8", "Scikit-learn", "Supervision"];

export const databases = ["PostgreSQL", "MySQL", "MSSQL", "SQLite", "Firestore", "Firebase RTDB", "Redis"];

export const cloudDevOps = ["Google Cloud Platform (GCP)", "Firebase", "Docker", "Kubernetes", "Git & GitHub Actions", "DigitalOcean", "Cloudways", "cPanel/WHM", "CyberPanel", "OpenLiteSpeed", "Linux (Ubuntu/Debian)", "Varnish", "Redis", "Object Cache Pro", "SSH/Ansible (basics)"];

export const productivityTools = ["VS Code", "Visual Studio", "PyCharm", "IntelliJ", "Postman", "Figma", "Draw.io", "Power BI", "Microsoft Excel", "Google Workspace", "FL Studio"];

export const softSkills = ["Problem solving", "System thinking", "Attention to detail", "Mentorship", "Team leadership", "Agile/Scrum", "Rapid prototyping", "Technical documentation", "Client communication", "Fast typing (77 WPM certified)"];

// All Skills Combined for Skills Section
export const allSkills = {
  "Core Languages": coreSkills,
  "Frameworks & Libraries": frameworks,
  "AI & Machine Learning": aiSkills,
  Databases: databases,
  "Cloud & DevOps": cloudDevOps,
  "Productivity Tools": productivityTools,
  "Soft Skills": softSkills,
};

// Languages
export const languages = [
  { name: "English", level: "C2 – Full professional" },
  { name: "Arabic", level: "Native" },
  { name: "Turkish", level: "B2 – Upper intermediate" },
  { name: "Swedish", level: "A1 – Basic (actively improving)" },
  { name: "French", level: "A1 – Basic" },
];

// Education
export const education = [
  {
    id: "1",
    degree: "B.Sc. Computer & Software Engineering",
    institution: "Toros University",
    location: "Mersin, Turkey",
    startDate: "2019-09-01",
    endDate: "2023-07-30",
    gpa: "3.77/4.00",
    description: ["Ranked 1st in department & faculty with GPA 3.77/4.00", "Focused on software engineering, algorithms, and data structures", "Completed coursework in web development, databases, and system design", "Participated in multiple programming competitions and hackathons"],
    achievements: ["Valedictorian - Ranked 1st in department & faculty", "Administrative Board Member, Computer Sciences Community", "Teknofest 2023 Autonomous Harvesting Robot - Ranked 25/100+ teams", "Active participant in university programming competitions"],
  },
];

// Experience (reverse-chronological)
export const experience = [
  {
    id: "1",
    title: "IT Manager & Full Stack Developer",
    company: "The Home Co EG",
    location: "Remote (Egypt)",
    startDate: "2025-04-01",
    endDate: null,
    description: [
      "Leading company-wide digital transformation: Google Workspace, CRM/ERP, WooCommerce implementation",
      "Designed comprehensive template library (Sheets, Docs) and SOPs; coached staff in tech adoption",
      "Architected Elementor-based storefront with custom dynamic areas and performance optimization",
      "Serving as personal assistant to CEO for technical strategy and market research",
    ],
    technologies: ["WordPress", "Elementor", "WooCommerce", "Google Workspace", "PHP", "MySQL"],
    achievements: ["Streamlined company operations through digital transformation", "Improved website performance by 60% through optimization", "Successfully trained 20+ staff members on new systems"],
  },
  {
    id: "2",
    title: "Co Founder / CTO",
    company: "Kiwify Tech Company",
    location: "Mersin, Turkey",
    startDate: "2024-06-01",
    endDate: null,
    description: [
      "Tech lead for 10+ client projects (WordPress, ASP.NET, Flutter) from scoping to deployment",
      "Built custom APIs in ASP.NET Core + PostgreSQL; managed mobile apps in Flutter",
      "Oversaw hosting, DNS, mail, server administration, enforced CI/CD pipelines",
      "Coordinated 2 other co-founders; set coding standards & project timelines",
    ],
    technologies: ["ASP.NET Core", "PostgreSQL", "Flutter", "WordPress", "Docker", "CI/CD"],
    achievements: ["Successfully delivered 10+ client projects on time and budget", "Established company technical standards and best practices", "Built scalable architecture supporting 1000+ concurrent users"],
  },
  {
    id: "3",
    title: "Backend & Application Engineer",
    company: "Domogreen",
    location: "Lund, Sweden",
    startDate: "2024-07-01",
    endDate: "2025-04-30",
    description: [
      "Built scalable Django REST API with PostgreSQL & Redis, plus WebSocket data streaming",
      "Implemented role-based JWT authentication with Firebase Auth integration",
      "Designed cross-platform chatbot & collaboration app using .NET MAUI",
      "Contributed to particle physics research tools for EU partners",
    ],
    technologies: ["Django", "PostgreSQL", "Redis", "WebSocket", "Firebase Auth", ".NET MAUI"],
    achievements: ["Reduced API response time by 40% through optimization", "Implemented real-time features supporting 500+ concurrent users", "Successfully integrated complex authentication system"],
  },
  {
    id: "4",
    title: "Computer Vision & Backend Engineer",
    company: "Animals AI",
    location: "Helsingborg, Sweden",
    startDate: "2023-08-01",
    endDate: "2025-04-30",
    description: [
      "Developed 30+ computer vision models and 50+ image processing algorithms",
      "Created automated pipelines on Google Cloud Engine with scalable infrastructure",
      "Built Flask REST backend on GCP with Firebase, Cloud Run, Docker CI/CD",
      "Designed AI/IoT camera system: 12 cameras, 5+ Nvidia Jetson devices, RTSP streaming",
    ],
    technologies: ["Python", "PyTorch", "OpenCV", "GCP", "Flask", "Docker", "Nvidia Jetson"],
    achievements: ["Delivered 30+ production-grade computer vision models", "Achieved 95% accuracy in animal detection systems", "Mentored 3 interns and conducted field testing with researchers"],
  },
  {
    id: "5",
    title: "IT Intern",
    company: "Toros University",
    location: "Mersin, Turkey",
    startDate: "2023-03-01",
    endDate: "2023-07-30",
    description: [
      "Provided campus-wide IT support (Windows, Office, networking, VOIP, printers)",
      "Refurbished 50% of computer lab PCs and strengthened server & network infrastructure",
      "Assisted with router/switch configuration and user account administration",
      "Maintained and upgraded university's IT systems and equipment",
    ],
    technologies: ["Windows Server", "Networking", "VOIP", "Hardware Maintenance"],
    achievements: ["Reduced IT support tickets by 30% through proactive maintenance", "Successfully refurbished 50+ computer lab systems", "Improved network stability across campus"],
  },
  {
    id: "6",
    title: "Freelance Full Stack Web Developer",
    company: "Freelance",
    location: "Mersin, Turkey",
    startDate: "2021-09-01",
    endDate: "2022-09-30",
    description: [
      "Delivered custom websites using HTML/CSS/JS, PHP/Laravel, Wix Velo, and WordPress",
      "Applied SEO best practices and collaborated with marketing agencies",
      "Met tight deadlines and budget constraints for diverse client projects",
      "Provided ongoing maintenance and support for client websites",
    ],
    technologies: ["HTML/CSS", "JavaScript", "PHP", "Laravel", "WordPress", "Wix"],
    achievements: ["Completed 15+ successful freelance projects", "Achieved 98% client satisfaction rating", "Improved client website performance by average 45%"],
  },
];

// Major Projects
export const projects = [
  {
    id: "1",
    name: "Eggersmann UAE",
    description: "Enterprise-level multilingual WordPress website for luxury kitchen brand",
    technologies: ["WordPress", "Elementor Pro", "Pods", "PHP", "MySQL"],
    highlights: ["Multilingual custom post types implementation", "Varnish/Redis performance optimization", "Custom PHP development for complex functionality", "Sole developer responsible for entire project"],
    status: "Completed",
    year: "2024",
  },
  {
    id: "2",
    name: "Kingfisher Logistics Tracker",
    description: "Custom WordPress plugin for shipment tracking and logistics management",
    technologies: ["WordPress", "PHP", "MySQL", "REST API"],
    highlights: ["Role-based CRUD operations", "Secure API development", "Real-time shipment ETA tracking", "Custom dashboard for logistics teams"],
    status: "Completed",
    year: "2024",
  },
  {
    id: "3",
    name: "AI Animal Detection System",
    description: "Computer vision system for livestock monitoring and health assessment",
    technologies: ["Python", "PyTorch", "OpenCV", "GCP", "Nvidia Jetson"],
    highlights: ["30+ custom CV models developed", "Real-time processing with 95% accuracy", "IoT camera integration with 12 devices", "Automated alert system for farmers"],
    status: "Completed",
    year: "2023-2024",
  },
  {
    id: "4",
    name: "Teknofest Autonomous Harvesting Robot",
    description: "Competition entry for autonomous agricultural robot with AI navigation",
    technologies: ["Python", "Computer Vision", "ROS", "Arduino", "Machine Learning"],
    highlights: ["Ranked 25/100+ teams in national competition", "Autonomous navigation and crop harvesting", "Real-time obstacle detection and avoidance", "Team leader for 5-person engineering team"],
    status: "Competition Entry",
    year: "2023",
  },
];

// Certificates
export const certificates = [
  {
    id: "1",
    name: "AI Engineer Internship Certificate",
    organization: "Animals AI",
    date: "2023-08-01",
    link: "https://animals.ai",
    description: "Comprehensive internship covering computer vision, machine learning, and production AI systems",
  },
  {
    id: "2",
    name: "AI Engineer (Toros University Smart Lab)",
    organization: "Teknofest Finalist",
    date: "2023-05-01",
    description: "Recognition for AI engineering work in autonomous systems and robotics",
  },
  {
    id: "3",
    name: "Self Driving Car Course – Applied Deep Learning",
    organization: "Udemy",
    date: "2023-01-01",
    link: "https://udemy.com",
    description: "Comprehensive course on autonomous vehicle technology and deep learning applications",
  },
  {
    id: "4",
    name: "Python Bootcamp: Zero to Hero",
    organization: "Udemy",
    date: "2024-05-01",
    link: "https://udemy.com",
    description: "Complete Python programming course covering fundamentals to advanced concepts",
  },
  {
    id: "5",
    name: "Go – The Complete Guide",
    organization: "Udemy",
    date: "2025-03-01",
    link: "https://udemy.com",
    description: "Comprehensive Go programming language course with practical projects",
  },
  {
    id: "6",
    name: "Typing Certificate – 77 WPM",
    organization: "Typing.com",
    date: "2024-05-01",
    link: "https://typing.com",
    description: "Certified typing speed of 77 words per minute with 95% accuracy",
  },
];

// Achievements & Awards
export const achievements = [
  {
    id: "1",
    title: "Teknofest 2023 Autonomous Harvesting Robot",
    description: "Ranked 25/100+ teams in Turkey's largest technology competition (2.5M visitors)",
    year: "2023",
    category: "Competition",
  },
  {
    id: "2",
    title: "Letter of Recommendation from Yuan Xiong",
    description: "CTO of Animals.ai provided exceptional recommendation for technical leadership",
    year: "2024",
    category: "Recognition",
  },
  {
    id: "3",
    title: "Valedictorian – Toros University",
    description: "Graduated with highest GPA (3.77/4.00) in Computer & Software Engineering",
    year: "2023",
    category: "Academic",
  },
  {
    id: "4",
    title: "Solo Enterprise Website Delivery",
    description: "Successfully delivered Eggersmann UAE enterprise website as sole developer",
    year: "2024",
    category: "Professional",
  },
];

// Recommendations
export const recommendations = [
  {
    id: "1",
    name: "Yuan Xiong",
    title: "Co-founder & CTO",
    company: "Animals.ai",
    relationship: "Direct supervisor",
    content: "Ammar demonstrated exceptional initiative and technical excellence in computer vision and backend development at Animals AI. He quickly mastered complex problems, delivered robust production systems, and mentored junior staff. I confidently recommend him for senior engineering roles.",
    linkedinUrl: "https://linkedin.com/in/yuan-xiong",
    date: "2024-05-06",
    avatar: "/testimonials/yuan-xiong.jpg",
  },
];

// Services Offered
export const services = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description: "Complete web application development from frontend to backend, including database design and API integration.",
    technologies: ["React", "Next.js", "Django", "PostgreSQL", "AWS"],
    icon: "💻",
    features: ["Custom web application development", "Database design and optimization", "API development and integration", "Performance optimization", "Security implementation"],
  },
  {
    id: "2",
    title: "AI & Computer Vision Solutions",
    description: "Custom AI models and computer vision systems for business automation and intelligent data processing.",
    technologies: ["Python", "PyTorch", "OpenCV", "TensorFlow", "GCP"],
    icon: "🤖",
    features: ["Custom AI model development", "Computer vision systems", "Image processing algorithms", "Machine learning pipelines", "AI system deployment"],
  },
  {
    id: "3",
    title: "Mobile App Development",
    description: "Cross-platform mobile applications with native performance and modern user experience.",
    technologies: ["Flutter", "Dart", ".NET MAUI", "Firebase"],
    icon: "📱",
    features: ["Cross-platform development", "Native performance optimization", "Backend integration", "Push notifications", "App store deployment"],
  },
  {
    id: "4",
    title: "Cloud Architecture & DevOps",
    description: "Scalable cloud infrastructure design and implementation with automated deployment pipelines.",
    technologies: ["GCP", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    icon: "☁️",
    features: ["Cloud infrastructure design", "Automated deployment pipelines", "Scalability optimization", "Monitoring and alerting", "Cost optimization"],
  },
  {
    id: "5",
    title: "Technical Consulting & Architecture",
    description: "Strategic technical guidance, system architecture design, and technology stack recommendations.",
    technologies: ["System Design", "Architecture", "Strategy", "Planning"],
    icon: "🏗️",
    features: ["System architecture design", "Technology stack selection", "Performance optimization", "Security assessment", "Technical documentation"],
  },
  {
    id: "6",
    title: "Mentorship & Training",
    description: "Technical mentorship, code reviews, and training programs for development teams.",
    technologies: ["Leadership", "Training", "Best Practices", "Code Review"],
    icon: "👨‍🏫",
    features: ["Technical mentorship", "Code review and best practices", "Team training programs", "Career guidance", "Knowledge transfer"],
  },
];

// Social Links
export const socialLinks = {
  email: "mailto:ammarhanyezeldin@gmail.com",
  github: "https://github.com/amarhany20",
  linkedin: "https://www.linkedin.com/in/ammar-hany/",
  whatsapp: "https://wa.me/905395775990",
  youtube: "https://www.youtube.com/@TheChillTechgineer",
  website: "https://ammarhany.com",
};

// Blog Posts (if needed)
export const blogPosts = [
  {
    id: "1",
    title: "Building Scalable Computer Vision Systems",
    excerpt: "Learn how to architect and deploy production-ready computer vision systems that can handle thousands of concurrent requests.",
    date: "2024-12-15",
    readTime: "8 min read",
    tags: ["Computer Vision", "Python", "Scalability"],
    slug: "building-scalable-computer-vision-systems",
  },
  {
    id: "2",
    title: "Full-Stack Development Best Practices",
    excerpt: "Essential practices for building maintainable, scalable full-stack applications with modern technologies.",
    date: "2024-11-20",
    readTime: "6 min read",
    tags: ["Full-Stack", "Best Practices", "Architecture"],
    slug: "full-stack-development-best-practices",
  },
];

// Contact Information
export const contactInfo = {
  title: "Let's Work Together",
  subtitle: "Ready to bring your ideas to life? Let's discuss your project and explore how we can create something amazing together.",
  email: "ammarhanyezeldin@gmail.com",
  phone: "+90 539 577 5990",
  location: "Istanbul, Turkey / New Cairo, Egypt / Helsingborg, Sweden",
  availability: "Available for freelance projects and full-time opportunities",
  responseTime: "I typically respond within 24 hours",
  preferredContact: "Email or WhatsApp for quickest response",
};

// CV/Resume Information
export const cvInfo = {
  title: "Download My Resume",
  subtitle: "Get a comprehensive overview of my experience, skills, and achievements in a professional format.",
  downloadUrl: "/resume-ammar-hany.pdf",
  lastUpdated: "January 2025",
  formats: ["PDF", "Word"],
  languages: ["English", "Turkish"],
};

// Footer Information
export const footerInfo = {
  copyright: "© 2025 Ammar Hany. All rights reserved.",
  builtWith: "Built with Next.js, TypeScript, and Tailwind CSS",
  version: "v2.0",
  lastUpdated: "January 2025",
};
