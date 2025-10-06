import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Calendar,
  Trash2,
  Edit,
  Moon,
  Sun,
  FileText,
  X,
  Check,
  Square,
} from "lucide-react";

const TaskManager = () => {
  // Load tasks from localStorage or use default tasks
  const loadTasksFromStorage = () => {
    try {
      const savedTasks = localStorage.getItem("taskManager-tasks");
      if (savedTasks) {
        return JSON.parse(savedTasks);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
    return [
      {
        id: 1,
        title: "Thai Homework",
        status: "in-progress",
        subtasks: [
          {
            id: 1,
            title: "Thai Homework 1",
            status: "completed",
            todoDate: "2024-10-01",
            deadline: "2024-10-05",
          },
          {
            id: 2,
            title: "Thai Homework 2",
            status: "in-progress",
            todoDate: "2024-10-03",
            deadline: "2024-10-07",
          },
          {
            id: 3,
            title: "Thai Homework 3",
            status: "todo",
            todoDate: "2024-10-05",
            deadline: "2024-10-10",
          },
        ],
      },
      {
        id: 2,
        title: "Math Assignment",
        status: "todo",
        subtasks: [
          {
            id: 4,
            title: "Math Problem Set 1",
            status: "todo",
            todoDate: "2024-10-02",
            deadline: "2024-10-06",
          },
          {
            id: 5,
            title: "Math Problem Set 2",
            status: "todo",
            todoDate: "2024-10-04",
            deadline: "2024-10-08",
          },
        ],
      },
    ];
  };

  // Detail modal functions
  const openDetailModal = (type, taskId, subtaskId = null) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let title, description, checklist;

    if (type === "task") {
      title = task.title;
      description = task.description || "";
      checklist = task.checklist || [];
    } else if (type === "subtask" && subtaskId) {
      const subtask = task.subtasks.find((s) => s.id === subtaskId);
      if (!subtask) return;
      title = subtask.title;
      description = subtask.description || "";
      checklist = subtask.checklist || [];
    }

    setDetailModalData({
      type,
      taskId,
      subtaskId,
      title,
      description,
      checklist: checklist.map((item, index) => ({
        id: item.id || Date.now() + index,
        text: item.text,
        completed: item.completed || false,
      })),
    });
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailModalData({
      type: null,
      taskId: null,
      subtaskId: null,
      title: "",
      description: "",
      checklist: [],
    });
    setNewChecklistItem("");
  };

  const saveDetailModal = () => {
    const updatedTasks = tasks.map((task) => {
      if (task.id !== detailModalData.taskId) return task;

      if (detailModalData.type === "task") {
        return {
          ...task,
          description: detailModalData.description,
          checklist: detailModalData.checklist,
        };
      } else if (
        detailModalData.type === "subtask" &&
        detailModalData.subtaskId
      ) {
        return {
          ...task,
          subtasks: task.subtasks.map((subtask) => {
            if (subtask.id !== detailModalData.subtaskId) return subtask;
            return {
              ...subtask,
              description: detailModalData.description,
              checklist: detailModalData.checklist,
            };
          }),
        };
      }

      return task;
    });

    setTasks(updatedTasks);
    closeDetailModal();
  };

  const updateDetailDescription = (description) => {
    setDetailModalData((prev) => ({
      ...prev,
      description,
    }));
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newChecklistItem.trim(),
      completed: false,
    };

    setDetailModalData((prev) => ({
      ...prev,
      checklist: [...prev.checklist, newItem],
    }));
    setNewChecklistItem("");
  };

  const toggleChecklistItem = (itemId) => {
    setDetailModalData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const removeChecklistItem = (itemId) => {
    setDetailModalData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== itemId),
    }));
  };

  const [tasks, setTasks] = useState(loadTasksFromStorage);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    try {
      localStorage.setItem("taskManager-tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  const [view, setView] = useState("tasks"); // 'tasks' or 'table'
  const [expandedTasks, setExpandedTasks] = useState(new Set([1, 2]));
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(null);
  const [newTask, setNewTask] = useState({ title: "" });
  const [newSubtask, setNewSubtask] = useState({
    title: "",
    todoDate: "",
    deadline: "",
    status: "todo",
  });
  const [editingSubtask, setEditingSubtask] = useState(null); // { taskId, subtaskId }
  const [editSubtaskData, setEditSubtaskData] = useState({
    title: "",
    todoDate: "",
    deadline: "",
    status: "todo",
  });

  // Detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalData, setDetailModalData] = useState({
    type: null, // 'task' or 'subtask'
    taskId: null,
    subtaskId: null,
    title: "",
    description: "",
    checklist: [], // Array of { id, text, completed }
  });
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("taskManager-darkMode");
      return savedTheme === "true";
    } catch (error) {
      return false;
    }
  });

  // Save dark mode preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("taskManager-darkMode", isDarkMode.toString());
      // Add or remove dark class from document element
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleTaskExpand = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        status: "todo",
        subtasks: [],
      };
      setTasks([...tasks, task]);
      setNewTask({ title: "" });
      setShowTaskForm(false);
    }
  };

  const addSubtask = (taskId) => {
    if (newSubtask.title.trim()) {
      setTasks(
        tasks.map((task) => {
          if (task.id === taskId) {
            const updatedSubtasks = [
              ...task.subtasks,
              {
                id: Date.now(),
                title: newSubtask.title,
                status: newSubtask.status,
                todoDate: newSubtask.todoDate,
                deadline: newSubtask.deadline,
              },
            ];

            return {
              ...task,
              subtasks: updatedSubtasks,
              status: calculateTaskStatus(updatedSubtasks),
            };
          }
          return task;
        })
      );
      setNewSubtask({ title: "", todoDate: "", deadline: "", status: "todo" });
      setShowSubtaskForm(null);
    }
  };

  const calculateTaskStatus = (subtasks) => {
    if (subtasks.length === 0) return "todo";

    const allCompleted = subtasks.every(
      (subtask) => subtask.status === "completed"
    );
    if (allCompleted) return "completed";

    const hasOngoing = subtasks.some((subtask) => subtask.status === "ongoing");
    if (hasOngoing) return "in-progress";

    const hasCompleted = subtasks.some(
      (subtask) => subtask.status === "completed"
    );
    if (hasCompleted) return "in-progress";

    return "todo";
  };

  const updateSubtaskStatus = (taskId, subtaskId, newStatus) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              return {
                ...subtask,
                status: newStatus,
              };
            }
            return subtask;
          });

          return {
            ...task,
            subtasks: updatedSubtasks,
            status: calculateTaskStatus(updatedSubtasks),
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.filter(
            (subtask) => subtask.id !== subtaskId
          );
          return {
            ...task,
            subtasks: updatedSubtasks,
            status: calculateTaskStatus(updatedSubtasks),
          };
        }
        return task;
      })
    );
  };

  // Edit subtask functions
  const startEditingSubtask = (taskId, subtask) => {
    setEditingSubtask({ taskId, subtaskId: subtask.id });
    setEditSubtaskData({
      title: subtask.title,
      todoDate: subtask.todoDate || "",
      deadline: subtask.deadline || "",
      status: subtask.status,
    });
  };

  const cancelEditingSubtask = () => {
    setEditingSubtask(null);
    setEditSubtaskData({
      title: "",
      todoDate: "",
      deadline: "",
      status: "todo",
    });
  };

  const saveEditedSubtask = (taskId, subtaskId) => {
    if (editSubtaskData.title.trim()) {
      setTasks(
        tasks.map((task) => {
          if (task.id === taskId) {
            const updatedSubtasks = task.subtasks.map((subtask) => {
              if (subtask.id === subtaskId) {
                return {
                  ...subtask,
                  title: editSubtaskData.title,
                  todoDate: editSubtaskData.todoDate,
                  deadline: editSubtaskData.deadline,
                  status: editSubtaskData.status,
                };
              }
              return subtask;
            });

            return {
              ...task,
              subtasks: updatedSubtasks,
              status: calculateTaskStatus(updatedSubtasks),
            };
          }
          return task;
        })
      );
      cancelEditingSubtask();
    }
  };

  const getAllSubtasks = () => {
    const allSubtasks = [];
    tasks.forEach((task) => {
      task.subtasks.forEach((subtask) => {
        allSubtasks.push({
          ...subtask,
          taskTitle: task.title,
          taskId: task.id,
        });
      });
    });
    return allSubtasks.sort((a, b) => {
      if (!a.todoDate) return 1;
      if (!b.todoDate) return -1;
      return new Date(a.todoDate) - new Date(b.todoDate);
    });
  };

  // Clear all data (useful for testing)
  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all tasks? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("taskManager-tasks");
      setTasks([]);
    }
  };

  const getStatusColor = (status) => {
    const lightColors = {
      completed: "bg-green-100 text-green-800 border-green-200 font-bold",
      ongoing: "bg-blue-100 text-blue-800 border-blue-200 font-bold",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200 font-bold",
      todo: "bg-gray-100 text-gray-700 border-gray-200 font-bold",
      default: "bg-gray-100 text-gray-700 border-gray-200 font-bold",
    };

    const darkColors = {
      completed: "bg-green-800 text-green-100 border-green-600 font-bold",
      ongoing: "bg-blue-800 text-blue-100 border-blue-600 font-bold",
      "in-progress": "bg-blue-800 text-blue-100 border-blue-600 font-bold",
      todo: "bg-gray-600 text-gray-100 border-gray-500 font-bold",
      default: "bg-gray-600 text-gray-100 border-gray-500 font-bold",
    };

    const colors = isDarkMode ? darkColors : lightColors;
    return colors[status] || colors.default;
  };

  // Theme helper functions
  const getThemeClasses = {
    background: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    cardBackground: isDarkMode ? "bg-gray-800" : "bg-white",
    text: isDarkMode ? "text-gray-100" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    subtaskBackground: isDarkMode ? "bg-gray-700" : "bg-gray-50",
    inputBackground: isDarkMode ? "bg-gray-800" : "bg-white",
    inputBorder: isDarkMode ? "border-gray-500" : "border-gray-300",
    buttonSecondary: isDarkMode
      ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300",
    // Table-specific classes
    tableHeader: isDarkMode
      ? "bg-gray-700 text-gray-200"
      : "bg-gray-50 text-gray-500",
    tableRow: isDarkMode
      ? "bg-gray-800 hover:bg-gray-700"
      : "bg-white hover:bg-gray-50",
    tableBorder: isDarkMode ? "border-gray-600" : "border-gray-200",
    // Button classes
    addButton: isDarkMode
      ? "bg-gray-700 text-blue-400 hover:bg-gray-600 border-gray-600"
      : "bg-white text-blue-600 hover:bg-blue-50 border-gray-300",
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "ongoing":
        return "On-Going";
      case "in-progress":
        return "In-Progress";
      case "todo":
        return "To Do";
      default:
        return "To Do";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div
      className={`min-h-screen ${getThemeClasses.background} p-6 transition-colors`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm p-6 mb-6 ${getThemeClasses.border} border transition-colors`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${getThemeClasses.text} mb-2`}>
                Task Manager
              </h1>
              <p className={getThemeClasses.textSecondary}>
                Organize your tasks and subtasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-yellow-400 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={clearAllData}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div
          className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm p-4 mb-6 ${getThemeClasses.border} border transition-colors`}
        >
          <div className="flex gap-2">
            <button
              onClick={() => setView("tasks")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                view === "tasks"
                  ? "bg-blue-600 text-white"
                  : `${getThemeClasses.buttonSecondary}`
              }`}
            >
              Tasks View
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                view === "table"
                  ? "bg-blue-600 text-white"
                  : `${getThemeClasses.buttonSecondary}`
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* Tasks View */}
        {view === "tasks" && (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm ${getThemeClasses.border} border transition-colors`}
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
                        {getStatusText(task.status)}
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
                            // Edit form
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
                                  onClick={() =>
                                    saveEditedSubtask(task.id, subtask.id)
                                  }
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
                            // Display mode
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
                                    openDetailModal(
                                      "subtask",
                                      task.id,
                                      subtask.id
                                    )
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
                                      <span>
                                        Start: {formatDate(subtask.todoDate)}
                                      </span>
                                    </div>
                                  )}
                                  {subtask.deadline && (
                                    <div className="flex items-center gap-1 text-red-500">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        Due: {formatDate(subtask.deadline)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-2">
                                <button
                                  onClick={() =>
                                    startEditingSubtask(task.id, subtask)
                                  }
                                  className="text-blue-500 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteSubtask(task.id, subtask.id)
                                  }
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
            ))}

            {showTaskForm ? (
              <div
                className={`${getThemeClasses.cardBackground} p-6 rounded-lg shadow-sm border-2 border-blue-500 transition-colors`}
              >
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ title: e.target.value })}
                  className={`w-full px-3 py-2 border ${getThemeClasses.inputBorder} ${getThemeClasses.inputBackground} ${getThemeClasses.text} rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
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
                onClick={() => setShowTaskForm(true)}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg shadow-sm transition-colors border-2 border-dashed ${getThemeClasses.addButton}`}
              >
                <Plus className="w-5 h-5" />
                Add New Task
              </button>
            )}
          </div>
        )}

        {/* Table View */}
        {view === "table" && (
          <div
            className={`${getThemeClasses.cardBackground} rounded-lg shadow-sm overflow-hidden ${getThemeClasses.border} border transition-colors`}
          >
            <table className="w-full">
              <thead
                className={`${getThemeClasses.tableHeader} ${getThemeClasses.tableBorder} border-b`}
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Subtask
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Parent Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    To-Do Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`${getThemeClasses.cardBackground} divide-y ${getThemeClasses.tableBorder}`}
              >
                {getAllSubtasks().map((subtask) => (
                  <tr
                    key={`${subtask.taskId}-${subtask.id}`}
                    className={getThemeClasses.tableRow}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={subtask.status}
                        onChange={(e) =>
                          updateSubtaskStatus(
                            subtask.taskId,
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
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 ${
                          subtask.status === "completed"
                            ? `line-through ${getThemeClasses.textMuted}`
                            : getThemeClasses.text
                        }`}
                        onClick={() =>
                          openDetailModal("subtask", subtask.taskId, subtask.id)
                        }
                      >
                        <FileText className="w-3 h-3" />
                        {subtask.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getThemeClasses.textSecondary}>
                        {subtask.taskTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getThemeClasses.text}>
                        {formatDate(subtask.todoDate) || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={
                          subtask.deadline
                            ? "text-red-500 font-medium"
                            : getThemeClasses.textMuted
                        }
                      >
                        {formatDate(subtask.deadline) || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          deleteSubtask(subtask.taskId, subtask.id)
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {getAllSubtasks().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No subtasks yet. Add some tasks and subtasks to get started!
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${getThemeClasses.background} ${getThemeClasses.border} border rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden`}
            >
              {/* Modal Header */}
              <div
                className={`${getThemeClasses.subtaskBackground} px-6 py-4 border-b ${getThemeClasses.border} flex items-center justify-between`}
              >
                <h2
                  className={`text-xl font-semibold ${getThemeClasses.text} flex items-center gap-2`}
                >
                  <FileText className="w-5 h-5" />
                  {detailModalData.title}
                </h2>
                <button
                  onClick={closeDetailModal}
                  className={`p-2 rounded-lg ${getThemeClasses.buttonSecondary} hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Description Section */}
                <div className="mb-6">
                  <label
                    className={`block text-sm font-medium ${getThemeClasses.text} mb-2`}
                  >
                    Description
                  </label>
                  <textarea
                    value={detailModalData.description}
                    onChange={(e) => updateDetailDescription(e.target.value)}
                    placeholder="Add a detailed description..."
                    className={`w-full h-32 p-3 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
                  />
                </div>

                {/* Checklist Section */}
                <div>
                  <label
                    className={`block text-sm font-medium ${getThemeClasses.text} mb-2`}
                  >
                    Checklist
                  </label>

                  {/* Existing Checklist Items */}
                  <div className="space-y-2 mb-4">
                    {detailModalData.checklist.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${getThemeClasses.subtaskBackground} ${getThemeClasses.border} border`}
                      >
                        <button
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center ${
                            item.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : `border-gray-300 dark:border-gray-600 ${getThemeClasses.background} hover:border-green-400`
                          }`}
                        >
                          {item.completed && <Check className="w-3 h-3" />}
                        </button>
                        <span
                          className={`flex-1 ${
                            item.completed
                              ? `line-through ${getThemeClasses.textMuted}`
                              : getThemeClasses.text
                          }`}
                        >
                          {item.text}
                        </span>
                        <button
                          onClick={() => removeChecklistItem(item.id)}
                          className={`flex-shrink-0 p-1 rounded ${getThemeClasses.buttonSecondary} hover:bg-red-100 dark:hover:bg-red-900 text-red-500`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Checklist Item */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addChecklistItem()
                      }
                      placeholder="Add checklist item..."
                      className={`flex-1 px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
                    />
                    <button
                      onClick={addChecklistItem}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={`${getThemeClasses.subtaskBackground} px-6 py-4 border-t ${getThemeClasses.border} flex justify-end gap-3`}
              >
                <button
                  onClick={closeDetailModal}
                  className={`px-4 py-2 ${getThemeClasses.buttonSecondary} hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveDetailModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
