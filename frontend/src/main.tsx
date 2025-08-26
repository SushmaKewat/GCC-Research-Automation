import { JSX, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './global.css';
import Login from './components/Login.tsx';
import App from './App.tsx';

function PrivateRoute({ children }: { children: JSX.Element }) {
	const isLoggedIn = localStorage.getItem('isLoggedIn');
	return isLoggedIn ? children : <Navigate to='/login' />;
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route
					path='/'
					element={
						<PrivateRoute>
							<App />
						</PrivateRoute>
					}
				/>
				<Route path='*' element={<Navigate to='/login' />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
