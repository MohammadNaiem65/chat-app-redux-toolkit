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
			query: ({ data }) => ({
				url: '/conversations',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(
				{ user: sender },
				{ queryFulfilled, dispatch }
			) {
				try {
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

					const messageDetails = {
						conversationId,
						sender,
						receiver,
						message,
						timestamp,
					};

					dispatch(
						messagesApi.endpoints.addMessage.initiate(
							messageDetails
						)
					);

					// pessimistically add conversation into cache
					dispatch(
						apiSlice.util.updateQueryData(
							'getConversations',
							sender.email,
							(draft) => {
								draft.unshift(conversationData);
							}
						)
					);
				} catch (error) {
					// do nothing
				}
			},
		}),

		editConversation: builder.mutation({
			query: ({ id, data }) => ({
				url: `/conversations/${id}`,
				method: 'PATCH',
				body: data,
			}),
			async onQueryStarted(
				{ user: sender, id, data },
				{ queryFulfilled, dispatch }
			) {
				// optimistic conversation cache update
				const conversationUpdate = dispatch(
					apiSlice.util.updateQueryData(
						'getConversations',
						sender.email,
						(draft) => {
							const conversation = draft.find((c) => c.id == id);

							conversation.message = data.message;
							conversation.timestamp = data.timestamp;
						}
					)
				);

				// optimistic messages cache update
				const messagesUpdate = dispatch(
					apiSlice.util.updateQueryData(
						'getMessages',
						JSON.stringify(id),
						(draft) => {
							const { users, message, timestamp } = data;

							const receiver = users.find(
								(user) => user.email !== sender.email
							);

							const messageDetails = {
								id: draft.length + 1,
								conversationId: id,
								sender,
								receiver,
								message,
								timestamp,
							};

							draft.push(messageDetails);
						}
					)
				);

				try {
					// add message to the db
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

					const messageDetails = {
						conversationId,
						sender,
						receiver,
						message,
						timestamp,
					};

					dispatch(
						messagesApi.endpoints.addMessage.initiate(
							messageDetails
						)
					);
				} catch (error) {
					// undo cache update
					conversationUpdate.undo();
					messagesUpdate.undo();
				}
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
