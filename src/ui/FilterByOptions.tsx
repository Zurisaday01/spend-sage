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
import { Dispatch, SetStateAction } from 'react';

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

	console.log(selectedYear);

	// console.log('year', selectedYear);
	// console.log('month', selectedMonth);

	// useEffect(() => {
	// 	if (selectedYear && !selectedMonth) {
	// 		setSelectedMonth('all');
	// 	}
	// }, [selectedMonth, selectedYear, setSelectedMonth]);

	// useEffect(() => {
	// 	if (selectedMonth && !selectedYear) {
	// 		console.log('no year');
	// 		setSelectedYear(new Date().getFullYear().toString());
	// 	}
	// }, [selectedMonth, selectedYear, setSelectedYear]);

	// useEffect(() => {
	// 	if (selectedYear === 'all') {
	// 		setSelectedMonth('all');
	// 		// setSelectedYear('all');
	// 	}
	// }, [selectedYear, setSelectedMonth]);

	return (
		<div className='flex flex-col sm:flex-row-reverse gap-2'>
			<Button
				onClick={() => {
					console.log('cleaning...');
					setSelectedYear('all');
					setSelectedMonth('all');
				}}>
				Clear Sorting
			</Button>
			<div className='flex gap-2'>
				<div className='flex flex-col w-full gap-1'>
					<Select
						onValueChange={value => setSelectedYear(value)}
						value={selectedYear}>
						<SelectTrigger className='w-full  sm:w-[150px] border border-primary'>
							{isLoading && <MiniSpinner />}
							<SelectValue placeholder='Sort by year' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value='all'>All years</SelectItem>
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
					{selectedYear === 'all' && Number(selectedMonth) ? (
						<p className='text-xs text-red-600'>Select a year</p>
					) : null}
				</div>
				<div className='w-full'>
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
			</div>
		</div>
	);
};
export default FilterByOptions;
