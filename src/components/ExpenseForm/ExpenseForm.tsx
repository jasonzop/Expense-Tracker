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
    receiptUrl?: string; // NEW
  }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  // NEW: receipt + uploading state
  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // NEW: extend errors to include receipt
  const [errors, setErrors] = useState<
    { [K in keyof ExpenseFormData]?: string } & { receipt?: string }
  >({});

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

  // NEW: file input change handler (type + size checks)
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) { setReceipt(null); setErrors(prev => ({ ...prev, receipt: undefined })); return; }
    if (!f.type.startsWith('image/')) {
      setReceipt(null);
      setErrors(prev => ({ ...prev, receipt: 'Please select an image file (PNG/JPG/GIF).' }));
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setReceipt(null);
      setErrors(prev => ({ ...prev, receipt: 'File must be smaller than 5MB.' }));
      return;
    }
    setReceipt(f);
    setErrors(prev => ({ ...prev, receipt: undefined }));
  };

  // CHANGED: make submit async, upload receipt first
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);
    let receiptUrl: string | undefined;

    try {
      // Upload to our Express API if a file is chosen
      if (receipt) {
        const fd = new FormData();
        fd.append('receipt', receipt);
        const res = await fetch('/api/upload-receipt', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data?.url) {
          throw new Error(data?.error || 'Failed to upload receipt');
        }
        receiptUrl = data.url; // S3 (LocalStack) URL
      }

      onSubmit({
        description: formData.description.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        receiptUrl, // NEW
      });

      // reset
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
      setReceipt(null);
      const inp = document.getElementById('receipt-input') as HTMLInputElement | null;
      if (inp) inp.value = '';
    } catch (err: any) {
      setErrors(prev => ({ ...prev, receipt: err?.message || 'Failed to upload receipt' }));
    } finally {
      setUploading(false);
    }
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

      {/* NEW: Receipt file input */}
      <div className="mt-4">
        <label htmlFor="receipt-input" className="block text-sm font-medium text-gray-700 mb-1.5">
          Receipt (optional)
        </label>
        <input
          id="receipt-input"
          type="file"
          accept="image/*"
          onChange={handleReceiptChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50"
        />
        {receipt && (
          <p className="mt-2 text-xs text-gray-600">
            Selected: <span className="font-medium">{receipt.name}</span> ({(receipt.size / 1024).toFixed(1)} KB)
          </p>
        )}
        {errors.receipt && (
          <p className="text-red-500 text-xs mt-1">{errors.receipt}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">PNG/JPG/GIF up to 5MB.</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center justify-center min-w-20 px-4 py-2.5 rounded-md text-sm font-medium
                     border bg-blue-500 text-white border-blue-500
                     hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
        >
          {uploading ? 'Uploading Receipt…' : 'Add Expense'}
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
            setReceipt(null);
            const inp = document.getElementById('receipt-input') as HTMLInputElement | null;
            if (inp) inp.value = '';
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
