import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Sun, Moon, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const VerifyEmail = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const messageParam = searchParams.get('message');
  
  // Default to success if no param is provided (for showcasing the page)
  const status = statusParam === 'error' ? 'error' : 'success';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.div 
      className="login-page verify-email-page"
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
            className="theme-icon-wrapper"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </motion.div>
        </AnimatePresence>
      </button>

      <motion.div 
        className="login-container verify-email-container"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      >
        <div className="login-header verify-email-header">
          {status === 'success' && (
             <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="icon-success"
             >
                <CheckCircle2 size={80} strokeWidth={1.5} />
             </motion.div>
          )}

          {status === 'error' && (
             <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="icon-error"
             >
                <XCircle size={80} strokeWidth={1.5} />
             </motion.div>
          )}

          <h1>
            {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h1>
          <p>
            {status === 'success' ? 'Your email address has been successfully verified. You can now log in to your account and get started.' :
             (messageParam === 'UserNotFound' ? 'No user found with this email address. The link might be incorrect.' :
              messageParam === 'InvalidToken' ? 'The verification link is invalid or has expired. Please request a new one.' :
              'We were unable to verify your email. Please try again or contact support if the issue persists.')}
          </p>
        </div>

        {status === 'success' ? (
            <Link to="/" className="action-link">
              <button className="submit-btn action-btn">
                  Log In
              </button>
            </Link>
        ) : (
            <div className="action-btn-group">
               <button className="submit-btn action-btn" onClick={() => window.location.reload()}>
                 Try Again
               </button>
               <Link to="/" className="action-link">
                 <button className="google-btn action-btn">
                     Back to Login
                 </button>
               </Link>
            </div>
        )}

      </motion.div>
    </motion.div>
  );
};

export default VerifyEmail;
