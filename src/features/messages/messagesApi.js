import apiSlice from '../api/apiSlice';

const messagesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query({
			query: (conversationId) => ({
				url: `/messages?conversationId=${conversationId}`,
			}),
		}),
		addMessage: builder.mutation({
			query: (data) => ({
				url: '/messages',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export default messagesApi;
export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
