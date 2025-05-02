import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Notice, Section } from "../components";
import "../styles/account.css";

const API = import.meta.env.VITE_API_URL;

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      .catch((err) => {
        navigate('/login');
      });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className='account-page'>
      <h1>Account</h1>
      <Section className='account__content'>
        <h2>Your Information</h2>
        {
          error && (
            <Notice message={error} type="error" />
          )
        }
        {success && <Notice message={success} type="success" />}
        <div className="account__info">
          <label>Username:</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
          />
          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          />
        </div>
        <button
          disabled={updatedUser.username === user.username && updatedUser.email === user.email}
          onClick={() => updateUser(updatedUser)}
          className="btn btn-primary"
        >
          Update
        </button>
      </Section>
    </main>
  );
}

export default Account;