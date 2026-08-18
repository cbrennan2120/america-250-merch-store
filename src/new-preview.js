const progress = document.querySelector("[data-reading-progress]");

function updateReadingProgress() {
  if (!progress) return;
  const root = document.documentElement;
  const remaining = root.scrollHeight - root.clientHeight;
  const percent = remaining > 0 ? Math.min(100, Math.max(0, (root.scrollTop / remaining) * 100)) : 0;
  progress.value = percent;
}

if (progress) {
  updateReadingProgress();
  document.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("resize", updateReadingProgress);
}
