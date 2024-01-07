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
} from '@radix-ui/react-icons';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@/types';
import DeleteCategoryBtn from './DeleteCategoryBtn';
import UpdateCategoryForm from './UpdateCategoryForm';

export const categoriesColumns: ColumnDef<Category>[] = [
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
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <div>{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => <div className='capitalize'>{row.getValue('type')}</div>,
	},
	{
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
									Update Category
								</Button>
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => setIsDeleteDialogOpen?.(row.original.id)}>
								<Button variant='ghost' className='flex items-center gap-1'>
									<TrashIcon />
									Delete Category
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
									Update Category
								</DialogTitle>
							</DialogHeader>
							<UpdateCategoryForm categoryId={+row.original.id} name={row.original.name} type={row.original.type} />
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
									This action cannot be undone. This will permanently delete the{' '}
									{row.original.name.toLowerCase()} category.
								</DialogDescription>
							</DialogHeader>
							<DeleteCategoryBtn categoryId={row.original.id} />
						</DialogContent>
					</Dialog>
				</>
			);
		},
	},
];
