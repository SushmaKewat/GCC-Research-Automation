import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/logo.png';

export default function Login() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	//@ts-ignore
	const [token, setToken] = useState<string | null>(localStorage.getItem('research_token'));
	const [message, setMessage] = useState<string>('');
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_REACT_SERVER_URL}/login`,
				new URLSearchParams({
					username,
					password,
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			console.log(res);
			const accessToken = res.data.access_token;
			localStorage.setItem('research_token', accessToken);
			setToken(accessToken);
			setMessage('Login successful!');
			navigate('/');
		} catch (err) {
			setMessage('Login failed!');
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
						autoComplete='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className='w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
						required
					/>

					<input
						type='password'
						placeholder='Password'
						autoComplete='current-password'
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
				{/* <div className='mt-4'>
					<button
						onClick={getProtected}
						className='bg-green-600 text-white p-2 rounded hover:bg-green-700'>
						Access App
					</button>
				</div> */}

				{message && <p className='mt-4 text-gray-700'>{message}</p>}

				<p className='text-center text-gray-400 text-sm mt-6'>
					© {new Date().getFullYear()} Risk Edge Solutions
				</p>
			</div>
		</div>
	);
}
