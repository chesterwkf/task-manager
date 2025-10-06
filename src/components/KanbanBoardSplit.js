import React from "react";
import { FileText, Calendar, X } from "lucide-react";

const KanbanBoardSplit = ({
  getThemeClasses,
  getSubtasksByStatus,
  getTodaysSubtasks,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  draggedItem,
  openDetailModal,
  deleteSubtask,
  formatDate,
}) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-2xl font-semibold ${getThemeClasses.text} mb-2`}>
          Today's Tasks - {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </h2>
        <p className={getThemeClasses.textSecondary}>Drag and drop tasks between columns to update their status</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[{ id: "todo", label: "To-Do", headBg: "bg-red-100 dark:bg-red-900", dot: "bg-red-500" },
          { id: "ongoing", label: "Ongoing", headBg: "bg-yellow-100 dark:bg-yellow-900", dot: "bg-yellow-500" },
          { id: "completed", label: "Completed", headBg: "bg-green-100 dark:bg-green-900", dot: "bg-green-500" }].map((col) => (
          <div
            key={col.id}
            className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm overflow-hidden ${getThemeClasses.border} border transition-colors`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className={`${col.headBg} p-4 border-b border-gray-200 dark:border-gray-700`}>
              <h3 className={`font-semibold flex items-center gap-2 ${col.id === "todo" ? "text-red-800 dark:text-red-200" : col.id === "ongoing" ? "text-yellow-800 dark:text-yellow-200" : "text-green-800 dark:text-green-200"}`}>
                <div className={`w-3 h-3 ${col.dot} rounded-full`}></div>
                {col.label}
                <span className={`${col.headBg.replace("100", "200").replace("900", "800")} px-2 py-1 rounded-full text-xs`}>{getSubtasksByStatus(col.id).length}</span>
              </h3>
            </div>
            <div className="p-4 space-y-3 min-h-[400px]">
              {getSubtasksByStatus(col.id).map((subtask) => (
                <div
                  key={`${subtask.taskId}-${subtask.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, subtask)}
                  onDragEnd={handleDragEnd}
                  className={`${getThemeClasses.subtaskBackground} p-3 rounded-lg border ${getThemeClasses.border} cursor-move hover:shadow-md transition-all ${draggedItem?.id === subtask.id ? "opacity-50" : ""} ${col.id === "completed" ? "opacity-75" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4
                      className={`font-medium ${col.id === "completed" ? getThemeClasses.textMuted + " line-through" : getThemeClasses.text} cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2`}
                      onClick={() => openDetailModal("subtask", subtask.taskId, subtask.id)}
                    >
                      <FileText className="w-3 h-3" />
                      {subtask.title}
                    </h4>
                    <button
                      onClick={() => deleteSubtask(subtask.taskId, subtask.id)}
                      className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className={`text-xs ${col.id === "completed" ? getThemeClasses.textMuted : getThemeClasses.textSecondary} mb-2`}>
                    {subtask.taskTitle}
                  </p>
                  {subtask.deadline && (
                    <div className={`flex items-center gap-1 text-xs ${col.id === "completed" ? "text-green-600" : "text-red-500"}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{col.id === "completed" ? "Completed" : `Due: ${formatDate(subtask.deadline)}`}</span>
                    </div>
                  )}
                </div>
              ))}
              {getSubtasksByStatus(col.id).length === 0 && (
                <div className={`text-center py-8 ${getThemeClasses.textMuted}`}>
                  <div className="text-4xl mb-2">{col.id === "todo" ? "📋" : col.id === "ongoing" ? "⚡" : "🎉"}</div>
                  <p>{col.id === "todo" ? "No to-do tasks for today" : col.id === "ongoing" ? "No ongoing tasks for today" : "No completed tasks yet"}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-6 ${getThemeClasses.cardBackground} rounded-lg p-4 ${getThemeClasses.border} border`}>
        <h3 className={`text-lg font-semibold ${getThemeClasses.text} mb-3`}>Today's Progress</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getThemeClasses.text}`}>{getTodaysSubtasks.length}</div>
            <div className={`text-sm ${getThemeClasses.textSecondary}`}>Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{getSubtasksByStatus("todo").length}</div>
            <div className={`text-sm ${getThemeClasses.textSecondary}`}>To-Do</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{getSubtasksByStatus("ongoing").length}</div>
            <div className={`text-sm ${getThemeClasses.textSecondary}`}>Ongoing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{getSubtasksByStatus("completed").length}</div>
            <div className={`text-sm ${getThemeClasses.textSecondary}`}>Completed</div>
          </div>
        </div>
        {getTodaysSubtasks.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className={getThemeClasses.textSecondary}>Progress</span>
              <span className={getThemeClasses.text}>
                {Math.round((getSubtasksByStatus("completed").length / getTodaysSubtasks.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getSubtasksByStatus("completed").length / getTodaysSubtasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoardSplit;


