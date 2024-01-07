import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

// Auth
export interface Login {
	email: string;
	password: string;
}

export interface SignUp {
	fullName: string;
	email: string;
	password: string;
}

export interface UpdateCurrentUser {
	email?: string;
	fullName?: string;
	password?: string;
	avatar?: File | undefined;
}

export interface UpdatePassword {
	newPassword: string;
	confirmPassword: string;
}

// Categories
export interface Category {
	id: string;
	name: string;
	type: string;
	user_id?: { id?: string };
}

export interface Categories {
	categories: Category[];
}

// transactions (expense | income)
export interface Transaction {
	id: string;
	date: Date;
	title: string;
	description: string;
	category_id: { id: string; type: string; name: string };
	amount: number;
	user_id: { id: string };
}

export interface Transactions {
	[type: string]: Transaction[];
}

// Api Responses

export interface UserApiResponse {
	data?:
		| {
				user: User;
				session: Session;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| {
				error: unknown;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
	error?: FetchBaseQueryError | SerializedError;
}

export interface UserSignUpApiResponse {
	data?:
		| {
				user: User | null;
				session: Session | null;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| {
				error: unknown;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
	error?: FetchBaseQueryError | SerializedError;
}

export interface UpdateUserApiResponse {
	data?:
		| {
				user: User;

				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| {
				error: unknown;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
	error?: FetchBaseQueryError | SerializedError;
}

export interface CreateCategoryApiResponse {
	data?:
		| {
				category: {
					name: string;
					type: string;
					// eslint-disable-next-line no-mixed-spaces-and-tabs
				}[];
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| {
				error: unknown;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
	error?: FetchBaseQueryError | SerializedError;
}

export interface DeleteApiResponse {
	data?:
		| {
				success: boolean;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| undefined;

	error?: FetchBaseQueryError | SerializedError;
}

export interface UpdateCategoryApiResponse {
	data?:
		| {
				category: {
					name: string;
					type: string;
					// eslint-disable-next-line no-mixed-spaces-and-tabs
				}[];
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| {
				error: unknown;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
	error?: FetchBaseQueryError | SerializedError;
}

export interface CreateExpenseApiResponse {
	data?:
		| {
				transaction: {
					title: string;
					category_id: {
						type: string;
					}[];
					// eslint-disable-next-line no-mixed-spaces-and-tabs
				}[];
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| {
				error: unknown;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
	error?: FetchBaseQueryError | SerializedError;
}

export interface UpdateTransactionApiResponse {
	data?:
		| {
				transaction: {
					title: string;
					category_id: {
						type: string;
					}[];
					// eslint-disable-next-line no-mixed-spaces-and-tabs
				}[];
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| {
				error: unknown;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
	error?: FetchBaseQueryError | SerializedError;
}
