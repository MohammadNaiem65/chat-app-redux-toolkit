import apiSlice from '../api/apiSlice';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversation: builder.query({
			query: ({ user, partner }) => ({
				url: `/conversations?participants_like=${user}-${partner}&participants_like=${partner}-${user}`,
			}),
		}),
		createConversation: builder.mutation({
			query: (data) => ({
				url: '/conversations',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export default conversationApi;
export const { useGetConversationQuery, useCreateConversationMutation } =
	conversationApi;
