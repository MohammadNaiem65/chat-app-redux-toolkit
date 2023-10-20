import { useParams } from 'react-router-dom';
import ChatHead from './ChatHead';
import Messages from './Messages';
import Options from './Options';
import { useGetMessagesQuery } from '../../../features/messages/messagesApi';
import Message from '../../ui/Message';
import Error from '../../ui/Error';

export default function ChatBody() {
	const { id } = useParams();
	const {
		data: messages,
		isLoading,
		isError,
		error,
	} = useGetMessagesQuery(id);

	return (
		<div className='w-full lg:col-span-2 lg:block'>
			<div className='w-full grid conversation-row-grid'>
				<ChatHead
					avatar='https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg'
					name='Akash Ahmed'
				/>
				{isLoading ? (
					<Message message='Loading...' />
				) : isError ? (
					<Error message={error} />
				) : (
					messages.length > 0 && <Messages messages={messages} />
				)}
				<Options />
			</div>
		</div>
	);
}
