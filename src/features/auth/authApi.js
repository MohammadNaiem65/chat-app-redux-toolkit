import apiSlice from '../api/apiSlice';
import { login } from './authSlice';

const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: '/register',
				method: 'POST',
				body: data,
			}),
		}),
		login: builder.mutation({
			query: (data) => ({
				url: '/login',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const { data } = await queryFulfilled;

				localStorage.setItem('auth', JSON.stringify(data));

				dispatch(login(data));
			},
		}),
	}),
});

export default authApi;
export const { useRegisterMutation, useLoginMutation } = authApi;
