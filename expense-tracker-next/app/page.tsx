import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Expense Tracker</h1>

        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-gray-600 mb-4">
            Track your expenses with ease. Start by viewing your expenses.
          </p>
          <Link
            href="/expenses"
            className="inline-block bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
          >
            View Expenses
          </Link>
        </div>
      </div>
    </main>
  );
}
