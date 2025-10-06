import React from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Calendar,
  Trash2,
  Edit,
  FileText,
  BookOpen,
} from "lucide-react";

const TasksViewSplit = ({
  tasks,
  subjects,
  expandedSubjects,
  toggleSubjectExpand,
  showSubjectForm,
  setShowSubjectForm,
  newSubject,
  setNewSubject,
  addSubject,
  deleteSubject,
  handleSubjectDrop,
  expandedTasks,
  toggleTaskExpand,
  deleteTask,
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
  newTask,
  setNewTask,
  showTaskForm,
  setShowTaskForm,
  addTask,
  addTaskToSubject,
  getThemeClasses,
  getStatusColor,
  formatDate,
}) => {
  // Get tasks for a specific subject
  const getTasksForSubject = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return [];
    const taskIds = subject.taskIds || [];
    return tasks.filter((task) => taskIds.includes(task.id));
  };

  // Get tasks that are not in any subject
  const getUnassignedTasks = () => {
    const assignedTaskIds = new Set();
    subjects.forEach((subject) => {
      const taskIds = subject.taskIds || [];
      taskIds.forEach((id) => assignedTaskIds.add(id));
    });
    return tasks.filter((task) => !assignedTaskIds.has(task.id));
  };

  const unassignedTasks = getUnassignedTasks();

  // Render a task card
  const renderTaskCard = (task) => (
    <div
      key={task.id}
      className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm ${getThemeClasses.border} border transition-colors mb-4`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/x-item",
          JSON.stringify({ id: task.id, type: "task" })
        );
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleTaskExpand(task.id)}
              className={`${getThemeClasses.textMuted} hover:${getThemeClasses.textSecondary} transition-colors`}
            >
              {expandedTasks.has(task.id) ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <h2
              className={`text-xl font-semibold ${getThemeClasses.text} cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2`}
              onClick={() => openDetailModal("task", task.id)}
            >
              <FileText className="w-4 h-4" />
              {task.title}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
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
            <span
              className={`text-sm ${getThemeClasses.textMuted} ${getThemeClasses.subtaskBackground} px-2 py-1 rounded`}
            >
              {task.subtasks.length} subtask
              {task.subtasks.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {expandedTasks.has(task.id) && (
          <div className="space-y-3">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className={`${getThemeClasses.subtaskBackground} p-4 rounded-lg ${getThemeClasses.border} border transition-colors`}
              >
                {editingSubtask &&
                editingSubtask.taskId === task.id &&
                editingSubtask.subtaskId === subtask.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editSubtaskData.title}
                      onChange={(e) =>
                        setEditSubtaskData({
                          ...editSubtaskData,
                          title: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border ${getThemeClasses.inputBorder} ${getThemeClasses.inputBackground} ${getThemeClasses.text} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Subtask title"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label
                          className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}
                        >
                          Status
                        </label>
                        <select
                          value={editSubtaskData.status}
                          onChange={(e) =>
                            setEditSubtaskData({
                              ...editSubtaskData,
                              status: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 border ${getThemeClasses.inputBorder} ${getThemeClasses.inputBackground} ${getThemeClasses.text} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                        >
                          <option value="todo">To Do</option>
                          <option value="ongoing">On-Going</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={editSubtaskData.todoDate}
                          onChange={(e) =>
                            setEditSubtaskData({
                              ...editSubtaskData,
                              todoDate: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 border ${getThemeClasses.inputBorder} ${getThemeClasses.inputBackground} ${getThemeClasses.text} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}
                        >
                          Deadline
                        </label>
                        <input
                          type="date"
                          value={editSubtaskData.deadline}
                          onChange={(e) =>
                            setEditSubtaskData({
                              ...editSubtaskData,
                              deadline: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 border ${getThemeClasses.inputBorder} ${getThemeClasses.inputBackground} ${getThemeClasses.text} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditedSubtask(task.id, subtask.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditingSubtask}
                        className={`px-4 py-2 rounded-lg transition-colors ${getThemeClasses.buttonSecondary}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <select
                        value={subtask.status}
                        onChange={(e) =>
                          updateSubtaskStatus(
                            task.id,
                            subtask.id,
                            e.target.value
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          subtask.status
                        )} ${getThemeClasses.inputBackground}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="ongoing">On-Going</option>
                        <option value="completed">Completed</option>
                      </select>
                      <span
                        className={`flex-1 font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 ${
                          subtask.status === "completed"
                            ? `line-through ${getThemeClasses.textMuted}`
                            : getThemeClasses.text
                        }`}
                        onClick={() =>
                          openDetailModal("subtask", task.id, subtask.id)
                        }
                      >
                        <FileText className="w-3 h-3" />
                        {subtask.title}
                      </span>
                      <div className="flex items-center gap-6 text-sm">
                        {subtask.todoDate && (
                          <div
                            className={`flex items-center gap-1 ${getThemeClasses.textSecondary}`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Start: {formatDate(subtask.todoDate)}</span>
                          </div>
                        )}
                        {subtask.deadline && (
                          <div className="flex items-center gap-1 text-red-500">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDate(subtask.deadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => startEditingSubtask(task.id, subtask)}
                        className="text-blue-500 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSubtask(task.id, subtask.id)}
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {showSubtaskForm === task.id ? (
              <div
                className={`${getThemeClasses.cardBackground} p-4 rounded-lg border-2 border-blue-200 dark:border-blue-600 mt-3 ${getThemeClasses.border}`}
              >
                <input
                  type="text"
                  placeholder="Subtask title"
                  value={newSubtask.title}
                  onChange={(e) =>
                    setNewSubtask({
                      ...newSubtask,
                      title: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg mb-3 ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
                />
                <div className="mb-3">
                  <label
                    className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}
                  >
                    Status
                  </label>
                  <select
                    value={newSubtask.status}
                    onChange={(e) =>
                      setNewSubtask({
                        ...newSubtask,
                        status: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="todo">To Do</option>
                    <option value="ongoing">On-Going</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label
                      className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}
                    >
                      To-Do Date
                    </label>
                    <input
                      type="date"
                      value={newSubtask.todoDate}
                      onChange={(e) =>
                        setNewSubtask({
                          ...newSubtask,
                          todoDate: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${getThemeClasses.text} mb-1`}
                    >
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={newSubtask.deadline}
                      onChange={(e) =>
                        setNewSubtask({
                          ...newSubtask,
                          deadline: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addSubtask(task.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            ) : (
              <button
                onClick={() => setShowSubtaskForm(task.id)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mt-3"
              >
                <Plus className="w-4 h-4" />
                Add Subtask
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Subjects Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
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
            <h3
              className={`text-lg font-semibold ${getThemeClasses.text} mb-4`}
            >
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
        {subjects.length > 0 && (
          <div className="space-y-4">
            {subjects.map((subject) => {
              const subjectTasks = getTasksForSubject(subject.id);
              const isSubjectExpanded = expandedSubjects.has(subject.id);

              return (
                <div
                  key={subject.id}
                  className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm ${getThemeClasses.border} border transition-colors`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("ring-2", "ring-blue-500");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("ring-2", "ring-blue-500");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("ring-2", "ring-blue-500");
                    handleSubjectDrop(e, subject.id);
                  }}
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
                        <h3
                          className={`text-xl font-semibold ${getThemeClasses.text} flex items-center gap-2`}
                        >
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          {subject.name}
                        </h3>
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
                            No tasks in this subject yet. Drag tasks here or add
                            a new task below.
                          </p>
                        ) : (
                          subjectTasks.map((task) => renderTaskCard(task))
                        )}

                        {/* Add Task to Subject Form */}
                        {showTaskForm === `subject-${subject.id}` ? (
                          <div
                            className={`${getThemeClasses.cardBackground} p-4 rounded-lg shadow-sm border-2 border-blue-500 transition-colors mt-4`}
                          >
                            <input
                              type="text"
                              placeholder="Task title"
                              value={newTask.title}
                              onChange={(e) =>
                                setNewTask({ title: e.target.value })
                              }
                              className={`w-full px-3 py-2 border ${getThemeClasses.inputBorder} ${getThemeClasses.inputBackground} ${getThemeClasses.text} rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  addTaskToSubject(subject.id);
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => addTaskToSubject(subject.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Add Task
                              </button>
                              <button
                                onClick={() => {
                                  setShowTaskForm(false);
                                  setNewTask({ title: "" });
                                }}
                                className={`px-4 py-2 rounded-lg transition-colors ${getThemeClasses.buttonSecondary}`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setShowTaskForm(`subject-${subject.id}`)
                            }
                            className={`flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mt-2`}
                          >
                            <Plus className="w-4 h-4" />
                            Add Task to {subject.name}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Unassigned Tasks Section */}
      <div>
        <h2 className={`text-2xl font-bold ${getThemeClasses.text} mb-4`}>
          All Tasks {subjects.length > 0 && "(Drag to assign to a subject)"}
        </h2>
        {unassignedTasks.map((task) => renderTaskCard(task))}

        {showTaskForm === "unassigned" ? (
          <div
            className={`${getThemeClasses.cardBackground} p-6 rounded-lg shadow-sm border-2 border-blue-500 transition-colors`}
          >
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ title: e.target.value })}
              className={`w-full px-3 py-2 border ${getThemeClasses.inputBorder} ${getThemeClasses.inputBackground} ${getThemeClasses.text} rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setShowTaskForm(false);
                  setNewTask({ title: "" });
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${getThemeClasses.buttonSecondary}`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowTaskForm("unassigned")}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg shadow-sm transition-colors border-2 border-dashed ${getThemeClasses.addButton}`}
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        )}
      </div>
    </div>
  );
};

export default TasksViewSplit;
