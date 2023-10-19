import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:9000/',
		prepareHeaders: async (headers, { getState }) => {
			const token = getState()?.auth?.accessToken;

			if (token) {
				return headers.set('Authorization', `Bearer ${token}`);
			}

			return token;
		},
	}),
	// eslint-disable-next-line no-unused-vars
	endpoints: (builder) => ({}),
});

export default apiSlice;
