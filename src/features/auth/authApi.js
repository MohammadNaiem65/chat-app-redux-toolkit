import apiSlice from '../api/apiSlice';

const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: '/register',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export default authApi;
export const { useRegisterMutation } = authApi;
