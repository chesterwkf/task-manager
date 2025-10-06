import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

const SubjectsPanel = ({
  subjects,
  isDarkMode,
  getThemeClasses,
  onAddSubject,
  onDeleteSubject,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const themeClasses = getThemeClasses;

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim());
      setNewSubjectName("");
    }
  };

  return (
    <div
      className={`${themeClasses.cardBackground} rounded-lg shadow-sm p-6 mb-6 ${themeClasses.border} border transition-colors`}
    >
      <h2 className={`text-xl font-bold ${themeClasses.text} mb-4`}>
        Subjects
      </h2>

      {/* Add New Subject Form */}
      <form onSubmit={handleAddSubject} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Enter subject name"
            className={`flex-1 p-2 border rounded-lg ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </form>

      {/* Subjects List */}
      <div className="space-y-2">
        {subjects && subjects.length > 0 ? (
          subjects.map((subject) => (
            <div
              key={subject.id}
              draggable
              onDragStart={(e) => onDragStart(e, subject.id, "subject")}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, subject.id)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-move ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <GripVertical
                  className={`w-4 h-4 ${themeClasses.textSecondary}`}
                />
                <span className={themeClasses.text}>{subject.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode
                      ? "bg-gray-600 text-gray-300"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {subject.taskIds?.length || 0}
                </span>
              </div>
              <button
                onClick={() => onDeleteSubject(subject.id)}
                className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className={`text-center py-4 ${themeClasses.textSecondary}`}>
            No subjects yet. Add your first subject above.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPanel;
