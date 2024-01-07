import { Dispatch, SetStateAction } from 'react';

const HambuergerBtn = ({
	setIsOpen,
	isOpen,
}: {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
}) => {
	return (
		<button
			className={`tham tham-e-squeeze tham-w-6 ${
				isOpen && 'tham-active ml-[210px]'
			}`}
			onClick={() => setIsOpen(!isOpen)}>
			<div className='tham-box'>
				<div className='tham-inner' />
			</div>
		</button>
	);
};
export default HambuergerBtn;
