export function renderTools() {
  const container = document.querySelector('#tools-content');
  if (!container) return;

  container.innerHTML = `
    <div class="card-grid">
      <article class="card" id="calc-card">
        <h4>1) Simple Calculator</h4>
        <input id="calc-a" type="number" placeholder="First number" />
        <select id="calc-op"><option>+</option><option>-</option><option>*</option><option>/</option></select>
        <input id="calc-b" type="number" placeholder="Second number" />
        <button id="calc-run">Calculate</button>
        <p id="calc-result" class="form-message"></p>
      </article>

      <article class="card" id="guess-card">
        <h4>2) Number Guessing Game</h4>
        <input id="guess-input" type="number" min="1" max="100" placeholder="Guess 1-100" />
        <button id="guess-btn">Guess</button>
        <p id="guess-msg" class="form-message"></p>
      </article>

      <article class="card" id="table-card">
        <h4>3) Multiplication Table</h4>
        <input id="table-num" type="number" placeholder="Enter a number" />
        <button id="table-btn">Generate</button>
        <pre id="table-output"></pre>
      </article>

      <article class="card" id="counter-card">
        <h4>4) Closure Counter</h4>
        <p id="counter-value">0</p>
        <div class="course-actions">
          <button id="counter-inc">Increment</button>
          <button id="counter-dec">Decrement</button>
          <button id="counter-reset">Reset</button>
        </div>
      </article>

      <article class="card" id="delay-card">
        <h4>5) Delayed Message App</h4>
        <input id="delay-ms" type="number" min="0" placeholder="Delay ms" />
        <input id="delay-text" placeholder="Message" />
        <button id="delay-btn">Show Delayed Message</button>
        <p id="delay-output" class="form-message"></p>
      </article>
    </div>
  `;

  // Calculator
  container.querySelector('#calc-run')?.addEventListener('click', () => {
    const a = Number(container.querySelector('#calc-a')?.value);
    const b = Number(container.querySelector('#calc-b')?.value);
    const op = container.querySelector('#calc-op')?.value;
    const out = container.querySelector('#calc-result');

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      out.textContent = 'Please enter valid numbers.';
      out.className = 'form-message error';
      return;
    }

    let result;
    if (op === '+') result = a + b;
    if (op === '-') result = a - b;
    if (op === '*') result = a * b;
    if (op === '/') {
      if (b === 0) {
        out.textContent = 'Cannot divide by zero.';
        out.className = 'form-message error';
        return;
      }
      result = a / b;
    }

    out.textContent = `Result: ${result}`;
    out.className = 'form-message success';
  });

  // Guessing game
  let secret = Math.floor(Math.random() * 100) + 1;
  container.querySelector('#guess-btn')?.addEventListener('click', () => {
    const guess = Number(container.querySelector('#guess-input')?.value);
    const msg = container.querySelector('#guess-msg');

    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      msg.textContent = 'Enter an integer between 1 and 100.';
      msg.className = 'form-message error';
      return;
    }

    if (guess < secret) {
      msg.textContent = 'Too low! Try again.';
      msg.className = 'form-message';
    } else if (guess > secret) {
      msg.textContent = 'Too high! Try again.';
      msg.className = 'form-message';
    } else {
      msg.textContent = 'Correct! New number generated.';
      msg.className = 'form-message success';
      secret = Math.floor(Math.random() * 100) + 1;
    }
  });

  // Multiplication table
  container.querySelector('#table-btn')?.addEventListener('click', () => {
    const n = Number(container.querySelector('#table-num')?.value);
    const output = container.querySelector('#table-output');

    if (!Number.isFinite(n)) {
      output.textContent = 'Enter a valid number.';
      return;
    }

    const lines = [];
    for (let i = 1; i <= 10; i += 1) {
      lines.push(`${n} x ${i} = ${n * i}`);
    }
    output.textContent = lines.join('\n');
  });

  // Closure counter
  const createCounter = () => {
    let count = 0;
    return {
      inc: () => { count += 1; return count; },
      dec: () => { count -= 1; return count; },
      reset: () => { count = 0; return count; }
    };
  };

  const counter = createCounter();
  const counterValue = container.querySelector('#counter-value');
  container.querySelector('#counter-inc')?.addEventListener('click', () => { counterValue.textContent = counter.inc(); });
  container.querySelector('#counter-dec')?.addEventListener('click', () => { counterValue.textContent = counter.dec(); });
  container.querySelector('#counter-reset')?.addEventListener('click', () => { counterValue.textContent = counter.reset(); });

  // Delayed message
  container.querySelector('#delay-btn')?.addEventListener('click', () => {
    const ms = Number(container.querySelector('#delay-ms')?.value);
    const text = (container.querySelector('#delay-text')?.value || '').trim();
    const output = container.querySelector('#delay-output');

    if (!Number.isFinite(ms) || ms < 0) {
      output.textContent = 'Enter a valid delay in milliseconds.';
      output.className = 'form-message error';
      return;
    }

    if (!text) {
      output.textContent = 'Enter a message.';
      output.className = 'form-message error';
      return;
    }

    output.textContent = `Waiting ${ms}ms...`;
    output.className = 'form-message';
    setTimeout(() => {
      output.textContent = text;
      output.className = 'form-message success';
    }, ms);
  });
}
