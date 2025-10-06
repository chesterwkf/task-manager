import React, { useState } from "react";
import {
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { getStatusColor, getThemeClasses, formatDate } from "../utils/helpers";

const TasksView = ({
  tasks,
  subjects,
  isDarkMode,
  onUpdateTask,
  onDeleteTask,
  onAddSubtask,
  onOpenDetails,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [newSubtasks, setNewSubtasks] = useState({});
  const themeClasses = getThemeClasses(isDarkMode);

  const handleAddSubtask = (taskId) => {
    const title = newSubtasks[taskId];
    if (title && title.trim()) {
      onAddSubtask(taskId, title.trim());
      setNewSubtasks((prev) => ({ ...prev, [taskId]: "" }));
    }
  };

  const handleSubtaskInputChange = (taskId, value) => {
    setNewSubtasks((prev) => ({ ...prev, [taskId]: value }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const subject = subjects.find((s) => s.id === task.subjectId);
        const statusColor = getStatusColor(task.status);

        return (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id, "task")}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, task.id)}
            className={`${themeClasses.cardBackground} rounded-lg shadow-sm p-6 ${themeClasses.border} border transition-all hover:shadow-md cursor-move`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status.replace("-", " ")}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                      task.priority
                    )} bg-opacity-10`}
                  >
                    {task.priority} priority
                  </span>
                  {subject && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-purple-900 text-purple-300"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {subject.name}
                    </span>
                  )}
                </div>
                <h3
                  className={`text-lg font-semibold ${themeClasses.text} mb-2 cursor-pointer hover:text-blue-500 transition-colors`}
                  onClick={() => onOpenDetails(task)}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`${themeClasses.textSecondary} mb-2 text-sm`}>
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    Due: {formatDate(task.dueDate)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenDetails(task)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <select
                  value={task.status}
                  onChange={(e) =>
                    onUpdateTask(task.id, { status: e.target.value })
                  }
                  className={`text-sm p-2 border rounded-lg ${themeClasses.input} ${themeClasses.inputBorder} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mb-4">
                <h4 className={`text-sm font-medium ${themeClasses.text} mb-2`}>
                  Subtasks ({task.subtasks.filter((st) => st.completed).length}/
                  {task.subtasks.length})
                </h4>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) =>
                          onUpdateTask(task.id, {
                            subtasks: task.subtasks.map((st) =>
                              st.id === subtask.id
                                ? { ...st, completed: e.target.checked }
                                : st
                            ),
                          })
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span
                        className={`text-sm ${
                          subtask.completed
                            ? `${themeClasses.textSecondary} line-through`
                            : themeClasses.text
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add subtask form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtasks[task.id] || ""}
                onChange={(e) =>
                  handleSubtaskInputChange(task.id, e.target.value)
                }
                placeholder="Add a subtask..."
                className={`flex-1 p-2 text-sm border rounded-lg ${themeClasses.input} ${themeClasses.inputBorder} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask(task.id);
                  }
                }}
              />
              <button
                onClick={() => handleAddSubtask(task.id)}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TasksView;
