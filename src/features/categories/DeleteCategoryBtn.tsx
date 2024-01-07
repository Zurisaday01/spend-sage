import { Button } from '@/components/ui/button';
import { useDeleteCategoryMutation } from '@/services/apiCategories';
import { DeleteApiResponse } from '@/types';
import MiniSpinner from '@/ui/MiniSpinner';
import toast from 'react-hot-toast';

const DeleteCategoryBtn = ({ categoryId }: { categoryId: string }) => {
	const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

	const handleDelete = async () => {
		try {
			const result: DeleteApiResponse = await deleteCategory({
				id: categoryId,
			});

			if (result.data) {
				// feedback
				toast.success('Category deleted successfully!');
			}

			if (result.error) {
				toast.error(result.error.toString());
			}
		} catch (error) {
			toast.error((error as Error).message);
		}
	};

	return (
		<Button
			className='sm:w-max w-full'
			variant='destructive'
			disabled={isLoading}
			onClick={handleDelete}>
			{isLoading ? <MiniSpinner /> : 'Delete'}
		</Button>
	);
};
export default DeleteCategoryBtn;
