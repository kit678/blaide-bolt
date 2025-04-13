import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DivisionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  path: string;
}

export const DivisionCard: React.FC<DivisionCardProps> = ({ title, description, imageSrc, path }) => {
  return (
    <motion.div 
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-900/30 transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>
        <Link 
          to={path}
          className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-300"
        >
          Learn More
        </Link>
      </div>
    </motion.div>
  );
}; 