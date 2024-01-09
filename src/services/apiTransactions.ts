import supabase from '@/services/supabase';
import { PAGE_SIZE } from '@/utils';
import { baseApi } from './baseApi';

export const apiTransactions = baseApi.injectEndpoints({
	endpoints: builder => ({
		getAllTransactions: builder.query({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({ transactionType }: { transactionType?: string }) => {
				try {
					let query = supabase
						.from('transactions')
						.select(
							'id, date, title, description, amount, category_id!inner(id, type, name)',
							{ count: 'exact' }
						);

					if (transactionType) {
						query = query.eq('category_id.type', transactionType);
					}

					const { data: transactions, error } = await query;

					if (error) throw new Error(error.message);

					return { data: { transactions } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
		}),
		getIncomesTransaction: builder.query({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({
				page,
				year,
				month,
				queryTitle,
			}: {
				page?: number;
				year?: string;
				month?: string;
				queryTitle?: string;
			}) => {
				try {
					let baseQuery = supabase
						.from('transactions')
						.select(
							'id, date, title, description, amount,  category_id!inner(id, type, name), user_id(id)',
							{ count: 'exact' }
						)
						.eq('category_id.type', 'income');

					// Apply filters
					if (queryTitle) {
						baseQuery = baseQuery.ilike('title', `%${queryTitle}%`);
					}

					if (Number(year) && Number(month)) {
						const startOfDate = new Date(`${year}-${month}-01`);
						const endOfDate = new Date(`${year}-${month}-31`);
						endOfDate.setHours(23, 59, 59, 999);
						baseQuery = baseQuery
							.gte('date', startOfDate.toISOString())
							.lte('date', endOfDate.toISOString());
					}

					if (Number(year) && month === 'all') {
						const currentYear = new Date().getFullYear();
						const startOfYear = new Date(`${year || currentYear}-01-01`);
						const endOfYear = new Date(`${year}-12-31`);
						baseQuery = baseQuery
							.gte('date', startOfYear.toISOString())
							.lte('date', endOfYear.toISOString());
					}

					const { count: totalCount } = await baseQuery;

					// Pagination
					let query = baseQuery;
					if (page) {
						const from = (page - 1) * PAGE_SIZE;
						const to = from + PAGE_SIZE - 1;

						query = baseQuery.range(
							Math.min(from, (totalCount ?? 0) - 1),
							Math.min(to, (totalCount ?? 0) - 1)
						);
					}

					const { data: incomes, error, count } = await query;

					if (error) throw new Error(error.message);

					return { data: { incomes, count } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
			providesTags: result =>
				result ? [{ type: 'Transactions', id: 'income' }] : [],
		}),
		getExpensesTransaction: builder.query({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({
				page,
				year,
				month,
				queryTitle,
			}: {
				page?: number;
				year?: string;
				month?: string;
				queryTitle?: string;
			}) => {
				try {
					let baseQuery = supabase
						.from('transactions')
						.select(
							'id, date, title, description, amount, category_id!inner(id, type, name), user_id(id)',
							{ count: 'exact' }
						)
						.eq('category_id.type', 'expense');

					// Apply filters
					if (queryTitle) {
						baseQuery = baseQuery.ilike('title', `%${queryTitle}%`);
					}

					if (Number(year) && Number(month)) {
						const startOfDate = new Date(`${year}-${month}-01`);
						const endOfDate = new Date(`${year}-${month}-31`);
						endOfDate.setHours(23, 59, 59, 999);
						baseQuery = baseQuery
							.gte('date', startOfDate.toISOString())
							.lte('date', endOfDate.toISOString());
					}

					if (Number(year) && month === 'all') {
						const currentYear = new Date().getFullYear();
						const startOfYear = new Date(`${year || currentYear}-01-01`);
						const endOfYear = new Date(`${year}-12-31`);
						baseQuery = baseQuery
							.gte('date', startOfYear.toISOString())
							.lte('date', endOfYear.toISOString());
					}

					// Get total count without pagination
					const { count: totalCount } = await baseQuery;

					// Pagination
					let query = baseQuery;
					if (page) {
						const from = (page - 1) * PAGE_SIZE;
						const to = from + PAGE_SIZE - 1;

						query = baseQuery.range(
							Math.min(from, (totalCount ?? 0) - 1),
							Math.min(to, (totalCount ?? 0) - 1)
						);
					}

					const { data: expenses, error, count } = await query;

					if (error) throw new Error(error.message);

					return { data: { expenses, count } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
			providesTags: result =>
				result ? [{ type: 'Transactions', id: 'expense' }] : [],
			staleTime: 0,
		}),
		createTransaction: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({
				user_id,
				date,
				title,
				description,
				categoryName,
				amount,
			}: {
				user_id: string;
				date: Date;
				title: string;
				description: string;
				categoryName: string;
				amount: string;
			}) => {
				try {
					// get the categoryId using the categoryName
					const { data: category, error: errorGettingCategoryId } =
						await supabase
							.from('categories')
							.select('id')
							.eq('name', categoryName);

					const query = supabase
						.from('transactions')
						.insert([
							{
								date,
								title,
								description,
								category_id: category?.at(0)?.id,
								amount,
								user_id,
							},
						])
						.select('title, category_id(type)');

					const { data: transaction, error } = await query;

					if (errorGettingCategoryId || error)
						throw new Error('Transaction could not be created');

					return { data: { transaction } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
			invalidatesTags: result =>
				result && result.transaction && result.transaction.length > 0
					? [
							{
								type: 'Transactions',
								id: result.transaction[0]?.category_id[0]?.type,
							},
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  ]
					: [],
		}),
		updateTransaction: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({
				id,
				date,
				title,
				description,
				categoryName,
				amount,
			}: {
				id: number;
				date: Date;
				title: string;
				description: string;
				categoryName: string;
				amount: string;
			}) => {
				try {
					// get the categoryId using the categoryName
					const { data: category, error: errorGettingCategoryId } =
						await supabase
							.from('categories')
							.select('id')
							.eq('name', categoryName);

					const query = supabase
						.from('transactions')
						.update({
							date,
							title,
							description,
							category_id: category?.at(0)?.id,
							amount,
						})
						.eq('id', id)
						.select('title, category_id(type)');

					const { data: transaction, error } = await query;

					if (errorGettingCategoryId || error)
						throw new Error('Transaction could not be created');

					return { data: { transaction } };
				} catch (error) {
					console.log(error);
					return { error: (error as Error).message };
				}
			},
			invalidatesTags: result =>
				result && result.transaction && result.transaction.length > 0
					? [
							{
								type: 'Transactions',
								id: result.transaction[0]?.category_id[0]?.type,
							},
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  ]
					: [],
		}),
		deleteTransaction: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({ id }: { id: string }) => {
				try {
					const query = supabase.from('transactions').delete().eq('id', id);

					const { error } = await query;

					if (error) throw new Error(error?.details);

					return { data: { success: true } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
			invalidatesTags: () => ['Transactions'],
		}),
	}),
});

export const {
	useGetAllTransactionsQuery,
	useGetExpensesTransactionQuery,
	useGetIncomesTransactionQuery,
	useCreateTransactionMutation,
	useUpdateTransactionMutation,
	useDeleteTransactionMutation,
} = apiTransactions;
