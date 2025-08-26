import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';

export default function Login() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const navigate = useNavigate();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		// Fake auth (frontend only)
		if (
			username === `${import.meta.env.VITE_REACT_USERNAME}` &&
			password === `${import.meta.env.VITE_REACT_PASSWORD}`
		) {
			localStorage.setItem('isLoggedIn', 'true');
			navigate('/');
		} else {
			alert('Invalid username or password');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-[#121212] text-white'>
			<div className='bg-[#1e1e1e] p-8 rounded-2xl shadow-lg w-96 border border-gray-800'>
				{/* Company Logo */}
				<div className='flex justify-center mb-6'>
					<img src={logo} alt='Company Logo' className='h-12' />
				</div>

				<h2 className='text-2xl font-bold text-center mb-6'>Welcome, Please Login</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<input
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className='w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
						required
					/>

					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
						required
					/>

					<button
						type='submit'
						className='w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition duration-200'>
						Login
					</button>
				</form>

				<p className='text-center text-gray-400 text-sm mt-6'>
					© {new Date().getFullYear()} Risk Edge Solutions
				</p>
			</div>
		</div>
	);
}
