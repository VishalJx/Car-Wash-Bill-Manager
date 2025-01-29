import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartPage = () => {
  const { bills } = useSelector(state => state.bills);

  const chartData = useMemo(() => {
    const monthlyData = bills.reduce((acc, bill) => {
      const date = new Date(bill.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = { month: monthYear, total: 0 };
      }
      acc[monthYear].total += bill.amount;
      return acc;
    }, {});

    return Object.values(monthlyData).sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });
  }, [bills]);

  const totalAmount = useMemo(() => {
    return bills.reduce((sum, bill) => sum + bill.amount, 0);
  }, [bills]);

  const monthlyAverage = totalAmount / chartData.length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Monthly Average</h3>
          <p className="text-3xl font-bold">${monthlyAverage.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-6">Monthly Expenses Trend</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={value => `$${value}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={value => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Highest Expense */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Highest Monthly Expense</h3>
          <p className="text-3xl font-bold">
            ${Math.max(...chartData.map(item => item.total)).toFixed(2)}
          </p>
        </div>
        {/* Lowest Expense */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Lowest Monthly Expense</h3>
          <p className="text-3xl font-bold">
            ${Math.min(...chartData.map(item => item.total)).toFixed(2)}
          </p>
        </div>
        {/* Total Months */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Total Months</h3>
          <p className="text-3xl font-bold">{chartData.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;