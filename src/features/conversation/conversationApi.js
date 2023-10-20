import apiSlice from '../api/apiSlice';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversation: builder.query({
			query: ({ user, partner }) => ({
				url: `/conversations?participants_like=${user}-${partner}&participants_like=${partner}-${user}`,
			}),
		}),
	}),
});

export default conversationApi;
export const { useGetConversationQuery } = conversationApi;
