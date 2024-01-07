import { Button } from '@/components/ui/button';
import { useDeleteTransactionMutation } from '@/services/apiTransactions';
import { DeleteApiResponse } from '@/types';
import MiniSpinner from '@/ui/MiniSpinner';
import toast from 'react-hot-toast';

const DeleteIncomeBtn = ({ incomeId }: { incomeId: string }) => {
	const [deleteTransaction, { isLoading }] = useDeleteTransactionMutation();

	const handleDelete = async () => {
		try {
			const result: DeleteApiResponse = await deleteTransaction({
				id: incomeId,
			});

			if (result.data) {
				// feedback
				toast.success('Income deleted successfully!');
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
export default DeleteIncomeBtn;
