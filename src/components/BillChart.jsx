import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const BillChart = () => {
  const { bills } = useSelector(state => state.bills);

  const processedData = bills.reduce((acc, bill) => {
    const date = new Date(bill.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, total: 0 };
    }
    acc[monthYear].total += bill.amount;
    return acc;
  }, {});

  const chartData = Object.values(processedData).sort((a, b) => {
    const [aMonth, aYear] = a.month.split('/');
    const [bMonth, bYear] = b.month.split('/');
    return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
  });

  return (
    <div className="w-full h-[400px] bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl mb-4">Monthly Billing Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
          />
          <YAxis 
            stroke="#9CA3AF"
            tickFormatter={value => `Rs.${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            formatter={value => [`Rs.${value}`, 'Total Amount']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#3B82F6" 
            name="Monthly Total"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BillChart;