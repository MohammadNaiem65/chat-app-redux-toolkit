export default function Message({ message }) {
	return (
		<div className='flex items-center'>
			<div className='relative rounded shadow w-full'>
				<span className='block text-sm'>{message}</span>
			</div>
		</div>
	);
}
