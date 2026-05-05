import { defaultQuizQuestions } from './data.js';
import { getFromStorage, saveToStorage } from './storage.js';

const BEST_SCORE_KEY = 'edutrack_best_quiz_score';

const quizMeta = {
  let: { options: ['var', 'let', 'const', 'define'], explanation: '`let` creates a block-scoped variable.' },
  object: { options: ['array', 'number', 'object', 'string'], explanation: 'Arrays are a specialized type of object in JavaScript.' },
  push: { options: ['pop', 'shift', 'push', 'unshift'], explanation: '`push` appends elements to the end of an array.' },
  'Document Object Model': { options: ['Data Object Method', 'Document Object Model', 'Digital Object Mapping', 'Document Oriented Module'], explanation: 'DOM stands for Document Object Model.' },
  'JSON.parse': { options: ['JSON.parse', 'JSON.stringify', 'Object.assign', 'parseJSON'], explanation: '`JSON.parse` converts JSON text to a JavaScript object.' },
  '===': { options: ['==', '===', '=', '!=='], explanation: '`===` compares both value and type.' },
  'try...catch': { options: ['if...else', 'switch', 'try...catch', 'throw...break'], explanation: 'Errors are handled with try/catch blocks.' },
  'do...while': { options: ['for', 'while', 'do...while', 'for...of'], explanation: 'A do...while loop runs at least once before checking the condition.' },
  setTimeout: { options: ['setInterval', 'setTimeout', 'queueMicrotask', 'requestAnimationFrame'], explanation: '`setTimeout` runs code once after a delay.' },
  localStorage: { options: ['sessionData', 'cacheStore', 'localStorage', 'indexedVar'], explanation: 'localStorage provides key-value storage in the browser.' },
  Promises: { options: ['Callbacks', 'Promises', 'Events', 'Generators'], explanation: 'async/await is syntactic sugar over Promises.' },
  fetch: { options: ['axios', 'XMLHttpRequest', 'request', 'fetch'], explanation: '`fetch` is the modern built-in API for HTTP requests.' }
};

const buildQuiz = () => defaultQuizQuestions.map((question, index) => {
  const meta = quizMeta[question.answer] || { options: [question.answer], explanation: 'Review this concept.' };
  const options = Array.from(new Set([...meta.options, question.answer])).slice(0, 4);
  return { id: index + 1, question: question.question, answer: question.answer, options, explanation: meta.explanation };
});

export function renderQuiz(onQuizChange = () => {}) {
  const container = document.querySelector('#quiz-content');
  if (!container) return;

  const questions = buildQuiz();
  const readBestScore = () => Number(getFromStorage(BEST_SCORE_KEY, 0)) || 0;

  const render = (results = null) => {
    const bestScore = readBestScore();
    container.innerHTML = `
      <p><strong>Best Score:</strong> ${bestScore}%</p>
      <form id="quiz-form" class="quiz-form">
        ${questions.map((q) => `
          <article class="card">
            <p><strong>Q${q.id}:</strong> ${q.question}</p>
            ${q.options.map((opt) => `
              <label><input type="radio" name="q-${q.id}" value="${opt}" /> ${opt}</label>
            `).join('')}
            ${results ? `<p><strong>Correct:</strong> ${q.answer}</p><p>${q.explanation}</p>` : ''}
          </article>
        `).join('')}
        <button type="submit">Submit Quiz</button>
        <button type="button" id="retake-quiz">Retake Quiz</button>
      </form>
      <div id="quiz-result"></div>
    `;

    if (results) {
      const panel = container.querySelector('#quiz-result');
      panel.innerHTML = `<article class="card"><p><strong>Score:</strong> ${results.score}%</p><p>${results.passed ? 'Pass ✅' : 'Fail ❌'} (${results.correct}/${questions.length} correct)</p></article>`;
    }

    container.querySelector('#quiz-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let correct = 0;

      questions.forEach((q) => {
        if (data.get(`q-${q.id}`) === q.answer) correct += 1;
      });

      const score = Math.round((correct / questions.length) * 100);
      const passed = score >= 60;
      const previousBest = Number(getFromStorage(BEST_SCORE_KEY, 0)) || 0;
      const nextBest = Math.max(previousBest, score);
      saveToStorage(BEST_SCORE_KEY, nextBest);
      onQuizChange(nextBest);
      render({ score, passed, correct });
    });

    container.querySelector('#retake-quiz')?.addEventListener('click', () => {
      render();
    });
  };

  render();
}
