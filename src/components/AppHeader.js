import React from "react";
import { Sun, Moon } from "lucide-react";

const AppHeader = ({ isDarkMode, onToggleDarkMode, onClearAllData, theme }) => {
  return (
    <div
      className={`${theme.cardBackground} rounded-lg shadow-sm p-6 mb-6 ${theme.border} border transition-colors`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>Task Manager</h1>
          <p className={theme.textSecondary}>Organize your tasks and subtasks efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "text-yellow-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
            }`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onClearAllData}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;


