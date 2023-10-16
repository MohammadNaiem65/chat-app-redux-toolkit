import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
	const { user, accessToken } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	if (user && accessToken) {
		return children;
	}

	return navigate('/');
}
