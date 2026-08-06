import { quizQuestions } from "./data/content.js";
import { buildShareText, getResultTier, scoreQuiz } from "./lib/quiz.js";
import { track } from "./analytics.js";

const form = document.querySelector("[data-quiz-form]");
const result = document.querySelector("[data-quiz-result]");
const shareButton = document.querySelector("[data-share-result]");
const copyStatus = document.querySelector("[data-share-status]");
let latest = null;

function escape(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function renderQuestions() {
  form.innerHTML = `${quizQuestions.map((question, index) => `
    <fieldset class="quiz-question" data-question="${question.id}">
      <legend><span>${index + 1}</span>${escape(question.prompt)}</legend>
      <div class="quiz-choices">
        ${question.choices.map((choice, choiceIndex) => `
          <label>
            <input type="radio" name="${question.id}" value="${choiceIndex}">
            <span>${escape(choice)}</span>
          </label>`).join("")}
      </div>
      <p class="quiz-feedback" data-feedback hidden></p>
    </fieldset>`).join("")}
    <button class="button" type="submit">See my result</button>`;
}

function readAnswers() {
  return Object.fromEntries(quizQuestions.flatMap((question) => {
    const selected = form.querySelector(`input[name="${question.id}"]:checked`);
    return selected ? [[question.id, Number(selected.value)]] : [];
  }));
}

function revealFeedback(answers) {
  quizQuestions.forEach((question) => {
    const container = form.querySelector(`[data-question="${question.id}"]`);
    const feedback = container.querySelector("[data-feedback]");
    const correct = answers[question.id] === question.correctIndex;
    container.dataset.correct = String(correct);
    feedback.hidden = false;
    feedback.innerHTML = `<strong>${correct ? "Correct." : `Answer: ${escape(question.choices[question.correctIndex])}.`}</strong> ${escape(question.explanation)} <a href="${question.source}" target="_blank" rel="noopener">Check the source<span class="sr-only"> (opens in a new tab)</span></a>`;
  });
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const answers = readAnswers();
  const unanswered = quizQuestions.find((question) => answers[question.id] === undefined);
  if (unanswered) {
    const fieldset = form.querySelector(`[data-question="${unanswered.id}"]`);
    fieldset.classList.add("has-error");
    fieldset.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldset.querySelector("input").focus();
    return;
  }

  const score = scoreQuiz(quizQuestions, answers);
  const tier = getResultTier(score, quizQuestions.length);
  latest = { score, total: quizQuestions.length, tier };
  revealFeedback(answers);
  result.hidden = false;
  result.querySelector("[data-result-title]").textContent = tier.title;
  result.querySelector("[data-result-score]").textContent = `${score} out of ${quizQuestions.length}`;
  result.querySelector("[data-result-message]").textContent = tier.message;
  result.scrollIntoView({ behavior: "smooth", block: "center" });
  result.focus();
  track("quiz_complete", { score, total: quizQuestions.length, result_tier: tier.id });
});

document.querySelector("[data-retry-quiz]")?.addEventListener("click", () => {
  form.reset();
  form.querySelectorAll(".quiz-question").forEach((question) => {
    question.classList.remove("has-error");
    delete question.dataset.correct;
    question.querySelector("[data-feedback]").hidden = true;
  });
  result.hidden = true;
  latest = null;
  form.querySelector("input").focus();
  track("quiz_retry");
});

shareButton?.addEventListener("click", async () => {
  if (!latest) return;
  const text = buildShareText(latest.score, latest.total, latest.tier.title);
  try {
    if (navigator.share) {
      await navigator.share({ title: "Spirit of 1776 history quiz", text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      copyStatus.textContent = "Result copied to your clipboard.";
    }
    track("quiz_result_share", { result_tier: latest.tier.id });
  } catch (error) {
    if (error?.name !== "AbortError") copyStatus.textContent = "Sharing is unavailable. Copy the page address instead.";
  }
});

renderQuestions();
form?.addEventListener("change", () => {
  track("quiz_start", { question_count: quizQuestions.length });
}, { once: true });
