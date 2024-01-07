import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { User } from '@supabase/supabase-js';

const initialState: {
	user: null | User;
	token: null | string;
} = {
	user: null,
	token: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (
			state,
			{ payload: { user, token } }: PayloadAction<{ user: User; token: string }>
		) => {
			state.user = user;
			state.token = token;
		},
		updateCurrentUser: (state, { payload: { user } }) => {
			state.user = user;
		},
		logOut: state => {
			state.user = null;
			state.token = null;
		},
	},
});

export const { setCredentials, updateCurrentUser, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
