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
import { useDispatch, useSelector } from 'react-redux';
import {
	selectCurrentUser,
	updateCurrentUser as updateCurrentUserFromStore,
} from './authSlice';
import MiniSpinner from '@/ui/MiniSpinner';
import { useUpdateCurrentUserMutation } from '@/services/apiAuth';
import { UpdateCurrentUser, UpdateUserApiResponse } from '@/types';
import toast from 'react-hot-toast';
import { useEffect, useMemo } from 'react';

const formSchema = z.object({
	email: z.string().min(2, {
		message: 'Insert a valid email',
	}),
	fullName: z.string().min(2, {
		message: 'Insert a valid full name',
	}),
	avatar: z.instanceof(File).optional(),
});


const UpdateUserDataForm = () => {
	const user = useSelector(selectCurrentUser);
	const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();
	const dispatch = useDispatch();

	const { email, user_metadata } = user!;

	// at the beginning could be undefined
	const currentFullName = user_metadata?.fullName;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: useMemo(() => {
			return {
				email: email,
				fullName: currentFullName || '',
			};
		}, [currentFullName, email]),
	});

	useEffect(() => {
		form.reset({
			email: email,
			fullName: currentFullName || '',
		});
	}, [form, currentFullName, email]);

	const onSubmit = async (values: UpdateCurrentUser) => {
		try {
			// rtk query
			const result: UpdateUserApiResponse = await updateCurrentUser(values);

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
			// feedback
			toast.error('Something went wrong!');
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
					name='email'
					render={({ field }) => (
						<FormItem className='flex items-center flex-col sm:flex-row justify-start max-w-[500px]'>
							<FormLabel className='w-full sm:w-[200px]'>Email</FormLabel>
							<div className='flex flex-col w-full flex-1 gap-2'>
								<FormControl>
									<Input
										type='text'
										placeholder='Your email...'
										{...field}
										disabled={true}
									/>
								</FormControl>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='fullName'
					render={({ field }) => (
						<FormItem className='flex items-center flex-col sm:flex-row justify-start max-w-[500px]'>
							<FormLabel className='w-full sm:w-[200px]'>Full name</FormLabel>
							<div className='flex flex-col w-full flex-1 gap-2'>
								<FormControl>
									<Input
										type='text'
										placeholder='Your full name'
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
					name='avatar'
					render={({ field }) => (
						<FormItem className='flex items-center  flex-col sm:flex-row max-w-[500px]'>
							<FormLabel className='w-full sm:w-[200px]'>Avatar</FormLabel>
							<div className='flex flex-col w-full flex-1 gap-2'>
								<FormControl>
									<Input
										type='file'
										accept='image/*'
										onChange={e => {
											field.onChange(e.target.files![0]);
										}}
										disabled={isLoading}
										className='bg-primary'
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
export default UpdateUserDataForm;
