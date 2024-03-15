import supabase, { supabaseUrl } from '@/services/supabase';
import {
	Login,
	SignUp,
	UpdateCurrentUser,
	QueryResultUser,
	QueryResultConfirmation,
} from '@/types';
import { baseApi } from './baseApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

// <returns, expects>

// from the api slice with normal redux
export const apiAuth = baseApi.injectEndpoints({
	endpoints: builder => ({
		getCurrentUser: builder.query<QueryResultUser, void>({
			queryFn: async (): Promise<
				QueryReturnValue<QueryResultUser, FetchBaseQueryError>
			> => {
				try {
					const { data: session } = await supabase.auth.getSession();
					if (!session.session) return { data: { user: null } };

					// get the user from database validating user's access JWT
					const { data: user, error } = await supabase.auth.getUser();

					if (error) throw new Error(error.message);

					return { data: user };
				} catch (error) {
					console.log(error);
					return { error: error as FetchBaseQueryError };
				}
			},
			providesTags: result => {
				if (result && result.user) {
					return [{ type: 'User', id: result.user.id }] as const;
				} else {
					return [] as const;
				}
			},
		}),
		login: builder.mutation<QueryResultUser, Login>({
			// prettier-ignore
			queryFn: async ({email,password,}: Login): Promise<QueryReturnValue<QueryResultUser, FetchBaseQueryError>> => {
				try {
					const { data, error } = await supabase.auth.signInWithPassword({
						email,
						password,
					});

					if (error) {
						throw new Error(error.message);
					}
					return { data };
				} catch (error) {
					return { error: error as FetchBaseQueryError };
				}
			},

			invalidatesTags: (_, error) => {
				if (error) return [];

				return [{ type: 'User' }];
			},
		}),
		signUp: builder.mutation<QueryResultUser, SignUp>({
			// prettier-ignore
			queryFn: async ({ fullName, email, password }: SignUp): Promise<QueryReturnValue<QueryResultUser, FetchBaseQueryError>> => {
				try {
					// sign up to supabase
					const { data, error } = await supabase.auth.signUp({
						email,
						password,
						options: {
							data: {
								fullName,
								avatar: '',
							},
						},
					});

					if (error) throw new Error(error.message);

					if (!data.user)
						throw new Error('Something went wrong creating the user');

					// create user in table
					const { error: errorCreating } = await supabase
						.from('users')
						.insert({ email: data.user?.email, id: data.user?.id });

					if (errorCreating) throw new Error(errorCreating.message);

					return { data };
				} catch (error) {
					return { error: error as FetchBaseQueryError };
				}
			},
			invalidatesTags: (_, error) => {
				if (error) return [];

				return [{ type: 'User' }];
			},
		}),

		logOut: builder.mutation<QueryResultConfirmation, void>({
			// prettier-ignore
			queryFn: async () : Promise<QueryReturnValue<QueryResultConfirmation, FetchBaseQueryError>>  => {
				try {
					const { error } = await supabase.auth.signOut();

					if (error) throw new Error(error.message);

					return { data: { success: true } };
				} catch (error) {
					return { error: error as FetchBaseQueryError };
				}
			},

			invalidatesTags: (_, error) => {
				if (error) return [];

				return [{ type: 'User' }];
			},
		}),
		updateCurrentUser: builder.mutation<QueryResultUser, UpdateCurrentUser>({
			// prettier-ignore
			queryFn: async ({fullName,password,avatar,}: UpdateCurrentUser): Promise<QueryReturnValue<QueryResultUser, FetchBaseQueryError>> => {
				try {
					let updateData:
						| { data: { fullName: string } }
						| { password: string }
						| object = {};

					if (password) updateData = { password };
					// update the user's metadata
					if (fullName) updateData = { data: { fullName } };

					const { data, error } = await supabase.auth.updateUser(updateData);

					if (error) throw new Error(error.message);
					// if there is not image file
					if (!avatar) return { data };

					const fileName = `avatar-${data.user.id}-${Math.random()}`;

					const { error: storageError } = await supabase.storage
						.from('avatars')
						.upload(fileName, avatar);

					if (storageError) throw Error(storageError.message);

					const { data: updateUser, error: errorLoadingAvatar } =
						await supabase.auth.updateUser({
							data: {
								avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
							},
						});

					if (errorLoadingAvatar) throw Error(errorLoadingAvatar.message);

					return { data: updateUser };
				} catch (error) {
					return { error: error as FetchBaseQueryError };
				}
			},
			invalidatesTags: (_, error) => {
				if (error) return [];

				return [{ type: 'User' }];
			},
		}),
	}),
});

export const {
	useGetCurrentUserQuery,
	useLoginMutation,
	useSignUpMutation,
	useUpdateCurrentUserMutation,
	useLogOutMutation,
} = apiAuth;
