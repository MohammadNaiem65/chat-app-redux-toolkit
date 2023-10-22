import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:9000/',
	prepareHeaders: async (headers, { getState }) => {
		const token = getState()?.auth?.accessToken;

		if (token) {
			return headers.set('Authorization', `Bearer ${token}`);
		}

		return token;
	},
});

const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: async (args, api, extraOptions) => {
		let result = await baseQuery(args, api, extraOptions);

		// remove access token if expired
		if (result?.error?.status === 401) {
			api.dispatch(logout());

			localStorage.removeItem('auth');
		}

		return result;
	},
	// eslint-disable-next-line no-unused-vars
	endpoints: (builder) => ({}),
});

export default apiSlice;
