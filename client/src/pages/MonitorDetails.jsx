import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import UptimePill from '../components/UptimePill';
import UptimeChart from '../components/UptimeChart';
import ResponseChart from '../components/ResponseChart';
import EditMonitorModal from '../components/EditMonitorModal';

import '../styles/monitorDetails.css';

const API = import.meta.env.VITE_API_URL;

const MonitorDetails = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState({});
  const [noAuth, setNoAuth] = useState(false);
  const [responseTimeOption, setResponseTimeOption] = useState('last24h');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      {showEditModal && (
        <EditMonitorModal
          onClose={() => setShowEditModal(false)}
          monitor={{id: monitor.id, name: monitor.name, url: monitor.url}}
          getMonitor={getMonitor}
        />
      )}
      <main className='monitor-page'>
          {loading ? (
            <div className='loading'>Loading...</div>
          ) : noAuth ? (
            <div className='no-auth'>You do not have permission to view this monitor.</div>
          ) : (
            <>
              <div className='monitor-page__details__header'>
                <div className='monitor-page__details__header__status'>
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
                <div className='monitor-page__details__header__buttons'>
                  <button className='btn btn-primary' onClick={() => setShowEditModal(true)}>
                    Edit
                  </button>
                  <button className='btn btn-danger background-colour-red' onClick={() => setShowDeleteModal(true)}>
                    Delete
                  </button>
                </div>
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
                    <UptimePill uptime={monitor.uptime.last24h} />
                  </div>
                  <div className='monitor-page__details__info__item'>
                    <h2>Uptime</h2>
                    <span className='monitor-page__details__info__item__subtitle'>
                      (7 Days)
                    </span>
                    <UptimePill uptime={monitor.uptime.last7d} />
                  </div>
                  <div className='monitor-page__details__info__item'>
                    <h2>Uptime</h2>
                    <span className='monitor-page__details__info__item__subtitle'>
                      (30 Days)
                    </span>
                    <UptimePill uptime={monitor.uptime.last30d} />
                  </div>
                </div>
                <UptimeChart
                  data={monitor.heartbeats.last24h}
                />
                <div className='monitor-page__details__response-time'>
                  <div className='monitor-page__details__response-time__header'>
                    <h2>Response Time</h2>
                    <select
                      className='monitor-page__details__response-time__header__select'
                      value={responseTimeOption}
                      onChange={(e) => setResponseTimeOption(e.target.value)}
                    >
                      <option value='last24h'>Last 24 hours</option>
                      <option value='last7d'>Last 7 days</option>
                      <option value='last30d'>Last 30 days</option>
                    </select>
                  </div>
                  <ResponseChart heartbeats={monitor.heartbeats[responseTimeOption]} />
                </div>
              </div>
            </>
          )}
      </main>
    </>
  );
};

export default MonitorDetails;
