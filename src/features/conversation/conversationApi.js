import apiSlice from '../api/apiSlice';
import messagesApi from '../messages/messagesApi';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversation: builder.query({
			query: ({ user, partner }) => ({
				url: `/conversations?participants_like=${user}-${partner}&participants_like=${partner}-${user}`,
			}),
		}),
		getConversations: builder.query({
			query: (email) => ({
				url: `/conversations?participants_like=${email}`,
			}),
		}),
		createConversation: builder.mutation({
			query: (data) => ({
				url: '/conversations',
				method: 'POST',
				body: data,
			}),
		}),
		editConversation: builder.mutation({
			query: ({ id, data }) => ({
				url: `/conversations/${id}`,
				method: 'PATCH',
				body: data,
			}),
			async onQueryStarted(
				{ user: sender },
				{ queryFulfilled, dispatch }
			) {
				const { data: conversationData } = await queryFulfilled;
				const {
					id: conversationId,
					users,
					message,
					timestamp,
				} = conversationData;

				const receiver = users.find(
					(user) => user.email !== sender.email
				);

				const data = {
					conversationId,
					sender,
					receiver,
					message,
					timestamp,
				};

				dispatch(messagesApi.endpoints.addMessage.initiate(data));
			},
		}),
	}),
});

export default conversationApi;
export const {
	useGetConversationQuery,
	useGetConversationsQuery,
	useCreateConversationMutation,
	useEditConversationMutation,
} = conversationApi;
