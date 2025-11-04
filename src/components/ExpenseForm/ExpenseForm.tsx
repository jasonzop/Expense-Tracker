import React, { useState } from "react";
import { uploadReceiptDev } from "../../lib/api";

export type ExpenseFormOut = {
  description: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl?: string;
};

interface Props {
  onSubmit: (e: ExpenseFormOut) => void;
}

const ExpenseForm: React.FC<Props> = ({ onSubmit }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!description.trim()) return setError("Description required");
    const amt = Number(amount);
    if (!amt || amt <= 0) return setError("Enter a valid amount");

    setBusy(true);
    let receiptUrl: string | undefined;

    try {
      if (file) {
        const res = await uploadReceiptDev(file);
        receiptUrl = res.url;
      }

      onSubmit({
        description: description.trim(),
        amount: amt,
        category,
        date,
        receiptUrl,
      });

      // reset
      setDescription("");
      setAmount("");
      setCategory("Food");
      setDate(new Date().toISOString().split("T")[0]);
      setFile(null);
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const inputBase =
    "w-full px-3 py-2.5 border rounded-md text-sm bg-white text-gray-700 transition-colors duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-5">Add Expense</h3>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <input className={inputBase} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Lunch at cafe" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
          <input className={inputBase} type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select className={inputBase} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Transportation</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
          <input className={inputBase} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt (optional)</label>
          <input
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-white hover:file:bg-gray-50"
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5 MB.</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center min-w-20 px-4 py-2.5 rounded-md text-sm font-medium border bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Add Expense"}
        </button>
        <button
          type="button"
          onClick={() => {
            setDescription(""); setAmount(""); setCategory("Food"); setDate(new Date().toISOString().split("T")[0]); setFile(null); setError(null);
          }}
          className="inline-flex items-center justify-center min-w-20 px-4 py-2.5 rounded-md text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
