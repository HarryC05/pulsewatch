import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import MonitorDetails from './pages/MonitorDetails';

/**
 * App component
 *
 * @returns {JSX.Element} - Rendered component
 */
function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/account" element={<Account />} />
					<Route path="/monitor/:id" element={<MonitorDetails />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
