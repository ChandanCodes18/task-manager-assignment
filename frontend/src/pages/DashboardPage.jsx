import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', status: 'todo' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'todo' });

  const fetchTasks = async () => {
    try {
      setError('');
      const response = await api.get('/tasks');
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tasks');
    }
  };

  useEffect(() => {
    // load tasks when dashboard opens
    fetchTasks();
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    try {
      await api.post('/tasks', form);
      setForm({ title: '', description: '', status: 'todo' });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete task');
    }
  };

  const startEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
    });
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditForm({ title: '', description: '', status: 'todo' });
  };

  const updateTask = async (event, taskId) => {
    event.preventDefault();
    try {
      await api.put(`/tasks/${taskId}`, editForm);
      cancelEditTask();
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getTaskOwner = (task) => {
    if (task.userId && typeof task.userId === 'object') {
      return task.userId;
    }
    return { _id: task.userId, email: 'Unknown user', role: 'unknown' };
  };

  const canManageTask = (task) => {
    if (user.role === 'admin') return true;
    const owner = getTaskOwner(task);
    return owner._id === user.id;
  };

  return (
    <div className="container">
      <div className="card between">
        <div>
          <h2>Dashboard</h2>
          <p>
            Signed in as <strong>{user.email}</strong> ({user.role})
          </p>
        </div>
        <button className="secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <h3>Create Task</h3>
        <form onSubmit={createTask}>
          <div className="form-row">
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <textarea
              placeholder="Task description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-row">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>

      <div className="card">
        <h3>All Tasks</h3>
        {tasks.length === 0 ? <p>No tasks yet.</p> : null}
        {tasks.map((task) => {
          const owner = getTaskOwner(task);
          const canManage = canManageTask(task);

          return (
            <div key={task._id} className="task-item">
            {editingTaskId === task._id ? (
              <form onSubmit={(event) => updateTask(event, task._id)}>
                <div className="form-row">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-row">
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="action-row">
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={cancelEditTask}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="between">
                  <strong>{task.title}</strong>
                  <span>{task.status}</span>
                </div>
                <p>{task.description || 'No description'}</p>
                <p>
                  Added by: <strong>{owner.email || 'Unknown user'}</strong> (
                  {owner.role || 'unknown'})
                </p>
                {canManage ? (
                  <div className="action-row">
                    <button type="button" onClick={() => startEditTask(task)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
          );
        })}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
