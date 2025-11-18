import React, { useEffect, useState, useMemo, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { XMarkIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";

// --- Task Modal Component ---
const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const todayStr = new Date().toISOString().split("T")[0];

  const isPastDate = (d) => {
    if (!d) return false;
    const sel = new Date(d);
    sel.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sel < today;
  };

  // Fill fields when opening modal
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setDueDate(task.dueDate || "");
      } else {
        setTitle("");
        setDescription("");
        setDueDate("");
      }
      setError("");
    }
  }, [task, isOpen]);

  // Handle click outside
  const handleClickOutside = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // disallow past due dates (both create and edit)
    if (dueDate && isPastDate(dueDate)) {
      setError("Due date cannot be in the past.");
      return;
    }

    onSave({
      ...task,
      title,
      description,
      dueDate,
      status: task?.status || "pending",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-stretch bg-black/40 backdrop-blur-[2px] transition-all duration-500">
      {/* Slide Panel */}
      <div
        ref={panelRef}
        className="bg-white/90 backdrop-blur-lg shadow-2xl h-full w-full max-w-md transform transition-transform duration-500 ease-out rounded-l-2xl p-6 overflow-y-auto translate-x-0"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {task ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-transform transform hover:rotate-90"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows="3"
              placeholder="Add details or notes..."
            ></textarea>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (error) setError("");
                }}
                min={todayStr}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!(title.trim() && !(dueDate && isPastDate(dueDate)))}
                className={`px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all ${
                  !(title.trim() && !(dueDate && isPastDate(dueDate)))
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {task ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sidebar Component ---
const Sidebar = ({
  user,
  logout,
  filter,
  setFilter,
  pendingCount,
  isOpen = true,
  onClose = () => {},
}) => {
  return (
    <>
      {/* Overlay for small screens */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 shadow-2xl p-6 flex flex-col border-r border-gray-100 bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-md bg-gray-100"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 011.06 0L10 7.88l2.66-2.66a.75.75 0 111.06 1.06L11.06 8.94l2.66 2.66a.75.75 0 11-1.06 1.06L10 10.0l-2.66 2.66a.75.75 0 11-1.06-1.06L8.94 8.94 6.28 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-teal-400 flex items-center justify-center shadow-md">
            <UserIcon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg leading-tight truncate">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
          <p className="text-sm text-gray-500">Pending Tasks</p>
          <p className="text-2xl font-semibold text-indigo-600">{pendingCount}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {["pending", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              // close sidebar on small screens after selecting
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg font-medium transition-all ${
              filter === status
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
            }`}
          >
            {status === "pending" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4"
                />
              </svg>
            )}
            <span className="capitalize">{status}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200 shadow-sm"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </button>
      </aside>
    </>
  );
};

