import { Project, SiteProfile } from '@/types/portfolio';

export const fallbackProfile: SiteProfile = {
  name: 'Your Name',
  title: 'Full-Stack Software Engineer',
  bio: 'I build high-performance web applications with modern technologies. Passionate about clean architecture, developer experience, and shipping products that make a difference.',
  resumeUrl: '/resume.pdf',
  email: 'you@example.com',
  phone: '+1 (555) 000-0000',
  githubUrl: 'https://github.com/yourusername',
  linkedinUrl: 'https://linkedin.com/in/yourusername',
  location: 'Remote / Available Worldwide',
};

export const fallbackProjects: Project[] = [
  {
    id: 'ai-chat-platform',
    title: 'AI Chat Platform',
    tagline: 'Real-time multi-agent conversational AI with streaming responses',
    description:
      'A full-featured chat platform powered by large language models, featuring real-time streaming, conversation history, and multi-agent orchestration.',
    tags: ['Next.js', 'TypeScript', 'WebSockets', 'OpenAI', 'Tailwind CSS'],
    mediaType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/yourusername/ai-chat',
    featured: true,
    role: 'Lead Full-Stack Developer',
    contributions: [
      'Architected real-time streaming pipeline with Server-Sent Events',
      'Built multi-agent orchestration system with tool calling',
      'Implemented conversation branching and history management',
    ],
    orderIndex: 0,
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    tagline: 'High-performance online store with Stripe and inventory management',
    description:
      'A production-grade e-commerce solution featuring product management, cart, checkout with Stripe, order tracking, and an admin dashboard.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    mediaType: 'image',
    mediaUrl: '',
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/yourusername/ecommerce',
    featured: true,
    role: 'Fullstack Developer',
    contributions: [
      'Integrated Stripe payment gateway with webhooks',
      'Built real-time inventory sync with Redis pub/sub',
      'Reduced checkout latency by 60% via query optimization',
    ],
    orderIndex: 1,
  },
  {
    id: 'devops-pipeline',
    title: 'CI/CD Pipeline Toolkit',
    tagline: 'Automated deployment pipeline for containerized microservices',
    description:
      'A reusable CI/CD toolkit that automates Docker image builds, testing, and deployment to Kubernetes clusters with zero-downtime rolling updates.',
    tags: ['Docker', 'Kubernetes', 'GitHub Actions', 'Go', 'Terraform'],
    mediaType: 'none',
    featured: false,
    role: 'DevOps Engineer',
    contributions: [
      'Designed zero-downtime rolling deployment strategy',
      'Reduced build times by 45% with layered Docker caching',
      'Wrote Terraform modules for GKE cluster provisioning',
    ],
    orderIndex: 2,
  },
];
