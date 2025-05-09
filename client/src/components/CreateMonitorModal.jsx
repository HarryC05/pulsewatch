import { useState } from 'react';
import axios from 'axios';

import {urlRegex, nameRegex} from '../../../shared/regex';
import { Modal, Notice, Button } from './';
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
  const [nameError, setNameError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [error, setError] = useState('');

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
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while creating the monitor.');
      }
    }
  }

  // Handle URL input change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setMonitor({ ...monitor, name: value });

    if (!nameRegex.pattern.test(value)) {
      setNameError(nameRegex.err);
      setDisabled({...disabled, name: true});
    } else {
      setNameError('');
      setDisabled({...disabled, name: false});
    }
  }

  // Handle URL change and validate it
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setMonitor({ ...monitor, url: value });

    if (urlRegex.pattern.test(value)) {
      setUrlError('');
      setDisabled({...disabled, url: false});
    } else {
      setUrlError(urlRegex.err);
      setDisabled({...disabled, url: true});
    }
  }

  return (
    <Modal onClose={onClose} title="Create Monitor">
      {error && <Notice message={error} variant="error" />}
      <div className="create-monitor__inputs">
        <label htmlFor="monitor-name">Monitor Name</label>
        <input
          type="text"
          id="monitor-name"
          value={monitor.name}
          onChange={handleNameChange}
        />
        {nameError && <Notice message={nameError} variant="error" />}
        <label htmlFor="monitor-url">Monitor URL</label>
        <input
          type="text"
          id="monitor-url"
          value={monitor.url}
          onChange={handleUrlChange}
        />
        {urlError && <Notice message={urlError} variant="error" />}
      </div>
      <div className="create-monitor__footer">
        <Button
          onClick={handleCreateMonitor}
          disabled={disabled.url || disabled.name}
        >
          Create Monitor
        </Button>
      </div>
    </Modal>
  );
}

export default CreateMonitorModal;
