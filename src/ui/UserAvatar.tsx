import noUser from '/no-user.png';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '@/services/apiAuth';
import MiniSpinner from './MiniSpinner';

const UserAvatar = () => {
	const navigate = useNavigate();

	const { data: user, isLoading } = useGetCurrentUserQuery({});

	return (
		<div
			className={`rounded-full w-12 h-12 overflow-hidden border-2 border-primary cursor-pointer ${
				isLoading && 'flex items-center justify-center'
			}`}
			onClick={() => navigate('/profile')}>
			{isLoading ? (
				<MiniSpinner />
			) : (
				<img
					src={user?.user?.user?.user_metadata?.avatar || noUser}
					alt='user'
					className='object-cover object-center w-full h-full'
				/>
			)}
		</div>
	);
};
export default UserAvatar;
