import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaBrain, FaCode, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import aiLabsHeroImage from '../../assets/ai-labs-hero.jpg';

export const AILabsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src={aiLabsHeroImage} 
          alt="AI Labs" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            AI Labs
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Advancing artificial intelligence through groundbreaking research and practical applications
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.h2 
                className="text-3xl font-bold mb-6 text-cyan-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                About Our AI Labs
              </motion.h2>
              
              <motion.div 
                className="prose prose-invert prose-lg max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p>
                  At Blaide AI Labs, we're pushing the boundaries of artificial intelligence to create technologies that are not just intelligent, but also ethical, reliable, and designed to enhance human capabilities rather than replace them.
                </p>
                
                <p>
                  Our team of researchers and engineers combines expertise in machine learning, neural networks, natural language processing, and computer vision to develop AI solutions that address real-world challenges.
                </p>
                
                <p>
                  We believe in democratizing AI and making advanced technologies accessible to organizations of all sizes. Through our work, we aim to accelerate innovation across industries while ensuring that AI systems are transparent, explainable, and aligned with human values.
                </p>
                
                <h3>Our Research Focus</h3>
                
                <p>
                  Our research spans fundamental advances in machine learning algorithms, reinforcement learning, generative models, and multimodal AI systems. We are particularly interested in developing AI that can:
                </p>
                
                <ul>
                  <li>Understand and generate human language with greater nuance and context</li>
                  <li>Perceive and interpret visual information more like humans do</li>
                  <li>Learn from smaller datasets and with greater efficiency</li>
                  <li>Make decisions that are explainable and aligned with human values</li>
                  <li>Adapt to new situations and environments with minimal additional training</li>
                </ul>
                
                <h3>Real-World Applications</h3>
                
                <p>
                  We translate our research into practical applications across healthcare, finance, education, and creative industries. Our solutions include:
                </p>
                
                <ul>
                  <li>Advanced diagnostic tools for medical imaging</li>
                  <li>Intelligent financial forecasting and risk assessment systems</li>
                  <li>Personalized learning platforms that adapt to individual student needs</li>
                  <li>Creative tools that augment human capabilities in design, writing, and music</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link 
                  to="/contact?division=ailabs" 
                  className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md transition-colors duration-300"
                >
                  Collaborate With Us
                </Link>
              </motion.div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Core Capabilities</h3>
                
                <ul className="space-y-4">
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <div className="flex-shrink-0 bg-cyan-800 p-2 rounded-md mr-4">
                      <FaBrain className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Deep Learning</h4>
                      <p className="text-gray-300 text-sm mt-1">Advanced neural networks for complex pattern recognition and prediction</p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <div className="flex-shrink-0 bg-cyan-800 p-2 rounded-md mr-4">
                      <FaRobot className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Natural Language Processing</h4>
                      <p className="text-gray-300 text-sm mt-1">Human-like text understanding and generation capabilities</p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <div className="flex-shrink-0 bg-cyan-800 p-2 rounded-md mr-4">
                      <FaCode className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Computer Vision</h4>
                      <p className="text-gray-300 text-sm mt-1">Image and video analysis with human-level accuracy</p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <div className="flex-shrink-0 bg-cyan-800 p-2 rounded-md mr-4">
                      <FaChartLine className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Predictive Analytics</h4>
                      <p className="text-gray-300 text-sm mt-1">Data-driven forecasting for business intelligence</p>
                    </div>
                  </motion.li>
                </ul>
                
                <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Ready to innovate with AI?</h4>
                  <p className="text-gray-300 text-sm mb-4">Our team can help you implement cutting-edge AI solutions for your specific challenges.</p>
                  <Link 
                    to="/contact?division=ailabs" 
                    className="block text-center w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-300"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 