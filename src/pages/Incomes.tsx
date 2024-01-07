import CreateIncomeForm from '@/features/incomes/CreateIncomeForm';
import IncomesTable from '@/features/incomes/IncomesTable';
import HeaderFuntionality from '@/ui/HeaderFuntionality';
import TransactionOptions from '@/ui/TransactionOptions';
import { useState } from 'react';

const Incomes = () => {
	const [selectedYear, setSelectedYear] = useState('');
	const [selectedMonth, setSelectedMonth] = useState('');
	return (
		<section className='flex flex-col gap-4'>
			<HeaderFuntionality
				heading='Incomes'
				buttonText='Add New Income'
				formElement={<CreateIncomeForm />}
			/>
			<TransactionOptions
				selectedYear={selectedYear}
				selectedMonth={selectedMonth}
				setSelectedYear={setSelectedYear}
				setSelectedMonth={setSelectedMonth}
				transactionType='income'
			/>
			<IncomesTable selectedYear={selectedYear}
				selectedMonth={selectedMonth} />
		</section>
	);
};
export default Incomes;
