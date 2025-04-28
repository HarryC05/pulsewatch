import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import NavBar from '../components/NavBar';
import CreateMonitorModal from '../components/CreateMonitorModal';

import '../styles/dashboard.css';

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [monitors, setMonitors] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getMonitors = () => {
    axios.get(`${API}/api/v1/monitor/list`, { withCredentials: true })
      .then((res) => {
        setMonitors(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    axios.get(`${API}/api/v1/account/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        navigate('/login');
      });

    getMonitors();
  }, [navigate]);

  // Polling for monitor updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getMonitors();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showCreateModal && (
        <CreateMonitorModal
          onClose={() => {
            setShowCreateModal(false);
          }}
          onCreate={() => {
            setShowCreateModal(false);
            getMonitors();
          } }
        />
      )}
      <NavBar />
      <main className='dashboard-page'>
        <h1>Welcome {user?.username}!</h1>
        <div className='dashboard__content'>
          <div className='dashboard__content-header'>
            <h2>Your Monitors</h2>
            <button
              className='btn btn-secondary'
              onClick={() => setShowCreateModal(true)}
            >
              + Add Monitor
            </button>
          </div>
          <div className='dashboard__content-summary'>
            <div className='dashboard__content-summary-item'>
              <h3>Total Monitors</h3>
              <h4>{monitors.length}</h4>
            </div>
            <div className='dashboard__content-summary-item'>
              <h3>Online</h3>
              <h4 className='text-colour-green'>
                {monitors.filter(m => m.latestStatus === 'up').length}
              </h4>
            </div>
            <div className='dashboard__content-summary-item'>
              <h3>Offline</h3>
              <h4 className='text-colour-red'>
                {monitors.filter(m => m.latestStatus === 'down').length}
              </h4>
            </div>
            <div className='dashboard__content-summary-item'>
              <h3>Unknown</h3>
              <h4>{monitors.filter(m => m.latestStatus === 'unknown').length}</h4>
            </div>
          </div>
          <table className='dashboard__table'>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>URL</th>
                <th>Uptime</th>
                <th>Response Time</th>
                <th>Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {monitors.map((monitor) => (
                <tr key={monitor.id}>
                  <td>
                    <span
                      className={`dashboard__table-status ${monitor.latestStatus}`}
                      title={monitor.latestStatus}
                    />
                  </td>
                  <td>{monitor.name}</td>
                  <td>
                    <a
                      className='dashboard__table-link'
                      href={monitor.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {monitor.url}
                    </a>
                  </td>
                  <td>
                    <span
                      className={
                        `dashboard__table-uptime ${monitor?.uptime ? monitor.uptime > 90 ? 'high' : monitor.uptime > 50 ? 'medium' : 'low' : 'unknown'}`
                      }
                    >
                      {monitor.uptime ? `${monitor.uptime}%` : 'N/A'}
                    </span>
                  </td>
                  <td>{monitor.latestResponseTime ? `${monitor.latestResponseTime} ms` : 'N/A'}</td>
                  <td>{monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
