import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/login.css';

const API = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');

      // Check if the user is signing up or logging in
      if (signup) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await axios.post(`${API}/api/auth/signup`, { email, password });
        setSuccess('Signup successful! Please login.');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        setSignup(false);
        setPassword('');
        setConfirmPassword('');
        return;
      }

      // Login
      const res = await axios.post(`${API}/api/auth/login`, { email, password }, { withCredentials: true });
      if (res.data.success) {
        navigate('/me');
      } else {
        setError('Invalid credentials');
        setSuccess('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Invalid credentials');
      setSuccess('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API}/api/auth/me`, { 
        withCredentials: true, 
        signal: controller.signal 
      })
      .then(() => {
        // User is already logged in
        navigate('/me');
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          // No action needed - stay on login page
        }
      });

    return () => {
      controller.abort();
    };
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-page--container">
        <img className="login-page--logo login-page--logo-dark" alt="Logo" src="/svgs/logo-dark.svg" />
        <img className="login-page--logo login-page--logo-light" alt="Logo" src="/svgs/logo-light.svg" />
        <div className='login-page--login-signup'>
          <button
            className={`login-page--login-signup-button${!signup ? ' login-page--login-signup-button--active' : ''}`}
            onClick={() => {
              setSignup(false);
              setError('');
              setSuccess('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <h2>Login</h2>
          </button>
          <button
            className={`login-page--login-signup-button${signup ? ' login-page--login-signup-button--active' : ''}`}
            onClick={() => {
              setSignup(true);
              setError('');
              setSuccess('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <h2>Signup</h2>
          </button>
        </div>
        {error && <div className="login-page--notice login-page--error">{error}</div>}
        {success && <div className="login-page--notice login-page--success">{success}</div>}
        <form onSubmit={handleLogin} className="login-page--form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-page--form-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-page--form-input"
            required
          />
          {signup && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-page--form-input"
              required
            />
          )}
          <button
            type="submit"
            className="login-page--form-button"
            disabled={!email || !password || (signup && password !== confirmPassword)}
          >
            {signup ? 'Signup' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
