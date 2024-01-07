import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchBar = ({ by }: { by: string }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

	useEffect(() => {
		const checkEmpty = setTimeout(() => {
			if (!searchQuery) {
				searchParams.delete('q');
				setSearchParams(searchParams);
			}
		}, 500);

		return () => clearTimeout(checkEmpty);
	}, [searchParams, searchQuery, setSearchParams]);

	useEffect(() => {
		if (searchQuery) {
			searchParams.set('q', searchQuery);
			setSearchParams(searchParams);
		}
	}, [searchParams, searchQuery, setSearchParams]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	return (
		<Input
			placeholder={`Filter by ${by}...`}
			value={searchQuery}
			onChange={handleInputChange}
			className='max-w-sm'
		/>
	);
};
export default SearchBar;
