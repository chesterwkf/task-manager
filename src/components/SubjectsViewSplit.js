import React from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit,
  BookOpen,
} from "lucide-react";

const SubjectsViewSplit = ({
  subjects,
  tasks,
  expandedSubjects,
  toggleSubjectExpand,
  expandedTasks,
  toggleTaskExpand,
  deleteTask,
  deleteSubject,
  editingSubtask,
  editSubtaskData,
  setEditSubtaskData,
  saveEditedSubtask,
  cancelEditingSubtask,
  startEditingSubtask,
  updateSubtaskStatus,
  openDetailModal,
  showSubtaskForm,
  setShowSubtaskForm,
  newSubtask,
  setNewSubtask,
  addSubtask,
  deleteSubtask,
  showSubjectForm,
  setShowSubjectForm,
  newSubject,
  setNewSubject,
  addSubject,
  getThemeClasses,
  getStatusColor,
  formatDate,
}) => {
  // Get tasks for a specific subject
  const getTasksForSubject = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject || !subject.taskIds) return [];
    return tasks.filter((task) => subject.taskIds.includes(task.id));
  };

  // Get all subtasks for a task
  const getSubtasksForTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.subtasks || [];
  };

  return (
    <div className="space-y-6">
      {/* Add Subject Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${getThemeClasses.text}`}>
          Subjects
        </h2>
        <button
          onClick={() => setShowSubjectForm(!showSubjectForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showSubjectForm && (
        <div
          className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm p-6 ${getThemeClasses.border} border mb-6`}
        >
          <h3 className={`text-lg font-semibold ${getThemeClasses.text} mb-4`}>
            Add New Subject
          </h3>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject name (e.g., Thai, Mathematics, Science)"
            className={`w-full px-4 py-2 rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.text} ${getThemeClasses.border} border focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4`}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (newSubject.trim()) {
                  addSubject(newSubject);
                  setShowSubjectForm(false);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Subject
            </button>
            <button
              onClick={() => setShowSubjectForm(false)}
              className={`px-4 py-2 ${getThemeClasses.buttonSecondary} rounded-lg transition-colors`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <div
          className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm p-8 text-center ${getThemeClasses.border} border`}
        >
          <BookOpen
            className={`w-12 h-12 mx-auto mb-4 ${getThemeClasses.textMuted}`}
          />
          <p className={`${getThemeClasses.textMuted} mb-4`}>
            No subjects yet. Create your first subject to organize your tasks!
          </p>
        </div>
      ) : (
        subjects.map((subject) => {
          const subjectTasks = getTasksForSubject(subject.id);
          const isSubjectExpanded = expandedSubjects.has(subject.id);

          return (
            <div
              key={subject.id}
              className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm ${getThemeClasses.border} border transition-colors`}
            >
              <div className="p-6">
                {/* Subject Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSubjectExpand(subject.id)}
                      className={`${getThemeClasses.textMuted} hover:${getThemeClasses.textSecondary} transition-colors`}
                    >
                      {isSubjectExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <h2
                      className={`text-xl font-semibold ${getThemeClasses.text} flex items-center gap-2`}
                    >
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      {subject.name}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getThemeClasses.textMuted} ${getThemeClasses.border} border`}
                    >
                      {subjectTasks.length}{" "}
                      {subjectTasks.length === 1 ? "task" : "tasks"}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Tasks under this Subject */}
                {isSubjectExpanded && (
                  <div className="ml-8 mt-4 space-y-4">
                    {subjectTasks.length === 0 ? (
                      <p
                        className={`${getThemeClasses.textMuted} text-sm italic`}
                      >
                        No tasks in this subject yet. Drag tasks here to
                        organize them.
                      </p>
                    ) : (
                      subjectTasks.map((task) => {
                        const taskSubtasks = getSubtasksForTask(task.id);
                        const isTaskExpanded = expandedTasks.has(task.id);

                        return (
                          <div
                            key={task.id}
                            className={`${getThemeClasses.cardBackground} rounded-lg p-4 ${getThemeClasses.border} border`}
                          >
                            {/* Task Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleTaskExpand(task.id)}
                                  className={`${getThemeClasses.textMuted} hover:${getThemeClasses.textSecondary} transition-colors`}
                                >
                                  {isTaskExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <h3
                                  className={`text-lg font-medium ${getThemeClasses.text} cursor-pointer hover:text-blue-600 dark:hover:text-blue-400`}
                                  onClick={() =>
                                    openDetailModal("task", task.id)
                                  }
                                >
                                  {task.title}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                    task.status
                                  )}`}
                                >
                                  {task.status === "completed"
                                    ? "Completed"
                                    : task.status === "ongoing"
                                    ? "On-Going"
                                    : task.status === "in-progress"
                                    ? "In-Progress"
                                    : "To Do"}
                                </span>
                              </div>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Subtasks under this Task */}
                            {isTaskExpanded && taskSubtasks.length > 0 && (
                              <div className="ml-6 mt-3 space-y-2">
                                {taskSubtasks.map((subtask) => (
                                  <div
                                    key={subtask.id}
                                    className={`flex items-center justify-between p-3 rounded-lg ${getThemeClasses.border} border hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors`}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={() =>
                                          updateSubtaskStatus(
                                            task.id,
                                            subtask.id,
                                            !subtask.completed
                                          )
                                        }
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                                      />
                                      <span
                                        className={`text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 ${
                                          subtask.completed
                                            ? "line-through text-gray-400"
                                            : getThemeClasses.text
                                        }`}
                                        onClick={() =>
                                          openDetailModal(
                                            "subtask",
                                            subtask.id,
                                            task.id
                                          )
                                        }
                                      >
                                        {subtask.title}
                                      </span>
                                      {subtask.todoDate && (
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded ${
                                            new Date(subtask.todoDate) <
                                              new Date() && !subtask.completed
                                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                          }`}
                                        >
                                          {formatDate(subtask.todoDate)}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          startEditingSubtask(
                                            task.id,
                                            subtask.id
                                          )
                                        }
                                        className={`p-1.5 ${getThemeClasses.textMuted} hover:${getThemeClasses.textSecondary} transition-colors`}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteSubtask(task.id, subtask.id)
                                        }
                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Subtask Button */}
                            {isTaskExpanded && (
                              <button
                                onClick={() => setShowSubtaskForm(task.id)}
                                className={`mt-3 ml-6 flex items-center gap-2 px-3 py-1.5 text-sm ${getThemeClasses.textMuted} hover:${getThemeClasses.textSecondary} ${getThemeClasses.border} border rounded-lg transition-colors`}
                              >
                                <Plus className="w-3 h-3" />
                                Add Subtask
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SubjectsViewSplit;
