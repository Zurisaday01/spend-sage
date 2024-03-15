import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
	return (
		<main className='min-h-[100vh] flex justify-center items-center rounded-md'>
			<div className='bg-white p-4 text-center flex flex-col space-y-3'>
				<h1 className='text-center heading text-2xl'>
					Oops! It looks like the page you're trying to access doesn't exist
				</h1>
				<div className='flex flex-col justify-center items-center gap-3'>
					Return to the dashboard and navigate to the desired page using the
					menu
					<Button asChild>
						<Link to='/dashboard'>Go to Dashboard</Link>
					</Button>
				</div>
			</div>
		</main>
	);
};
export default PageNotFound;
