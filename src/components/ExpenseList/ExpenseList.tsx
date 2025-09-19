// src/components/ExpenseList/ExpenseList.tsx
import React, { useMemo, useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import './ExpenseList.css';
import type { Expense, FilterOption, SortOption } from '../../types';
// Type for expense data (reusing interface from ExpenseCard)
/*
============================
TYPESCRIPT FEATURE INVENTORY
============================
Interfaces Found:
1. Expense (from src/types.ts) - defines the shared expense model
2. ExpenseCardProps - extends Expense with optional UI props

Type Annotations Found:
1. amount: number - ensures valid numeric currency values
2. category: ExpenseCategory - restricts category to union type values

Autocomplete Helped:
1. Category select only allows 'Food' | 'Transportation' | 'Entertainment' | 'Other'
2. onDelete shows correct signature (id: number) if passed

Error I Fixed:
1. Tried to use category="Foood" → TypeScript error
   Fix: corrected to "Food" (or extend ExpenseCategory union if needed)
*/

// (Now using shared Expense model from src/types.ts)

/**
 * Props interface for ExpenseList component
 * FIXED: expenses is now required (not optional initialExpenses)
 * @interface ExpenseListProps
 * @property {Expense[]} expenses - Current expense data from parent component (App.tsx)
 */
interface ExpenseListProps {
  expenses: Expense[];  // FIXED: Required prop, receives current state from App
  onDelete?: (id: number) => void;   // <- allow delete to be forwarded
}

/**
 * ExpenseList Component - FIXED VERSION
 * 
 * IMPORTANT CHANGE: This component no longer manages expense data in local state.
 * It receives expenses as props from App.tsx and only manages UI state (filtering).
 * 
 * This fixes the "duplicate state" bug where:
 * - App.tsx had expense state (updated by form)
 * - ExpenseList had separate expense state (never updated)
 * 
 * Now there's a SINGLE SOURCE OF TRUTH in App.tsx
 * 
 * @param {ExpenseListProps} props - Component props
 * @returns {JSX.Element} Rendered expense list with filtering controls
 */
const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  
  // ONLY manage UI state (filtering) - NOT expense data
  const [filterCategory, setFilterCategory] = useState<FilterOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Filter + sort derived from props
  const visibleExpenses = useMemo(() => {
    const filtered =
      filterCategory === 'All'
        ? expenses
        : expenses.filter(expense => expense.category === filterCategory);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return b.date.localeCompare(a.date); // 'date' default: newest first
    });
  }, [expenses, filterCategory, sortBy]);

  // Calculate total for the currently filtered expenses
  const filteredTotal = visibleExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  /**
   * Handles category filter change from select dropdown
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Select change event
   */
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(event.target.value as FilterOption);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortOption);
  };

  return (
    <div className="expense-list">
      <div className="expense-controls">
        <h2>Your Expenses</h2>
        
        <div className="filter-controls">
          <label htmlFor="category-filter">Filter by category:</label>
          <select 
            id="category-filter"
            value={filterCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sort-controls">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="date">Date (newest)</option>
            <option value="amount">Amount (high → low)</option>
            <option value="category">Category (A → Z)</option>
          </select>
        </div>
      </div>

      <div className="expense-summary">
        <p>
          Total: ${filteredTotal.toFixed(2)} ({visibleExpenses.length} expenses)
        </p>
      </div>

      <div className="expense-items">
        {visibleExpenses.length === 0 ? (
          <p className="no-expenses">
            No expenses found. Add some expenses to get started!
          </p>
        ) : (
          visibleExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              {...expense}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
