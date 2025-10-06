import React, { useState, useEffect, useMemo, useCallback } from "react";
import AppHeader from "./components/AppHeader";
import ViewToggle from "./components/ViewToggle";
import TasksViewSplit from "./components/TasksViewSplit";
import TableViewSplit from "./components/TableViewSplit";
import KanbanBoardSplit from "./components/KanbanBoardSplit";
import DetailModalSplit from "./components/DetailModalSplit";
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
    parentTaskId: null,
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

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState(null);

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

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const toggleTaskExpand = useCallback((taskId) => {
    setExpandedTasks((prev) => {
      const updated = new Set(prev);
      if (updated.has(taskId)) {
        updated.delete(taskId);
      } else {
        updated.add(taskId);
      }
      return updated;
    });
  }, []);

  const addTask = useCallback(() => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        status: "todo",
        subtasks: [],
      };
      setTasks((prev) => [...prev, task]);
      setNewTask({ title: "" });
      setShowTaskForm(false);
    }
  }, [newTask.title]);

  const addSubtask = useCallback(
    (taskId) => {
      if (newSubtask.title.trim()) {
        setTasks((prev) =>
          prev.map((task) => {
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
        setNewSubtask({
          title: "",
          todoDate: "",
          deadline: "",
          status: "todo",
          parentTaskId: null,
        });
        setShowSubtaskForm(null);
      }
    },
    [
      newSubtask.title,
      newSubtask.status,
      newSubtask.todoDate,
      newSubtask.deadline,
    ]
  );

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

  const updateSubtaskStatus = useCallback((taskId, subtaskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
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
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
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
  }, []);

  // Edit subtask functions
  const startEditingSubtask = useCallback((taskId, subtask) => {
    setEditingSubtask({ taskId, subtaskId: subtask.id });
    setEditSubtaskData({
      title: subtask.title,
      todoDate: subtask.todoDate || "",
      deadline: subtask.deadline || "",
      status: subtask.status,
    });
  }, []);

  const cancelEditingSubtask = useCallback(() => {
    setEditingSubtask(null);
    setEditSubtaskData({
      title: "",
      todoDate: "",
      deadline: "",
      status: "todo",
    });
  }, []);

  const saveEditedSubtask = useCallback(
    (taskId, subtaskId) => {
      if (editSubtaskData.title.trim()) {
        setTasks((prev) =>
          prev.map((task) => {
            if (task.id === taskId) {
              const updatedSubtasks = task.subtasks.map((subtask) => {
                if (subtask.id === subtaskId) {
                  return {
                    ...subtask,
                    title: editSubtaskData.title,
                    todoDate: editSubtaskData.todoDate || "",
                    deadline: editSubtaskData.deadline || "",
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
    },
    [editSubtaskData, cancelEditingSubtask]
  );

  const getAllSubtasks = useCallback(() => {
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
    return allSubtasks; // preserve original order to avoid confusing row jumps during edits
  }, [tasks]);

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

  const getStatusColor = useCallback(
    (status) => {
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
    },
    [isDarkMode]
  );

  // Theme helper functions (memoized)
  const getThemeClasses = useMemo(
    () => ({
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
    }),
    [isDarkMode]
  );

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
      month: "long",
      day: "numeric",
    });
  };

  // Kanban board helper functions
  const getTodaysSubtasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaysSubtasks = [];

    tasks.forEach((task) => {
      task.subtasks.forEach((subtask) => {
        if (subtask.todoDate === today) {
          todaysSubtasks.push({
            ...subtask,
            taskTitle: task.title,
            taskId: task.id,
          });
        }
      });
    });

    return todaysSubtasks;
  }, [tasks]);

  const getSubtasksByStatus = useCallback(
    (status) => getTodaysSubtasks.filter((s) => s.status === status),
    [getTodaysSubtasks]
  );

  // Drag and drop handlers
  const handleDragStart = (e, subtask) => {
    setDraggedItem(subtask);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      updateSubtaskStatus(draggedItem.taskId, draggedItem.id, newStatus);
    }
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div
      className={`min-h-screen ${getThemeClasses.background} p-6 transition-colors`}
    >
      <div className="max-w-7xl mx-auto">
        <AppHeader
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onClearAllData={clearAllData}
          theme={getThemeClasses}
        />

        {/* View Toggle */}
        <ViewToggle view={view} setView={setView} theme={getThemeClasses} />

        {/* Tasks View */}
        {view === "tasks" && (
          <TasksViewSplit
            tasks={tasks}
            expandedTasks={expandedTasks}
            toggleTaskExpand={toggleTaskExpand}
            deleteTask={deleteTask}
            editingSubtask={editingSubtask}
            editSubtaskData={editSubtaskData}
            setEditSubtaskData={setEditSubtaskData}
            saveEditedSubtask={saveEditedSubtask}
            cancelEditingSubtask={cancelEditingSubtask}
            startEditingSubtask={startEditingSubtask}
            updateSubtaskStatus={updateSubtaskStatus}
            openDetailModal={openDetailModal}
            showSubtaskForm={showSubtaskForm}
            setShowSubtaskForm={setShowSubtaskForm}
            newSubtask={newSubtask}
            setNewSubtask={setNewSubtask}
            addSubtask={addSubtask}
            deleteSubtask={deleteSubtask}
            newTask={newTask}
            setNewTask={setNewTask}
            showTaskForm={showTaskForm}
            setShowTaskForm={setShowTaskForm}
            addTask={addTask}
            getThemeClasses={getThemeClasses}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        )}

        {/* Table View */}
        {view === "table" && (
          <TableViewSplit
            tasks={tasks}
            showSubtaskForm={showSubtaskForm}
            setShowSubtaskForm={setShowSubtaskForm}
            newSubtask={newSubtask}
            setNewSubtask={setNewSubtask}
            getThemeClasses={getThemeClasses}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            editingSubtask={editingSubtask}
            editSubtaskData={editSubtaskData}
            setEditSubtaskData={setEditSubtaskData}
            saveEditedSubtask={saveEditedSubtask}
            cancelEditingSubtask={cancelEditingSubtask}
            updateSubtaskStatus={updateSubtaskStatus}
            openDetailModal={openDetailModal}
            startEditingSubtask={startEditingSubtask}
            deleteSubtask={deleteSubtask}
            addSubtask={addSubtask}
            getAllSubtasks={getAllSubtasks}
          />
        )}

        {/* Kanban Board View */}
        {view === "kanban" && (
          <KanbanBoardSplit
            getThemeClasses={getThemeClasses}
            getSubtasksByStatus={getSubtasksByStatus}
            getTodaysSubtasks={getTodaysSubtasks}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            draggedItem={draggedItem}
            openDetailModal={openDetailModal}
            deleteSubtask={deleteSubtask}
            formatDate={formatDate}
          />
        )}

        {/* Detail Modal */}
        <DetailModalSplit
          show={showDetailModal}
          detailModalData={detailModalData}
          getThemeClasses={getThemeClasses}
          closeDetailModal={closeDetailModal}
          updateDetailDescription={updateDetailDescription}
          newChecklistItem={newChecklistItem}
          setNewChecklistItem={setNewChecklistItem}
          toggleChecklistItem={toggleChecklistItem}
          removeChecklistItem={removeChecklistItem}
          addChecklistItem={addChecklistItem}
          saveDetailModal={saveDetailModal}
        />
      </div>
    </div>
  );
};

export default TaskManager;
