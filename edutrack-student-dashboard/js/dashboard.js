import { STORAGE_KEYS } from './data.js';
import { getFromStorage } from './storage.js';

const safeArray = (value) => (Array.isArray(value) ? value : []);

export function renderDashboard() {
  const appState = getFromStorage(STORAGE_KEYS.APP_STATE, {});
  const profile = getFromStorage('edutrack_profile', {});
  const courses = safeArray(getFromStorage('edutrack_courses', appState.courses || []));
  const tasks = safeArray(getFromStorage('edutrack_tasks', appState.tasks || []));
  const grades = safeArray(appState.grades);
  const lastGradeResult = getFromStorage('edutrack_grades', null);
  const quizScores = safeArray(appState.quizScores);
  const bestQuizScoreSaved = Number(getFromStorage('edutrack_best_quiz_score', 0)) || 0;
  const learningWeeks = safeArray(getFromStorage('edutrack_progress', appState.learningWeeks || []));

  const totalCourses = courses.length;
  const completedCourses = courses.filter((course) => course.status === 'Completed' || Boolean(course.completed)).length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending' || task.done === false).length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed' || task.done === true).length;

  const averageGrade = lastGradeResult?.average !== undefined
    ? Math.round(Number(lastGradeResult.average) || 0)
    : (grades.length
      ? Math.round(grades.reduce((sum, grade) => sum + (Number(grade.score) || 0), 0) / grades.length)
      : 0);

  const bestQuizScore = Math.max(
    bestQuizScoreSaved,
    quizScores.length ? Math.max(...quizScores.map((score) => Number(score) || 0)) : 0
  );

  const completedWeeks = learningWeeks.filter((week) => week.completed).length;
  const learningProgress = learningWeeks.length
    ? Math.round((completedWeeks / learningWeeks.length) * 100)
    : 0;

  const el = document.querySelector('#dashboard-content');
  if (!el) return;

  el.innerHTML = `
    <article class="card welcome-card">
      <p>${profile.fullName ? `Welcome back, <strong>${profile.fullName}</strong>!` : 'Welcome to EduTrack! Complete your profile to personalize your dashboard.'}</p>
    </article>
    <div class="card-grid">
      <article class="card"><p>Total Courses</p><p class="value">${totalCourses}</p></article>
      <article class="card"><p>Completed Courses</p><p class="value">${completedCourses}</p></article>
      <article class="card"><p>Pending Tasks</p><p class="value">${pendingTasks}</p></article>
      <article class="card"><p>Completed Tasks</p><p class="value">${completedTasks}</p></article>
      <article class="card"><p>Average Grade</p><p class="value">${averageGrade}%</p></article>
      <article class="card"><p>Best Quiz Score</p><p class="value">${bestQuizScore}%</p></article>
      <article class="card"><p>Learning Progress</p><p class="value">${learningProgress}%</p></article>
    </div>
  `;
}
