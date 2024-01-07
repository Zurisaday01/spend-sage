import { Dispatch, SetStateAction } from 'react';
import HamburgerBtn from './HamburgerBtn';
import UserAvatar from './UserAvatar';

const Header = ({
	setIsOpen,
	isOpen,
}: {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
}) => {
	return (
		<header className='col-[2_/_-1] border-2 border-b-primary p-2 flex justify-between items-center'>
			<HamburgerBtn setIsOpen={setIsOpen} isOpen={isOpen} />
			<UserAvatar />
		</header>
	);
};
export default Header;
