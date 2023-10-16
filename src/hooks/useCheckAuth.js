import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';

const useCheckAuth = () => {
	// hooks
	const dispatch = useDispatch();

	// local states
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const localAuth = JSON.parse(localStorage.getItem('auth'));

		if (localAuth?.accessToken && localAuth?.user) {
			dispatch(login(localAuth));
		}

		setAuthChecked(true);
	}, [dispatch]);

	return authChecked;
};

export default useCheckAuth;
