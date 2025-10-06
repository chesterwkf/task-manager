import React from "react";
import { Plus, Edit, Trash2, FileText } from "lucide-react";

const TableViewSplit = ({
  tasks,
  showSubtaskForm,
  setShowSubtaskForm,
  newSubtask,
  setNewSubtask,
  getThemeClasses,
  getStatusColor,
  formatDate,
  editingSubtask,
  editSubtaskData,
  setEditSubtaskData,
  saveEditedSubtask,
  cancelEditingSubtask,
  updateSubtaskStatus,
  openDetailModal,
  startEditingSubtask,
  deleteSubtask,
  addSubtask,
  getAllSubtasks,
}) => {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${getThemeClasses.text}`}>All Subtasks</h2>
        <button
          onClick={() => setShowSubtaskForm("table")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Subtask
        </button>
      </div>

      {showSubtaskForm === "table" && (
        <div
          className={`${getThemeClasses.cardBackground} p-4 rounded-lg border-2 border-blue-200 dark:border-blue-600 mb-4 ${getThemeClasses.border}`}
        >
          <div className="mb-3">
            <label className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}>
              Parent Task
            </label>
            <select
              value={newSubtask.parentTaskId || ""}
              onChange={(e) =>
                setNewSubtask({
                  ...newSubtask,
                  parentTaskId: parseInt(e.target.value),
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select a parent task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Subtask title"
            value={newSubtask.title}
            onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg mb-3 ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
          />
          <div className="mb-3">
            <label className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}>
              Status
            </label>
            <select
              value={newSubtask.status}
              onChange={(e) => setNewSubtask({ ...newSubtask, status: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="todo">To Do</option>
              <option value="ongoing">On-Going</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}>
                To-Do Date
              </label>
              <input
                type="date"
                value={newSubtask.todoDate}
                onChange={(e) => setNewSubtask({ ...newSubtask, todoDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}>
                Deadline
              </label>
              <input
                type="date"
                value={newSubtask.deadline}
                onChange={(e) => setNewSubtask({ ...newSubtask, deadline: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (newSubtask.parentTaskId) {
                  addSubtask(newSubtask.parentTaskId);
                  setShowSubtaskForm(null);
                }
              }}
              disabled={!newSubtask.parentTaskId || !newSubtask.title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Subtask
            </button>
            <button
              onClick={() => {
                setShowSubtaskForm(null);
                setNewSubtask({
                  title: "",
                  todoDate: "",
                  deadline: "",
                  status: "todo",
                  parentTaskId: null,
                });
              }}
              className={`px-4 py-2 ${getThemeClasses.buttonSecondary} rounded-lg transition-colors`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm overflow-hidden ${getThemeClasses.border} border transition-colors`}>
        <table className="w-full">
          <thead className={`${getThemeClasses.tableHeader} ${getThemeClasses.tableBorder} border-b`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subtask</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Parent Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">To-Do Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`${getThemeClasses.cardBackground} divide-y ${getThemeClasses.tableBorder}`}>
            {getAllSubtasks().map((subtask) => (
              <tr key={`${subtask.taskId}-${subtask.id}`} className={getThemeClasses.tableRow}>
                {editingSubtask &&
                editingSubtask.taskId === subtask.taskId &&
                editingSubtask.subtaskId === subtask.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={editSubtaskData.status}
                        onChange={(e) => setEditSubtaskData({ ...editSubtaskData, status: e.target.value })}
                        className={`w-full px-3 py-1 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="todo">To Do</option>
                        <option value="ongoing">On-Going</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editSubtaskData.title}
                        onChange={(e) => setEditSubtaskData({ ...editSubtaskData, title: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Subtask title"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={getThemeClasses.textSecondary}>{subtask.taskTitle}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={editSubtaskData.todoDate}
                        onChange={(e) => setEditSubtaskData({ ...editSubtaskData, todoDate: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={editSubtaskData.deadline}
                        onChange={(e) => setEditSubtaskData({ ...editSubtaskData, deadline: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveEditedSubtask(subtask.taskId, subtask.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingSubtask}
                          className={`px-3 py-1 text-xs rounded ${getThemeClasses.buttonSecondary}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={subtask.status}
                        onChange={(e) => updateSubtaskStatus(subtask.taskId, subtask.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(subtask.status)} ${getThemeClasses.inputBackground}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="ongoing">On-Going</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 ${
                          subtask.status === "completed" ? `line-through ${getThemeClasses.textMuted}` : getThemeClasses.text
                        }`}
                        onClick={() => openDetailModal("subtask", subtask.taskId, subtask.id)}
                      >
                        <FileText className="w-3 h-3" />
                        {subtask.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getThemeClasses.textSecondary}>{subtask.taskTitle}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getThemeClasses.text}>{formatDate(subtask.todoDate) || "-"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={subtask.deadline ? "text-red-500 font-medium" : getThemeClasses.textMuted}>
                        {formatDate(subtask.deadline) || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingSubtask(subtask.taskId, subtask)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSubtask(subtask.taskId, subtask.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {getAllSubtasks().length === 0 && (
          <div className="text-center py-12 text-gray-500">No subtasks yet. Add some tasks and subtasks to get started!</div>
        )}
      </div>
    </div>
  );
};

export default TableViewSplit;


