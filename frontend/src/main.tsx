import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './global.css';
import Login from './components/Login.tsx';
import App from './App.tsx';
import Layout from './components/Layout.tsx';
import OutreachPage from './components/OutreachPage.tsx';

function PrivateRoute() {
	// const isLoggedIn = localStorage.getItem('isLoggedIn');
	const token = localStorage.getItem('research_token');
	return token ? <Outlet /> : <Navigate to='/login' replace />;
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route element={<PrivateRoute />}>
					<Route element={<Layout />}>
						<Route path='/' element={<App />} />
						<Route path='/draft' element={<OutreachPage />} />
					</Route>
				</Route>
				<Route path='*' element={<Navigate to='/login' />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
