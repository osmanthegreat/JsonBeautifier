const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const beautifyBtn = document.getElementById('beautifyBtn');
const minifyBtn = document.getElementById('minifyBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const errorDisplay = document.getElementById('errorDisplay');
const inputStatus = document.getElementById('inputStatus');
const outputStatus = document.getElementById('outputStatus');

// Helper to show error
function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.remove('hidden');
  setTimeout(() => {
    errorDisplay.classList.add('hidden');
  }, 5000);
}

// Helper to clear error
function clearError() {
  errorDisplay.textContent = '';
  errorDisplay.classList.add('hidden');
}

// Helper to update status
function updateStatus(element, text) {
  element.textContent = text;
  setTimeout(() => {
    element.textContent = '';
  }, 2000);
}

// Beautify Function
function beautifyJSON() {
  clearError();
  const rawValue = jsonInput.value.trim();

  if (!rawValue) {
    showError('Please enter some JSON to beautify.');
    return;
  }

  try {
    const parsed = JSON.parse(rawValue);
    const beautified = JSON.stringify(parsed, null, 2);
    jsonOutput.value = beautified;
    updateStatus(outputStatus, 'Beautified!');
  } catch (err) {
    showError(`Invalid JSON: ${err.message}`);
  }
}

// Minify Function
function minifyJSON() {
  clearError();
  const rawValue = jsonInput.value.trim();

  if (!rawValue) {
    showError('Please enter some JSON to minify.');
    return;
  }

  try {
    const parsed = JSON.parse(rawValue);
    const minified = JSON.stringify(parsed);
    jsonOutput.value = minified;
    updateStatus(outputStatus, 'Minified!');
  } catch (err) {
    showError(`Invalid JSON: ${err.message}`);
  }
}

// Clear Function
function clearAll() {
  jsonInput.value = '';
  jsonOutput.value = '';
  clearError();
  inputStatus.textContent = '';
  outputStatus.textContent = '';
  jsonInput.focus();
}

// Copy Function
async function copyToClipboard() {
  const content = jsonOutput.value;
  if (!content) {
    showError('Nothing to copy!');
    return;
  }

  try {
    await navigator.clipboard.writeText(content);

    // Visual feedback for icon button
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    copyBtn.classList.add('success');
    copyBtn.title = "Copied!";

    setTimeout(() => {
      copyBtn.innerHTML = originalIcon;
      copyBtn.classList.remove('success');
      copyBtn.title = "Copy to Clipboard";
    }, 2000);
  } catch (err) {
    showError('Failed to copy to clipboard.');
    console.error(err);
  }
}

// Event Listeners
beautifyBtn.addEventListener('click', beautifyJSON);
minifyBtn.addEventListener('click', minifyJSON);
clearBtn.addEventListener('click', clearAll);
copyBtn.addEventListener('click', copyToClipboard);

// Auto-resize textarea (optional enhancement)
// jsonInput.addEventListener('input', () => {
//   clearError();
// });
