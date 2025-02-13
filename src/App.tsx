import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Admin } from './pages/Admin';
import { divisions } from './data/divisions';
import { Division } from './types/division';
import { DivisionModal } from './components/DivisionModal';
import { collection, addDoc } from 'firebase/firestore';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-gray-900/90 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">Blaide</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#about" className="text-white hover:text-blue-400 transition-colors">About</a>
              <a href="#divisions" className="text-white hover:text-blue-400 transition-colors">Divisions</a>
              <a href="#contact" className="text-white hover:text-blue-400 transition-colors">Contact</a>
              <Link to="/blog" className="text-white hover:text-blue-400 transition-colors">Blog</Link>
              <Link to="/admin" className="text-white hover:text-blue-400 transition-colors">Admin</Link>
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
              <a href="#about" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md">About</a>
              <a href="#divisions" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md">Divisions</a>
              <a href="#contact" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md">Contact</a>
              <Link to="/blog" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md">Blog</Link>
              <Link to="/admin" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HomePage(): JSX.Element {
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    division: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message || !formData.division) {
      toast.error('Please fill all fields');
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
      try {
        await addDoc(collection(db, 'contact_messages'), {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          division: formData.division,
          created_at: new Date().toISOString(),
          is_read: false,
        });
      
        toast.success('Message sent successfully!');
        setFormData({ 
          name: '', 
          email: '', 
          message: '', 
          division: '' 
        });
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Pioneering AI Innovation
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Unifying cutting-edge AI ventures under one visionary umbrella
          </p>
          <a
            href="#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisions" className="py-24 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Divisions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {divisions.map((division) => (
              <button
                key={division.name}
                onClick={() => setSelectedDivision(division)}
                className="p-6 rounded-lg bg-gray-700/50 backdrop-blur-sm hover:transform hover:-translate-y-1 transition-all text-left group relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundImage: `url(${division.backgroundImage})` }}
                />
                <div className="relative z-10">
                  <division.icon className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">{division.name}</h3>
                  <p className="text-gray-300">{division.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">Email</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="division" className="block text-sm font-medium mb-2 text-white">Division</label>
              <div className="relative">
                <select
                  id="division"
                  required
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white appearance-none"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                >
                  <option value="">Select a division</option>
                  {divisions.map(({ name }) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">Message</label>
              <textarea
                id="message"
                required
                rows={4}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-3 px-8 rounded-full transition-colors`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {selectedDivision && (
        <DivisionModal
          division={selectedDivision}
          onClose={() => setSelectedDivision(null)}
        />
      )}
    </>
  );
  );
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
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
