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
import { useDispatch } from 'react-redux';
import { updateCurrentUser as updateCurrentUserFromStore } from './authSlice';
import MiniSpinner from '@/ui/MiniSpinner';
import { useUpdateCurrentUserMutation } from '@/services/apiAuth';
import { UpdatePassword, UserApiResponse } from '@/types';

import toast from 'react-hot-toast';

const formSchema = z
	.object({
		newPassword: z.string().min(6, {
			message: 'New password must be at least 6 characters long',
		}),
		confirmPassword: z.string().min(6, {
			message: 'Confirm password must be at least 6 characters long',
		}),
	})
	.refine(values => values.newPassword === values.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

const UpdatePasswordForm = () => {
	const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();
	const dispatch = useDispatch();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (values: UpdatePassword) => {
		try {
			const { confirmPassword } = values;
			// rtk query
			const result: UserApiResponse = await updateCurrentUser({
				password: confirmPassword,
			});

			if (result.data) {
				// feedback
				toast.success('User successfully updated');
				// dispatch to my redux store
				// update store
				dispatch(updateCurrentUserFromStore(result.data));
			}

			if (result.error) {
				toast.error(result.error.toString());
			}
		} catch (error) {
			console.log((error as Error).message);
			toast.error('Something went wrong!');
		} finally {
			// reset form
			form.reset();
		}
	};

	const handleCancel = () => {
		form.reset();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4'>
				<FormField
					control={form.control}
					name='newPassword'
					render={({ field }) => (
						<FormItem className='flex items-center flex-col sm:flex-row  justify-start max-w-[500px]'>
							<FormLabel className='w-full sm:w-[200px]'>
								New Password
							</FormLabel>
							<div className='flex flex-col  w-full flex-1 gap-2'>
								<FormControl>
									<Input
										type='password'
										placeholder='Minimum 6 characters'
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem className='flex items-center flex-col sm:flex-row  justify-start max-w-[500px]'>
							<FormLabel className='w-full sm:w-[200px]'>
								Confirm Password
							</FormLabel>
							<div className='flex flex-col  w-full flex-1 gap-2'>
								<FormControl>
									<Input
										type='password'
										placeholder='Confirm your password'
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<div className='flex space-x-2 self-end'>
					<Button className='w-full' type='submit' disabled={isLoading}>
						{isLoading ? <MiniSpinner /> : 'Update'}
					</Button>
					<Button
						variant='outline'
						className='w-full'
						type='reset'
						onClick={handleCancel}
						disabled={isLoading}>
						{isLoading ? <MiniSpinner /> : 'Cancel'}
					</Button>
				</div>
			</form>
		</Form>
	);
};
export default UpdatePasswordForm;
