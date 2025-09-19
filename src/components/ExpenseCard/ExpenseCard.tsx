// src/components/ExpenseCard/ExpenseCard.tsx
import React from 'react';
import './ExpenseCard.css';
import type { Expense, ExpenseCategory } from '../../types';

// Step 1: Define exactly which categories are allowed
// Start with what you learned in Section 2, but apply everywhere:
// (Now imported from src/types.ts instead of redefining locally)

// TODO: Find every place in your code that uses strings for categories
// TODO: Update ExpenseCard, ExpenseList, ExpenseForm to use union types
// TODO: Test that TypeScript catches invalid category names
/*
Error I Fixed:
1) Type mismatch
   - Issue: amount was set to a string ("12.50") while the interface expects number
   - Fix: changed to number (12.50)
   - Lesson: interfaces catch wrong primitive types before runtime

2) Invalid union member
   - Issue: category was set to "Transport" which is not in the union
   - Fix: corrected to "Transportation"
   - Lesson: union types prevent invalid values and improve autocomplete
*/
export interface ExpenseCardProps extends Expense {
  // Optional props (can be provided or not)
  onDelete?: (id: number) => void;    // The ? makes it optional
  highlighted?: boolean;              // Component might be highlighted
  showCategory?: boolean;             // Category display might be hidden
}

/**
 * Displays a single expense item with formatted currency and professional styling
 * @param {Object} props - Component props
 * @param {number} props.id - Unique identifier for the expense entry
 * @param {string} props.description - Human-readable description of the expense
 * @param {number} props.amount - Expense amount in dollars (will be formatted as currency)
 * @param {ExpenseCategory} props.category - Expense category for organization and filtering
 * @param {string} props.date - Date when expense occurred (ISO string format)
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({
  id,
  description,
  amount,
  category,
  date,
  highlighted = false,
  showCategory = true,
  onDelete
}) => {
  // Format currency for professional display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  // Format date for user-friendly display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className={`expense-card ${highlighted ? 'highlighted' : ''}`}>
      <div className="expense-header">
        {showCategory && <span className="expense-category">{category}</span>}
        <span className="expense-date">{formattedDate}</span>
      </div>

      <p className="expense-description">{description}</p>
      <p className="expense-amount">{formattedAmount}</p>

      {onDelete && (
        <div className="expense-actions">
          <button type="button" className="danger" onClick={() => onDelete(id)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export default ExpenseCard;
