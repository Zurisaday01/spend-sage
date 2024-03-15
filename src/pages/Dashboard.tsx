import { useGetCurrentUserQuery } from '@/services/apiAuth';
import {
	useGetExpensesTransactionQuery,
	useGetIncomesTransactionQuery,
} from '@/services/apiTransactions';
import { Transaction } from '@/types';
import CategoriesTabs from '@/ui/CategoriesTabs';
import FilterByOptions from '@/ui/FilterByOptions';
import PeriodGraph from '@/ui/PeriodGraph';
import Spinner from '@/ui/Spinner';
import TransactionCard from '@/ui/TransactionCard';
import TransactionDoughnutCard from '@/ui/TransactionDoughnutCard';
import {
	categoriesTransactionsGraphData,
	formatAmount,
	totalAmountPerCategory,
	transactionsCountsPerCategory,
} from '@/utils';
import { useState } from 'react';

const Dashboard = () => {
	// get user
	const { isLoading: isLoadingCurrentUser } = useGetCurrentUserQuery();
	// option values
	const [selectedYear, setSelectedYear] = useState('all');
	const [selectedMonth, setSelectedMonth] = useState('all');

	const { data: expenses, isLoading: isLoadingExpenses } =
		useGetExpensesTransactionQuery({
			year: selectedYear,
			month: selectedMonth,
		});

	const { data: incomes, isLoading: isLoadingIncomes } =
		useGetIncomesTransactionQuery({ year: selectedYear, month: selectedMonth });

	const expensesAmount =
		expenses?.expenses.reduce(
			(acc, current) => acc + Math.abs(current.amount),
			0
		) ?? 0;

	const incomesAmount =
		incomes?.incomes.reduce((acc, current) => acc + current.amount, 0) ?? 0;

	const categoriesExpensesData = categoriesTransactionsGraphData(
		transactionsCountsPerCategory(
			expenses?.expenses as Transaction[] | undefined
		)
	);

	const categoriesIncomesData = categoriesTransactionsGraphData(
		transactionsCountsPerCategory(incomes?.incomes as Transaction[] | undefined)
	);

	const totalAmountExpenses = totalAmountPerCategory(
		expenses?.expenses as Transaction[] | undefined
	);
	const totalAmountIncomes = totalAmountPerCategory(
		incomes?.incomes as Transaction[] | undefined
	);

	if (isLoadingExpenses || isLoadingIncomes || isLoadingCurrentUser)
		return <Spinner />;

	return (
		<section className='flex flex-col gap-3'>
			<div className='flex flex-col gap-3 md:flex-row  justify-between md:items-center'>
				<FilterByOptions
					selectedYear={selectedYear}
					selectedMonth={selectedMonth}
					setSelectedMonth={setSelectedMonth}
					setSelectedYear={setSelectedYear}
				/>
				<p className='flex flex-col text-center sm:text-start text-secondary'>
					<span>Balance</span>
					<span className='text-3xl'>
						{formatAmount.format(incomesAmount - expensesAmount)}
					</span>
				</p>
			</div>
			<div className='min-h-[80vh] grid gap-3 grid-rows-[repeat(auto-fit,_minmax(max-content,_1fr))] md:grid-cols-[repeat(2,minmax(max-content,1fr))] xl:grid-cols-[repeat(3,minmax(max-content,1fr))]'>
				<TransactionCard
					type='expenses'
					className='min-w-[250px] md:w-full h-[150px] sm:h-[200px]'
					amount={expensesAmount}
				/>
				<TransactionCard
					type='incomes'
					className='min-w-[250px] md:w-full h-[150px] sm:h-[200px]'
					amount={incomesAmount}
				/>

				{/* count of transactions per category (income, expense) */}
				<TransactionDoughnutCard
					type='expense'
					className='min-w-[250px] md:w-full h-[200px] sm:h-[250px] xl:col-[1_/_2] xl:row-[2_/_3]'
					data={categoriesExpensesData}
				/>
				<TransactionDoughnutCard
					type='income'
					className='min-w-[250px] md:w-full h-[200px] sm:h-[250px] xl:col-[2_/_3] xl:row-[2_/_3]'
					data={categoriesIncomesData}
				/>

				<CategoriesTabs
					className='min-w-[250px] md:col-span-full  xl:row-[1_/_3] xl:col-[3_/_-1] xl:w-[600px] xl:max-w-[700px] h-[470px]'
					expenses={totalAmountExpenses}
					incomes={totalAmountIncomes}
				/>

				<PeriodGraph
					className='h-[300px] md:col-span-full xl:h-[300px] xl:col-[1_/_-1] xl:row-[3_/_4]'
					incomes={incomes?.incomes as unknown as Transaction[]}
					expenses={expenses?.expenses as unknown as Transaction[]}
					selectedMonth={selectedMonth}
					selectedYear={selectedYear}
				/>
			</div>
		</section>
	);
};
export default Dashboard;
