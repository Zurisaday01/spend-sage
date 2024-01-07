import { formatAmount } from '@/utils/utils';

const TransactionCard = ({
	type,
	className,
	amount,
}: {
	type: string;
	className: string;
	amount: number;
}) => {
	return (
		<div
			className={`bg-white rounded-md relative overflow-hidden p-4 ${className}`}>
			<h3 className='heading text-xl sm:mb-3'>Total {type}</h3>
			<span
				className={`text-3xl ${
					type === 'expenses' ? 'text-red-700' : 'text-green-700'
				}`}>
				{formatAmount.format(amount)}
			</span>

			<div className='w-full absolute left-[10px] bottom-[-10px]'>
				{type === 'expenses' ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 142 65'
						fill='none'
						className='w-full h-full'>
						<path
							d='M22.4235 46.063C20.4875 46.7664 12.3566 52.6047 5 64H141V1C118.5 4 110.292 29.752 104 34.5C97.7082 39.248 91.1495 26.0157 81.9537 23.3779C72.758 20.7402 68.8861 28.126 66.4662 31.8189C64.0463 35.5118 52.4306 61.3622 43.2349 55.0315C35.8783 49.9669 28.7153 43.7769 22.4235 46.063Z'
							fill='#D80C0C'
							fillOpacity='0.4'
						/>
						<path
							d='M1 64.5C8.6 53.7 17 48.1667 19 47.5C25.5 45.3333 32.9 51.2 40.5 56C50 62 62 37.5 64.5 34C67 30.5 71 23.5 80.5 26C90 28.5 97.5 41 104 36.5C110.5 32 120.5 5 141.5 1'
							stroke='#D80C0C'
							strokeOpacity='0.6'
						/>
					</svg>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 142 65'
						fill='none'
						className='w-full h-full'>
						<path
							d='M22.4235 46.063C20.4875 46.7664 12.3566 52.6047 5 64H141V1C118.5 4 110.292 29.752 104 34.5C97.7082 39.248 91.1495 26.0157 81.9537 23.3779C72.758 20.7402 68.8861 28.126 66.4662 31.8189C64.0463 35.5118 52.4306 61.3622 43.2349 55.0315C35.8783 49.9669 28.7153 43.7769 22.4235 46.063Z'
							fill='#15803D'
							fillOpacity='0.4'
						/>
						<path
							d='M1 64.5C8.6 53.7 17 48.1667 19 47.5C25.5 45.3333 32.9 51.2 40.5 56C50 62 62 37.5 64.5 34C67 30.5 71 23.5 80.5 26C90 28.5 97.5 41 104 36.5C110.5 32 120.5 5 141.5 1'
							stroke='#15803D'
							fillOpacity='0.6'
						/>
					</svg>
				)}
			</div>
		</div>
	);
};
export default TransactionCard;
