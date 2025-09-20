import React, { useState } from 'react';

interface ExpenseFormData {
  description: string;
  amount: string;
  category: string;
  date: string;
}

interface ExpenseFormProps {
  onSubmit: (expenseData: {
    description: string;
    amount: number;
    category: string;
    date: string;
  }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<{ [K in keyof ExpenseFormData]?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!formData.description.trim()) next.description = 'Description is required.';
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0)
      next.amount = 'Enter a valid amount.';
    if (!formData.date) next.date = 'Date is required.';
    if (!formData.category) next.category = 'Category is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      description: formData.description.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
    });

    // reset
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  const inputBase =
    'w-full px-3 py-2.5 border rounded-md text-sm bg-white text-gray-700 transition-colors duration-200 ' +
    'hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-5">Add Expense</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g., Lunch at cafe"
            value={formData.description}
            onChange={handleChange}
            className={`${inputBase} ${errors.description ? 'border-red-500 ring-2 ring-red-500/10' : 'border-gray-300'}`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            className={`${inputBase} ${errors.amount ? 'border-red-500 ring-2 ring-red-500/10' : 'border-gray-300'}`}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${inputBase} cursor-pointer ${errors.category ? 'border-red-500 ring-2 ring-red-500/10' : 'border-gray-300'}`}
          >
            <option>Food</option>
            <option>Transportation</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={`${inputBase} ${errors.date ? 'border-red-500 ring-2 ring-red-500/10' : 'border-gray-300'}`}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="inline-flex items-center justify-center min-w-20 px-4 py-2.5 rounded-md text-sm font-medium
                     border bg-blue-500 text-white border-blue-500
                     hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Expense
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData({
              description: '',
              amount: '',
              category: 'Food',
              date: new Date().toISOString().split('T')[0],
            });
            setErrors({});
          }}
          className="inline-flex items-center justify-center min-w-20 px-4 py-2.5 rounded-md text-sm font-medium
                     border bg-white text-gray-700 border-gray-300
                     hover:bg-gray-50 hover:border-gray-400
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
