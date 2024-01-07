import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { getYear } from 'date-fns';

import MiniSpinner from './MiniSpinner';
import { useGetAllTransactionsQuery } from '@/services/apiTransactions';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction, useEffect } from 'react';

const FilterByOptions = ({
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
	transactionType?: string;
}) => {
	const { data: allTransactions, isLoading } = useGetAllTransactionsQuery({
		transactionType,
	});

	useEffect(() => {
		if (selectedYear && !selectedMonth) {
			const monthNumber = new Date().getMonth() + 1;

			setSelectedMonth(
				monthNumber < 9 ? `0${monthNumber}` : monthNumber.toString()
			);
		}
	}, [selectedMonth, selectedYear, setSelectedMonth]);

	useEffect(() => {
		if (selectedMonth && !selectedYear) {
			setSelectedYear(new Date().getFullYear().toString());
		}
	}, [selectedMonth, selectedYear, setSelectedYear]);

	return (
		<div className='flex flex-col sm:flex-row gap-2'>
			<div className='flex gap-2'>
				<Select
					onValueChange={value => setSelectedYear(value)}
					value={selectedYear}>
					<SelectTrigger className='w-full  sm:w-[150px] border border-primary'>
						{isLoading && <MiniSpinner />}
						<SelectValue placeholder='Sort by year' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{[
								...new Set(
									allTransactions?.transactions.map(expense =>
										getYear(expense.date)
									)
								),
							].map(year => (
								<SelectItem key={year} value={year.toString()}>
									{year}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select
					onValueChange={value => setSelectedMonth(value)}
					value={selectedMonth}>
					<SelectTrigger className='w-full sm:w-[150px] border border-primary'>
						<SelectValue placeholder='Sort by month' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value='all'>All months</SelectItem>
							<SelectItem value='01'>January</SelectItem>
							<SelectItem value='02'>February</SelectItem>
							<SelectItem value='03'>March</SelectItem>
							<SelectItem value='04'>April</SelectItem>
							<SelectItem value='05'>May</SelectItem>
							<SelectItem value='06'>June</SelectItem>
							<SelectItem value='07'>July</SelectItem>
							<SelectItem value='08'>August</SelectItem>
							<SelectItem value='09'>September</SelectItem>
							<SelectItem value='10'>October</SelectItem>
							<SelectItem value='11'>November</SelectItem>
							<SelectItem value='12'>December</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<Button
				onClick={() => {
					setSelectedYear('');
					setSelectedMonth('');
				}}>
				Clear Sorting
			</Button>
		</div>
	);
};
export default FilterByOptions;
