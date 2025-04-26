import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [monitor, setMonitor] = useState({});

  useEffect(() => {
    axios.get(`${API}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
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
    <div>
      <h1>Welcome {user?.username}!</h1>
      <form>
        <input
          type="text"
          placeholder="Monitor Name"
          value={monitor.name || ''}
          onChange={(e) => setMonitor({ ...monitor, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Monitor URL"
          value={monitor.url || ''}
          onChange={(e) => setMonitor({ ...monitor, url: e.target.value })}
        />
        <button type="submit">
          Create Monitor
        </button>
      </form>
      <button>
        log monitors
      </button>
    </div>
  );
};

export default Dashboard;
