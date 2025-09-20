import React from "react";

type ExpenseSummaryProps = {
  totalAmount: number;
  expenseCount: number;
  period: string; // e.g., "This Month"
};

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  totalAmount,
  expenseCount,
  period,
}) => {
  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5 pb-4 border-b border-gray-200 gap-3 md:gap-0 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 m-0">Summary</h2>
        <span className="inline-block bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-sm font-medium">
          {period}
        </span>
      </div>

      {/* Stats */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-8">
        <div className="flex flex-col items-center flex-1">
          <span className="text-sm font-medium text-gray-500 mb-2 text-center">
            Total Expenses
          </span>
          <span className="text-3xl font-bold text-gray-900 text-center">
            {expenseCount}
          </span>
        </div>

        <div className="flex flex-col items-center flex-1">
          <span className="text-sm font-medium text-gray-500 mb-2 text-center">
            Total Amount
          </span>
          <span className="text-3xl font-bold text-gray-900 text-center">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ExpenseSummary;
