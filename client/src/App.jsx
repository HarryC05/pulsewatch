import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import MonitorDetails from './pages/MonitorDetails';
import Pages from './pages/Pages';
import Status from './pages/Status';
import Edit from './pages/Edit';

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
					<Route path="/pages" element={<Pages />} />
					<Route path="/status/:slug" element={<Status />} />
					<Route path="/edit/:id" element={<Edit />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
