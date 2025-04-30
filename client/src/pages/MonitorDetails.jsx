import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import NavBar from '../components/NavBar';
import '../styles/monitorDetails.css';
import Uptime from '../components/Uptime';
import UptimeChart from '../components/UptimeChart';

const API = import.meta.env.VITE_API_URL;

const MonitorDetails = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState({});
  const [noAuth, setNoAuth] = useState(false);

  const getMonitor = () => {
    axios.get(`${API}/api/v1/monitor/${id}`, { withCredentials: true })
      .then((res) => {
        setMonitor(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setNoAuth(true);
          setLoading(false);
        } else {
          console.error(err);
        }
      });
  }
  
  useEffect(() => {
    // Fetch monitor details
    getMonitor();

    // Polling for monitor updates every 30 seconds
    const interval = setInterval(() => {
      getMonitor();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />
      <main className='monitor-page'>
        {loading ? (
          <div className='loading'>Loading...</div>
        ) : noAuth ? (
          <div className='no-auth'>You do not have permission to view this monitor.</div>
        ) : (
          <>
            <div className='monitor-page__details__header'>
              <span
                className={`monitor-page__details-status ${monitor.latest.status === 'up' ? 'background-colour-green' : 'background-colour-red'}`}
                title={monitor.latest.status}
              />
              <h1>
                {monitor.name} -{' '}
                <a href={monitor.url} target='_blank' rel='noopener noreferrer' className='monitor-page__details__info__url'>
                  {monitor.url}
                </a>
              </h1>
            </div>
            <div className='monitor-page__details'>
              <h4>
                Last Check: {new Date(monitor.latest.createdAt).toLocaleString()}
              </h4>
              <div className='monitor-page__details__info'>
                <div className='monitor-page__details__info__item'>
                  <h2>Response</h2>
                  <span className='monitor-page__details__info__item__subtitle'>
                    (current)
                  </span>
                  <h3 className='monitor-page__details__info__item__value'>
                    {monitor.latest.responseTime ? `${monitor.latest.responseTime} ms` : 'N/A'}
                  </h3>
                </div>
                <div className='monitor-page__details__info__item'>
                  <h2>Response</h2>
                  <span className='monitor-page__details__info__item__subtitle'>
                    (Avg. 24 hrs)
                  </span>
                  <h3 className='monitor-page__details__info__item__value'>
                    {monitor.responseTimes.last24h ? `${monitor.responseTimes.last24h} ms` : 'N/A'}
                  </h3>
                </div>
                <div className='monitor-page__details__info__item'>
                  <h2>Response</h2>
                  <span className='monitor-page__details__info__item__subtitle'>
                    (Avg. 7 days)
                  </span>
                  <h3 className='monitor-page__details__info__item__value'>
                    {monitor.responseTimes.last7d ? `${monitor.responseTimes.last7d} ms` : 'N/A'}
                  </h3>
                </div>
                <div className='monitor-page__details__info__item'>
                  <h2>Uptime</h2>
                  <span className='monitor-page__details__info__item__subtitle'>
                    (24 hrs)
                  </span>
                  <Uptime uptime={monitor.uptime.last24h} />
                </div>
                <div className='monitor-page__details__info__item'>
                  <h2>Uptime</h2>
                  <span className='monitor-page__details__info__item__subtitle'>
                    (7 Days)
                  </span>
                  <Uptime uptime={monitor.uptime.last7d} />
                </div>
                <div className='monitor-page__details__info__item'>
                  <h2>Uptime</h2>
                  <span className='monitor-page__details__info__item__subtitle'>
                    (30 Days)
                  </span>
                  <Uptime uptime={monitor.uptime.last30d} />
                </div>
              </div>
              <UptimeChart
                data={monitor.heartbeats.last24h}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default MonitorDetails;
