import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBill, editBill } from '../redux/slices/billsSlice';
import { v4 as uuidv4 } from 'uuid';

const BillForm = ({ closeModal, editBill: editBillData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Utilities',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editBillData) {
      const dateStr = new Date(editBillData.date).toISOString().split('T')[0];
      setFormData({
        ...editBillData,
        amount: editBillData.amount.toString(),
        date: dateStr
      });
    }
  }, [editBillData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const billData = {
      ...formData,
      id: editBillData ? editBillData.id : uuidv4(),
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    if (editBillData) {
      dispatch(editBill(billData));
    } else {
      dispatch(addBill(billData));
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editBillData ? 'Edit Bill' : 'Add New Bill'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (Rs)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="Utilities">Utilities</option>
              <option value="Supplies">Supplies</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Equipment">Equipment</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              {editBillData ? 'Save Changes' : 'Add Bill'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;