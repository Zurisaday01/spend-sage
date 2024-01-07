import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoriesCard from './CategoriesCard';

const CategoriesTabs = ({
	className,
	expenses,
	incomes,
}: {
	className: string;
	expenses: { name: string; totalAmount: number }[];
	incomes: { name: string; totalAmount: number }[];
}) => {
	return (
		<div className={`bg-white rounded-md relative  ${className}`}>
			<Tabs defaultValue='expenses' className=' h-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='expenses'>Expenses</TabsTrigger>
					<TabsTrigger value='incomes'>Incomes</TabsTrigger>
				</TabsList>
				<TabsContent value='expenses' className='w-full h-full'>
					<CategoriesCard data={expenses} type='expenses' />
				</TabsContent>
				<TabsContent value='incomes' className='w-full h-full'>
					<CategoriesCard data={incomes} type='incomes' />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default CategoriesTabs;
