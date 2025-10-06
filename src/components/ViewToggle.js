import React from "react";

const ViewToggle = ({ view, setView, theme }) => (
  <div
    className={`${theme.cardBackground} rounded-lg shadow-sm p-4 mb-6 ${theme.border} border transition-colors`}
  >
    <div className="flex gap-2">
      <button
        onClick={() => setView("tasks")}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          view === "tasks"
            ? "bg-blue-600 text-white"
            : `${theme.buttonSecondary}`
        }`}
      >
        Tasks View
      </button>
      <button
        onClick={() => setView("table")}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          view === "table"
            ? "bg-blue-600 text-white"
            : `${theme.buttonSecondary}`
        }`}
      >
        Table View
      </button>
      <button
        onClick={() => setView("kanban")}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          view === "kanban"
            ? "bg-blue-600 text-white"
            : `${theme.buttonSecondary}`
        }`}
      >
        Board View
      </button>
    </div>
  </div>
);

export default ViewToggle;
