import supabase from '@/services/supabase';
import { PAGE_SIZE } from '@/utils';
import { baseApi } from './baseApi';

export const apiCategories = baseApi.injectEndpoints({
	endpoints: builder => ({
		getCategories: builder.query({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({
				page,
				type,
				queryName,
				userId,
			}: {
				page?: number;
				type?: string;
				queryName?: string;
				userId: string | undefined;
			}) => {
				try {
					if (!userId)
						throw new Error('Something is wrong with your authentification');

					let baseQuery = supabase
						.from('categories')
						.select('id, name, type, user_id!inner(id)', { count: 'exact' })
						.eq('user_id.id', userId);

					if (queryName) {
						baseQuery = baseQuery.ilike('name', `%${queryName}%`);
					}

					if (type) {
						baseQuery = baseQuery.eq('type', type);
					}

					// Get total count without pagination
					const { count: totalCount } = await baseQuery;

					// pagination
					let query = baseQuery;

					if (page) {
						const from = (page - 1) * PAGE_SIZE;
						const to = from + PAGE_SIZE - 1;

						query = baseQuery.range(
							Math.min(from, (totalCount ?? 0) - 1),
							Math.min(to, (totalCount ?? 0) - 1)
						);
					}

					const { data: categories, error, count } = await query;

					if (error) throw new Error(error.message);

					return { data: { categories, count } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
			providesTags: () => ['Categories'],
			staleTime: 0,
		}),
		getCategory: builder.query({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({ categoryId }: { categoryId: number }) => {
				try {
					const query = supabase
						.from('categories')
						.select('id, name, type')
						.eq('id', categoryId);

					const { data: category, error } = await query;

					if (error) throw new Error(error.message);

					return { data: { category } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
		}),
		createCategory: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({
				user_id,
				name,
				type,
			}: {
				user_id: string;
				name: string;
				type: string;
			}) => {
				try {
					const query = supabase
						.from('categories')
						.insert([{ name, type, user_id }])
						.select('name, type');

					const { data: category, error } = await query;

					console.log(category, error);

					if (error?.code === '23505')
						throw new Error(
							"Can't create! 🚫  A category with the name already exists. Please choose a unique name for the category"
						);

					if (error) throw new Error('Category could not be created');

					return { data: { category } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
			invalidatesTags: () => ['Categories'],
		}),
		updateCategory: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({
				id,
				name,
				type,
			}: {
				id: number;
				name: string;
				type: string;
			}) => {
				try {
					const query = supabase
						.from('categories')
						.update({ name, type })
						.eq('id', id)
						.select('name, type');

					const { data: category, error } = await query;

					if (error) throw new Error('Category could not be updated');

					return { data: { category } };
				} catch (error) {
					console.log(error);
					return { error: (error as Error).message };
				}
			},
			invalidatesTags: () => ['Categories'],
		}),
		deleteCategory: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({ id }: { id: string }) => {
				try {
					const query = supabase.from('categories').delete().eq('id', id);

					const { error } = await query;

					if (error?.code === '23503')
						throw new Error(
							"Can't delete! 🚫 Category has active financial ties"
						);

					if (error) throw new Error(error?.details);

					return { data: { success: true } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
			invalidatesTags: () => ['Categories'],
		}),
	}),
});

export const {
	useGetCategoriesQuery,
	useGetCategoryQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
} = apiCategories;
