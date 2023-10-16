import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
	const { user, accessToken } = useSelector((state) => state.auth);

	if (!user && !accessToken) {
		return children;
	}

	return <Navigate to='/inbox' replace />;
}
