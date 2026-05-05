import { getFromStorage, saveToStorage } from './storage.js';

const PROFILE_KEY = 'edutrack_profile';

const defaultProfile = {
  fullName: '',
  email: '',
  program: '',
  learningGoal: '',
  currentWeek: '',
  targetCompletionDate: '',
  preferredTheme: 'light'
};

function applyTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
}

function profileCardTemplate(profile) {
  return `
    <article class="card profile-card">
      <h4>Saved Profile</h4>
      <p><strong>Full name:</strong> ${profile.fullName || '-'}</p>
      <p><strong>Email:</strong> ${profile.email || '-'}</p>
      <p><strong>Program:</strong> ${profile.program || '-'}</p>
      <p><strong>Learning goal:</strong> ${profile.learningGoal || '-'}</p>
      <p><strong>Current JS week:</strong> ${profile.currentWeek || '-'}</p>
      <p><strong>Target completion:</strong> ${profile.targetCompletionDate || '-'}</p>
      <p><strong>Theme:</strong> ${profile.preferredTheme || 'light'}</p>
    </article>
  `;
}

export function renderProfile(onProfileUpdate = () => {}) {
  const savedProfile = getFromStorage(PROFILE_KEY, defaultProfile);
  const container = document.querySelector('#profile-content');
  if (!container) return;

  applyTheme(savedProfile.preferredTheme);

  container.innerHTML = `
    <form id="profile-form" class="profile-form" novalidate>
      <div class="form-grid">
        <label>Full name<input name="fullName" required value="${savedProfile.fullName || ''}" /></label>
        <label>Email<input name="email" type="email" required value="${savedProfile.email || ''}" /></label>
        <label>Program or course name<input name="program" required value="${savedProfile.program || ''}" /></label>
        <label>Learning goal<input name="learningGoal" required value="${savedProfile.learningGoal || ''}" /></label>
        <label>Current JavaScript week<input name="currentWeek" type="number" min="1" max="16" required value="${savedProfile.currentWeek || ''}" /></label>
        <label>Target completion date<input name="targetCompletionDate" type="date" required value="${savedProfile.targetCompletionDate || ''}" /></label>
        <label>Preferred theme
          <select name="preferredTheme" required>
            <option value="light" ${savedProfile.preferredTheme === 'light' ? 'selected' : ''}>light</option>
            <option value="dark" ${savedProfile.preferredTheme === 'dark' ? 'selected' : ''}>dark</option>
          </select>
        </label>
      </div>
      <button type="submit">Save Profile</button>
      <p id="profile-message" class="form-message"></p>
    </form>
    <div id="saved-profile">${profileCardTemplate(savedProfile)}</div>
  `;

  const form = container.querySelector('#profile-form');
  const msg = container.querySelector('#profile-message');
  const profileCard = container.querySelector('#saved-profile');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const profile = Object.fromEntries(formData.entries());

    const requiredFields = ['fullName', 'email', 'program', 'learningGoal', 'currentWeek', 'targetCompletionDate', 'preferredTheme'];
    const missing = requiredFields.some((field) => !String(profile[field] || '').trim());

    if (missing) {
      msg.textContent = 'Please complete all required fields.';
      msg.className = 'form-message error';
      return;
    }

    const saveOk = saveToStorage(PROFILE_KEY, profile);
    if (!saveOk) {
      msg.textContent = 'Unable to save profile. Please try again.';
      msg.className = 'form-message error';
      return;
    }

    applyTheme(profile.preferredTheme);
    profileCard.innerHTML = profileCardTemplate(profile);
    msg.textContent = 'Profile saved successfully.';
    msg.className = 'form-message success';
    onProfileUpdate(profile);
  });
}
