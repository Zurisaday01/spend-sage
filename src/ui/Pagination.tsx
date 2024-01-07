import { Button } from '@/components/ui/button';
import { PAGE_SIZE } from '@/utils';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ count }: { count: number | undefined | null }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	//  get the current page
	const currentPage = !searchParams.get('page')
		? 1
		: Number(searchParams.get('page'));

	const pageCount = Math.ceil((count ?? 0) / PAGE_SIZE);

	function nextPage() {
		// If you are in the last page then stay where you are otherwise advance one page

		const next = currentPage === pageCount ? currentPage : currentPage + 1;

		searchParams.set('page', next.toString());
		setSearchParams(searchParams);
	}

	function prevPage() {
		const prev = currentPage === 1 ? currentPage : currentPage - 1;
		searchParams.set('page', prev.toString());
		setSearchParams(searchParams);
	}

	if (pageCount <= 1) return null;
	return (
		<div className='flex items-center justify-end space-x-2 py-4'>
			<div className='flex-1 text-sm text-muted-foreground'>
				Showing <span>{(currentPage - 1) * (PAGE_SIZE + 1)}</span> to{' '}
				<span>{currentPage * PAGE_SIZE}</span> of <span>{count}</span> results
			</div>
			<div className='space-x-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={prevPage}
					disabled={currentPage === 1}>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={nextPage}
					disabled={currentPage === pageCount}>
					Next
				</Button>
			</div>
		</div>
	);
};
export default Pagination;
