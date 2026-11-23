try {
  await import('@testing-library/jest-dom/vitest');
} catch (e) {
  await import('@testing-library/jest-dom');
}
