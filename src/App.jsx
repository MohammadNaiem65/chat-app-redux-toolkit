import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Conversation from './pages/Conversation';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import Register from './pages/Register';
import useCheckAuth from './hooks/useCheckAuth';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';

function App() {
	// local states
	const authCheck = useCheckAuth();

	return (
		authCheck && (
			<Router>
				<Routes>
					<Route
						path='/'
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path='/register'
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>
					<Route
						path='/inbox'
						element={
							<PrivateRoute>
								<Conversation />
							</PrivateRoute>
						}
					/>
					<Route
						path='/inbox/:id'
						element={
							<PrivateRoute>
								<Inbox />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		)
	);
}

export default App;
