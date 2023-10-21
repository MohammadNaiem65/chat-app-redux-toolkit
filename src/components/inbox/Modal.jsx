import { useEffect, useState } from 'react';
import isValidEmail from '../../utils/isValidEmail';
import { useDispatch, useSelector } from 'react-redux';
import userApi from '../../features/user/userApi';
import Error from '../ui/Error';
import conversationApi, {
	useCreateConversationMutation,
	useEditConversationMutation,
} from '../../features/conversation/conversationApi';

export default function Modal({ open, control }) {
	// hooks
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const [
		createConversation,
		{
			isSuccess: creatingConversationSuccessState,
			isError: creatingConversationErrorState,
			error: creatingConversationError,
		},
	] = useCreateConversationMutation();
	const [
		editConversation,
		{
			isSuccess: editConversationSuccessState,
			isError: editConversationErrorState,
			error: editConversationError,
		},
	] = useEditConversationMutation();

	// local states
	const [conversationDetails, setConversationDetails] = useState(null);
	const [messageDetails, setMessageDetails] = useState({
		receiver: '',
		message: '',
	});
	const [error, setError] = useState('');

	// handle email debounce and validation
	const setReceiver = () => {
		let timeoutId;
		return (...args) => {
			setError('');
			clearTimeout(timeoutId);

			timeoutId = setTimeout(getConversationDetails(...args), 600);
		};
	};

	const getConversationDetails = (e) => {
		const validEmail = isValidEmail(e.target.value);

		if (validEmail && validEmail[0] === user.email) {
			setError('You can not message yourself.');
		} else if (validEmail && validEmail[0] !== user.email) {
			// get user details
			dispatch(userApi.endpoints.getUser.initiate(validEmail[0]))
				.unwrap()
				.then((res) => {
					// if user is unavailable
					if (res.length === 0) {
						setError('No user found.');
					} else if (res.length > 0) {
						// if user is available
						const partner = res[0];
						setMessageDetails({
							...messageDetails,
							receiver: partner,
						});

						dispatch(
							conversationApi.endpoints.getConversation.initiate({
								user: user.email,
								partner: partner.email,
							})
						)
							.unwrap()
							.then((res) => {
								setConversationDetails(res);
							});
					}
				});
		}
	};

	// handle send message
	const handleSendMessage = (e) => {
		e.preventDefault();

		const { email, name, id } = messageDetails.receiver;

		const data = {
			participants: `${user.email}-${email}`,
			users: [user, { email, name, id }],
			message: messageDetails.message,
			timestamp: new Date().getTime(),
		};

		// create new conversation
		if (conversationDetails.length === 0) {
			createConversation({ user, data });
		} else if (conversationDetails.length > 0) {
			// edit conversation
			editConversation({ id: conversationDetails[0].id, data, user });
		}

		setMessageDetails({ receiver: '', message: '' });
	};

	// hide modal
	useEffect(() => {
		if (creatingConversationSuccessState || editConversationSuccessState) {
			control();
		} else if (
			creatingConversationErrorState ||
			editConversationErrorState
		) {
			setError(
				creatingConversationErrorState
					? creatingConversationError?.data
					: editConversationError?.data
			);
		}
		// disable lint error for not using control as dependency
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		creatingConversationSuccessState,
		editConversationSuccessState,
		creatingConversationErrorState,
		editConversationErrorState,
		creatingConversationError?.data,
		editConversationError?.data,
	]);

	return (
		open && (
			<>
				<div
					onClick={control}
					className='fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer'></div>
				<div className='rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2'>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Send message
					</h2>
					<form
						className='mt-8 space-y-6'
						onSubmit={handleSendMessage}>
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label htmlFor='receiver' className='sr-only'>
									To
								</label>
								<input
									id='receiver'
									name='receiver'
									type='email'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Send to'
									onChange={setReceiver()}
								/>
							</div>

							<div>
								<label htmlFor='message' className='sr-only'>
									Message
								</label>
								<textarea
									id='message'
									name='message'
									type='text'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Message'
									value={messageDetails.message}
									onChange={(e) =>
										setMessageDetails({
											...messageDetails,
											message: e.target.value,
										})
									}
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'>
								Send Message
							</button>
						</div>

						{error && <Error message={error} />}
					</form>
				</div>
			</>
		)
	);
}
