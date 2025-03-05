import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Brain, Menu, X, ChevronDown, ChevronRight, Code, Activity, Zap, Database, Users, Clock, Shield, Layers, ChevronLeft } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Blog } from './pages/Blog.js';
import { BlogPost } from './pages/BlogPost.js';
import { Admin } from './pages/Admin.js';
import { divisions } from './data/divisions.js';
import { Division } from './types/division.js';
import { sendEmail } from './lib/email.js';
import { getEnvironmentConfig } from './config/environment.js';
import { addContactMessage } from './services/firestore.js';
import { ImageCarousel } from './components/ImageCarousel.js';
import { motion, AnimatePresence, useReducedMotion, AnimateSharedLayout } from "framer-motion";
import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// Define interfaces for our data structures
interface ProjectBenefit {
  icon: 'users' | 'clock' | 'shield' | 'activity' | 'database' | 'layers';
  title: string;
  description: string;
}

interface Project {
  id: number;
  title: string;
  preview: string;
  backgroundImage: string;
  detailImage: string;
  description: string;
  features: string[];
  techStack: string[];
  benefits: ProjectBenefit[];
}

// Project Card component with proper typing
interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

// Create a custom hook for responsive columns
function useResponsiveColumns() {
  const [columns, setColumns] = useState(3);
  
  useLayoutEffect(() => {
    function updateColumns() {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    }
    
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);
  
  return columns;
}

// Create a masonry layout component
function MasonryGrid({ children }: { children: React.ReactNode[] }) {
  const columns = useResponsiveColumns();
  
  // Create column arrays based on the number of columns
  const columnGroups: React.ReactNode[][] = Array.from({ length: columns }, () => []);
  
  // Distribute children among columns
  children.forEach((child, i) => {
    const columnIndex = i % columns;
    columnGroups[columnIndex].push(child);
  });
  
  return (
    <div className="flex w-full gap-6">
      {columnGroups.map((column, i) => (
        <div key={i} className="flex flex-col gap-6 flex-1">
          {column}
        </div>
      ))}
    </div>
  );
}

// Update the ProjectCard component to have random heights
function ProjectCard({ project, onClick }: ProjectCardProps) {
  // Create varying heights using a more sophisticated approach
  // Use project.id to ensure consistent heights between renders
  const heightClass = React.useMemo(() => {
    const heights = ['h-48 md:h-64', 'h-56 md:h-72', 'h-64 md:h-80'];
    const randomIndex = (project.id + project.title.length) % 3;
    return heights[randomIndex];
  }, [project.id, project.title]);
  
  // Generate random preview length (2-5 lines) - increased from (1-3 lines)
  const previewLines = React.useMemo(() => {
    return ((project.id * 3) % 4) + 2; // 2, 3, 4, or 5 lines based on project.id
  }, [project.id]);

  return (
    <motion.div 
      className="overflow-hidden rounded-xl cursor-pointer shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
      onClick={() => onClick(project)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div 
        className={`relative ${heightClass} bg-cover bg-center`}
        style={{ backgroundImage: `url(${project.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="text-lg md:text-xl font-bold mb-1 text-white/95">{project.title}</h3>
          <p className={`text-sm text-white/90 ${previewLines === 2 ? 'line-clamp-2' : previewLines === 3 ? 'line-clamp-3' : previewLines === 4 ? 'line-clamp-4' : 'line-clamp-5'}`}>
            {project.preview}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Project Modal component with proper typing
interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Add this function to handle the CTA button click
  const handleCtaClick = () => {
    // Close the modal
    onClose();
    
    // Get the scrollToContactWithDivision function from the HomePage component
    // This is a workaround since we can't directly access the function
    const contactButton = document.createElement('button');
    contactButton.setAttribute('data-division', 'Labs');
    contactButton.setAttribute('data-action', 'contact');
    contactButton.style.display = 'none';
    document.body.appendChild(contactButton);
    
    // Dispatch a custom event that the HomePage component will listen for
    const event = new CustomEvent('contactWithDivision', { 
      detail: { division: 'Labs' } 
    });
    contactButton.dispatchEvent(event);
    
    // Clean up
    document.body.removeChild(contactButton);
  };

  if (!project) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        ref={modalRef}
        className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700/50"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between bg-gray-700/80 px-6 py-4 border-b border-gray-600/30">
          <h2 className="text-xl md:text-2xl font-bold text-white">{project.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-600/50 focus:outline-none transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* Magazine-style layout with integrated images */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
              <ChevronRight className="mr-2" size={20} />
              Overview
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="md:w-2/3">
                <p className="text-white/90 leading-relaxed mb-4">{project.description.substring(0, project.description.length / 2)}</p>
              </div>
              <div className="md:w-1/3">
                <img 
                  src={project.detailImage} 
                  alt={project.title} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <p className="text-white/90 leading-relaxed">
              {project.description.substring(project.description.length / 2)}
            </p>
          </div>
          
          {/* Key Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
              <ChevronRight className="mr-2" size={20} />
              Key Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {project.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Zap className="mr-2 text-yellow-400 flex-shrink-0 mt-1" size={18} />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
              <ChevronRight className="mr-2" size={20} />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string, index: number) => (
                <span key={index} className="bg-gray-700/70 text-blue-300 px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm">
                  <Code size={14} className="mr-1.5" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
              <ChevronRight className="mr-2" size={20} />
              Business Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {project.benefits.map((benefit: ProjectBenefit, index: number) => (
                <div key={index} className="bg-gray-700/40 p-5 rounded-lg shadow-sm border border-gray-600/30 hover:border-gray-500/50 transition-colors duration-300">
                  <div className="flex items-center mb-2">
                    {benefit.icon === 'users' && <Users className="text-green-400 mr-2.5" size={20} />}
                    {benefit.icon === 'clock' && <Clock className="text-purple-400 mr-2.5" size={20} />}
                    {benefit.icon === 'shield' && <Shield className="text-red-400 mr-2.5" size={20} />}
                    {benefit.icon === 'activity' && <Activity className="text-blue-400 mr-2.5" size={20} />}
                    {benefit.icon === 'database' && <Database className="text-yellow-400 mr-2.5" size={20} />}
                    {benefit.icon === 'layers' && <Layers className="text-orange-400 mr-2.5" size={20} />}
                    <h4 className="font-medium text-white">{benefit.title}</h4>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA - Updated with click handler */}
          <div className="mt-10 flex justify-center">
            <button 
              onClick={handleCtaClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/20 transform hover:translate-y-[-2px]"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-gray-900/90 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/logos/blaide_white_nobg.png" alt="Blaide Logo" className="h-20" />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a 
                href="#divisions" 
                className="text-white hover:text-blue-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('divisions')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Divisions
              </a>
              <a href="#contact" className="text-white hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-gray-700"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a 
                href="#divisions" 
                className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('divisions')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                  setIsMenuOpen(false);
                }}
              >
                Divisions
              </a>
              <a href="#contact" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md">Contact</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HomePage(): JSX.Element {
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Add these state variables at the component level, not inside renderDrawerContent
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  // Add this new state for Research content expansion
  const [showFullResearchContent, setShowFullResearchContent] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    division: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track viewport height for mobile browsers
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselSlides = [
    {
      title: "Pioneering AI Innovation",
      subtitle: "Unifying cutting-edge AI ventures under one visionary umbrella",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      title: "Transforming Industries",
      subtitle: "Reimagining business processes through intelligent automation",
      gradient: "from-green-400 to-blue-500"
    },
    {
      title: "Building Tomorrow's Technology",
      subtitle: "Creating the future of AI with practical, scalable solutions",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  // Add a function to handle directing users to the contact form with division preselected
  const scrollToContactWithDivision = (division: string): void => {
    // Close the drawer if it's open
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      setTimeout(() => {
        setSelectedDivision(null);
      }, 300);
    }
    
    // Scroll to the contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Set the division in the contact form
      setTimeout(() => {
        const divisionSelect = document.getElementById('division') as HTMLSelectElement;
        if (divisionSelect) {
          divisionSelect.value = division;
          // Trigger a change event to ensure the form state updates
          divisionSelect.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Update the formData state as well
          setFormData(prevData => ({
            ...prevData,
            division: division
          }));
        }
      }, 800); // Short delay to ensure the form is in view
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggles drawer open/closed
  const toggleDrawer = (division: Division) => {
    if (selectedDivision?.name === division.name) {
      setIsDrawerOpen(false);
      setTimeout(() => {
        setSelectedDivision(null);
      }, 300);
    } 
    else {
      setSelectedDivision(division);
      setIsDrawerOpen(true);
    }
  };

  // Define these handlers at the component level
  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Move this array outside the renderDrawerContent function
  const labsProjects: Project[] = [
    {
      id: 1,
      title: "ConversAI: Intelligent Support",
      preview: "Transform customer support with our advanced AI chatbot that handles inquiries, troubleshoots issues, and executes transactions autonomously.",
      backgroundImage: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop",
      description: "ConversAI is a sophisticated customer support platform powered by the latest large language models (LLMs) including GPT-4o and our proprietary agentic enhancements. It goes beyond basic chatbots by understanding complex queries, executing multi-step processes, and learning from interactions to continually improve its performance. Our solution integrates seamlessly with existing customer support systems while reducing operational costs by up to 60%.",
      features: [
        "Natural language understanding with 97% accuracy",
        "Autonomous issue resolution for common problems",
        "Seamless handoff to human agents when needed",
        "Multi-channel deployment (website, mobile, social)",
        "Real-time sentiment analysis and escalation protocols",
        "Custom knowledge base integration",
        "Transaction processing capabilities",
        "Multilingual support in over 30 languages"
      ],
      techStack: [
        "GPT-4o", "Custom Agentic Framework", "Python", "Node.js", "Redis", "MongoDB", "Docker", "Kubernetes"
      ],
      benefits: [
        {
          icon: "clock",
          title: "24/7 Availability",
          description: "Provide round-the-clock support without staffing concerns or increased costs."
        },
        {
          icon: "database",
          title: "Cost Reduction",
          description: "Decrease support costs by up to 60% while improving customer satisfaction metrics."
        },
        {
          icon: "users",
          title: "Improved Experience",
          description: "Deliver consistent, high-quality responses with minimal wait times."
        },
        {
          icon: "activity",
          title: "Scalable Solution",
          description: "Handle sudden increases in demand without performance degradation."
        }
      ]
    },
    {
      id: 2,
      title: "ContentForge AI",
      preview: "Generate high-converting marketing content at scale with our adaptive AI content creation platform.",
      backgroundImage: "https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=2013&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=2064&auto=format&fit=crop",
      description: "ContentForge AI revolutionizes marketing content creation by generating high-quality, tailored content across multiple formats. From engaging blog posts to compelling social media captions and conversion-focused email campaigns, our platform leverages advanced AI to produce content that resonates with your specific audience segments. What sets ContentForge apart is its ability to adapt tone, style, and messaging to match your brand voice while maintaining consistency across all channels.",
      features: [
        "Brand voice calibration and maintenance",
        "Multi-format content generation (blogs, social, ads, emails)",
        "SEO optimization built into content creation",
        "Automated content calendar management",
        "A/B testing variations generator",
        "Audience segment customization",
        "Performance analytics and feedback loop",
        "Brand compliance checking"
      ],
      techStack: [
        "LLM fine-tuning", "NLP frameworks", "Python", "TensorFlow", "React", "NextJS", "GraphQL", "PostgreSQL"
      ],
      benefits: [
        {
          icon: "clock",
          title: "Time Efficiency",
          description: "Reduce content creation time by up to 80%, allowing teams to focus on strategy."
        },
        {
          icon: "layers",
          title: "Content Consistency",
          description: "Maintain brand voice across all channels and team members automatically."
        },
        {
          icon: "activity",
          title: "Increased Output",
          description: "Produce 10x more content without increasing headcount or budget."
        },
        {
          icon: "users",
          title: "Personalization at Scale",
          description: "Create tailored content for different audience segments simultaneously."
        }
      ]
    },
    {
      id: 3,
      title: "InsightPulse",
      preview: "Transform complex data into actionable insights with our AI-powered business intelligence solution.",
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
      description: "InsightPulse is a revolutionary data summarization and business intelligence tool that empowers decision-makers to extract meaningful insights from massive datasets in seconds. Using advanced natural language processing and machine learning algorithms, InsightPulse automatically analyzes reports, research papers, market data, and unstructured content to deliver concise summaries and actionable recommendations. The platform features automated dashboard generation that transforms raw data into visual insights, making complex information accessible to stakeholders at all levels.",
      features: [
        "Automated data ingestion from multiple sources",
        "Natural language summaries of complex reports",
        "Visual dashboard generation from unstructured data",
        "Trend identification and anomaly detection",
        "Predictive analytics and forecasting",
        "Custom KPI tracking and alerts",
        "Competitive intelligence gathering",
        "Executive-ready presentation generation"
      ],
      techStack: [
        "Deep Learning", "NLP", "Data Processing Pipeline", "Python", "R", "D3.js", "Tableau Integration", "Cloud Data Warehouse"
      ],
      benefits: [
        {
          icon: "database",
          title: "Data Democratization",
          description: "Make complex data accessible and actionable for non-technical stakeholders."
        },
        {
          icon: "activity",
          title: "Faster Decision Making",
          description: "Reduce analysis time from days to minutes, accelerating strategic decisions."
        },
        {
          icon: "shield",
          title: "Competitive Advantage",
          description: "Identify market trends and opportunities before competitors can react."
        },
        {
          icon: "layers",
          title: "Resource Optimization",
          description: "Redirect data analysts to high-value tasks instead of report generation."
        }
      ]
    },
    {
      id: 4,
      title: "NarrativeCraft",
      preview: "Create personalized, interactive storytelling experiences that adapt to user choices and preferences.",
      backgroundImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1539553224133-f7767ea30c6c?q=80&w=1933&auto=format&fit=crop",
      description: "NarrativeCraft is an innovative platform that enables the creation of dynamic, interactive storytelling experiences powered by generative AI. Whether for entertainment, education, or marketing, our platform allows content creators to build engaging narratives that adapt to user choices in real-time. NarrativeCraft can generate rich, branching storylines, educational content with personalized learning paths, or interactive marketing experiences that respond to consumer preferences—all at a scale previously impossible with traditional content creation methods.",
      features: [
        "Dynamic storyline generation with branching narratives",
        "Personalized character and plot development",
        "Interactive learning paths for educational content",
        "Voice and text input for narrative progression",
        "Multi-format output (text, audio narration, visuals)",
        "User preference learning and adaptation",
        "Content moderation and safety filters",
        "Analytics on user engagement and choices"
      ],
      techStack: [
        "GPT-4", "Stable Diffusion", "Audio Generation", "React", "Three.js", "AWS", "Firebase", "WebSockets"
      ],
      benefits: [
        {
          icon: "users",
          title: "Enhanced Engagement",
          description: "Increase user retention by 40% through personalized narrative experiences."
        },
        {
          icon: "layers",
          title: "Content Scalability",
          description: "Generate thousands of unique narrative paths from a single content framework."
        },
        {
          icon: "activity",
          title: "Learning Outcomes",
          description: "Improve information retention by 35% through interactive educational content."
        },
        {
          icon: "database",
          title: "User Insights",
          description: "Gather valuable data on user preferences and decision-making patterns."
        }
      ]
    },
    {
      id: 5,
      title: "AdGenesis",
      preview: "Revolutionize your advertising with AI-generated creatives tailored for different audience segments and platforms.",
      backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2074&auto=format&fit=crop",
      description: "AdGenesis is a cutting-edge platform that transforms advertising creative development through generative AI. Our system can automatically produce dozens of variations of ad creatives—from compelling copy and eye-catching images to short video clips—all tailored to specific audience segments and distribution channels. By analyzing performance data and user engagement metrics, AdGenesis continuously refines its outputs to maximize campaign effectiveness. This allows marketing teams to rapidly test and iterate on their advertising strategies while significantly reducing production costs and time-to-market.",
      features: [
        "Multi-format creative generation (text, image, video)",
        "Audience segment personalization engine",
        "Platform-specific formatting (social, display, search)",
        "A/B testing automation with performance analytics",
        "Brand voice and style consistency enforcement",
        "Dynamic creative adaptation based on performance",
        "Seasonal and trend-based creative updating",
        "Compliance and regulatory checks by industry"
      ],
      techStack: [
        "Generative AI", "Computer Vision", "Video Generation", "Python", "TensorFlow", "AWS", "Figma API Integration", "Analytics Pipeline"
      ],
      benefits: [
        {
          icon: "clock",
          title: "Production Efficiency",
          description: "Reduce creative production time from weeks to hours while maintaining quality."
        },
        {
          icon: "activity",
          title: "Improved Performance",
          description: "Increase click-through rates by 30% through targeted creative variations."
        },
        {
          icon: "database",
          title: "Cost Reduction",
          description: "Lower creative production costs by up to 70% compared to traditional methods."
        },
        {
          icon: "layers",
          title: "Campaign Agility",
          description: "Quickly adapt to market trends and competitive activity with fresh creatives."
        }
      ]
    },
    {
      id: 6,
      title: "DocuMind Analyzer",
      preview: "Extract deep insights from complex documents with our advanced document analysis and research platform.",
      backgroundImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2048&auto=format&fit=crop",
      description: "DocuMind Analyzer is a sophisticated document intelligence system that processes and analyses documents of any format, from academic papers to legal contracts and creative works. Using advanced AI techniques, it triages documents by type, performs necessary conversions, and builds a comprehensive textual corpus. What sets DocuMind apart is its ability to extract and contextualize images within documents, understanding their relationship to the surrounding text and building a rich, interconnected knowledge graph. This enables nuanced question-answering capabilities and deeper analysis than traditional document processing systems.",
      features: [
        "Multi-format document processing (PDF, DOCX, ePub, etc.)",
        "Automatic document classification and triage",
        "Image extraction and contextual understanding",
        "Cross-reference identification between documents",
        "Deep semantic analysis for subtext and implications",
        "Custom knowledge graph construction",
        "Advanced question-answering system",
        "Summarization at multiple abstraction levels"
      ],
      techStack: [
        "OCR Technology", "Natural Language Understanding", "Computer Vision", "Knowledge Graphs", "Vector Databases", "Python", "TensorFlow", "Neo4j"
      ],
      benefits: [
        {
          icon: "clock",
          title: "Research Acceleration",
          description: "Reduce research time by 80% while discovering deeper connections in content."
        },
        {
          icon: "database",
          title: "Knowledge Extraction",
          description: "Uncover hidden insights and relationships across vast document collections."
        },
        {
          icon: "shield",
          title: "Compliance Assurance",
          description: "Identify regulatory concerns and contractual obligations automatically."
        },
        {
          icon: "layers",
          title: "Content Utilization",
          description: "Maximize the value of existing document repositories and institutional knowledge."
        }
      ]
    },
    {
      id: 7,
      title: "CareerPilot AI",
      preview: "Optimize job applications and accelerate your career progress with our AI-powered career assistant.",
      backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop",
      description: "CareerPilot AI is a comprehensive career advancement platform that leverages artificial intelligence to optimize every aspect of the job search and career development process. Starting with resume analysis and optimization, CareerPilot intelligently tailors application materials to specific job descriptions, significantly increasing interview rates. The platform continuously scans job boards and company websites for opportunities that match the user's skills and career goals, providing personalized recommendations and application strategies. Through its coaching capabilities, CareerPilot also offers interview preparation, salary negotiation guidance, and ongoing career development planning.",
      features: [
        "AI-powered resume optimization for ATS systems",
        "Job description matching and application tailoring",
        "Automated cover letter generation with customization",
        "Personalized job opportunity alerts and recommendations",
        "Interview preparation with industry-specific questions",
        "Salary negotiation strategies and market data",
        "Career progression planning and skill gap analysis",
        "Professional network growth recommendations"
      ],
      techStack: [
        "NLP", "Machine Learning", "Web Scraping", "Python", "React", "Node.js", "PostgreSQL", "Redis"
      ],
      benefits: [
        {
          icon: "activity",
          title: "Application Success",
          description: "Increase interview rates by 300% through optimized application materials."
        },
        {
          icon: "clock",
          title: "Time Efficiency",
          description: "Reduce job search time by automating application customization and discovery."
        },
        {
          icon: "database",
          title: "Market Insights",
          description: "Access real-time salary and job requirement data for informed career decisions."
        },
        {
          icon: "users",
          title: "Career Advancement",
          description: "Accelerate professional growth through targeted skill development recommendations."
        }
      ]
    },
    {
      id: 8,
      title: "DevFlow AI",
      preview: "Streamline your development process from ideation to deployment with our intelligent workflow automation.",
      backgroundImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop",
      description: "DevFlow AI is a comprehensive development workflow automation platform that transforms how software products are built. From initial business idea to final deployment, our system employs specialized AI agents that assist at every stage of the development lifecycle. DevFlow helps users refine concepts, create detailed roadmaps, generate code, conduct thorough testing, handle deployment, and manage launch activities. By automating repetitive tasks and providing intelligent guidance, DevFlow significantly accelerates development timelines while maintaining high quality standards.",
      features: [
        "AI-assisted product ideation and validation",
        "Automated roadmap and sprint planning",
        "Code generation and documentation",
        "Intelligent testing and quality assurance",
        "CI/CD pipeline integration and optimization",
        "Deployment automation across environments",
        "Launch strategy planning and execution",
        "Progress tracking and bottleneck identification"
      ],
      techStack: [
        "LLM for Code", "Agent Framework", "GitHub Integration", "CI/CD Tools", "Kubernetes", "Docker", "TypeScript", "Python"
      ],
      benefits: [
        {
          icon: "clock",
          title: "Development Speed",
          description: "Reduce development time by up to 60% while maintaining code quality."
        },
        {
          icon: "shield",
          title: "Quality Assurance",
          description: "Decrease production bugs by 75% through consistent testing and best practices."
        },
        {
          icon: "layers",
          title: "Resource Optimization",
          description: "Allow developers to focus on creative problem-solving instead of repetitive tasks."
        },
        {
          icon: "activity",
          title: "Predictable Delivery",
          description: "Improve project estimation accuracy and consistently meet deadlines."
        }
      ]
    },
    {
      id: 9,
      title: "QuantumTrade AI",
      preview: "Harness the power of advanced AI algorithms for sophisticated market analysis and automated trading strategies.",
      backgroundImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop",
      description: "QuantumTrade AI is a state-of-the-art trading platform powered by sophisticated artificial intelligence and machine learning algorithms. Our system analyzes vast amounts of market data, news, social sentiment, and economic indicators in real-time to identify trading opportunities across multiple asset classes. QuantumTrade employs a multi-agent architecture where specialized AI agents handle different aspects of the trading process—from market analysis and strategy formulation to risk management and execution. The platform adapts to changing market conditions and continuously optimizes its strategies based on performance data.",
      features: [
        "Multi-agent trading system architecture",
        "Real-time data processing across markets",
        "Sentiment analysis of news and social media",
        "Pattern recognition and anomaly detection",
        "Automated strategy development and backtesting",
        "Risk management and position sizing",
        "Multi-timeframe analysis",
        "Portfolio optimization and rebalancing"
      ],
      techStack: [
        "Reinforcement Learning", "Time Series Analysis", "Neural Networks", "Python", "TensorFlow", "Kafka", "InfluxDB", "AWS"
      ],
      benefits: [
        {
          icon: "activity",
          title: "Enhanced Performance",
          description: "Access institutional-grade trading strategies previously unavailable to most investors."
        },
        {
          icon: "shield",
          title: "Risk Mitigation",
          description: "Implement sophisticated risk management to protect capital in volatile markets."
        },
        {
          icon: "clock",
          title: "24/7 Operation",
          description: "Take advantage of global market opportunities without constant human monitoring."
        },
        {
          icon: "database",
          title: "Data-Driven Decisions",
          description: "Eliminate emotional biases from trading decisions through systematic analysis."
        }
      ]
    }
  ];

  // Modify renderDrawerContent for both Labs and Research divisions
  const renderDrawerContent = () => {
    if (selectedDivision?.name === 'Labs') {
      return (
        <div className="p-8 md:p-10 pt-16"> {/* Extra top padding for floating close button */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Blaide Labs</h2>
          <p className="text-gray-300 mb-8 max-w-3xl">
            Our innovation workshop where cutting-edge AI solutions are developed, tested, and refined for real-world applications.
          </p>
          
          <MasonryGrid>
            {labsProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={handleOpenModal} 
              />
            ))}
          </MasonryGrid>
        </div>
      );
    }
    else if (selectedDivision?.name === 'Research') {
      return (
        <div className="p-8 md:p-10 pt-16 custom-scrollbar"> {/* Extra top padding for floating close button */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Uncovering Hidden Rhythms in Financial Markets</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Blaide Research pioneers frameworks that decode cyclical patterns in equities, commodities, and FX—bridging quantitative rigor with natural time principles.
            </p>
            
            {/* Visual Element */}
            <div className="mb-10 bg-gray-800/50 rounded-xl overflow-hidden shadow-lg">
              <div className="p-5 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7">
                    <h3 className="text-xl font-bold text-white mb-4">Our Differentiator: Market Periodicity</h3>
                    <p className="text-gray-300 mb-4">
                      While most quantitative approaches fixate on statistical anomalies, Blaide Research investigates the mathematical relationship between asset price movements and underlying cyclical forces.
                    </p>
                    <p className="text-gray-300">
                      By applying spectral analysis techniques developed in astrophysics and chronobiology, we uncover hidden market frequencies and non-random patterns in market behavior.
                    </p>
                  </div>
                  <div className="md:col-span-5 flex justify-center items-center">
                    <div className="relative h-40 w-40 md:h-48 md:w-48">
                      {/* Animated waveform visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-full w-full rounded-full border-4 border-blue-500/30 flex items-center justify-center animate-pulse">
                          <div className="h-[85%] w-[85%] rounded-full border-4 border-blue-400/40 flex items-center justify-center">
                            <div className="h-[80%] w-[80%] rounded-full border-4 border-blue-300/50 flex items-center justify-center">
                              <div className="h-[70%] w-[70%] rounded-full bg-blue-600/20 flex items-center justify-center">
                                <div className="text-blue-400 font-bold text-lg">Cycle<br/>Analysis</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content that can be toggled */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Research Focus</h3>
              <p className="text-white/90 mb-6">
                Our core research investigates three interrelated areas:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Spectral Market Analysis</h4>
                  <p className="text-white/80">
                    Building Fourier transform models to decompose market movements into constituent frequencies, revealing cyclical patterns invisible to traditional analysis.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Temporal Market Clustering</h4>
                  <p className="text-white/80">
                    Identifying recurring market regimes and behavior patterns through unsupervised learning on multi-decade financial datasets.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Entrainment & Phase Synchronization</h4>
                  <p className="text-white/80">
                    Studying how markets synchronize with external cycles in nature, human behavior, and institutional processes.
                  </p>
                </div>
              </div>
            </div>
            
            {showFullResearchContent && (
              <div className="mt-8 mb-10 animate-fadeIn">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Applications & Impact</h3>
                <p className="text-white/90 mb-4">
                  Our research holds value for:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-2">Academics</h4>
                    <p className="text-white/70">A novel framework for modeling market psychology through natural cycles.</p>
                  </div>
                  <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-2">Asset Managers</h4>
                    <p className="text-white/70">Complementary signals for timing entries, exits, and hedging.</p>
                  </div>
                  <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-2">Quant Funds</h4>
                    <p className="text-white/70">Unconventional alpha factors validated across centuries of data.</p>
                  </div>
                  <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-2">Risk Management</h4>
                    <p className="text-white/70">Enhanced tools for anticipating volatility regime changes.</p>
                  </div>
                </div>
                
                <div className="mt-12 bg-gray-800/50 p-6 rounded-xl border border-gray-700/30">
                  <h3 className="text-xl font-bold text-white mb-4">Join the Exploration</h3>
                  <p className="text-white/80 mb-6">
                    Discover how Blaide Research is redefining market analysis. Download our whitepaper "Cycles, Clusters, and Market Anomalies" for a non-technical overview of our methodology.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    <button 
                      onClick={() => scrollToContactWithDivision('Research')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                      Access Research Preview
                    </button>
                  </div>
                  
                  <p className="mt-4 text-sm text-center text-gray-400">
                    For collaboration or institutional inquiries, contact research@blaide.com
                  </p>
                </div>
                
                <div className="mt-8 text-sm text-gray-500 italic">
                  Blaide Research's findings are preliminary and subject to peer review. Past observations are not indicative of future results. This is not investment advice. Proprietary methodology details remain confidential.
                </div>
              </div>
            )}
            
            {/* Toggle Button */}
            <div className="flex justify-center mb-2">
              <button 
                onClick={() => setShowFullResearchContent(!showFullResearchContent)}
                className="flex items-center justify-center text-sm text-blue-400 hover:text-blue-300 transition-colors py-2 px-4 rounded-md hover:bg-gray-700/30"
              >
                <span className="mr-2">{showFullResearchContent ? 'Show Less' : 'Read More'}</span>
                {showFullResearchContent ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }
    else if (selectedDivision?.name === 'Foundry') {
      return (
        <div className="p-8 md:p-10 pt-16 custom-scrollbar"> {/* Extra top padding for floating close button */}
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Your Vision, Our Code</h2>
              <p className="text-gray-300 text-lg">
                For non-technical founders who want to build tech startups without hiring a CTO.
              </p>
            </div>
            
            {/* Simple hero image */}
              <div className="mb-10 bg-gray-800/50 rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-orange-700/20"></div>
                <div className="relative z-10 flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                          </div>
                  <div className="p-3 bg-orange-500/20 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                      <polyline points="16 3 21 3 21 8"></polyline>
                      <line x1="4" y1="20" x2="21" y2="3"></line>
                      <polyline points="21 16 21 21 16 21"></polyline>
                      <line x1="15" y1="15" x2="21" y2="21"></line>
                      <line x1="4" y1="4" x2="9" y2="9"></line>
                    </svg>
                              </div>
                            </div>
                          </div>
                      </div>
                      
            {/* 3 Key Services Section */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-blue-400 mb-4">We Provide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                    <span className="text-white font-semibold">Full Tech Development</span>
                  </div>
                </div>
                <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                    <span className="text-white font-semibold">Go-to-Market Strategy</span>
                  </div>
                </div>
                <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    <span className="text-white font-semibold">Equity Partnerships</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* How It Works Section */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Build Your Startup in 4 Steps</h3>
              <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">1</div>
                    <span className="text-white">Pitch your idea</span>
                    </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">2</div>
                    <span className="text-white">We build MVP</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">3</div>
                    <span className="text-white">Launch together</span>
                </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">4</div>
                    <span className="text-white">Scale with shared success</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="text-center bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Ready to start?</h3>
              <button 
                onClick={() => scrollToContactWithDivision('Foundry')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
              >
                Book Free Consultation
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = getEnvironmentConfig();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update Firestore
      await addContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        division: formData.division,
        message: formData.message,
        created_at: new Date(),
        is_read: false
      });

      // Send email through API
      await sendEmail({
        to: config.emailService.adminEmail,
        from_name: formData.name,
        from_email: formData.email,
        subject: `New message from ${formData.name}`,
        message: formData.message,
        division: formData.division,
        phone: formData.phone || undefined
      });

      toast.success('Message sent successfully!');
      setFormData({ 
        name: '', 
        email: '', 
        message: '', 
        phone: '',
        division: 'General Inquiry'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Add the custom scrollbar styles to the document
    const style = document.createElement('style');
    style.innerHTML = `
      /* Existing styles... */
      
      /* Add animation for progress bar in Foundry section */
      @keyframes progressGrow {
        from { width: 0%; }
        to { width: 100%; }
      }
      
      @keyframes moveRight {
        from { left: 0; }
        to { left: 100%; }
      }
      
      /* Add animation for cube in Foundry section */
      @keyframes spin-slow {
        from { transform: rotateX(0) rotateY(0); }
        to { transform: rotateX(360deg) rotateY(360deg); }
      }
      
      .animate-spin-slow {
        animation: spin-slow 15s linear infinite;
      }
      
      .perspective-500 {
        perspective: 500px;
      }
      
      .transform-style-3d {
        transform-style: preserve-3d;
      }
      
      /* Existing animations continue... */
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Add event listener for custom contactWithDivision event
    const handleContactWithDivision = (event: CustomEvent) => {
      const { division } = event.detail;
      scrollToContactWithDivision(division);
    };

    // Add the event listener
    document.addEventListener('contactWithDivision', handleContactWithDivision as EventListener);

    // Clean up
    return () => {
      document.removeEventListener('contactWithDivision', handleContactWithDivision as EventListener);
    };
  }, [scrollToContactWithDivision]);  // Include scrollToContactWithDivision in the dependency array

  return (
    <>
      {/* Hero Section - Add top padding to account for fixed navbar */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto text-center relative">
          <AnimatePresence mode="wait">
            {carouselSlides.map((slide, index) => (
              activeSlide === index && (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center"
                >
                  <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${slide.gradient} text-transparent bg-clip-text`}>
                    {slide.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
                    {slide.subtitle}
                  </p>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          <a
            href="#divisions"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-blue-600/20"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('divisions')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
          >
            Explore
          </a>

          {/* Carousel Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSlide === index ? 'bg-blue-500' : 'bg-gray-500 opacity-50 hover:opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Previous/Next Buttons */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-800/50 text-white/70 hover:bg-gray-700/70 hover:text-white transition-all duration-200 focus:outline-none hidden md:block"
            onClick={() => setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-800/50 text-white/70 hover:bg-gray-700/70 hover:text-white transition-all duration-200 focus:outline-none hidden md:block"
            onClick={() => setActiveSlide((prev) => (prev + 1) % carouselSlides.length)}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Enhanced Divisions Section with improved card borders */}
      <section 
        id="divisions" 
        className="relative flex flex-col md:flex-row h-screen overflow-hidden"
        style={{ 
          paddingTop: "64px" // Account for navbar
        }}
      >
        {/* Cards Container - Improved border handling */}
        <div 
          className={`
            ${isDrawerOpen ? 'md:w-1/4 w-full' : 'w-full'}
            flex items-center justify-center md:items-center
            transition-all duration-300 ease-out
            ${isDrawerOpen ? 'h-auto md:h-full' : 'h-full'}
            p-3 md:p-4
          `}
        >
          <div className={`
            w-full max-w-6xl px-3 md:px-4
            ${isDrawerOpen ? 'md:flex md:flex-col md:items-center md:justify-center md:h-full' : ''}
          `}>
            <div className={`
              ${isDrawerOpen 
                ? 'flex md:flex-col w-full gap-4 pb-2 md:pb-0 overflow-x-auto md:overflow-y-auto' 
                : 'grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full'}
              custom-scrollbar
            `}>
            {divisions.map((division) => (
              <motion.button
                key={division.name}
                data-division-card="true"
                onClick={() => toggleDrawer(division)}
                className={`
                  relative overflow-hidden rounded-xl
                  ${isDrawerOpen ? 'flex-shrink-0 md:flex-shrink-1' : ''}
                  ${selectedDivision?.name === division.name && isDrawerOpen 
                    ? 'outline-none focus-visible:ring-0 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800/10 shadow-lg shadow-blue-500/10' 
                    : 'hover:shadow-xl hover:transform hover:scale-[1.02] focus-visible:ring-0'}
                  transition-all duration-200 ease-out
                  ${isDrawerOpen ? 'shadow-md' : 'shadow-lg'}
                `}
                style={{ 
                  backgroundImage: `url(${division.name === 'Foundry' ? 
                    '/images/innovation-hub.jpg' : division.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: selectedDivision?.name === division.name && isDrawerOpen ? 
                    '0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.2) inset' : 
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
                layout
                layoutId={`card-${division.name}`}
                transition={{
                  layout: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {/* Card Background Overlay - Improved with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-0 
                  ${selectedDivision?.name === division.name && isDrawerOpen ? 'opacity-80' : 'opacity-100'}`}></div>
                
                {/* Card Content */}
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-3"
                  style={{
                    height: isDrawerOpen ? "70px" : "180px",
                  }}
                >
                  <division.icon className={`
                    ${selectedDivision?.name === division.name && isDrawerOpen ? 'text-blue-400' : 'text-blue-300'} mb-1
                    ${isDrawerOpen ? 'h-5 w-5' : 'h-8 w-8 md:h-12 md:w-12'}
                  `} />
                  <h3 className={`
                    font-bold text-center
                    ${selectedDivision?.name === division.name && isDrawerOpen ? 'text-white' : 'text-white/90'}
                    ${isDrawerOpen ? 'text-xs md:text-sm' : 'text-lg md:text-xl'}
                  `}>
                    {division.name}
                  </h3>
                  {!isDrawerOpen && (
                    <p className="text-gray-300 text-sm text-center">
                      {division.description}
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        </div>

        {/* Drawer Section - Added rounded corners and margins */}
        <AnimatePresence mode="sync">
          {isDrawerOpen && selectedDivision && (
            <motion.div
              ref={drawerRef}
              className="md:w-3/4 w-full bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                height: "calc(100vh - 100px)",
                padding: "1.5rem"
              }}
            >
              {/* Create a premium card-like drawer with subtle effects */}
              <div 
                className="h-full bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden relative"
                style={{
                  boxShadow: "0 10px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                }}
              >
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none"></div>
                
                {/* Main content area with smooth scrolling */}
                <div className="h-full overflow-auto custom-scrollbar">
                  {renderDrawerContent()}
                </div>
                
                {/* Elegant close button */}
                <button 
                  onClick={() => toggleDrawer(selectedDivision)}
                  className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-700/70 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-gray-600/80 focus:outline-none transition-all duration-200 z-10 shadow-lg"
                  style={{
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
                  }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Contact Section - Improved to fit in viewport */}
      <section id="contact" className="min-h-screen flex items-center justify-center py-12 px-4 md:py-16">
        <div className="w-full max-w-3xl mx-auto flex flex-col" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-white">Get in Touch</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 flex-grow flex flex-col overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-white">Name</label>
              <input
                type="text"
                id="name"
                required
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none focus-visible:ring-0 text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
              
              <div className="flex flex-col">
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">Email</label>
              <input
                type="email"
                id="email"
                required
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none focus-visible:ring-0 text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-white">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none focus-visible:ring-0 text-white"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="division" className="block text-sm font-medium mb-1 text-white">Division</label>
              <div className="relative">
                <select
                  id="division"
                  required
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none focus-visible:ring-0 text-white appearance-none"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                >
                  <option value="">Select a division</option>
                  <option value="Research">Research</option>
                  <option value="Labs">Labs</option>
                  <option value="Foundry">Foundry</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex flex-col flex-grow">
              <label htmlFor="message" className="block text-sm font-medium mb-1 text-white">Message</label>
              <textarea
                id="message"
                required
                rows={3}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none focus-visible:ring-0 text-white flex-grow"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ minHeight: "100px", maxHeight: "200px" }}
              ></textarea>
            </div>
            
            {/* Button always visible at bottom */}
            <div className="pt-2 md:pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-bold py-3 px-8 rounded-full transition-colors focus:outline-none focus-visible:ring-0 shadow-lg`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            </div>
          </form>
        </div>
      </section>

      {/* Add this at the end of your JSX to render the modal */}
      <AnimatePresence>
        {showModal && selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={handleCloseModal} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  useEffect(() => {
    // Add the custom scrollbar styles to the document
    const style = document.createElement('style');
    style.innerHTML = `
      /* Custom scrollbar styling for browsers that support it */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(30, 41, 59, 0.1);
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.4);
        border-radius: 10px;
        transition: background 0.2s ease;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.7);
      }
      
      /* For Firefox */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(59, 130, 246, 0.4) rgba(30, 41, 59, 0.1);
      }
      
      /* Global focus styles */
      *:focus {
        outline: none;
      }
      
      /* Keep focus styles for keyboard navigation */
      .js-focus-visible :focus:not(.focus-visible) {
        outline: none;
      }
      
      /* Improve body typography */
      body {
        font-feature-settings: 'salt' on, 'liga' 1;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Add animation for content fade-in */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white custom-scrollbar">
        <Toaster position="top-right" />
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}
