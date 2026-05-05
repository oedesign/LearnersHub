import { getFromStorage, saveToStorage } from './storage.js';

const COURSES_KEY = 'edutrack_courses';

const createId = () => {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `course-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export function renderCourses(onCoursesChange = () => {}) {
  const container = document.querySelector('#courses-content');
  if (!container) return;

  let courses = getFromStorage(COURSES_KEY, []);
  if (!Array.isArray(courses)) courses = [];
  courses = courses.filter((c) => c && typeof c === "object");
  let editingId = null;

  const sync = () => {
    saveToStorage(COURSES_KEY, courses);
    onCoursesChange(courses);
  };

  const renderList = () => {
    const searchTerm = (container.querySelector('#course-search')?.value || '').toLowerCase().trim();
    const statusFilter = container.querySelector('#course-status-filter')?.value || 'all';

    const filteredCourses = courses.filter((course) => {
            const title = String(course.title || "").toLowerCase();
      const status = String(course.status || "Not Started");
      const matchesTitle = title.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || status === statusFilter;
      return matchesTitle && matchesStatus;
    });

    const list = container.querySelector('#courses-list');
    if (!list) return;

    if (!filteredCourses.length) {
      list.innerHTML = '<p class="empty-state">No courses found. Add your first course to get started.</p>';
      return;
    }

    list.innerHTML = `
      <div class="card-grid">
        ${filteredCourses.map((course) => `
          <article class="card">
            <h4>${escapeHtml(course.title)}</h4>
            <p>${escapeHtml(course.description || 'No description')}</p>
            <p><strong>Category:</strong> ${escapeHtml(course.category)}</p>
            <p><strong>Status:</strong> ${escapeHtml(course.status)}</p>
            <p><strong>Progress:</strong> ${Number(course.progress) || 0}%</p>
            <div class="course-actions">
              <button data-action="edit" data-id="${course.id}">Edit</button>
              <button data-action="complete" data-id="${course.id}">Mark Completed</button>
              <button data-action="delete" data-id="${course.id}">Delete</button>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  };

  container.innerHTML = `
    <form id="course-form" class="profile-form" novalidate>
      <div class="form-grid">
        <label>Course title<input name="title" required /></label>
        <label>Description<input name="description" /></label>
        <label>Category<input name="category" required /></label>
        <label>Status
          <select name="status" required>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <label>Progress percentage<input name="progress" type="number" min="0" max="100" required value="0" /></label>
      </div>
      <button type="submit" id="course-submit">Add Course</button>
      <p id="course-message" class="form-message"></p>
    </form>

    <div class="course-controls form-grid">
      <label>Search by title<input id="course-search" placeholder="Search courses..." /></label>
      <label>Filter by status
        <select id="course-status-filter">
          <option value="all">All</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
    </div>

    <div id="courses-list"></div>
  `;

  const form = container.querySelector('#course-form');
  const message = container.querySelector('#course-message');
  const submitBtn = container.querySelector('#course-submit');

  const setMessage = (text, type) => {
    message.textContent = text;
    message.className = `form-message ${type}`;
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const course = Object.fromEntries(formData.entries());

    if (!course.title.trim() || !course.category.trim() || !course.status.trim()) {
      setMessage('Please fill in all required fields.', 'error');
      return;
    }

    const progressValue = Number(course.progress);
    if (!Number.isFinite(progressValue) || progressValue < 0 || progressValue > 100) {
      setMessage('Progress percentage must be between 0 and 100.', 'error');
      return;
    }

    const normalized = {
      id: editingId || createId(),
      title: course.title.trim(),
      description: course.description.trim(),
      category: course.category.trim(),
      status: course.status,
      progress: progressValue
    };

    if (normalized.status === 'Completed' && normalized.progress < 100) {
      normalized.progress = 100;
    }

    if (editingId) {
      courses = courses.map((item) => (item.id === editingId ? normalized : item));
      setMessage('Course updated successfully.', 'success');
    } else {
      courses = [normalized, ...courses];
      setMessage('Course added successfully.', 'success');
    }

    editingId = null;
    submitBtn.textContent = 'Add Course';
    form.reset();
    form.elements.status.value = 'Not Started';
    form.elements.progress.value = '0';
    sync();
    renderList();
  });

  container.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;

    const { action, id } = btn.dataset;
    const selected = courses.find((course) => course.id === id);
    if (!selected) return;

    if (action === 'delete') {
      if (!confirm('Delete this course?')) return;
      courses = courses.filter((course) => course.id !== id);
      setMessage('Course deleted.', 'success');
      sync();
      renderList();
      return;
    }

    if (action === 'complete') {
      courses = courses.map((course) => (course.id === id
        ? { ...course, status: 'Completed', progress: 100 }
        : course));
      setMessage('Course marked as completed.', 'success');
      sync();
      renderList();
      return;
    }

    if (action === 'edit') {
      editingId = id;
      form.elements.title.value = selected.title;
      form.elements.description.value = selected.description;
      form.elements.category.value = selected.category;
      form.elements.status.value = selected.status;
      form.elements.progress.value = String(selected.progress);
      submitBtn.textContent = 'Save Changes';
      setMessage('Editing course. Update fields and save.', 'success');
    }
  });

  container.querySelector('#course-search')?.addEventListener('input', renderList);
  container.querySelector('#course-status-filter')?.addEventListener('change', renderList);

  renderList();
}
