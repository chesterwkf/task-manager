import { useState, useEffect } from "react";
import { calculateTaskStatus } from "../utils/helpers";

export const useTasks = () => {
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

  // Load subjects from localStorage or use default subjects
  const loadSubjectsFromStorage = () => {
    try {
      const savedSubjects = localStorage.getItem("taskManager-subjects");
      if (savedSubjects) {
        return JSON.parse(savedSubjects);
      }
    } catch (error) {
      console.error("Error loading subjects from localStorage:", error);
    }
    return [
      { id: 1, name: "School", taskIds: [] },
      { id: 2, name: "Personal", taskIds: [] },
      { id: 3, name: "Work", taskIds: [] },
    ];
  };

  const [tasks, setTasks] = useState(loadTasksFromStorage);
  const [subjects, setSubjects] = useState(loadSubjectsFromStorage);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    try {
      localStorage.setItem("taskManager-tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  // Save subjects to localStorage whenever subjects state changes
  useEffect(() => {
    try {
      localStorage.setItem("taskManager-subjects", JSON.stringify(subjects));
    } catch (error) {
      console.error("Error saving subjects to localStorage:", error);
    }
  }, [subjects]);

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      subtasks: [],
      checklist: [],
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);

    // Add task to subject if specified
    if (taskData.subjectId) {
      setSubjects(
        subjects.map((subject) =>
          subject.id === taskData.subjectId
            ? { ...subject, taskIds: [...(subject.taskIds || []), newTask.id] }
            : subject
        )
      );
    }
  };

  const updateTask = (taskId, updates) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  // Subject management functions
  const addSubject = (name) => {
    const newSubject = {
      id: Date.now(),
      name,
      taskIds: [],
    };
    setSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (subjectId) => {
    // Remove tasks from the deleted subject
    setTasks(
      tasks.map((task) =>
        task.subjectId === subjectId ? { ...task, subjectId: null } : task
      )
    );

    // Remove the subject
    setSubjects(subjects.filter((subject) => subject.id !== subjectId));
  };

  // Drag and drop handlers
  const handleDragStart = (e, id, type) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("type", type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    const draggedType = e.dataTransfer.getData("type");

    if (draggedType === "task") {
      // Update task's subject
      setTasks(
        tasks.map((task) =>
          task.id === draggedId ? { ...task, subjectId: targetId } : task
        )
      );

      // Update subjects' task lists
      setSubjects(
        subjects.map((subject) => {
          const taskIds = subject.taskIds || [];

          if (subject.id === targetId) {
            // Add task to target subject
            return {
              ...subject,
              taskIds: taskIds.includes(draggedId)
                ? taskIds
                : [...taskIds, draggedId],
            };
          } else {
            // Remove task from other subjects
            return {
              ...subject,
              taskIds: taskIds.filter((id) => id !== draggedId),
            };
          }
        })
      );
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addSubtask = (taskId, subtaskData) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = [
            ...task.subtasks,
            {
              id: Date.now(),
              ...subtaskData,
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

  const updateSubtask = (taskId, subtaskId, updatedData) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              return {
                ...subtask,
                ...updatedData,
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

  const getTodaysSubtasks = () => {
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
  };

  const getSubtasksByStatus = (status) => {
    return getTodaysSubtasks().filter((subtask) => subtask.status === status);
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all tasks and subjects? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("taskManager-tasks");
      localStorage.removeItem("taskManager-subjects");
      setTasks([]);
      setSubjects(loadSubjectsFromStorage());
    }
  };

  return {
    tasks,
    subjects,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    addSubject,
    deleteSubject,
    clearAllData,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};
