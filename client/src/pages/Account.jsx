import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { unameRegex, emailRegex }  from '../../../shared/regex';
import { Notice, Section, Button } from '../components';
import '../styles/account.css';

const API = import.meta.env.VITE_API_URL;

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const updateUser = (user) => {
    axios.put(`${API}/api/v1/account/me`, user, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setUpdatedUser({
          username: res.data.user.username,
          email: res.data.user.email,
        });
        setSuccess('Account updated successfully!');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        setError('');
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || 'An error occurred';
        setError(errorMessage);
        setSuccess('');
      });
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUpdatedUser({ ...updatedUser, username: value });

    if (!unameRegex.pattern.test(value)) {
      setNameError(unameRegex.err);
    } else {
      setNameError('');
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUpdatedUser({ ...updatedUser, email: value });

    if (!emailRegex.pattern.test(value)) {
      setEmailError(emailRegex.err);
    } else {
      setEmailError('');
    }
  }

  useEffect(() => {
    axios.get(`${API}/api/v1/account/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setUpdatedUser({
          username: res.data.user.username,
          email: res.data.user.email,
        });
        setLoading(false);
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="account-page">
      <h1>Account</h1>
      <Section className="account__content">
        <h2>Your Information</h2>
        {
          error && (
            <Notice message={error} variant="error" />
          )
        }
        {success && <Notice message={success} variant="success" />}
        <div className="account__info">
          <label>Username:</label>
          <input
            type="text"
            value={updatedUser.username}
            onChange={handleUsernameChange}
          />
          {nameError && <Notice message={nameError} variant="error" />}
          <label>Email:</label>
          <input
            type="email"
            value={updatedUser.email}
            onChange={handleEmailChange}
          />
          {emailError && <Notice message={emailError} variant="error" />}
        </div>
        <Button
          variant="primary"
          disabled={(updatedUser.username === user.username && updatedUser.email === user.email) || nameError || emailError}
          onClick={() => updateUser(updatedUser)}
        >
          Update
        </Button>
      </Section>
    </main>
  );
}

export default Account;
