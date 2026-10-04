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
  },
  {
    q: "A class group chat makes insulting comments about a student's gender expression. What is the best response?",
    a: [
      "Add laughing emojis so you fit in.",
      "Forward the comments to other groups.",
      "Do not join in, support the targeted student, and report the abuse when appropriate.",
      "Tell the student they should leave school."
    ],
    correct: 2,
    explanation: "Do not amplify harassment. Offer support and use suitable reporting channels."
  },
  {
    q: "Someone asks you to send an intimate photo and keeps pressuring you after you say no. What matters most?",
    a: [
      "You must agree if they are your partner.",
      "Your boundary and consent must be respected.",
      "You should send one to stop the messages.",
      "You should feel guilty for refusing."
    ],
    correct: 1,
    explanation: "Consent must be freely given. Pressure, threats, or a relationship do not remove your right to say no."
  },
  {
    q: "You see a sexist meme targeting a classmate being shared widely. What should you do?",
    a: [
      "Share it before it gets deleted.",
      "Comment on the classmate's appearance.",
      "Avoid sharing it, report it if appropriate, and check on the person targeted.",
      "Save it to use against them later."
    ],
    correct: 2,
    explanation: "Refusing to spread harmful content can reduce its reach and help protect the person targeted."
  },
  {
    q: "Which statement about online harassment is true?",
    a: [
      "It is harmless if it happens after class.",
      "It only matters if the target replies.",
      "It can affect a person's safety, well-being, and participation online.",
      "It is always acceptable when posted anonymously."
    ],
    correct: 2,
    explanation: "Online harassment can have real consequences, even when it happens through a screen or anonymous account."
  },
  {
    q: "A friend shares screenshots of a private conversation without permission to embarrass someone. What is a respectful choice?",
    a: [
      "Repost the screenshots publicly.",
      "Ask them to stop spreading private content and respect the person's privacy.",
      "Edit the screenshots to make them more entertaining.",
      "Tag more people so they can judge it."
    ],
    correct: 1,
    explanation: "Private conversations should be handled carefully. Do not spread them to shame or harass someone."
  },
  {
    q: "A person experiencing online harassment is not ready to make a public report. How can you support them?",
    a: [
      "Post their story without asking.",
      "Force them to confront the harasser.",
      "Listen without blaming them and discuss safe options while respecting their choices.",
      "Tell everyone they are exaggerating."
    ],
    correct: 2,
    explanation: "Support the person's agency and privacy. Help them explore options without pressuring them."
  },
  {
    q: "What is a safer way to respond to a threatening direct message?",
    a: [
      "Arrange to meet the sender alone.",
      "Threaten them back with worse messages.",
      "Keep evidence, use platform safety tools, and seek trusted or official help if needed.",
      "Publish your home address to prove you are not afraid."
    ],
    correct: 2,
    explanation: "Prioritize safety, preserve relevant evidence, block or report the account when appropriate, and seek help for threats."
  },
  {
    q: "Which action shows bystander responsibility when you witness online harassment?",
    a: [
      "Stay safe, avoid amplifying the abuse, and report or support the target when appropriate.",
      "Join in so the harasser does not target you.",
      "Share the post for entertainment.",
      "Tell the target they caused it."
    ],
    correct: 0,
    explanation: "Bystanders can help without escalating the situation by reporting, offering support, and not spreading harmful content."
  },
  {
    q: "Why should you think before posting a comment about someone's body or gender?",
    a: [
      "Because every comment must be popular.",
      "Because unwanted sexual or sexist remarks can harm others and may cross boundaries.",
      "Because only celebrities deserve privacy.",
      "Because online comments never have consequences."
    ],
    correct: 1,
    explanation: "Consider consent, dignity, and the possible impact of your words before posting."
  },
  {
    q: "What should you do if an account is sharing someone's personal information to intimidate them?",
    a: [
      "Share the information again to warn others.",
      "Contact the account to ask for more private details.",
      "Avoid spreading the information, preserve evidence safely, and report the post or seek help.",
      "Post your own private information in response."
    ],
    correct: 2,
    explanation: "Do not amplify exposed personal information. Save relevant evidence safely and report the incident or seek appropriate support."
  },
  {
    q: "Which is the best example of consent in digital communication?",
    a: [
      "Assuming silence means yes.",
      "Sharing someone's photo because you are friends.",
      "Checking permission before posting or forwarding personal content.",
      "Ignoring a request to remove a photo."
    ],
    correct: 2,
    explanation: "Ask permission before sharing personal content and respect requests to keep it private or remove it."
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
