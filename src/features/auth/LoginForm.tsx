import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MiniSpinner from '@/ui/MiniSpinner';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// redux and RTK query
import { setCredentials } from './authSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/services/apiAuth';
import { UserApiResponse } from '@/types';

const formSchema = z.object({
	email: z.string().min(2, {
		message: 'Insert a valid email',
	}),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters.',
	}),
});

const LoginForm = () => {
	const navigate = useNavigate();

	// redux and RTK query
	const dispatch = useDispatch();
	const [login, { isLoading, isSuccess }] = useLoginMutation();
	// const { data: user, isLoading: isLoadingUser } = useGetCurrentUserQuery({});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		if (isSuccess) navigate('/');
	}, [isSuccess, navigate]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			// using login mutation
			const result: UserApiResponse = await login(values);

			if (result.data) {
				if ('user' in result.data && 'session' in result.data) {
					const { session, user } = result.data;

					const credentials = { user, token: session.access_token };

					// feedback
					toast.success('Welcome again!!');
					// dispatch to my redux store
					dispatch(setCredentials(credentials));
				} else {
					console.error('Unexpected response structure:', result.data);
				}
			}

			if (result.error) {
				toast.error(result.error.toString());
			}

			//reset form
			form.reset();
		} catch (error) {
			console.error('Login:', error);
			toast.error('Something went wrong!');

			// reset form
			form.reset();
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder='example@hotmail.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<Button className='w-full' type='submit' disabled={isLoading}>
						{isLoading ? <MiniSpinner /> : 'Log In'}
					</Button>
				</div>
			</form>
			<p className='mt-3'>
				Don't have an account yet?{' '}
				<Link
					to='/signup'
					className='pointer text-secondary font-bold transition duration-150 hover:text-primary'>
					Sign up now!
				</Link>
			</p>
		</Form>
	);
};
export default LoginForm;
