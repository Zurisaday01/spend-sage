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
import { UserApiResponse } from '@/types';
import { useSignUpMutation } from '@/services/apiAuth';

const formSchema = z.object({
	fullName: z.string().min(2, {
		message: 'Full name must be at least 4 characters',
	}),
	email: z.string().min(2, {
		message: 'Insert a valid email',
	}),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters.',
	}),
});

const SignUpForm = () => {
	const navigate = useNavigate();

	// redux and RTK query
	const dispatch = useDispatch();
	const [signUp, { isLoading, isSuccess }] = useSignUpMutation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: '',
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
			const result: UserApiResponse = await signUp(values);

			console.log(result);

			if (result.data) {
				if ('user' in result.data && 'session' in result.data) {
					const { session, user } = result.data;

					if (session && user) {
						const credentials = { user, token: session.access_token };
						// feedback
						toast.success('Welcome to SpendSage!!');
						// dispatch to my redux store

						dispatch(setCredentials(credentials));
					} else {
						// feedback
						toast.success('Something went wrong!');
					}
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
					name='fullName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input
									placeholder='Your Full Name'
									autoComplete='off'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder='example@hotmail.com'
									autoComplete='off'
									{...field}
								/>
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
						{isLoading ? <MiniSpinner /> : 'Sign Up'}
					</Button>
				</div>
			</form>
			<p className='mt-3'>
				Already have an account?{' '}
				<Link
					to='/login'
					className='pointer text-secondary font-bold transition duration-150 hover:text-primary'>
					Log in
				</Link>
			</p>
		</Form>
	);
};
export default SignUpForm;
