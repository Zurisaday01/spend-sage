import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

const HeaderFuntionality = ({
	heading,
	buttonText,
	formElement,
}: {
	heading: string;
	buttonText: string;
	formElement: ReactNode;
}) => {
	return (
		<header className='flex flex-col  justify-between gap-3 sm:flex-row'>
			<h1 className='text-2xl font-quicksand font-bold'>{heading}</h1>

			<Dialog>
				<DialogTrigger asChild>
					<Button>{buttonText}</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle className='heading text-2xl'>{buttonText}</DialogTitle>
					</DialogHeader>
					{formElement}
				</DialogContent>
			</Dialog>
		</header>
	);
};
export default HeaderFuntionality;
