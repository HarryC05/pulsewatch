import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  CreateMonitorModal,
  UptimePill,
  Section,
  Card,
  Button,
} from '../components';

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
      <main className='dashboard-page'>
        <h1>Welcome {user?.username}!</h1>
        <Section className='dashboard__content'>
          <div className='dashboard__content-header'>
            <div className='dashboard__content-header-title'>
              <h2>Your Monitors</h2>
              <h4>
                ({user?.totalMonitors}/10)
              </h4>
            </div>
            <Button
              variant='primary'
              onClick={() => setShowCreateModal(true)}
            >
              + Add Monitor
            </Button>
          </div>
          <div className='dashboard__content-summary'>
            <Card className='dashboard__content-summary-item'>
              <h3>Total Monitors</h3>
              <h4>{monitors.length}</h4>
            </Card>
            <Card className='dashboard__content-summary-item'>
              <h3>Online</h3>
              <h4 className='text-colour-green-light'>
                {monitors.filter(m => m.latest.status === 'up').length}
              </h4>
            </Card>
            <Card className='dashboard__content-summary-item'>
              <h3>Offline</h3>
              <h4 className='text-colour-red'>
                {monitors.filter(m => m.latest.status === 'down').length}
              </h4>
            </Card>
            <Card className='dashboard__content-summary-item'>
              <h3>Unknown</h3>
              <h4>{monitors.filter(m => m.latest.status === 'unknown').length}</h4>
            </Card>
          </div>
          <table className='dashboard__table'>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>URL</th>
                <th
                  title='Uptime is calculated based on the last 7 days of heartbeats'
                >
                  Uptime (%)
                </th>
                <th>Response Time</th>
                <th>Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {monitors.map((monitor) => (
                <tr
                  key={monitor.id}
                  onClick={(e) => ! e.target.classList.contains('dashboard__table-link') && navigate(`/monitor/${monitor.id}`)}
                >
                  <td>
                    <span
                      className={`dashboard__table-status ${monitor.latest.status === 'up' ? 'background-colour-green' : monitor.latest.status === 'down' ? 'background-colour-red' : ''}`}
                      title={monitor.latest.status}
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
                    <UptimePill uptime={monitor.uptime} />
                  </td>
                  <td>{monitor.latest.responseTime ? `${monitor.latest.responseTime} ms` : 'N/A'}</td>
                  <td>{monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </main>
    </>
  );
};

export default Dashboard;
