import * as React from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
	ColumnDef,
	ColumnFiltersState,
	RowData,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { categoriesColumns } from './CategoriesColumns';
import { useGetCategoriesQuery } from '@/services/apiCategories';
import Spinner from '@/ui/Spinner';
import { useSearchParams } from 'react-router-dom';
import { Category } from '@/types';
import Pagination from '@/ui/Pagination';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

declare module '@tanstack/table-core' {
	interface TableMeta<TData extends RowData> {
		isEditDialogOpen?: string;
		isDeleteDialogOpen?: string;
		setIsEditDialogOpen?: (value: string) => void;
		setIsDeleteDialogOpen?: (value: string) => void;

		data?: TData[];
	}
}

const CategoriesTable = () => {
	// get user to get user id
	const user = useSelector(selectCurrentUser);
	const [searchParams] = useSearchParams();

	const pageNum = searchParams.get('page') ?? 1;
	const queryName = searchParams.get('q') ?? '';

	const { data, isLoading, isFetching } = useGetCategoriesQuery({
		page: +pageNum,
		queryName,
		userId: user?.id,
	});

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	// open different dialogs
	const [isEditDialogOpen, setIsEditDialogOpen] = React.useState('');
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState('');

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const columns = React.useMemo<ColumnDef<Category>[]>(
		() => categoriesColumns,
		[]
	);

	// I am getting a type error between the accessor and data columns
	const table = useReactTable({
		data: data?.categories ?? [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		meta: {
			isEditDialogOpen,
			isDeleteDialogOpen,
			setIsEditDialogOpen,
			setIsDeleteDialogOpen,
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	if (isLoading || isFetching) {
		return <Spinner />;
	}
	return (
		<div className='w-full'>
			<div className='flex items-center py-4'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' className='ml-auto'>
							Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={value => column.toggleVisibility(!!value)}>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className='rounded-md border bg-white'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
														// eslint-disable-next-line no-mixed-spaces-and-tabs
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<Pagination count={data?.count} />
		</div>
	);
};

export default CategoriesTable;
