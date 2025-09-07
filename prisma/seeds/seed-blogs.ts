import { PrismaClient } from '@prisma/client';

export async function seedBlogs(prisma: PrismaClient) {
  console.log('\n[blogs] Seeding blog posts...');
  const posts = [
    {
      title: 'Designing Clean Backend Architectures Across Python and .NET',
      slug: 'clean-architecture-python-dotnet',
      excerpt: 'A practical comparison of applying layered architecture, DTO mapping, and repository patterns in Django/FastAPI vs ASP.NET Core.',
      content: '# Clean Architecture in Python & .NET\n\nThis article explores pragmatic patterns used across production backends (Django REST + ASP.NET Core)...',
      coverImage: null,
      author: 'Ammar Hany',
      publishedAt: new Date('2025-09-05'),
      category: 'Backend Engineering',
      tags: ['Architecture','Django','ASP.NET Core','Patterns','DTOs','Repositories'],
      readTime: 9,
      isPublished: true,
      isFeatured: true
    },
    {
      title: 'From CV Pipelines to Edge Deployment on Jetson',
      slug: 'cv-pipelines-edge-jetson',
      excerpt: 'Lessons learned building 30+ computer vision models and deploying real-time inference to Jetson devices in agricultural environments.',
      content: '# Edge CV Deployment on Jetson\n\nOptimization, streaming, and reliability techniques after shipping multi-camera CV workloads...',
      coverImage: null,
      author: 'Ammar Hany',
      publishedAt: new Date('2025-09-05'),
      category: 'AI / Computer Vision',
      tags: ['Computer Vision','YOLOv8','Jetson','Edge AI','Pipelines'],
      readTime: 11,
      isPublished: true,
      isFeatured: false
    }
  ];

  for (const post of posts) {
    const exists = await prisma.blogPost.findFirst({ where: { slug: post.slug } });
    if (exists) continue;
    await prisma.blogPost.create({ data: { ...post, tags: JSON.stringify(post.tags) } });
  }
  console.log('[blogs] Done.');
}
