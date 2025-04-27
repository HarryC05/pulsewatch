import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/login.css';

const API = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (signup) {
      try {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        await axios.post(`${API}/api/auth/signup`, { username, email, password }, { withCredentials: true });

        setSuccess('Signup successful! Please login.');
        setTimeout(() => {
          setSuccess('');
        }, 3000);

        // Reset form fields
        setIdentifier(username);
        setUsername('');
        setEmail('');
        setSignup(false);
        setPassword('');
        setConfirmPassword('');
        return;
      } catch (err) {
        // Get the error message from the response
        const errorMessage = err.response?.data?.message || 'An error occurred';
        setError(errorMessage);
        setSuccess('');
        setPassword('');
        setConfirmPassword('');
        return;
      }
    }

    // Login
    try {
      const res = await axios.post(`${API}/api/auth/login`, { identifier, password }, { withCredentials: true });
      if (res.data.success) {
        navigate('/dashboard');
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
    axios.get(`${API}/api/account/me`, { 
        withCredentials: true, 
        signal: controller.signal 
      })
      .then(() => {
        // User is already logged in
        navigate('/dashboard');
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          const urlParams = new URLSearchParams(window.location.search);
          const isSignup = urlParams.get('signup');
          if (isSignup) {
            setSignup(true);
          }
        }
      });

    return () => {
      controller.abort();
    };
  }, [navigate]);

  return (
    <main className="login-page">
      <div className="login-page--container">
        <a href="/">
          <img className="login-page--logo logo-dark" alt="Logo" src="/svgs/logo-dark.svg" />
          <img className="login-page--logo logo-light" alt="Logo" src="/svgs/logo-light.svg" />
        </a>
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
        {error && <div className="notice notice--error">{error}</div>}
        {success && <div className="notice notice--success">{success}</div>}
        <form onSubmit={handleLogin} className="login-page--form">
          {signup && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-page--form-input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-page--form-input"
                required
              />
            </>
          )}
          { !signup && (
            <input
              type="text"
              placeholder="Email/Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="login-page--form-input"
              required
            />
          )}
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
            className="btn btn-primary"
            disabled={
              (signup && !email)
              || (!signup && !identifier)
              || !password
              || (signup && password !== confirmPassword)
            }
          >
            {signup ? 'Signup' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
