import { BlogPost } from '../types/blog.js';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Investigative Journalism',
    excerpt: 'How AI is revolutionizing the way we uncover and verify news stories.',
    content: `
      Artificial Intelligence is transforming investigative journalism in unprecedented ways. At Xposition, we're leveraging cutting-edge AI technologies to enhance our investigative capabilities and ensure the highest standards of journalistic integrity.

      Our AI systems can analyze vast amounts of data, identify patterns, and flag potential leads that human journalists might miss. This doesn't replace traditional journalism – instead, it augments our team's capabilities and allows them to focus on what they do best: telling compelling stories that matter.

      We're also using AI to verify sources, cross-reference facts, and detect potential misinformation. This combination of human expertise and AI capabilities is helping us set new standards in investigative journalism.
    `,
    author: 'Sarah Chen',
    date: '2024-03-15',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['AI', 'Journalism', 'Technology', 'Innovation']
  },
  {
    id: '2',
    title: 'Predictive Analytics: Reshaping Financial Markets',
    excerpt: 'How Blaide Research is using AI to transform financial forecasting.',
    content: `
      The financial markets are becoming increasingly complex, with countless variables affecting market movements. Traditional analysis methods are struggling to keep up, but AI-powered predictive analytics is changing the game.

      At Blaide Research, we've developed sophisticated AI models that can process massive amounts of market data in real-time, identifying trends and patterns that would be impossible to spot manually. Our systems analyze everything from market indicators to social media sentiment, providing a comprehensive view of market dynamics.

      This technology isn't just about making predictions – it's about understanding the interconnected nature of global markets and making informed decisions based on data-driven insights.
    `,
    author: 'Michael Torres',
    date: '2024-03-12',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Finance', 'AI', 'Predictive Analytics', 'Markets']
  },
  {
    id: '3',
    title: 'Building the Next Generation of AI Startups',
    excerpt: 'Inside Blaide Foundry: How we are nurturing AI-driven innovation.',
    content: `
      The startup ecosystem is evolving rapidly, and AI is at the forefront of this transformation. At Blaide Foundry, we're not just investing in startups – we're building a comprehensive support system for the next generation of AI innovators.

      Our incubation program provides more than just funding. We offer technical expertise, market insights, and access to our network of industry leaders. We believe that successful AI startups need a combination of cutting-edge technology, business acumen, and ethical considerations.

      Through our program, we're helping entrepreneurs turn their AI-driven ideas into successful, sustainable businesses that can make a real impact on the world.
    `,
    author: 'Lisa Wong',
    date: '2024-03-10',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Startups', 'Innovation', 'AI', 'Entrepreneurship']
  }
];