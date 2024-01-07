import { SpinnerRoundFilled } from 'spinners-react';

const Spinner = () => {
	return (
		<div role='status' className='w-full flex justify-center items-center'>
			<SpinnerRoundFilled size={100} color='#E6CB95' />
		</div>
	);
};
export default Spinner;
