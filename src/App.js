import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Calendar, CheckCircle2, Circle, Trash2 } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "AI Individual Assignment",
      status: "in-progress",
      subtasks: [
        { id: 101, title: "Research on ML algorithms", status: "completed", todoDate: "2025-10-01", deadline: "2025-10-05" },
        { id: 102, title: "Write literature review", status: "ongoing", todoDate: "2025-10-06", deadline: "2025-10-10" },
        { id: 103, title: "Implement model", status: "todo", todoDate: "2025-10-11", deadline: "2025-10-20" }
      ]
    },
    {
      id: 2,
      title: "Web Development Project",
      status: "todo",
      subtasks: [
        { id: 201, title: "Design mockups", status: "todo", todoDate: "2025-10-03", deadline: "2025-10-08" },
        { id: 202, title: "Setup React project", status: "todo", todoDate: "2025-10-09", deadline: "2025-10-12" }
      ]
    }
  ]);

  const [view, setView] = useState('tasks'); // 'tasks' or 'table'
  const [expandedTasks, setExpandedTasks] = useState(new Set([1, 2]));
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(null);
  const [newTask, setNewTask] = useState({ title: '' });
  const [newSubtask, setNewSubtask] = useState({ title: '', todoDate: '', deadline: '', status: 'todo' });

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
        status: 'todo',
        subtasks: []
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '' });
      setShowTaskForm(false);
    }
  };

  const addSubtask = (taskId) => {
    if (newSubtask.title.trim()) {
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = [...task.subtasks, {
            id: Date.now(),
            title: newSubtask.title,
            status: newSubtask.status,
            todoDate: newSubtask.todoDate,
            deadline: newSubtask.deadline
          }];
          
          return {
            ...task,
            subtasks: updatedSubtasks,
            status: calculateTaskStatus(updatedSubtasks)
          };
        }
        return task;
      }));
      setNewSubtask({ title: '', todoDate: '', deadline: '', status: 'todo' });
      setShowSubtaskForm(null);
    }
  };

  const calculateTaskStatus = (subtasks) => {
    if (subtasks.length === 0) return 'todo';
    
    const allCompleted = subtasks.every(subtask => subtask.status === 'completed');
    if (allCompleted) return 'completed';
    
    const hasOngoing = subtasks.some(subtask => subtask.status === 'ongoing');
    if (hasOngoing) return 'in-progress';
    
    const hasCompleted = subtasks.some(subtask => subtask.status === 'completed');
    if (hasCompleted) return 'in-progress';
    
    return 'todo';
  };

  const updateSubtaskStatus = (taskId, subtaskId, newStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask => {
          if (subtask.id === subtaskId) {
            return {
              ...subtask,
              status: newStatus
            };
          }
          return subtask;
        });
        
        return {
          ...task,
          subtasks: updatedSubtasks,
          status: calculateTaskStatus(updatedSubtasks)
        };
      }
      return task;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
        return {
          ...task,
          subtasks: updatedSubtasks,
          status: calculateTaskStatus(updatedSubtasks)
        };
      }
      return task;
    }));
  };

  const getAllSubtasks = () => {
    const allSubtasks = [];
    tasks.forEach(task => {
      task.subtasks.forEach(subtask => {
        allSubtasks.push({
          ...subtask,
          taskTitle: task.title,
          taskId: task.id
        });
      });
    });
    return allSubtasks.sort((a, b) => {
      if (!a.todoDate) return 1;
      if (!b.todoDate) return -1;
      return new Date(a.todoDate) - new Date(b.todoDate);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">Organize your tasks and subtasks efficiently</p>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView('tasks')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                view === 'tasks'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tasks View
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                view === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* Tasks View */}
        {view === 'tasks' && (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleTaskExpand(task.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedTasks.has(task.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedTasks.has(task.id) && (
                  <div className="p-4 bg-gray-50">
                    <div className="space-y-2 mb-4">
                      {task.subtasks.map(subtask => (
                        <div
                          key={subtask.id}
                          className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <select
                              value={subtask.status}
                              onChange={(e) => updateSubtaskStatus(task.id, subtask.id, e.target.value)}
                              className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(subtask.status)}`}
                            >
                              <option value="todo">To Do</option>
                              <option value="ongoing">On-Going</option>
                              <option value="completed">Completed</option>
                            </select>
                            <span className={`flex-1 ${subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {subtask.title}
                            </span>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {subtask.todoDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Start: {subtask.todoDate}</span>
                                </div>
                              )}
                              {subtask.deadline && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-red-500" />
                                  <span>Due: {subtask.deadline}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteSubtask(task.id, subtask.id)}
                            className="text-red-600 hover:text-red-700 p-2 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {showSubtaskForm === task.id ? (
                      <div className="bg-white p-4 rounded-md border-2 border-blue-200">
                        <input
                          type="text"
                          placeholder="Subtask title"
                          value={newSubtask.title}
                          onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
                        />
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={newSubtask.status}
                            onChange={(e) => setNewSubtask({ ...newSubtask, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="todo">To Do</option>
                            <option value="ongoing">On-Going</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To-Do Date</label>
                            <input
                              type="date"
                              value={newSubtask.todoDate}
                              onChange={(e) => setNewSubtask({ ...newSubtask, todoDate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                              type="date"
                              value={newSubtask.deadline}
                              onChange={(e) => setNewSubtask({ ...newSubtask, deadline: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addSubtask(task.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add Subtask
                          </button>
                          <button
                            onClick={() => {
                              setShowSubtaskForm(null);
                              setNewSubtask({ title: '', todoDate: '', deadline: '', status: 'todo' });
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSubtaskForm(task.id)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Subtask
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {showTaskForm ? (
              <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-200">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setShowTaskForm(false);
                      setNewTask({ title: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTaskForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors border-2 border-dashed border-gray-300"
              >
                <Plus className="w-5 h-5" />
                Add New Task
              </button>
            )}
          </div>
        )}

        {/* Table View */}
        {view === 'table' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtask</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To-Do Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getAllSubtasks().map(subtask => (
                  <tr key={`${subtask.taskId}-${subtask.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={subtask.status}
                        onChange={(e) => updateSubtaskStatus(subtask.taskId, subtask.id, e.target.value)}
                        className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(subtask.status)}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="ongoing">On-Going</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}>
                        {subtask.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{subtask.taskTitle}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{subtask.todoDate || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={subtask.deadline ? 'text-red-600 font-medium' : 'text-gray-400'}>
                        {subtask.deadline || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteSubtask(subtask.taskId, subtask.id)}
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
      </div>
    </div>
  );
};

export default TaskManager;