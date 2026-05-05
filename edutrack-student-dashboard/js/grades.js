import { getFromStorage, saveToStorage } from './storage.js';

const GRADES_KEY = 'edutrack_grades';

const toNumber = (value) => Number(value);
const isValidScore = (value) => Number.isFinite(value) && value >= 0 && value <= 100;

const getLetterGrade = (average) => {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
};

export function renderGrades(onGradesChange = () => {}) {
  const container = document.querySelector('#grades-content');
  if (!container) return;

  const lastSaved = getFromStorage(GRADES_KEY, null);

  container.innerHTML = `
    <form id="grades-form" class="profile-form" novalidate>
      <div class="form-grid">
        <label>Assignment score<input name="assignment" type="number" min="0" max="100" required /></label>
        <label>Quiz score<input name="quiz" type="number" min="0" max="100" required /></label>
        <label>Project score<input name="project" type="number" min="0" max="100" required /></label>
        <label>Exam score<input name="exam" type="number" min="0" max="100" required /></label>
      </div>
      <button type="submit">Calculate Grade</button>
      <p id="grades-message" class="form-message"></p>
    </form>
    <div id="grades-result"></div>
  `;

  const message = container.querySelector('#grades-message');
  const result = container.querySelector('#grades-result');

  const renderResult = (gradeData) => {
    if (!gradeData) {
      result.innerHTML = '<p class="empty-state">No saved grade result yet.</p>';
      return;
    }

    result.innerHTML = `
      <article class="card">
        <h4>Last Grade Result</h4>
        <p><strong>Total Score:</strong> ${gradeData.total.toFixed(2)}</p>
        <p><strong>Average Score:</strong> ${gradeData.average.toFixed(2)}%</p>
        <p><strong>Letter Grade:</strong> ${gradeData.letter}</p>
        <p><strong>Status:</strong> ${gradeData.pass ? 'Pass ✅' : 'Fail ❌'}</p>
      </article>
    `;
  };

  renderResult(lastSaved);

  container.querySelector('#grades-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const scores = [
      toNumber(values.assignment),
      toNumber(values.quiz),
      toNumber(values.project),
      toNumber(values.exam)
    ];

    if (scores.some((score) => !isValidScore(score))) {
      message.textContent = 'All scores must be valid numbers between 0 and 100.';
      message.className = 'form-message error';
      return;
    }

    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / scores.length;
    const letter = getLetterGrade(average);
    const pass = average >= 60;

    const payload = { total, average, letter, pass, updatedAt: new Date().toISOString() };
    saveToStorage(GRADES_KEY, payload);
    renderResult(payload);
    message.textContent = 'Grade calculated and saved successfully.';
    message.className = 'form-message success';
    onGradesChange(payload);
  });
}
