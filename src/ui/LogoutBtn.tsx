import { logOut as logOutStore } from '@/features/auth/authSlice';
import { BiLogOut } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useLogOutMutation } from '@/services/apiAuth';
import toast from 'react-hot-toast';
import { baseApi } from '@/services/baseApi';

interface ResponseLogOutApi {
	data?: { success: boolean } | undefined;
	error?: FetchBaseQueryError | SerializedError;
}

const LogoutBtn = ({ isOpen }: { isOpen: boolean }) => {
	const dispatch = useDispatch();
	const [logOut] = useLogOutMutation();

	const handleLogout = async () => {
		try {
			const result: ResponseLogOutApi = await logOut({});

			if (result.data?.success) {
				// feedback
				toast.success('👋 See you later...');
				//  reset entire api state
				dispatch(baseApi.util.resetApiState());
				// dispatch the action reset the store slices
				dispatch(logOutStore());
			}
		} catch (error) {
			console.error('Login:', error);
			toast.error('Something went wrong!');
		}
	};

	return (
		<div className='flex items-end flex-1'>
			<button
				className={`flex items-center gap-2 transition duration-150 hover:text-secondary text-lg  ${
					isOpen ? 'p-3' : 'p-2'
				}`}
				onClick={handleLogout}>
				<span className='text-xl'>
					<BiLogOut />
				</span>
				{isOpen && <span>Log out</span>}
			</button>
		</div>
	);
};
export default LogoutBtn;
