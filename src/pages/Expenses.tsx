import CreateExpenseForm from '@/features/expenses/CreateExpenseForm';
import ExpensesTable from '@/features/expenses/ExpensesTable';
import HeaderFuntionality from '@/ui/HeaderFuntionality';
import TransactionOptions from '@/ui/TransactionOptions';
import { useState } from 'react';

const Expenses = () => {
	const [selectedYear, setSelectedYear] = useState('all');
	const [selectedMonth, setSelectedMonth] = useState('all');
	return (
		<section className='flex flex-col gap-4'>
			<HeaderFuntionality
				heading='Expenses'
				buttonText='Add New Expense'
				formElement={<CreateExpenseForm />}
			/>
			<TransactionOptions
				selectedYear={selectedYear}
				selectedMonth={selectedMonth}
				setSelectedYear={setSelectedYear}
				setSelectedMonth={setSelectedMonth}
				transactionType='expense'
			/>

			<ExpensesTable
				selectedYear={selectedYear}
				selectedMonth={selectedMonth}
			/>
		</section>
	);
};
export default Expenses;
