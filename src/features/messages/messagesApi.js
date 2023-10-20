import apiSlice from '../api/apiSlice';

const messagesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query({
			query: (conversationId) => ({
				url: `/messages?conversationId=${conversationId}`,
			}),
		}),
	}),
});

export default messagesApi;
export const { useGetMessagesQuery } = messagesApi;
