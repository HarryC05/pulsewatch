import { useState } from 'react';
import axios from 'axios';

import { urlRegex } from '../../utils/regex';
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
  const [ disabled, setDisabled ] = useState({url: true, name: true});

  const handleCreateMonitor = async () => {
    if (!monitor.name.trim() || !monitor.url.trim()) {
      return;
    }

    try {
      const res = await axios.post(`${API}/api/v1/monitor/create`, monitor, { withCredentials: true });
      onCreate();
      onClose();
    } catch (error) {
      console.error('Error creating monitor:', error);
    }
  }

  // Handle URL input change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setMonitor({ ...monitor, name: value });

    if (value.trim().length > 0) {
      setDisabled({...disabled, name: false});
    } else {
      setDisabled({...disabled, name: true});
    }
  }

  // Handle URL change and validate it
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setMonitor({ ...monitor, url: value });

    if (urlRegex.test(value)) {
      setDisabled({...disabled, url: false});
    } else {
      setDisabled({...disabled, url: true});
    }
  }

  return (
    <Modal onClose={onClose} title="Create Monitor">
      <div className="create-monitor__inputs">
        <label htmlFor="monitor-name">Monitor Name</label>
        <input
          type="text"
          id="monitor-name"
          value={monitor.name}
          onChange={handleNameChange}
        />
        <label htmlFor="monitor-url">Monitor URL</label>
        <input
          type="text"
          id="monitor-url"
          value={monitor.url}
          onChange={handleUrlChange}
        />
      </div>
      <div className='create-monitor__footer'>
        <button
          className="btn btn-secondary"
          onClick={handleCreateMonitor}
          disabled={disabled.url || disabled.name}
        >
          Create Monitor
        </button>
      </div>
    </Modal>
  );
}

export default CreateMonitorModal;