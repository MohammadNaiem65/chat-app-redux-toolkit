import { useSelector } from 'react-redux';
import moment from 'moment';
import { useGetConversationsQuery } from '../../features/conversation/conversationApi';
import ChatItem from './ChatItem';
import Error from '../ui/Error';
import Message from '../ui/Message';

export default function ChatItems() {
	// hooks
	const { user } = useSelector((state) => state.auth);
	const {
		data: conversations,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetConversationsQuery(user.email);

	// ! decide what to render
	let content = null;
	if (isLoading) {
		content = <Message message='Loading' />;
	} else if (!isLoading && isError) {
		content = <Error message={error.data} />;
	} else if (!isLoading && isSuccess && conversations.length === 0) {
		content = <Message message='No conversation found' />;
	} else if (!isLoading && isSuccess && conversations.length > 0) {
		content = conversations.map((conversation) => {
			const { message, timestamp } = conversation;
			const partner = conversation.users.find(
				(u) => u.email !== user.email
			).name;

			return (
				<ChatItem
					key={conversation.id}
					avatar='https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg'
					name={partner}
					lastMessage={message}
					lastTime={moment(timestamp).fromNow()}
				/>
			);
		});
	}

	return (
		<ul>
			<li>{content}</li>
		</ul>
	);
}
