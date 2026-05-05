const API_URL = 'https://jsonplaceholder.typicode.com/todos/1';

export function renderApiResource() {
  const container = document.querySelector('#api-content');
  if (!container) return;

  container.innerHTML = `
    <article class="card">
      <h4>External API Demo</h4>
      <p>Fetches a sample task from JSONPlaceholder (no API key required).</p>
      <button id="retry-api">Fetch Data</button>
      <p id="api-status" class="form-message"></p>
      <pre id="api-result" class="api-result"></pre>
    </article>
  `;

  const statusEl = container.querySelector('#api-status');
  const resultEl = container.querySelector('#api-result');
  const retryBtn = container.querySelector('#retry-api');

  const setStatus = (text, type = '') => {
    statusEl.textContent = text;
    statusEl.className = `form-message ${type}`;
  };

  const loadData = async () => {
    setStatus('Loading data...', '');
    resultEl.textContent = '';
    retryBtn.disabled = true;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      resultEl.textContent = JSON.stringify(data, null, 2);
      setStatus('Data fetched successfully.', 'success');
    } catch (error) {
      setStatus('Unable to fetch data right now. Please retry. If offline/restricted, the app still works normally.', 'error');
      resultEl.textContent = `Error details: ${error.message}`;
    } finally {
      retryBtn.disabled = false;
      retryBtn.textContent = 'Retry';
    }
  };

  retryBtn?.addEventListener('click', loadData);
  loadData();
}
