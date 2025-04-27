import { useState } from 'react';

import axios from 'axios';

import Modal from './Modal';

import '../styles/components/createMonitorModal.css';

const API = import.meta.env.VITE_API_URL;

/**
 * CreateMonitorModal component
 * 
 * @description This component renders a modal for creating a new monitor.
 * 
 * @param {Object}   props          - Props for the component
 * @param {Function} props.onClose  - Function to close the modal
 * @param {Function} props.onCreate - Function to handle monitor creation
 * 
 * @returns {JSX.Element} - Rendered component
 */
const CreateMonitorModal = ({onClose, onCreate}) => {
  const [monitor, setMonitor] = useState({
    name: '',
    url: '',
  });

  const handleCreateMonitor = async () => {
    if (!monitor.name.trim() || !monitor.url.trim()) {
      return;
    }

    try {
      const res = await axios.post(`${API}/api/monitor`, monitor, { withCredentials: true });
      onCreate();
      onClose();
    } catch (error) {
      console.error('Error creating monitor:', error);
    }
  }

  return (
    <Modal onClose={onClose} title="Create Monitor">
      <div className="create-monitor--inputs">
        <label htmlFor="monitor-name">Monitor Name</label>
        <input
          type="text"
          id="monitor-name"
          value={monitor.name}
          onChange={(e) => setMonitor({ ...monitor, name: e.target.value })}
        />
        <label htmlFor="monitor-url">Monitor URL</label>
        <input
          type="text"
          id="monitor-url"
          value={monitor.url}
          onChange={(e) => setMonitor({ ...monitor, url: e.target.value })}
        />
      </div>
      <div className='create-monitor--footer'>
        <button
          className="btn btn-secondary"
          onClick={handleCreateMonitor}
        >
          Create Monitor
        </button>
      </div>
    </Modal>
  );
}

export default CreateMonitorModal;