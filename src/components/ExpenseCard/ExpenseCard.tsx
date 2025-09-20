// src/components/ExpenseCard/ExpenseCard.tsx
import React from "react";

type ExpenseCardProps = {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  onDelete?: (id: number) => void;
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  id,
  description,
  amount,
  category,
  date,
  onDelete,
}) => {
  const formattedDate = new Date(date).toLocaleDateString();
  const formattedAmount = `$${amount.toFixed(2)}`;

  return (
    <article
      className="
        bg-white rounded-lg p-4 mb-3 shadow-md border-l-4 border-l-blue-500
        hover:shadow-lg transition-all duration-200 relative
      "
    >
      {/* Header row */}
      <div className="flex justify-between items-center mb-2">
        <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold uppercase">
          {category}
        </span>
        <time className="text-sm text-gray-500" dateTime={date}>
          {formattedDate}
        </time>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <h3 className="text-base font-medium text-gray-900">{description}</h3>
        <p className="text-lg font-bold text-green-600">{formattedAmount}</p>
      </div>

      {/* Optional delete button */}
      {onDelete && (
        <button
          className="
            absolute top-2 right-2 w-6 h-6 rounded-full
            bg-red-500 hover:bg-red-600 text-white
            flex items-center justify-center
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400
          "
          onClick={() => onDelete(id)}
          aria-label="Delete expense"
        >
          ×
        </button>
      )}
    </article>
  );
};

export default ExpenseCard;
