import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Register = () => {
  // Check local storage for theme, default to dark to match initial design
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering user:', formData);
    // TODO: Add registration logic here
  };

  return (
    <motion.div 
      className="register-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button 
        className="theme-toggle" 
        onClick={toggleTheme} 
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </motion.div>
        </AnimatePresence>
      </button>

      <motion.div 
        className="register-container"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      >
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join Perplexity to continue</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Your FullName"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>

        <div className="login-link">
          Already have an account? 
          <Link to="/">Log in</Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
