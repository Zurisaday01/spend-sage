import CategoriesTable from '@/features/categories/CategoriesTable';
import CreateCategoryForm from '@/features/categories/CreateCategoryForm';
import HeaderFuntionality from '@/ui/HeaderFuntionality';
import SearchBar from '@/ui/SearchBar';

const Categories = () => {
	return (
		<section className='flex flex-col gap-4'>
			<HeaderFuntionality
				heading='Categories'
				buttonText='Add New Category'
				formElement={<CreateCategoryForm />}
			/>
			<SearchBar by='name' />
			<CategoriesTable />
		</section>
	);
};
export default Categories;
