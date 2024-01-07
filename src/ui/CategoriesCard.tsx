import {
	BarChart,
	Bar,
	Rectangle,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

const CategoriesCard = ({
	data,
	type,
}: {
	data: { name: string; totalAmount: number }[];
	type: string;
}) => {
	return (
		<div className='p-4 w-full h-full'>
			<h3 className='heading text-xl font-bold mb-3 '>
				Amount spent by {type} categories
			</h3>
			<div className=' h-[350px] sm:h-[390px]'>
				<ResponsiveContainer
					width='100%'
					height='100%'
					className='w-full h-full'>
					<BarChart
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 25,
						}}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Bar
							dataKey='totalAmount'
							name='Amount'
							unit='$'
							fill={`${type === 'expenses' ? '#B91C1B' : '#16803C'}`}
							activeBar={<Rectangle fill='#FAC858' />}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default CategoriesCard;
