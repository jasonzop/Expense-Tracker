import React, { useMemo, useState } from "react";
import ExpenseCard from "../ExpenseCard/ExpenseCard";

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
};

type ExpenseListProps = {
  expenses: Expense[];
  onDelete?: (id: number) => void;
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return expenses;
    return expenses.filter(e => e.category === filter);
  }, [expenses, filter]);

  const total = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );

  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Expenses</h2>

      {/* Summary / Filter bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold text-blue-500 m-0">
          Summary
        </h3>

        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">
            Filter by category:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 cursor-pointer transition-colors duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All</option>
            <option>Food</option>
            <option>Transportation</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="text-lg font-bold text-green-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 px-5 text-gray-500">
          <p className="text-base m-0">No expenses to show.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <ExpenseCard
              key={e.id}
              id={e.id}
              description={e.description}
              amount={e.amount}
              category={e.category}
              date={e.date}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ExpenseList;
