import NavItem from './NavItem';
import {
	MdSpaceDashboard,
	MdMoneyOff,
	MdMoney,
	MdCategory,
} from 'react-icons/md';
import { TiUser } from 'react-icons/ti';

const Navigation = ({ isOpen }: { isOpen: boolean }) => {
	return (
		<nav className={`${isOpen && 'mt-3'}`}>
			<ul className='flex flex-col'>
				<NavItem
					icon={<MdSpaceDashboard />}
					title='Dashboard'
					isOpen={isOpen}
				/>
				<NavItem icon={<MdCategory />} title='Categories' isOpen={isOpen} />
				<NavItem icon={<MdMoneyOff />} title='Expenses' isOpen={isOpen} />
				<NavItem icon={<MdMoney />} title='Incomes' isOpen={isOpen} />
				<NavItem icon={<TiUser />} title='Profile' isOpen={isOpen} />
			</ul>
		</nav>
	);
};
export default Navigation;
