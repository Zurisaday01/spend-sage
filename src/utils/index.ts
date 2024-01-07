import { Transaction } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

interface CategoryCounts {
	[key: string]: number;
}

interface TotalCategory {
	[key: string]: number;
}

export const PAGE_SIZE = 5;

const padToTwo = (number: number) => {
	return number > 9 ? number : '0' + number;
};

export const formatDate = (date: Date | string) => {
	const year = new Date(date).getUTCFullYear();
	const month = new Date(date).getUTCMonth() + 1;
	const day = new Date(date).getUTCDate();

	return `${year}-${padToTwo(month)}-${padToTwo(day)}`;
};

export const normalizedDate = (date: Date | string) => {
	return new Date(
		new Date(date).getTime() +
			Math.abs(new Date(date).getTimezoneOffset() * 60000)
	);
};

export const formatAmount = Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const transactionsCountsPerCategory = (
	transaction: Transaction[] | undefined
) => {
	return (
		transaction?.reduce((acc, income) => {
			if (income && income.category_id) {
				const categoryName: string = (income as unknown as Transaction)
					.category_id.name;
				(acc as CategoryCounts)[categoryName] =
					((acc as CategoryCounts)[categoryName] || 0) + 1;
			}

			return acc;
		}, {}) || {}
	);
};

export const categoriesTransactionsGraphData = (
	count: CategoryCounts | undefined
) => {
	const categoriesTransactionData = [];
	for (const [key, value] of Object.entries(count || {})) {
		const dataIncome = {
			name: key,
			value: value,
		};
		categoriesTransactionData.push(dataIncome);
	}

	return categoriesTransactionData;
};

export const totalAmountPerCategory = (
	transaction: Transaction[] | undefined
) => {
	const groupedTransactions = {};

	// Iterate through each transaction
	transaction?.forEach(transaction => {
		const categoryName = transaction.category_id.name;
		const amount = transaction.amount;

		// If the category doesn't exist in the groupedTransactions object, create it
		if (!(groupedTransactions as TotalCategory)[categoryName]) {
			(groupedTransactions as TotalCategory)[categoryName] = 0;
		}

		// Add the amount to the totalAmount for the category
		(groupedTransactions as TotalCategory)[categoryName] += amount;
	});

	// Convert the object to an array of objects
	const resultArray = Object.entries(groupedTransactions).map(
		([category, totalAmount]) => ({
			name: category,
			totalAmount: Math.abs(totalAmount as number),
		})
	);

	return resultArray;
};
