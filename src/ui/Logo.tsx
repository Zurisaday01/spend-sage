import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';

interface Props {
	location?: 'dashboard' | undefined;
	isOpen?: boolean | undefined;
}

const Logo = ({ location, isOpen }: Props) => {
	const navigate = useNavigate();

	if (location && isOpen) {
		return (
			<div
				className='text-bold flex gap-1 items-center text-2xl font-quicksand font-bold cursor-pointer'
				onClick={() => navigate('/dashboard')}>
				<img className='w-[60px]' src={logo} alt='logo' />
				SpendSage
			</div>
		);
	}

	if (location && !isOpen) {
		return (
			<div
				className='h-[60px] flex items-center cursor-pointer'
				onClick={() => navigate('/dashboard')}>
				<img className='w-[60px]' src={logo} alt='logo' />
			</div>
		);
	}

	if (!location) {
		return (
			<div className='text-bold flex flex-col gap-1 items-center text-2xl font-quicksand font-bold'>
				<img className='w-[80px]' src={logo} alt='logo' />
				SpendSage
			</div>
		);
	}
};
export default Logo;
