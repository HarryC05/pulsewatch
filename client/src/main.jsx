import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import App from './App.jsx';
import './styles/main.scss';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
			<App />
		</DndProvider>
	</StrictMode>
);
