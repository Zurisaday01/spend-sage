import { Dispatch, SetStateAction } from 'react';
import FilterByOptions from './FilterByOptions';
import SearchBar from './SearchBar';

const TransactionOptions = ({
	selectedYear,
	selectedMonth,
	setSelectedYear,
	setSelectedMonth,
	transactionType,
}: {
	selectedYear: string;
	selectedMonth: string;
	setSelectedYear: Dispatch<SetStateAction<string>>;
	setSelectedMonth: Dispatch<SetStateAction<string>>;
	transactionType: string;
}) => {
	return (
		<div className='flex w-full flex-col gap-2'>
			<SearchBar by='title' />
			<FilterByOptions
				selectedYear={selectedYear}
				selectedMonth={selectedMonth}
				setSelectedYear={setSelectedYear}
				setSelectedMonth={setSelectedMonth}
				transactionType={transactionType}
			/>
		</div>
	);
};
export default TransactionOptions;
