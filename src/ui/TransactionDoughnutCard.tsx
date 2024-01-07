import { capitalizeFirstLetter } from '@/utils';
import ReactEcharts from 'echarts-for-react';

const TransactionDoughnutCard = ({
	type,
	className,
	data,
}: {
	type: string;
	className: string;
	data: { value: number; name: string }[];
}) => {
	const option = {
		// width: '100%',
		// height: '100%',
		title: {
			text: `${capitalizeFirstLetter(type)}s count by category`,
			left: 'start',
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			orient: 'horizontal',
			right: 'center',
			bottom: 0,
			type: 'scroll',
			width: '100%',
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				left: 'start',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2,
				},
				center: ['50%', '50%'],
				label: {
					show: false,
					position: 'center',
				},
				emphasis: {
					label: {
						show: false,
					},
				},
				labelLine: {
					show: true,
				},
				data,
			},
		],
	};

	return (
		<div className={`bg-white rounded-md relative ${className}`}>
			<div className='h-full p-3'>
				<ReactEcharts
					option={option}
					style={{ width: '100%', height: '100%' }}
				/>
			</div>
		</div>
	);
};
export default TransactionDoughnutCard;
