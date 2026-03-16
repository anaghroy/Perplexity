import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Sun,
  Moon,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { motion, AnimatePresence } from "motion/react";

import {
  clearError,
  registerUser,
  resendVerification,
} from "../../features/auth/authSlice";
import {
  selectAuthLoading,
  selectAuthError,
} from "../../features/auth/authSelectors";

const Register = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // UI state for conditional rendering and feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      setIsSubmitted(true);
    }
  };

  const handleResendEmail = async () => {
    setResendStatus("loading");
    const result = await dispatch(
      resendVerification({ email: formData.email }),
    );
    if (resendVerification.fulfilled.match(result)) {
      setResendStatus("success");
      setTimeout(() => setResendStatus(""), 5000);
    } else {
      setResendStatus("error");
    }
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
        onClick={() => dispatch(toggleTheme())}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </motion.div>
        </AnimatePresence>
      </button>

      <motion.div
        className="register-container"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      >
        {!isSubmitted ? (
          <>
            <div className="register-header">
              <h1>Create Account</h1>
              <p>Join Perplexity to continue</p>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Your Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <Loader2 className="spinner" size={20} />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="login-link">
              Already have an account?
              <Link to="/">Log in</Link>
            </div>
          </>
        ) : (
          <motion.div
            className="success-state"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="icon-wrapper">
              <Mail size={50} strokeWidth={1.5} />
            </div>
            <h2>Check your email</h2>
            <p>
              We've sent a verification link to{" "}
              <strong>{formData.email}</strong>. Please verify your account to
              continue.
            </p>

            {error && resendStatus === "error" && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {resendStatus === "success" && (
              <div className="success-message">
                <CheckCircle2 size={18} />
                <span>Verification email sent!</span>
              </div>
            )}

            <button
              className="submit-btn resend-btn"
              onClick={handleResendEmail}
              disabled={resendStatus === "loading"}
            >
              {resendStatus === "loading" ? (
                <>
                  <Loader2 className="spinner" size={18} /> Sending...
                </>
              ) : (
                "Resend Email"
              )}
            </button>

            <div className="login-link">
              <Link to="/">Back to Login</Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Register;
