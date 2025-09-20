import React from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  active?: string; // optional, e.g., "Dashboard"
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, active }) => {
  const baseBtn =
    "bg-white/10 border border-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50";

  const activeBtn = "bg-white/20 border-white/40";

  return (
    <header
      className="
        bg-gradient-to-br from-blue-500 to-purple-600 text-white
        shadow-lg mb-8 w-full px-5 py-6 rounded-xl
        flex flex-col md:flex-row gap-5 md:gap-0 items-start md:items-center justify-between
      "
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-base text-blue-100 opacity-90 m-0">{subtitle}</p>
        )}
      </div>

      <nav className="flex gap-3 flex-wrap justify-center md:justify-end">
        <button className={`${baseBtn} ${active === "Dashboard" ? activeBtn : ""}`}>
          Dashboard
        </button>
        <button className={`${baseBtn} ${active === "Expenses" ? activeBtn : ""}`}>
          Expenses
        </button>
        <button className={`${baseBtn} ${active === "Reports" ? activeBtn : ""}`}>
          Reports
        </button>
      </nav>
    </header>
  );
};

export default Header;
