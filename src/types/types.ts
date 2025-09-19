// Add these union types to your project:

// TODO: Update your ExpenseList component to use FilterOption instead of string
// TODO: Add SortOption type for any sorting functionality
// src/types.ts

export type ExpenseCategory = | 'Food' | 'Transportation' | 'Entertainment' | 'Other';
export type SortOption = 'date' | 'amount' | 'category';
export type FilterOption = 'All' | ExpenseCategory;

// Defines the shape of an expense object.
// Every expense in the app must follow this contract.
export interface Expense {
  id: number;                // Unique identifier (assigned in App.tsx)
  description: string;       // What the expense is
  amount: number;            // Stored as number for calculations
  category: ExpenseCategory; // Must match union type above
  date: string;              // ISO string (YYYY-MM-DD format)
}
