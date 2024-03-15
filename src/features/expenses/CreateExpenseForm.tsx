import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

import { useGetCategoriesQuery } from '@/services/apiCategories';
import toast from 'react-hot-toast';
import { Category, CreateExpenseApiResponse } from '@/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import MiniSpinner from '@/ui/MiniSpinner';
import { useCreateTransactionMutation } from '@/services/apiTransactions';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn, formatDate, normalizedDate } from '@/utils';
import Spinner from '@/ui/Spinner';

const formSchema = z.object({
	date: z.coerce.date(),
	title: z.string().min(3, {
		message: 'Title must be at least 3 characters.',
	}),
	description: z.string().min(5, {
		message: 'Description must be at least 5 characters.',
	}),
	categoryName: z.string().min(2, {
		message: 'Select a category',
	}),
	amount: z
		.string()
		.regex(/^(?!0(?:\.0{1,2})?$)[0-9]+(?:\.[0-9]{1,2})?$/, 'Invalid amount'),
});

const CreateExpenseForm = () => {
	// get current user
	const user = useSelector(selectCurrentUser);
	const [createTransaction, { isLoading }] = useCreateTransactionMutation();
	const { data: categories, isLoading: isLoadingCategories } =
		useGetCategoriesQuery({ type: 'expense', userId: user?.id });

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			title: '',
			description: '',
			categoryName: '',
			amount: '0',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const result: CreateExpenseApiResponse = await createTransaction({
				user_id: user!.id,
				...values,
				amount: `-${values.amount}`,
			});
			// NOTE: the expense's amount needs to be negative in the database

			if (result.data && 'transaction' in result.data) {
				const { title } = result.data.transaction[0];
				// feedback
				toast.success(
					`Expense added: '${title}'. Thanks for recording. Your financial future thanks you! 🚀💸`
				);
			}
			if (result.error) {
				toast.error(result.error.toString());
			}
			//reset form
			form.reset();
		} catch (error) {
			toast.error((error as Error).message);
			console.log((error as Error).message);
		}
	};

	if (isLoading || isLoadingCategories) return <Spinner />;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='date'
					render={({ field }) => (
						<FormItem className='flex flex-col gap-1'>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={'outline'}
											className={cn(
												'w-[240px] justify-start text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}>
											<CalendarIcon className='mr-2 h-4 w-4' />
											{field.value ? (
												formatDate(field.value)
											) : (
												<span>Pick a date</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<Calendar
											mode='single'
											selected={normalizedDate(field.value)}
											onSelect={field.onChange}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder='Where did your money go?'
									{...field}
									disabled={isLoading || form.formState.isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='categoryName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								{categories && (
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={isLoading || form.formState.isSubmitting}>
										<SelectTrigger>
											<SelectValue placeholder='Select a category' />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{categories?.categories?.map((category: Category) => (
													<SelectItem key={category.id} value={category.name}>
														{category.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='amount'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									placeholder='How much did your wallet suffer?'
									type='number'
									step='.01'
									min='0'
									{...field}
									disabled={isLoading || form.formState.isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder='What happened to your cash, and was it worth it?'
									{...field}
									disabled={isLoading || form.formState.isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex gap-2'>
					<Button
						type='submit'
						disabled={isLoading || form.formState.isSubmitting}>
						{isLoading || form.formState.isSubmitting ? (
							<MiniSpinner />
						) : (
							'Create'
						)}
					</Button>

					<Button
						type='reset'
						variant='outline'
						onClick={() => form.reset()}
						disabled={isLoading || form.formState.isSubmitting}>
						{isLoading || form.formState.isSubmitting ? (
							<MiniSpinner />
						) : (
							'Cancel'
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};
export default CreateExpenseForm;