// --- Dashboard Component ---
const Dashboard = () => {
  const { user, logout } = useAuth();
  const token = Cookies.get("jwt");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // control which date sections are expanded
  const [openSections, setOpenSections] = useState({
    today: true,
    tomorrow: false,
    later: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/tasks/${user.id}`);
        if (res.ok) setTasks(await res.json());
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [user, token]);

  if (!user && token)
    return (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-semibold text-blue-700 tracking-wide">
        Loading...
      </p>
    </div>
  </div>
);

  if (!user && !token) return <Navigate to="/" replace />;

  const groupTasksByDate = (tasks) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formatDate = (d) => d.toISOString().split("T")[0];
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    const grouped = { today: [], tomorrow: [], later: [] };
    tasks.forEach((task) => {
      const date = task.dueDate || todayStr;
      if (date === todayStr) grouped.today.push(task);
      else if (date === tomorrowStr) grouped.tomorrow.push(task);
      else grouped.later.push(task);
    });
    return grouped;
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const groupedTasks = groupTasksByDate(filteredTasks);

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskToSave) => {
    const isUpdating = !!taskToSave.id;
    const url = isUpdating
      ? `http://localhost:8080/api/tasks/edit/${taskToSave.id}`
      : `http://localhost:8080/api/new-task`;
    const method = isUpdating ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskToSave,
          userId: user.id,
          // preserve existing status when updating; default to 'pending' for new tasks
          status: taskToSave.status || "pending",
        }),
      });
      if (res.ok) {
        const savedTask = await res.json();
        setTasks((prev) =>
          isUpdating
            ? prev.map((t) => (t.id === savedTask.id ? savedTask : t))
            : [...prev, savedTask]
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map((t) => (t.id === id ? updated : t)));
      }else {
      console.error("Failed to update task status:", res.status);
    }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
      />

      {/* Add Sidebar */}
      <Sidebar
        user={user}
        logout={logout}
        filter={filter}
        setFilter={setFilter}
        pendingCount={tasks.filter((task) => task.status === "pending").length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

  {/* Adjust main content margin */}
  <div className="ml-0 md:ml-64 z-10 min-h-screen">
        <div className="max-w-6xl mx-auto p-6 mt-10">
          {/* Header - simplified */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg bg-white shadow-sm"
                aria-label="Open sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5h14a1 1 0 100-2H3a1 1 0 000 2zm14 6H3a1 1 0 100 2h14a1 1 0 100-2zm0 6H3a1 1 0 100 2h14a1 1 0 100-2z" clipRule="evenodd" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                {filter === "pending" ? "Pending Tasks" : "Completed Tasks"}
              </h1>
            </div>
            <button
              onClick={openNewTaskModal}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">New Task</span>
            </button>
          </div>

          {/* Progress Bar removed per request */}

          {/* Task Lists */}
          {filter === "pending" ? (
            // Pending Tasks grouped by today/tomorrow/later with collapsible sections
            ["today", "tomorrow", "later"].map((section) => {
              const pretty =
                section === "later"
                  ? "Later"
                  : section.charAt(0).toUpperCase() + section.slice(1);
              const count = groupedTasks[section]?.length || 0;
              const isOpen = !!openSections[section];
              return (
                <div key={section} className="mb-6">
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-fit flex items-center justify-between bg-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        {pretty}
                      </span>
                      <span className="bg-gray-300 text-sm text-gray-800 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-600 transform transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.063a.75.75 0 111.12 1l-4.25 4.656a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className={`${isOpen ? "block" : "hidden"} mt-3`}>
                    {count === 0 ? (
                      <p className="text-gray-400 italic">
                        No {section} tasks.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {groupedTasks[section].map((task) => (
                          <li
                            key={task.id}
                            onClick={() => openEditTaskModal(task)}
                            className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-stretch w-full">
                              {/* left accent */}
                              <div
                                className={`w-1 rounded-l-xl mr-3 ${
                                  section === "today"
                                    ? "bg-indigo-500"
                                    : section === "tomorrow"
                                    ? "bg-emerald-400"
                                    : "bg-slate-300"
                                }`}
                              />

                              <div className="flex items-center gap-4 w-full">
                                <input
                                  type="checkbox"
                                  checked={task.status === "completed"}
                                  onChange={() => toggleStatus(task.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <p
                                    className={`font-medium truncate ${
                                      task.status === "completed"
                                        ? "line-through text-slate-400"
                                        : "text-slate-800"
                                    }`}
                                  >
                                    {task.title}
                                  </p>
                                  <p className="text-sm text-slate-500 truncate">
                                    {task.description
                                      ? `${task.description}`
                                      : "-"}
                                  </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  <span className="text-sm text-slate-400">
                                    {task.dueDate || "Today"}
                                  </span>
                                  <button
                                    onClick={(e) => deleteTask(e, task.id)}
                                    className="bg-red-500 hover:bg-red-700 p-1 rounded-md"
                                    title="Delete Task"
                                  >
                                    <TrashIcon className="w-5 h-5  text-white " aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            // Completed Tasks: list all flat
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Completed Tasks
              </h2>
              {filteredTasks.length === 0 ? (
                <p className="text-slate-400 italic">No completed tasks.</p>
              ) : (
                <ul className="space-y-3">
                  {filteredTasks.map((task) => (
                    <li
                      key={task.id}
                      onClick={() => openEditTaskModal(task)}
                      className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-stretch w-full">
                        <div className="w-1 rounded-l-xl mr-3 bg-slate-300" />
                        <div className="flex items-center gap-4 w-full">
                          <input
                            type="checkbox"
                            checked={task.status === "completed"}
                            onChange={() => toggleStatus(task.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 accent-indigo-600 cursor-pointer"
                          />
                          <div className="flex-1">
                                  <p
                                    className={`font-medium truncate ${
                                      task.status === "completed"
                                        ? "line-through text-slate-400"
                                        : "text-slate-800"
                                    }`}
                                  >
                                    {task.title}
                                  </p>
                                  <p className="text-sm text-slate-500 truncate">
                                    {task.description
                                      ? `${task.description}`
                                      : "-"}
                                  </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  <span className="text-sm text-slate-400">
                                    {task.dueDate || "Today"}
                                  </span>
                                  <button
                                    onClick={(e) => deleteTask(e, task.id)}
                                    className="bg-red-500 hover:bg-red-700 p-1 rounded-md"
                                    title="Delete Task"
                                  >
                                    <TrashIcon className="w-5 h-5  text-white " aria-hidden="true" />
                                  </button>
                                </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
