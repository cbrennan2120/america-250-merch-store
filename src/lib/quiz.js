export function scoreQuiz(questions, answers) {
  return questions.reduce((score, question) => score + (answers[question.id] === question.correctIndex ? 1 : 0), 0);
}

export function getResultTier(score, total) {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.8) return { id: "history-keeper", title: "History Keeper", message: "You notice both the headline moments and the harder questions behind them." };
  if (ratio >= 0.5) return { id: "liberty-scholar", title: "Liberty Scholar", message: "You have a solid foundation—and a few new stories to explore." };
  return { id: "curious-reader", title: "Curious Reader", message: "Good history starts with curiosity. Follow the sources and try again." };
}

export function buildShareText(score, total, tierTitle) {
  return `I scored ${score}/${total} and earned “${tierTitle}” on the Spirit of 1776 history quiz.`;
}
