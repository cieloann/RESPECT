const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Reveal-on-scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Animated statistics
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target);
    const decimals = Number(el.dataset.decimals || 0);
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, {threshold: 0.5});
document.querySelectorAll(".stat-number").forEach(el => statObserver.observe(el));

// Law modal
const lawModal = document.getElementById("lawModal");
const lawButton = document.getElementById("lawButton");
const modalClose = document.getElementById("modalClose");

function closeModal() {
  lawModal.classList.remove("open");
  document.body.style.overflow = "";
}
lawButton.addEventListener("click", () => {
  lawModal.classList.add("open");
  document.body.style.overflow = "hidden";
});
modalClose.addEventListener("click", closeModal);
document.querySelector("[data-close-modal]").addEventListener("click", closeModal);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

// Quiz
const questions = [
  {
    q: "Someone repeatedly sends you unwanted sexual messages after you asked them to stop. What is a responsible response?",
    a: [
      "Save relevant evidence and seek appropriate help.",
      "Send their private information to everyone.",
      "Threaten them back.",
      "Pretend it never happened and delete all evidence."
    ],
    correct: 0,
    explanation: "Saving evidence and seeking appropriate assistance can support safety and reporting."
  },
  {
    q: "A person wants to post an intimate photo of someone else without that person's permission. What should you do?",
    a: [
      "Share it only with close friends.",
      "Discourage the post and respect the person's privacy and consent.",
      "Add a funny caption before posting.",
      "Repost it so more people can see it."
    ],
    correct: 1,
    explanation: "Private or intimate content should not be shared without consent."
  },
  {
    q: "A fake account is pretending to be your classmate and using the account to harass them. What is an appropriate step?",
    a: [
      "Join the comments to make the joke bigger.",
      "Ignore it because fake accounts never matter.",
      "Keep relevant evidence and use reporting/support channels.",
      "Post the classmate's private information."
    ],
    correct: 2,
    explanation: "Preserving evidence and using reporting or support channels is more responsible than retaliating."
  },
  {
    q: "A friend tells you they are experiencing gender-based online harassment. What is a supportive response?",
    a: [
      "Blame them for posting online.",
      "Tell them to just accept it.",
      "Listen, respect their choices, and help them find appropriate support.",
      "Share the story publicly without asking."
    ],
    correct: 2,
    explanation: "Support should respect the person's privacy, choices, and safety."
  },
  {
    q: "Which behavior helps create a more inclusive digital community?",
    a: [
      "Using sexist jokes when they get likes.",
      "Respecting boundaries and thinking before posting.",
      "Sharing private messages for entertainment.",
      "Targeting people who disagree with you."
    ],
    correct: 1,
    explanation: "Respecting boundaries and considering the impact of online actions supports a safer community."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const feedback = document.getElementById("quizFeedback");
const nextButton = document.getElementById("nextButton");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

function renderQuestion() {
  const item = questions[currentQuestion];
  answered = false;
  questionNumber.textContent = String(currentQuestion + 1).padStart(2, "0");
  questionText.textContent = item.q;
  answers.innerHTML = "";
  feedback.textContent = "";
  feedback.style.color = "";
  nextButton.disabled = true;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "See My Result →" : "Next Question →";
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  item.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const item = questions[currentQuestion];
  const buttons = [...answers.querySelectorAll(".answer")];

  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.correct) button.classList.add("correct");
    if (i === index && i !== item.correct) button.classList.add("wrong");
  });

  if (index === item.correct) {
    score++;
    feedback.textContent = `✓ Correct. ${item.explanation}`;
    feedback.style.color = "#159b8b";
  } else {
    feedback.textContent = `Not quite. ${item.explanation}`;
    feedback.style.color = "#a54f15";
  }
  nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    const percentage = Math.round((score / questions.length) * 100);
    questionNumber.textContent = "✓";
    questionText.textContent = `You scored ${score}/${questions.length} (${percentage}%).`;
    answers.innerHTML = "";
    feedback.textContent = percentage >= 80
      ? "Great work! Keep using respectful and responsible digital habits."
      : "Good start! Review the issue and try the quiz again to strengthen your understanding.";
    feedback.style.color = "#6c4de6";
    nextButton.textContent = "Try Again";
    nextButton.disabled = false;
    answered = true;
    nextButton.onclick = () => {
      currentQuestion = 0;
      score = 0;
      nextButton.onclick = null;
      renderQuestion();
    };
  }
});

renderQuestion();

// Respect pledge
const pledgeChecks = [...document.querySelectorAll(".pledge-check")];
const pledgeButton = document.getElementById("pledgeButton");
const pledgeMessage = document.getElementById("pledgeMessage");

function updatePledgeButton() {
  pledgeButton.disabled = !pledgeChecks.every(check => check.checked);
}
pledgeChecks.forEach(check => check.addEventListener("change", updatePledgeButton));

pledgeButton.addEventListener("click", () => {
  pledgeMessage.textContent = "✓ Pledge accepted — every respectful click makes a difference.";
  pledgeChecks.forEach(check => check.disabled = true);
  pledgeButton.disabled = true;
  pledgeButton.textContent = "Pledge Completed ✓";
});

// Back to top
const backTop = document.getElementById("backTop");
window.addEventListener("scroll", () => {
  backTop.classList.toggle("show", window.scrollY > 500);
});
backTop.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));
