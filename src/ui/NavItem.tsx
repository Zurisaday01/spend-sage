import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
	icon: ReactNode;
	title: string;
	isOpen: boolean;
}

const NavItem = ({ icon, title, isOpen }: Props) => {
	return (
		<li>
			<Link
				to={`/${title.toLowerCase()}`}
				className={`flex items-center gap-2 text-lg hover:bg-secondary ${isOpen ? 'p-3' : 'p-2'} transition duration-200 rounded-md hover:text-[#fffdf4]`}>
				<span className='text-xl'>{icon}</span>
				{isOpen && <span>{title}</span>}
			</Link>
		</li>
	);
};
export default NavItem;
