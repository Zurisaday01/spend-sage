import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut as logOutStore, selectToken } from '@/features/auth/authSlice';
import { useLogOutMutation } from '@/services/apiAuth';
import { isTokenExpired } from '@/utils';
import {  UserApiConfirmation } from '@/types';


const AppLayout = () => {
	const token = useSelector(selectToken);

	const dispatch = useDispatch();
	const [logOut] = useLogOutMutation();

	useEffect(() => {
		const checkTokenExpiration = async () => {
			if (isTokenExpired(token)) {
				// Token is expired, log out the user
				const result: UserApiConfirmation = await logOut();

				if (result.data?.success) {
					dispatch(logOutStore());
				}
			}
		};

		checkTokenExpiration();
	}, [dispatch, logOut, token]);

	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className='grid grid-rows-[auto_1fr] h-screen transition duration-200 overflow-x-hidden grid-cols-[50px_1fr]'>
			<Header setIsOpen={setIsOpen} isOpen={isOpen} />
			<Sidebar isOpen={isOpen} />
			<main className='col-[2_/_-1] row-[2_/_-1] overflow-y-auto'>
				<div className='w-max-[1200px] my-0 mx-auto flex flex-col gap-[32px] px-6 py-6 sm:px-12 sm:py-8'>
					<Outlet />
				</div>
			</main>
		</div>
	);
};
export default AppLayout;
