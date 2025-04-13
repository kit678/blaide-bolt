import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  const location = window.location.pathname;
  const isHomePage = location === '/';

  // Function to handle smooth scrolling to sections on homepage
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (!isHomePage) {
      // If not on homepage, navigate to homepage first and then scroll
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Function to determine link behavior based on current location
  const getNavLinkProps = (sectionId: string) => {
    if (isHomePage) {
      return {
        href: `#${sectionId}`,
        onClick: (e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, sectionId)
      };
    } else {
      return {
        href: `/#${sectionId}`,
        onClick: () => setIsMenuOpen(false)
      };
    }
  };

  return (
    <nav className="fixed w-full bg-gray-900/90 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logos/blaide_white_nobg.png" alt="Blaide Logo" className="h-20" />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              <a 
                {...getNavLinkProps('labs')}
                className="text-white hover:text-blue-400 transition-colors"
              >
                Labs
              </a>
              <a 
                {...getNavLinkProps('research')}
                className="text-white hover:text-blue-400 transition-colors"
              >
                Research
              </a>
              <a 
                {...getNavLinkProps('foundry')}
                className="text-white hover:text-blue-400 transition-colors"
              >
                Foundry
              </a>
              <Link to="/blog" className="text-white hover:text-blue-400 transition-colors">Blog</Link>
              <a 
                {...getNavLinkProps('contact')}
                className="text-white hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
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
                {...getNavLinkProps('labs')}
                className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md"
              >
                Labs
              </a>
              <a 
                {...getNavLinkProps('research')}
                className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md"
              >
                Research
              </a>
              <a 
                {...getNavLinkProps('foundry')}
                className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md"
              >
                Foundry
              </a>
              <Link
                to="/blog" 
                className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <a 
                {...getNavLinkProps('contact')}
                className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Create new DivisionCard component for homepage
interface DivisionCardProps {
  division: Division;
}

function DivisionCard({ division }: DivisionCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl shadow-lg group"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${division.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
          <division.icon className="text-blue-300 w-12 h-12 mb-3" />
          <h3 className="text-2xl font-bold text-white mb-3">{division.name}</h3>
          <p className="text-gray-300 mb-6">{division.description}</p>
          
          <a 
            href={`#${division.name.toLowerCase()}`} 
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function HomePage(): JSX.Element {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
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

  // Define labsProjects array for preview on home page
  const labsProjects: Project[] = [
    {
      id: 1,
      title: "AI Content Generator",
      preview: "Create dynamic marketing assets in seconds with our AI-powered content generation platform.",
      backgroundImage: "https://images.unsplash.com/photo-1677442135996-2bb51033b64d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGFpJTIwZ2VuZXJhdG9yfGVufDB8fDB8fHww",
      detailImage: "https://images.unsplash.com/photo-1675265238875-6ca420b2ac0c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "The AI Content Generator is a cutting-edge platform that leverages advanced neural networks to produce high-quality marketing content across formats. It understands brand guidelines, tone preferences, and marketing objectives to deliver personalized, conversion-optimized assets.",
      features: [
        "Multi-format content generation (copy, images, videos)",
        "Brand voice customization",
        "Audience-specific targeting"
      ],
      techStack: [
        "GPT-4",
        "Stable Diffusion",
        "TensorFlow",
        "PyTorch"
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
        }
      ]
    },
    {
      id: 2,
      title: "DocuMind Analyzer",
      preview: "Extract deep insights from complex documents with our advanced document analysis platform.",
      backgroundImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2048&auto=format&fit=crop",
      description: "DocuMind Analyzer is a sophisticated document intelligence system that processes and analyses documents of any format, from academic papers to legal contracts and creative works.",
      features: [
        "Multi-format document processing",
        "Advanced OCR with layout understanding",
        "Image content recognition and analysis"
      ],
      techStack: [
        "Computer Vision",
        "NLP Transformers",
        "Knowledge Graphs",
        "LangChain"
      ],
      benefits: [
        {
          icon: "users",
          title: "Research Acceleration",
          description: "Reduce research time by 60% through automated document analysis and insight extraction."
        },
        {
          icon: "shield",
          title: "Compliance Confidence",
          description: "Identify regulatory issues and contractual obligations with 95% accuracy."
        }
      ]
    },
    {
      id: 3,
      title: "Predictive Analytics Suite",
      preview: "Harness the power of your data with our comprehensive predictive analytics solution.",
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      detailImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      description: "The Predictive Analytics Suite is an enterprise-grade platform that transforms raw organizational data into actionable business intelligence.",
      features: [
        "Automated data preparation and cleaning",
        "Custom model development for specific use cases",
        "Real-time prediction API"
      ],
      techStack: [
        "Python",
        "Scikit-learn",
        "XGBoost",
        "Neural Prophet"
      ],
      benefits: [
        {
          icon: "activity",
          title: "Revenue Optimization",
          description: "Increase revenue by 15-25% through optimized pricing and inventory decisions."
        },
        {
          icon: "shield",
          title: "Risk Mitigation",
          description: "Reduce operational risks by identifying potential issues before they occur."
        }
      ]
    }
  ];

  // Set up contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    division: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Define these handlers at the component level
  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        division: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section component with animation
  const Section = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => {
    return (
      <motion.section 
        id={id}
        className="py-16 min-h-screen"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white mb-10">{title}</h2>
          {children}
        </div>
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white custom-scrollbar">
      <Navigation />
      
      {/* Hero Section */}
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
                  <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${slide.gradient} text-transparent bg-clip-text leading-tight md:leading-relaxed pb-1`}>
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
            onClick={(e: React.MouseEvent) => {
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

      {/* Divisions Preview Section */}
      <section id="divisions" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Divisions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our specialized divisions, each focused on a different aspect of AI innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {divisions.map((division) => (
              <DivisionCard 
                key={division.name}
                division={division} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Individual Division Sections */}
      {divisions.map((division) => {
        if (division.name === 'Research') {
          return (
            <Section 
              key={division.name} 
              id={division.name.toLowerCase()} 
              title={division.name}
            >
              <motion.div 
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-3xl overflow-hidden border border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-8 md:p-10 relative">
                  {/* Creative masked background */}
                  <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 opacity-20">
                    <div 
                      className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl"
                      style={{ maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)' }}
                    ></div>
                    <div 
                      className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 blur-3xl"
                      style={{ maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)' }}
                    ></div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-gray-300 mb-8">{division.description}</p>
                    
                    <div className="mb-16 max-w-5xl mx-auto">
                      <div className="flex flex-col lg:flex-row gap-8 mb-10">
                        <div className="lg:w-7/12">
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Uncovering Hidden Rhythms in Financial Markets</h3>
                          <p className="text-gray-300 mb-8 text-lg">
                            Blaide Research pioneers frameworks that decode cyclical patterns in equities, commodities, and FX—bridging quantitative rigor with natural time principles.
                          </p>
                        </div>
                        
                        <div className="lg:w-5/12 relative">
                          {/* Image with mask effect */}
                          <div className="w-full h-64 md:h-full relative rounded-2xl overflow-hidden">
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url(${division.images[0]})`,
                                maskImage: 'linear-gradient(to bottom right, black 30%, transparent 80%)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-transparent mix-blend-overlay"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 transform hover:shadow-lg">
                          <h4 className="text-lg font-semibold text-white mb-2">Academics</h4>
                          <p className="text-white/70">A novel framework for modeling market psychology through natural cycles.</p>
                        </div>
                        <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 transform hover:shadow-lg">
                          <h4 className="text-lg font-semibold text-white mb-2">Asset Managers</h4>
                          <p className="text-white/70">Complementary signals for timing entries, exits, and hedging.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Link 
                          to="/research" 
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-blue-600/20"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Section>
          );
        } else if (division.name === 'Labs') {
          // Labs section with project previews and "Explore More" button
          return (
            <Section 
              key={division.name} 
              id={division.name.toLowerCase()} 
              title={division.name}
            >
              <motion.div 
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-3xl overflow-hidden border border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-8 md:p-10 relative">
                  {/* Creative masked background */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                    <div 
                      className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 blur-3xl"
                      style={{ maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)' }}
                    ></div>
                    <div 
                      className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 blur-3xl"
                      style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)' }}
                    ></div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-gray-300 mb-8">{division.description}</p>
                    
                    <div className="mb-12">
                      <div className="flex flex-col lg:flex-row gap-10 mb-10">
                        <div className="lg:w-4/12 relative order-2 lg:order-1">
                          {/* Image with mask effect */}
                          <div className="w-full h-64 md:h-full relative rounded-2xl overflow-hidden">
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url(${division.images[1]})`,
                                maskImage: 'linear-gradient(to top left, black 40%, transparent 90%)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/30 to-transparent mix-blend-overlay"></div>
                          </div>
                        </div>
                        
                        <div className="lg:w-8/12 order-1 lg:order-2">
                          <h3 className="text-2xl font-bold mb-8 text-center lg:text-left">Our Solutions</h3>
                          
                          {/* Preview of Lab projects - show only 3 */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {labsProjects.slice(0, 3).map((project) => (
                              <motion.div
                                key={project.id}
                                className="overflow-hidden rounded-xl shadow-lg"
                                whileHover={{ y: -5 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div 
                                  className="relative h-64 bg-cover bg-center"
                                  style={{ backgroundImage: `url(${project.backgroundImage})` }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                  <div className="absolute bottom-0 left-0 p-4 text-white">
                                    <h3 className="text-lg md:text-xl font-bold mb-1 text-white/95">{project.title}</h3>
                                    <p className="text-sm text-white/90 line-clamp-2">
                                      {project.preview}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Link 
                          to="/labs" 
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-blue-600/20"
                        >
                          Explore More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Section>
          );
        } else if (division.name === 'Foundry') {
          // Enhanced Foundry section with detailed content
          return (
            <Section 
              key={division.name} 
              id={division.name.toLowerCase()} 
              title={division.name}
            >
              <motion.div 
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-3xl overflow-hidden border border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-8 md:p-10 relative">
                  {/* Creative masked background */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                    <div 
                      className="absolute top-20 right-0 w-80 h-80 bg-orange-500/30 blur-3xl"
                      style={{ maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)' }}
                    ></div>
                    <div 
                      className="absolute -bottom-20 left-0 w-96 h-96 bg-red-500/20 blur-3xl"
                      style={{ maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)' }}
                    ></div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-gray-300 mb-8">{division.description}</p>
                    
                    <div className="mb-10">
                      <div className="flex flex-col lg:flex-row gap-8 mb-10">
                        <div className="lg:w-7/12">
                          <div className="text-center lg:text-left mb-8">
                            <h3 className="text-2xl font-bold text-white mb-3">Your Vision, Our Code</h3>
                            <p className="text-gray-300 text-lg">
                              For non-technical founders who want to build tech startups without hiring a CTO.
                            </p>
                          </div>
                          
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-blue-400 mb-6 text-center lg:text-left">What We Provide</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-gray-800/70 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 transform hover:shadow-lg">
                                <div className="flex items-center mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                                  </svg>
                                  <span className="text-white font-semibold">Full Tech Development</span>
                                </div>
                                <p className="text-white/70 ml-8">We build your MVP from the ground up with modern, scalable tech stack</p>
                              </div>
                              <div className="bg-gray-800/70 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 transform hover:shadow-lg">
                                <div className="flex items-center mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                                    <line x1="12" y1="20" x2="12" y2="10"></line>
                                    <line x1="18" y1="20" x2="18" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="16"></line>
                                  </svg>
                                  <span className="text-white font-semibold">Go-to-Market Strategy</span>
                                </div>
                                <p className="text-white/70 ml-8">Launch strategy, customer acquisition frameworks, and marketing guidance</p>
                              </div>
                              <div className="bg-gray-800/70 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 transform hover:shadow-lg">
                                <div className="flex items-center mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                  </svg>
                                  <span className="text-white font-semibold">Equity Partnerships</span>
                                </div>
                                <p className="text-white/70 ml-8">We invest with our time and resources in exchange for equity</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="lg:w-5/12 relative">
                          {/* Image with mask effect */}
                          <div className="w-full h-64 lg:h-full relative rounded-2xl overflow-hidden">
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url(${division.images[0]})`,
                                maskImage: 'linear-gradient(to bottom left, black 40%, transparent 90%)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-transparent mix-blend-overlay"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-blue-400 mb-6 text-center">Build Your Startup in 4 Steps</h4>
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
                          <div className="space-y-5">
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold flex-shrink-0 mt-1">1</div>
                              <div>
                                <span className="text-white font-semibold">Pitch your idea</span>
                                <p className="text-white/70 text-sm mt-1">Share your vision with our team and we'll assess its market potential</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold flex-shrink-0 mt-1">2</div>
                              <div>
                                <span className="text-white font-semibold">We build your MVP</span>
                                <p className="text-white/70 text-sm mt-1">Our engineering team creates a market-ready product with modern tech</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold flex-shrink-0 mt-1">3</div>
                              <div>
                                <span className="text-white font-semibold">Launch together</span>
                                <p className="text-white/70 text-sm mt-1">We help you get your first users and refine the product based on feedback</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold flex-shrink-0 mt-1">4</div>
                              <div>
                                <span className="text-white font-semibold">Scale with shared success</span>
                                <p className="text-white/70 text-sm mt-1">As a co-founder, we're invested in your long-term growth</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <a 
                          href="#contact" 
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-blue-600/20"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Start Your Founder Journey
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Section>
          );
        }
      })}

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
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
