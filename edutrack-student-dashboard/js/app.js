import {
  STORAGE_KEYS,
  defaultData,
  defaultLearningWeeks,
  defaultQuizQuestions,
  defaultQuotes
} from './data.js';
import { getFromStorage, saveToStorage } from './storage.js';
import { renderDashboard } from './dashboard.js';
import { renderProfile } from './profile.js';
import { renderCourses } from './courses.js';
import { renderTasks } from './tasks.js';
import { renderProgress } from './progress.js';
import { renderGrades } from './grades.js';
import { renderQuiz } from './quiz.js';
import { renderPassword } from './password.js';
import { renderQuotes } from './quotes.js';
import { renderApiResource } from './api.js';
import { renderTools } from './tools.js';

const state = getFromStorage(STORAGE_KEYS.APP_STATE, defaultData);

const seedStorage = () => {
  const defaults = [
    [STORAGE_KEYS.APP_STATE, state],
    [STORAGE_KEYS.LEARNING_WEEKS, defaultLearningWeeks],
    [STORAGE_KEYS.QUIZ_QUESTIONS, defaultQuizQuestions],
    [STORAGE_KEYS.QUOTES, defaultQuotes]
  ];

  defaults.forEach(([key, fallback]) => {
    saveToStorage(key, getFromStorage(key, fallback));
  });
};

const setActiveSection = (targetId, label) => {
  const navLinks = document.querySelectorAll('.nav-link');
  const panels = document.querySelectorAll('.panel');
  const sectionTitle = document.querySelector('#section-title');

  navLinks.forEach((link) => {
    const linkTarget = link.getAttribute('href')?.slice(1);
    link.classList.toggle('active', linkTarget === targetId);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active-panel', panel.id === targetId);
  });

  if (sectionTitle) sectionTitle.textContent = label;
};

const initializeNavigation = () => {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href')?.slice(1) ?? 'dashboard';
      const label = link.textContent?.trim() || 'Dashboard';
      setActiveSection(targetId, label);
    });
  });

  setActiveSection('dashboard', 'Dashboard');
};

const refreshDashboard = () => renderDashboard();

const renderAll = () => {
  refreshDashboard();
  renderProfile(refreshDashboard);
  renderCourses(refreshDashboard);
  renderTasks(refreshDashboard);
  renderProgress(refreshDashboard);
  renderGrades(refreshDashboard);
  renderQuiz(refreshDashboard);
  renderPassword();
  renderQuotes();
  renderApiResource();
  renderTools();
};

seedStorage();
initializeNavigation();
renderAll();
