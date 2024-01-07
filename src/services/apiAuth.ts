import supabase, { supabaseUrl } from '@/services/supabase';
import { Login, SignUp, UpdateCurrentUser } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import { baseApi } from './baseApi';

// from the api slice with normal redux

export const apiAuth = baseApi.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<
			{ user: User; session: Session } | { error: unknown },
			Login
		>({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({ email, password }: Login) => {
				try {
					const { data, error } = await supabase.auth.signInWithPassword({
						email,
						password,
					});

					if (error) throw new Error(error.message);

					return { data };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
		}),

		signUp: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({ fullName, email, password }: SignUp) => {
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
					return { error: (error as Error).message };
				}
			},
		}),

		logOut: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async () => {
				try {
					const { error } = await supabase.auth.signOut();

					if (error) throw new Error(error.message);

					return { data: { success: true } };
				} catch (error) {
					return { error: (error as Error).message };
				}
			},
		}),
		updateCurrentUser: builder.mutation({
			// @ts-expect-error data incompatible coming from supabase
			queryFn: async ({ fullName, password, avatar }: UpdateCurrentUser) => {
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
					return { error: (error as Error).message };
				}
			},
		}),
	}),
});

export const {
	useLoginMutation,
	useSignUpMutation,
	useUpdateCurrentUserMutation,
	useLogOutMutation,
} = apiAuth;
