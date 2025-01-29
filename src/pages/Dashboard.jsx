import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteBill, setFilterCategory } from '../redux/slices/billsSlice';
import BillForm from '../components/BillForm';

const OptimizationResults = ({ selectedBills, totalSelected, budget, onClose, allBills  }) => {
  const remainingBudget = budget - totalSelected;
  const percentageUsed = (totalSelected / budget) * 100;
  const selectedBillsDetails = allBills.filter(bill => selectedBills.includes(bill.id));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold">Optimization Results</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Budget Utilization</span>
            <span className="text-sm font-medium">{percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Selected Bills</p>
            <p className="text-2xl font-bold">{selectedBills.length}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Remaining Budget</p>
            <p className="text-2xl font-bold text-green-500">
              ${remainingBudget.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span>Monthly Budget</span>
            <span className="font-medium">Rs.{budget.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Selected</span>
            <span className="font-medium">Rs.{totalSelected.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-600 mt-2 pt-2">
            <div className="flex justify-between">
              <span>Remaining</span>
              <span className="font-medium text-green-500">
                ${remainingBudget.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Bills Table */}
        <div className="bg-gray-700 rounded-lg overflow-hidden mb-6">
          <h4 className="text-lg font-medium p-4 bg-gray-600">Selected Bills</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedBillsDetails.map(bill => (
                  <tr key={bill.id} className="border-b border-gray-600">
                    <td className="p-4">{bill.name}</td>
                    <td className="p-4">Rs{bill.amount.toFixed(2)}</td>
                    <td className="p-4">{bill.category}</td>
                    <td className="p-4">{new Date(bill.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center">
          {remainingBudget >= 0 
            ? `Optimized selection fits within your budget with Rs.${remainingBudget.toFixed(2)} remaining.`
            : 'Warning: Current selection exceeds your budget.'}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { bills, filterCategory } = useSelector(state => state.bills);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBillData, setEditBillData] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [optimizedBills, setOptimizedBills] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);

  const currentMonthBills = useMemo(() => {
    const now = new Date();
    return bills.filter(bill => {
      const billDate = new Date(bill.date);
      return billDate.getMonth() === now.getMonth() && 
             billDate.getFullYear() === now.getFullYear();
    });
  }, [bills]);

  const filteredBills = useMemo(() => {
    return filterCategory === 'All' 
      ? currentMonthBills 
      : currentMonthBills.filter(bill => bill.category === filterCategory);
  }, [currentMonthBills, filterCategory]);

  const totalAmount = useMemo(() => {
    return currentMonthBills.reduce((sum, bill) => sum + bill.amount, 0);
  }, [currentMonthBills]);

  const optimizeBills = (budget) => {
    if (!budget || budget <= 0) return;

    const parsedBudget = parseFloat(budget);
    
    const sortedBills = [...currentMonthBills]
      .sort((a, b) => a.amount - b.amount);

    let selectedBills = [];
    let totalSelected = 0;
    let maxBills = 0;

    for (let i = 0; i < sortedBills.length; i++) {
      let currentTotal = 0;
      let currentBills = [];

      for (let j = i; j < sortedBills.length; j++) {
        if (currentTotal + sortedBills[j].amount <= parsedBudget) {
          currentTotal += sortedBills[j].amount;
          currentBills.push(sortedBills[j].id);
        }
      }

      if (currentBills.length > maxBills) {
        maxBills = currentBills.length;
        selectedBills = currentBills;
        totalSelected = currentTotal;
      }
    }

    setOptimizedBills(selectedBills);
    return { count: selectedBills.length, total: totalSelected };
  };

  const handleOptimize = (e) => {
    e.preventDefault();
    const result = optimizeBills(monthlyBudget);
    
    if (result) {
      setOptimizationResults(result);
      setShowResults(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Monthly Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 mb-1">Total Monthly Bills</p>
            <p className="text-2xl font-bold">Rs{totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Number of Bills</p>
            <p className="text-2xl font-bold">{currentMonthBills.length}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          Add New Bill
        </button>

        <form onSubmit={handleOptimize} className="flex-1 flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="Enter monthly budget"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            Optimize Bills
          </button>
        </form>

        <select
          value={filterCategory}
          onChange={(e) => dispatch(setFilterCategory(e.target.value))}
          className="px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          <option value="Utilities">Utilities</option>
          <option value="Supplies">Supplies</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Equipment">Equipment</option>
          <option value="Marketing">Marketing</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No bills found for the current month.
                </td>
              </tr>
            ) : (
              filteredBills.map(bill => (
                <tr 
                  key={bill.id} 
                  className={`border-t border-gray-700 ${
                    optimizedBills.includes(bill.id) 
                      ? 'bg-green-900 bg-opacity-20' 
                      : ''
                  }`}
                >
                  <td className="p-4">{bill.name}</td>
                  <td className="p-4">Rs.{bill.amount.toFixed(2)}</td>
                  <td className="p-4">{bill.category}</td>
                  <td className="p-4">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditBillData(bill);
                          setModalOpen(true);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => dispatch(deleteBill(bill.id))}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <BillForm 
          closeModal={() => {
            setModalOpen(false);
            setEditBillData(null);
          }} 
          editBill={editBillData}
        />
      )}

      {showResults && optimizationResults && (
        <OptimizationResults
          selectedBills={optimizedBills}
          totalSelected={optimizationResults.total}
          budget={parseFloat(monthlyBudget)}
          onClose={() => setShowResults(false)}
          allBills={currentMonthBills}  // Add this prop
        />
    )}
    </div>
  );
};

export default Dashboard;
