import { Outlet, Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';

export default function Layout() {
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem('isLoggedIn');
		navigate('/login');
	};

	return (
		<div className='min-h-screen flex flex-col bg-neutral-800 text-neutral-100 font-sans antialiased'>
			{/* Navbar */}
			<header className='min-h-content p-4 shadow-md flex flex-row justify-between items-center'>
				<div>
					<img src={logo} alt='Risk Edge Solutions' width={150} />
				</div>
				<nav className='space-x-4 flex items-center'>
					<Link to='/' className='hover:underline'>
						Research
					</Link>
					<Link to='/draft' className='hover:underline'>
						Draft
					</Link>
					<button
						onClick={handleLogout}
						className='bg-red-800 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition duration-200'>
						Logout
					</button>
				</nav>
			</header>

			{/* Main Content */}
			<main className='flex-1 p-6'>
				<Outlet />
			</main>

			{/* Footer */}
			{/* <footer className='bg-gray-100 text-center p-3 border-t'>
				<p className='text-sm text-gray-500'>&copy; {new Date().getFullYear()} My App</p>
			</footer> */}
		</div>
	);
}
