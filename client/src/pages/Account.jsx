import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import NavBar from "../components/NavBar";

const API = import.meta.env.VITE_API_URL;

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateUser = (user) => {
    axios.put(`${API}/api/account/me`, user, { withCredentials: true })
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
    axios.get(`${API}/api/account/me`, { withCredentials: true })
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
    <>
      <NavBar />
      <main className='account-page'>
        <h1>Account</h1>
        <div className='account--content'>
          <h2>Your Information</h2>
          {
            error && (
              <div className="notice notice--error">{error}</div>
            )
          }
          {success && <div className="notice notice--success">{success}</div>}
          <table>
            <tbody>
              <tr>
                <td>Username:</td>
                <td>
                  <input
                    type="text"
                    value={updatedUser.username}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  <input
                    type="email"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            disabled={updatedUser.username === user.username && updatedUser.email === user.email}
            onClick={() => updateUser(updatedUser)}
          >
            Update
          </button>
        </div>
      </main>
    </>
  );
}

export default Account;