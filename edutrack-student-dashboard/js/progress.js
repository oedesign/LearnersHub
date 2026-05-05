import { defaultLearningWeeks } from './data.js';
import { getFromStorage, saveToStorage } from './storage.js';

const PROGRESS_KEY = 'edutrack_progress';

const makeDefaultProgress = () => defaultLearningWeeks.map((topic, index) => ({
  week: index + 1,
  topic,
  completed: false
}));

export function renderProgress(onProgressChange = () => {}) {
  const container = document.querySelector('#progress-content');
  if (!container) return;

  let weeks = getFromStorage(PROGRESS_KEY, makeDefaultProgress());
  if (!Array.isArray(weeks) || weeks.length !== defaultLearningWeeks.length) {
    weeks = makeDefaultProgress();
  }

  const sync = () => {
    saveToStorage(PROGRESS_KEY, weeks);
    onProgressChange(weeks);
  };

  container.innerHTML = `
    <div class="progress-toolbar">
      <button data-filter="all" class="filter-btn active">All</button>
      <button data-filter="completed" class="filter-btn">Completed</button>
      <button data-filter="incomplete" class="filter-btn">Incomplete</button>
    </div>
    <div id="progress-summary"></div>
    <div class="progress-track"><div id="progress-bar" class="progress-bar"></div></div>
    <div id="weeks-list"></div>
  `;

  const summaryEl = container.querySelector('#progress-summary');
  const barEl = container.querySelector('#progress-bar');
  const listEl = container.querySelector('#weeks-list');
  let activeFilter = 'all';

  const render = () => {
    const completedCount = weeks.filter((w) => w.completed).length;
    const incompleteCount = weeks.length - completedCount;
    const percentage = Math.round((completedCount / weeks.length) * 100);

    summaryEl.innerHTML = `
      <div class="card-grid">
        <article class="card"><p>Progress</p><p class="value">${percentage}%</p></article>
        <article class="card"><p>Completed Weeks</p><p class="value">${completedCount}</p></article>
        <article class="card"><p>Incomplete Weeks</p><p class="value">${incompleteCount}</p></article>
      </div>
    `;

    barEl.style.width = `${percentage}%`;

    const filtered = weeks.filter((week) => {
      if (activeFilter === 'completed') return week.completed;
      if (activeFilter === 'incomplete') return !week.completed;
      return true;
    });

    listEl.innerHTML = `
      <div class="card-grid">
        ${filtered.map((week) => `
          <article class="card">
            <p><strong>Week ${week.week}</strong></p>
            <p>${week.topic}</p>
            <p>Status: ${week.completed ? 'Completed' : 'Incomplete'}</p>
            <button data-week="${week.week}">${week.completed ? 'Mark Incomplete' : 'Mark Completed'}</button>
          </article>
        `).join('')}
      </div>
    `;
  };

  container.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      container.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  container.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-week]');
    if (!button) return;

    const weekNumber = Number(button.dataset.week);
    weeks = weeks.map((week) => (week.week === weekNumber ? { ...week, completed: !week.completed } : week));
    sync();
    render();
  });

  sync();
  render();
}
