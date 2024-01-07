import { useSelector } from 'react-redux';
import noUser from '/no-user.png';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const UserAvatar = () => {
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();

	const { user_metadata } = user!;

	return (
		<div
			className='rounded-full w-12 h-12 overflow-hidden border-2 border-primary cursor-pointer'
			onClick={() => navigate('/profile')}>
			<img
				src={user_metadata?.avatar || noUser}
				alt='user'
				className='object-cover object-center w-full h-full'
			/>
		</div>
	);
};
export default UserAvatar;
