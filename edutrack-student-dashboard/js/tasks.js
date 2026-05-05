import { getFromStorage, saveToStorage } from './storage.js';

const TASKS_KEY = 'edutrack_tasks';

const createId = () => {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const safe = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const isOverduePending = (task) => task.status === 'Pending' && task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString());

export function renderTasks(onTasksChange = () => {}) {
  const container = document.querySelector('#tasks-content');
  if (!container) return;

  let tasks = getFromStorage(TASKS_KEY, []);
  if (!Array.isArray(tasks)) tasks = [];
  tasks = tasks.filter((t) => t && typeof t === "object");
  let editingId = null;

  const sync = () => {
    saveToStorage(TASKS_KEY, tasks);
    onTasksChange(tasks);
  };

  container.innerHTML = `
    <form id="task-form" class="profile-form" novalidate>
      <div class="form-grid">
        <label>Task title<input name="title" required /></label>
        <label>Course name<input name="courseName" required /></label>
        <label>Description<input name="description" /></label>
        <label>Due date<input name="dueDate" type="date" required /></label>
        <label>Priority
          <select name="priority" required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <label>Status
          <select name="status" required>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
      </div>
      <button type="submit" id="task-submit">Add Task</button>
      <p id="task-message" class="form-message"></p>
    </form>

    <div class="task-controls form-grid">
      <label>Search by title<input id="task-search" placeholder="Search tasks..." /></label>
      <label>Filter by priority
        <select id="task-priority-filter">
          <option value="all">All</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
        </select>
      </label>
      <label>Filter by course<input id="task-course-filter" placeholder="e.g. JavaScript" /></label>
      <label>Filter by status
        <select id="task-status-filter">
          <option value="all">All</option><option value="Pending">Pending</option><option value="Completed">Completed</option>
        </select>
      </label>
    </div>

    <div id="tasks-list"></div>
  `;

  const form = container.querySelector('#task-form');
  const message = container.querySelector('#task-message');
  const submitBtn = container.querySelector('#task-submit');

  const setMessage = (text, type) => {
    message.textContent = text;
    message.className = `form-message ${type}`;
  };

  const renderList = () => {
    const search = (container.querySelector('#task-search')?.value || '').toLowerCase().trim();
    const priority = container.querySelector('#task-priority-filter')?.value || 'all';
    const course = (container.querySelector('#task-course-filter')?.value || '').toLowerCase().trim();
    const status = container.querySelector('#task-status-filter')?.value || 'all';

    const filtered = tasks.filter((task) => {
      const title = String(task.title || "").toLowerCase();
      const courseName = String(task.courseName || "").toLowerCase();
      const taskPriority = String(task.priority || "Low");
      const taskStatus = String(task.status || "Pending");
      const byTitle = title.includes(search);
            const byPriority = priority === 'all' || taskPriority === priority;
      const byCourse = !course || courseName.includes(course);
            const byStatus = status === 'all' || taskStatus === status;
      return byTitle && byPriority && byCourse && byStatus;
    });

    const list = container.querySelector('#tasks-list');
    if (!list) return;

    if (!filtered.length) {
      list.innerHTML = '<p class="empty-state">No tasks found. Add your first assignment.</p>';
      return;
    }

    list.innerHTML = `
      <div class="card-grid">
        ${filtered.map((task) => `
          <article class="card ${isOverduePending(task) ? 'overdue-task' : ''}">
            <h4>${safe(task.title)}</h4>
            <p><strong>Course:</strong> ${safe(task.courseName)}</p>
            <p>${safe(task.description || 'No description')}</p>
            <p><strong>Due:</strong> ${safe(task.dueDate)}</p>
            <p><strong>Priority:</strong> ${safe(task.priority)}</p>
            <p><strong>Status:</strong> ${safe(task.status)}</p>
            ${isOverduePending(task) ? '<p class="overdue-text">Overdue</p>' : ''}
            <div class="course-actions">
              <button data-action="toggle" data-id="${task.id}">${task.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}</button>
              <button data-action="edit" data-id="${task.id}">Edit</button>
              <button data-action="delete" data-id="${task.id}">Delete</button>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.title.trim() || !data.courseName.trim() || !data.dueDate || !data.priority.trim() || !data.status.trim()) {
      setMessage('Please fill in all required fields.', 'error');
      return;
    }

    const normalized = {
      id: editingId || createId(),
      title: data.title.trim(),
      courseName: data.courseName.trim(),
      description: data.description.trim(),
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status
    };

    if (editingId) {
      tasks = tasks.map((task) => (task.id === editingId ? normalized : task));
      setMessage('Task updated successfully.', 'success');
    } else {
      tasks = [normalized, ...tasks];
      setMessage('Task added successfully.', 'success');
    }

    editingId = null;
    submitBtn.textContent = 'Add Task';
    form.reset();
    form.elements.priority.value = 'Low';
    form.elements.status.value = 'Pending';
    sync();
    renderList();
  });

  container.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, id } = button.dataset;
    const selected = tasks.find((task) => task.id === id);
    if (!selected) return;

    if (action === 'delete') {
      if (!confirm('Delete this task?')) return;
      tasks = tasks.filter((task) => task.id !== id);
      setMessage('Task deleted.', 'success');
      sync();
      renderList();
      return;
    }

    if (action === 'toggle') {
      tasks = tasks.map((task) => (task.id === id
        ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
        : task));
      setMessage('Task status updated.', 'success');
      sync();
      renderList();
      return;
    }

    if (action === 'edit') {
      editingId = id;
      form.elements.title.value = selected.title;
      form.elements.courseName.value = selected.courseName;
      form.elements.description.value = selected.description;
      form.elements.dueDate.value = selected.dueDate;
      form.elements.priority.value = selected.priority;
      form.elements.status.value = selected.status;
      submitBtn.textContent = 'Save Changes';
      setMessage('Editing task. Update fields and save.', 'success');
    }
  });

  container.querySelector('#task-search')?.addEventListener('input', renderList);
  container.querySelector('#task-priority-filter')?.addEventListener('change', renderList);
  container.querySelector('#task-course-filter')?.addEventListener('input', renderList);
  container.querySelector('#task-status-filter')?.addEventListener('change', renderList);

  renderList();
}
