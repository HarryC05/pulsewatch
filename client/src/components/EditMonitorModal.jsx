import { useState } from 'react';
import axios from 'axios';

import { urlRegex, urlRegexError, monitorNameRegex, monitorNameRegexError } from '../../utils/regex';
import Modal from './Modal';
import '../styles/components/editMonitorModal.css';

const API = import.meta.env.VITE_API_URL;

/**
 * Edit component
 * 
 * @description This component renders a modal for editing a monitor.
 * 
 * @param {Object}   props            - Props for the component
 * @param {Function} props.onClose    - Function to close the modal
 * @param {Object}   props.monitor    - Monitor object to be edited
 * @param {Function} props.getMonitor - Function to fetch the monitor data
 * 
 * @returns {JSX.Element} - Rendered component
 */
const EditMonitorModal = ({onClose, monitor, getMonitor}) => {
  const [tmpMonitor, setTmpMonitor] = useState(monitor);
  const [nameError, setNameError] = useState('');
  const [urlError, setUrlError] = useState('');

  const onSave = () => {
    axios.put(`${API}/api/v1/monitor/${monitor.id}`, tmpMonitor, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          onClose();
          getMonitor();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Handle URL input change
  const handleNameChange = (e) => {
    const value = e.target.value;

    // Validate monitor name
    if (!value.match(monitorNameRegex)) {
      setNameError(monitorNameRegexError);
    } else {
      setNameError('');
    }

    setTmpMonitor({ ...tmpMonitor, name: value });
  }

  // Handle URL change and validate it
  const handleUrlChange = (e) => {
    const value = e.target.value;

    // Validate URL
    if (!value.match(urlRegex)) {
      setUrlError(urlRegexError);
    } else {
      setUrlError('');
    }

    setTmpMonitor({ ...tmpMonitor, url: value });
  }

  return (
    <Modal onClose={onClose} title="Edit Monitor">
      <div className="edit-monitor__inputs">
        <label htmlFor="monitor-name">Monitor Name</label>
        <input
          type="text"
          id="monitor-name"
          value={tmpMonitor.name}
          onChange={handleNameChange}
        />
        {nameError && <div className="notice notice__error">{nameError}</div>}
        <label htmlFor="monitor-url">Monitor URL</label>
        <input
          type="text"
          id="monitor-url"
          value={tmpMonitor.url}
          onChange={handleUrlChange}
        />
        {urlError && <div className="notice notice__error">{urlError}</div>}
      </div>
      <div className='edit-monitor__footer'>
        <button
          className="btn btn-primary"
          onClick={onSave}
          disabled={(tmpMonitor.name === monitor.name && tmpMonitor.url === monitor.url) || nameError || urlError}
        >
          Save
        </button>
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default EditMonitorModal;