import { Transaction } from '@/types';
import { formatDate, normalizedDate } from '@/utils';
import { eachDayOfInterval, format, isSameDay, endOfMonth } from 'date-fns';
import {
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	AreaChart,
	ResponsiveContainer,
} from 'recharts';

const PeriodGraph = ({
	className,
	incomes,
	expenses,
	selectedMonth,
	selectedYear,
}: {
	className: string;
	incomes: Transaction[];
	expenses: Transaction[];
	selectedMonth: string;
	selectedYear: string;
}) => {
	// Beginning of the current month
	const startDate =
		selectedMonth !== 'all' && selectedYear !== 'all'
			? new Date(+selectedYear, +selectedMonth - 1, 1)
			: new Date(new Date().getFullYear(), new Date().getMonth(), 1);

	const endDate =
		selectedMonth !== 'all' && selectedYear !== 'all'
			? endOfMonth(new Date(+selectedYear, +selectedMonth - 1))
			: endOfMonth(startDate);

	// Get all the days for the selected month
	const allDays = eachDayOfInterval({ start: startDate, end: endDate });

	const transactionsData = allDays.map(date => {
		return {
			label: formatDate(date),
			totalIncomes: incomes
				?.filter(income => isSameDay(date, normalizedDate(income.date)))
				.reduce((acc, income) => acc + income.amount, 0),
			totalExpenses: expenses
				?.filter(expense => isSameDay(date, normalizedDate(expense.date)))
				.reduce((acc, expense) => acc + Math.abs(expense.amount), 0),
		};
	});

	const colors = {
		totalIncomes: { stroke: '#16803C', fill: '#16803da7' },
		totalExpenses: { stroke: '#B91C1B', fill: '#b91b1b8c' },
		text: '#374151',
		background: '#fff',
	};

	return (
		<div
			className={`bg-white rounded-md w-full h-full relative overflow-hidden p-4 ${className}`}>
			{' '}
			<h3 className='heading text-xl font-bold mb-3'>
				Transactions from {format(allDays.at(0) as Date, 'MMM dd yyyy')} &mdash;{' '}
				{format(allDays.at(-1) as Date, 'MMM dd yyyy')}
			</h3>
			<div>
				<ResponsiveContainer height={250} width='100%'>
					<AreaChart data={transactionsData}>
						<XAxis
							dataKey='label'
							tick={{ fill: colors.text }}
							tickLine={{ stroke: colors.text }}
						/>
						<YAxis
							unit='$'
							tick={{ fill: colors.text }}
							tickLine={{ stroke: colors.text }}
						/>
						<CartesianGrid strokeDasharray='4' />
						<Tooltip contentStyle={{ backgroundColor: colors.background }} />
						<Area
							dataKey='totalIncomes'
							type='monotone'
							stroke={colors.totalIncomes.stroke}
							fill={colors.totalIncomes.fill}
							strokeWidth={2}
							name='Total incomes'
							unit='$'
						/>
						<Area
							dataKey='totalExpenses'
							type='monotone'
							stroke={colors.totalExpenses.stroke}
							fill={colors.totalExpenses.fill}
							strokeWidth={2}
							name='Total expenses'
							unit='$'
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
export default PeriodGraph;
