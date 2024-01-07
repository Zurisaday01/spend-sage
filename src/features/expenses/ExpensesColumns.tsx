import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	DotsVerticalIcon,
	Pencil2Icon,
	TrashIcon,
	DoubleArrowDownIcon,
} from '@radix-ui/react-icons';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/types';
import DeleteExpenseBtn from './DeleteExpenseBtn';
import UpdateExpenseForm from './UpdateExpenseForm';
import { formatAmount } from '@/utils';

export const expensesColumns: ColumnDef<Transaction>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) => <div>{row.getValue('date')}</div>,
	},
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => <div>{row.getValue('title')}</div>,
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row, table }) => {
			const { isFullDescription, setIsFullDescription } =
				table.options?.meta ?? {};

			return (
				<div className='flex items-start gap-2'>
					<button onClick={() => setIsFullDescription?.(row.id)}>
						<DoubleArrowDownIcon />
					</button>
					<div>
						{isFullDescription === row.id ? (
							<p className='max-w-[150px]'>{row.getValue('description')}</p>
						) : (
							<p>
								{`${
									row.getValue('description') &&
									(row.getValue('description') as string).substring(0, 20)
								}...`}
							</p>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'category_id',
		header: 'Category',
		cell: ({ row }) => {
			const category = row.getValue('category_id') as { name?: string };

			return <div className='capitalize'>{category?.name}</div>;
		},
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => (
			<div className='text-red-700'>{`${formatAmount.format(
				row.getValue('amount') as number
			)}`}</div>
		),
	},
	{
		// Need to pass the state and setter to my column
		// Pass the state to the table
		// Column access the state
		// use the meta option in the creating of the table
		// meta is a way of providing context in the table
		id: 'actions',
		enableHiding: false,
		cell: ({ table, row }) => {
			const {
				isEditDialogOpen,
				isDeleteDialogOpen,
				setIsEditDialogOpen,
				setIsDeleteDialogOpen,
			} = table.options?.meta ?? {};

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-[20px] p-0'>
								<span className='sr-only'>Open menu</span>
								<DotsVerticalIcon className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem
								onClick={() => setIsEditDialogOpen?.(row.original.id)}>
								<Button variant='ghost' className='flex items-center gap-1'>
									<Pencil2Icon />
									Update Expense
								</Button>
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => setIsDeleteDialogOpen?.(row.original.id)}>
								<Button variant='ghost' className='flex items-center gap-1'>
									<TrashIcon />
									Delete Expense
								</Button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Dialog
						open={isEditDialogOpen === row.original.id}
						onOpenChange={() => setIsEditDialogOpen?.('')}>
						<DialogContent className=''>
							<DialogHeader>
								<DialogTitle className='heading text-2xl'>
									Update Expense
								</DialogTitle>
							</DialogHeader>
							<div>
								<UpdateExpenseForm
									expenseId={+row.original.id}
									date={row.original.date}
									title={row.original.title}
									description={row.original.description}
									categoryName={row.original.category_id?.name}
									amount={row.original.amount.toString()}
								/>
							</div>
						</DialogContent>
					</Dialog>
					<Dialog
						open={isDeleteDialogOpen === row.original.id}
						onOpenChange={() => setIsDeleteDialogOpen?.('')}>
						<DialogContent className=''>
							<DialogHeader>
								<DialogTitle className='heading text-2xl'>
									Are you sure absolutely sure?
								</DialogTitle>
								<DialogDescription>
									This action cannot be undone. This will permanently delete
									this expense.
								</DialogDescription>
							</DialogHeader>
							<DeleteExpenseBtn expenseId={row.original.id} />
						</DialogContent>
					</Dialog>
				</>
			);
		},
	},
];

/*<div>{ <UpdateFormat formatId={format.id} /> </div>*/
