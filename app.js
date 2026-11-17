const questions = [
  { text: 'Which tag is a heading?', choices: ['h1', 'p', 'div'], answer: 0 },
  { text: 'Which language styles a page?', choices: ['CSS', 'SQL', 'C++'], answer: 0 },
  { text: 'How many days in a week?', choices: ['5', '7', '9'], answer: 1 }
];

const welcomeView = document.getElementById('welcome');
const quizView = document.getElementById('quiz');
const resultsView = document.getElementById('results');
const questionElement = document.getElementById('question');
const questionCount = document.getElementById('question-count');
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');

let currentQuestion = 0;
let score = 0;
let answered = false;

function showView(viewToShow) {
  [welcomeView, quizView, resultsView].forEach((view) => {
    view.hidden = view !== viewToShow;
  });
}

function renderQuestion() {
  const question = questions[currentQuestion];
  questionElement.textContent = question.text;
  questionCount.innerHTML = `QUESTION ${String(currentQuestion + 1).padStart(2, '0')} <span>/ ${String(questions.length).padStart(2, '0')}</span>`;
  answersElement.replaceChildren();
  feedbackElement.textContent = 'Choose the answer that feels right.';
  feedbackElement.className = 'feedback';
  answered = false;
  nextButton.disabled = true;
  nextButton.innerHTML = 'Continue <span class="button-arrow" aria-hidden="true">→</span>';

  question.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    const letter = document.createElement('span');
    const text = document.createElement('span');

    button.type = 'button';
    button.className = 'answer-button';
    button.setAttribute('aria-pressed', 'false');
    letter.className = 'answer-letter';
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = String.fromCharCode(65 + index);
    text.className = 'answer-text';
    text.textContent = choice;
    button.append(letter, text);
    button.addEventListener('click', () => selectAnswer(button, index));
    answersElement.append(button);
  });

  updateProgress(currentQuestion);
}

function updateProgress(completedQuestions) {
  progress.setAttribute('aria-valuenow', String(completedQuestions));
  progressFill.style.width = `${(completedQuestions / questions.length) * 100}%`;
}

function selectAnswer(selectedButton, selectedIndex) {
  if (answered) return;
  answered = true;

  const isCorrect = selectedIndex === questions[currentQuestion].answer;
  if (isCorrect) score += 1;

  const answerButtons = answersElement.querySelectorAll('.answer-button');
  answerButtons.forEach((button, index) => {
    button.disabled = true;
    button.setAttribute('aria-pressed', String(button === selectedButton));
    if (index === selectedIndex) button.classList.add('is-selected');
    if (index === questions[currentQuestion].answer) button.classList.add('is-correct');
    if (button === selectedButton && !isCorrect) button.classList.add('is-incorrect');
  });

  feedbackElement.textContent = isCorrect ? 'That’s right — lovely work!' : 'Not quite — the correct answer is highlighted.';
  feedbackElement.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
  updateProgress(currentQuestion + 1);
  nextButton.disabled = false;

  if (currentQuestion === questions.length - 1) {
    nextButton.innerHTML = 'See my results <span class="button-arrow" aria-hidden="true">→</span>';
  }
}

function showResults() {
  const percentage = Math.round((score / questions.length) * 100);
  document.getElementById('final-score').textContent = String(score);
  document.getElementById('percentage').textContent = `${percentage}%`;

  let message = 'A lovely start — keep that curiosity going.';
  if (score === questions.length) {
    message = 'Brilliant — you got every one!';
  } else if (score >= 2) {
    message = 'Beautifully done — you know your stuff.';
  } else if (score === 1) {
    message = 'Nice work — you’re finding your rhythm.';
  }
  document.getElementById('performance').textContent = message;
  showView(resultsView);
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  updateProgress(0);
  renderQuestion();
  showView(quizView);
}

document.getElementById('start').addEventListener('click', startQuiz);
document.getElementById('play-again').addEventListener('click', startQuiz);

nextButton.addEventListener('click', () => {
  if (!answered) return;
  if (currentQuestion === questions.length - 1) {
    showResults();
    return;
  }

  currentQuestion += 1;
  renderQuestion();
});
