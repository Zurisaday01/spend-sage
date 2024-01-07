import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';
import { supabaseUrl } from '@/services/supabase';

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: supabaseUrl,
		credentials: 'include',
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	tagTypes: ['Categories', 'Transactions'],
	endpoints: () => ({}),
});
