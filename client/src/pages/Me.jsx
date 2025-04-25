import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function Me() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        setMessage(res.data.message)
      })
      .catch((err) => {
        navigate('/login');
      });
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
}

export default Me;
