const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-={}[]|:;<>?,./'
};

const randomInt = (max) => Math.floor(Math.random() * max);

function generatePassword(length, selectedSets) {
  let allChars = '';
  const guaranteed = [];

  selectedSets.forEach((set) => {
    const chars = CHAR_SETS[set];
    allChars += chars;
    guaranteed.push(chars[randomInt(chars.length)]);
  });

  const output = [...guaranteed];
  while (output.length < length) {
    output.push(allChars[randomInt(allChars.length)]);
  }

  return output.sort(() => Math.random() - 0.5).join('');
}

export function renderPassword() {
  const container = document.querySelector('#password-content');
  if (!container) return;

  container.innerHTML = `
    <form id="password-form" class="profile-form" novalidate>
      <div class="form-grid">
        <label>Password length<input name="length" type="number" min="6" max="32" value="12" required /></label>
        <label><input type="checkbox" name="uppercase" checked /> Include uppercase letters</label>
        <label><input type="checkbox" name="lowercase" checked /> Include lowercase letters</label>
        <label><input type="checkbox" name="numbers" checked /> Include numbers</label>
        <label><input type="checkbox" name="symbols" /> Include symbols</label>
      </div>
      <button type="submit">Generate Password</button>
      <p id="password-message" class="form-message"></p>
    </form>
    <article class="card">
      <p><strong>Generated Password:</strong></p>
      <p id="generated-password">-</p>
      <button type="button" id="copy-password">Copy to Clipboard</button>
    </article>
  `;

  const form = container.querySelector('#password-form');
  const message = container.querySelector('#password-message');
  const output = container.querySelector('#generated-password');
  const copyBtn = container.querySelector('#copy-password');

  const setMessage = (text, type) => {
    message.textContent = text;
    message.className = `form-message ${type}`;
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const length = Number(data.get('length'));
    const selectedSets = ['uppercase', 'lowercase', 'numbers', 'symbols'].filter((key) => data.get(key) === 'on');

    if (!Number.isInteger(length) || length < 6 || length > 32) {
      setMessage('Password length must be between 6 and 32.', 'error');
      return;
    }

    if (!selectedSets.length) {
      setMessage('Select at least one character option.', 'error');
      return;
    }

    const password = generatePassword(length, selectedSets);
    output.textContent = password;
    setMessage('Password generated successfully.', 'success');
  });

  copyBtn?.addEventListener('click', async () => {
    const text = output.textContent || '';
    if (!text || text === '-') {
      setMessage('Generate a password before copying.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setMessage('Password copied to clipboard.', 'success');
    } catch (error) {
      setMessage('Clipboard access failed. Copy manually.', 'error');
    }
  });
}
