import { defaultQuotes } from './data.js';
import { getFromStorage, saveToStorage } from './storage.js';

const FAVORITES_KEY = 'edutrack_favorite_quotes';

const randomFrom = (items) => items[Math.floor(Math.random() * items.length)];

export function renderQuotes() {
  const container = document.querySelector('#quotes-content');
  if (!container) return;

  let favorites = getFromStorage(FAVORITES_KEY, []);
  if (!Array.isArray(favorites)) favorites = [];
  favorites = favorites.filter((q) => typeof q === "string" && q.trim());

  let currentQuote = randomFrom(defaultQuotes) || "Stay focused and keep learning.";

  container.innerHTML = `
    <article class="card">
      <h4>Quote of the Moment</h4>
      <blockquote id="current-quote">"${currentQuote}"</blockquote>
      <div class="course-actions">
        <button id="new-quote">New Quote</button>
        <button id="save-quote">Save Favorite</button>
      </div>
      <p id="quotes-message" class="form-message"></p>
    </article>
    <div id="favorite-quotes"></div>
  `;

  const message = container.querySelector('#quotes-message');
  const quoteEl = container.querySelector('#current-quote');
  const favoritesEl = container.querySelector('#favorite-quotes');

  const setMessage = (text, type) => {
    message.textContent = text;
    message.className = `form-message ${type}`;
  };

  const renderFavorites = () => {
    if (!favorites.length) {
      favoritesEl.innerHTML = '<p class="empty-state">No favorite quotes yet. Save one to get started.</p>';
      return;
    }

    favoritesEl.innerHTML = `
      <div class="card-grid">
        ${favorites.map((quote, index) => `
          <article class="card">
            <blockquote>"${quote || ""}"</blockquote>
            <button data-delete="${index}">Delete</button>
          </article>
        `).join('')}
      </div>
    `;
  };

  container.querySelector('#new-quote')?.addEventListener('click', () => {
    if (defaultQuotes.length < 2) return;
    let next = randomFrom(defaultQuotes);
    while (next === currentQuote) {
      next = randomFrom(defaultQuotes);
    }
    currentQuote = next;
    quoteEl.textContent = `"${currentQuote}"`;
    setMessage('Loaded a new quote.', 'success');
  });

  container.querySelector('#save-quote')?.addEventListener('click', () => {
    if (favorites.includes(currentQuote)) {
      setMessage('That quote is already in favorites.', 'error');
      return;
    }

    favorites = [currentQuote, ...favorites].filter((q, i, arr) => arr.indexOf(q) === i);
    saveToStorage(FAVORITES_KEY, favorites);
    setMessage('Quote saved to favorites.', 'success');
    renderFavorites();
  });

  container.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-delete]');
    if (!btn) return;
    const index = Number(btn.dataset.delete);
    if (!Number.isInteger(index) || index < 0 || index >= favorites.length) return;
    if (!confirm('Delete this favorite quote?')) return;
    favorites = favorites.filter((_, i) => i !== index);
    saveToStorage(FAVORITES_KEY, favorites);
    setMessage('Favorite quote removed.', 'success');
    renderFavorites();
  });

  renderFavorites();
}
