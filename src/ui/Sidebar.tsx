import Logo from './Logo';
import LogoutBtn from './LogoutBtn';
import Navigation from './Navigation';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
	return (
		<aside className='col-[1_/_2] row-span-full  relative '>
			<div
				className={`absolute flex flex-col p-2 gap- z-[50] bg-primary h-full ${
					isOpen ? 'w-[260px]' : 'w-full'
				} `}>
				<Logo location='dashboard' isOpen={isOpen} />
				<Navigation isOpen={isOpen} />
				<LogoutBtn isOpen={isOpen} />
			</div>
		</aside>
	);
};
export default Sidebar;
