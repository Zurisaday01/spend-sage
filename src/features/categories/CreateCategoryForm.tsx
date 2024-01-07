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
import { useCreateCategoryMutation } from '@/services/apiCategories';
import toast from 'react-hot-toast';
import { CreateCategoryApiResponse } from '@/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import MiniSpinner from '@/ui/MiniSpinner';

const formSchema = z.object({
	name: z.string().min(3, {
		message: 'Name must be at least 3 characters.',
	}),
	type: z.string().min(1, {
		message: 'Type must be selected.',
	}),
});

const CreateCategoryForm = () => {
	const [createCategory, { isLoading }] = useCreateCategoryMutation();
	const user = useSelector(selectCurrentUser);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			type: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const result: CreateCategoryApiResponse = await createCategory({
				user_id: user!.id,
				...values,
			});

			if (result.data && 'category' in result.data) {
				const { name, type } = result.data.category[0];
				// feedback
				toast.success(
					`🚀 "${name}" added successfully as an ${type} category!`
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

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder='Name your new category'
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
					name='type'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									disabled={isLoading || form.formState.isSubmitting}>
									<SelectTrigger>
										<SelectValue placeholder='Select a type' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value='expense'>Expense</SelectItem>
											<SelectItem value='income'>Income</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
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
export default CreateCategoryForm;
