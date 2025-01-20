import { Newspaper, Search, LineChart, Code, Rocket } from 'lucide-react';
import { Division } from '../types/division';

export const divisions: Division[] = [
  {
    name: 'Xposition',
    description: 'AI-powered investigative journalism platform combining machine learning with traditional journalistic values.',
    icon: Search,
    images: [
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'AI-powered investigation tools',
      'Real-time fact-checking',
      'Data visualization platform',
      'Collaborative journalism workspace',
      'Automated research assistance'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Noos',
    description: 'Advanced AI algorithms ensuring unbiased reporting and comprehensive fact-checking in real-time.',
    icon: Newspaper,
    images: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Neural network analysis',
      'Sentiment analysis', 
      'Cross-reference verification',
      'Bias detection algorithms',
      'Multilingual processing'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Blaide Research',
    description: 'Transforming financial markets through cutting-edge predictive analytics.',
    icon: LineChart,
    images: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Real-time market analysis',
      'Predictive modeling',
      'Risk assessment tools',
      'Portfolio optimization',
      'Automated trading strategies'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Blaide Labs',
    description: 'Delivering cutting-edge AI consulting and rapid full-stack development solutions.',
    icon: Code,
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Custom AI solutions',
      'Full-stack development',
      'Cloud architecture',
      'DevOps automation',
      'Technical consulting'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Blaide Foundry',
    description: 'Nurturing the next generation of AI-driven startups through comprehensive support and resources.',
    icon: Rocket,
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Seed funding',
      'Mentorship program',
      'Technical resources',
      'Network access',
      'Growth strategy'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
];