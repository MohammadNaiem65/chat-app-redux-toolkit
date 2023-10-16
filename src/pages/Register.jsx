import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../features/auth/authApi';
import logoImage from '../assets/images/lws-logo-light.svg';
import Error from '../components/ui/Error';

export default function Register() {
	// Hooks
	const [register, { isSuccess, isError, error: processError }] =
		useRegisterMutation();
	const navigate = useNavigate();

	// local states
	const [userDetails, setUserDetails] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		agreed: false,
	});
	const [error, setError] = useState('');

	// Handle register
	const handleRegister = (e) => {
		e.preventDefault();
		setError('');

		const { name, email, password, confirmPassword } = userDetails;

		if (password === confirmPassword) {
			const data = { email, name, password };

			register(data);
		} else {
			setError('Password do not match');
		}
	};

	// handle registration process result
	useEffect(() => {
		if (isSuccess) {
			navigate('/');
		} else if (isError) {
			setError(processError?.data);
		}
	}, [isSuccess, isError, navigate, processError?.data]);

	return (
		<div className='grid place-items-center h-screen bg-[#F9FAFB'>
			<div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-md w-full space-y-8'>
					<div>
						<Link to='/'>
							<img
								className='mx-auto h-12 w-auto'
								src={logoImage}
								alt='Learn with sumit'
							/>
						</Link>
						<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
							Create your account
						</h2>
					</div>

					<form className='mt-8 space-y-6' onSubmit={handleRegister}>
						<input type='hidden' name='remember' value='true' />
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label htmlFor='name' className='sr-only'>
									Full Name
								</label>
								<input
									id='name'
									name='name'
									type='text'
									autoComplete='name'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Name'
									value={userDetails.name}
									onChange={(e) =>
										setUserDetails({
											...userDetails,
											name: e.target.value,
										})
									}
								/>
							</div>

							<div>
								<label htmlFor='email' className='sr-only'>
									Email address
								</label>
								<input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Email address'
									value={userDetails.email}
									onChange={(e) =>
										setUserDetails({
											...userDetails,
											email: e.target.value,
										})
									}
								/>
							</div>

							<div>
								<label htmlFor='password' className='sr-only'>
									Password
								</label>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='current-password'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Password'
									value={userDetails.password}
									onChange={(e) =>
										setUserDetails({
											...userDetails,
											password: e.target.value,
										})
									}
								/>
							</div>

							<div>
								<label
									htmlFor='confirmPassword'
									className='sr-only'>
									Confirm Password
								</label>
								<input
									id='confirmPassword'
									name='confirmPassword'
									type='password'
									autoComplete='current-confirmPassword'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Confirm Password'
									value={userDetails.confirmPassword}
									onChange={(e) =>
										setUserDetails({
											...userDetails,
											confirmPassword: e.target.value,
										})
									}
								/>
							</div>
						</div>

						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<input
									id='remember-me'
									name='remember-me'
									type='checkbox'
									className='h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded'
									required
									checked={userDetails.agreed}
									onChange={() =>
										setUserDetails({
											...userDetails,
											agreed: !userDetails.agreed,
										})
									}
								/>
								<label
									htmlFor='accept-terms'
									className='ml-2 block text-sm text-gray-900'>
									Agreed with the terms and condition
								</label>
							</div>
						</div>

						{error && <Error message={error} />}

						<div>
							<button
								type='submit'
								className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'>
								<span className='absolute left-0 inset-y-0 flex items-center pl-3'></span>
								Sign up
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
