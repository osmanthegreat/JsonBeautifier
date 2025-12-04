const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const beautifyBtn = document.getElementById('beautifyBtn');
const minifyBtn = document.getElementById('minifyBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const errorDisplay = document.getElementById('errorDisplay');
const inputStatus = document.getElementById('inputStatus');
const outputStatus = document.getElementById('outputStatus');

const inputLineNumbers = document.getElementById('inputLineNumbers');
const outputLineNumbers = document.getElementById('outputLineNumbers');

// Helper to show error
function showError(message, position = null) {
  let displayMessage = message;

  // Store position for navigation
  if (position !== null) {
    // Calculate line and column
    const text = jsonInput.value;
    const lines = text.substring(0, position).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    displayMessage = `${message} (Line ${line}, Column ${column})`;

    errorDisplay.dataset.position = position;
    errorDisplay.title = "Double-click to jump to error";
    errorDisplay.classList.add('clickable');
  } else {
    delete errorDisplay.dataset.position;
    errorDisplay.title = "";
    errorDisplay.classList.remove('clickable');
  }

  errorDisplay.textContent = displayMessage;
  errorDisplay.classList.remove('hidden');
}

// Helper to clear error
function clearError() {
  errorDisplay.textContent = '';
  errorDisplay.classList.add('hidden');
  delete errorDisplay.dataset.position;
  errorDisplay.classList.remove('clickable');
}

// Helper to update status
function updateStatus(element, text) {
  element.textContent = text;
  setTimeout(() => {
    element.textContent = '';
  }, 2000);
}

// Line Numbers Logic
function updateLineNumbers(textarea, lineNumbersEle) {
  const lines = textarea.value.split('\n').length;
  lineNumbersEle.innerHTML = Array(lines).fill(0).map((_, i) => `<div>${i + 1}</div>`).join('');
}

function syncScroll(textarea, lineNumbersEle) {
  lineNumbersEle.scrollTop = textarea.scrollTop;
}

// Jump to error function
function jumpToError() {
  const position = errorDisplay.dataset.position;
  if (position) {
    const pos = parseInt(position, 10);
    jsonInput.focus();
    jsonInput.setSelectionRange(pos, pos + 1);

    // Calculate scroll position (approximate)
    const text = jsonInput.value;
    const lines = text.substring(0, pos).split('\n');
    const lineNum = lines.length;

    // Scroll to line
    const lineHeight = 20; // Approximation, better to get computed style
    const scrollTo = (lineNum - 1) * lineHeight;
    jsonInput.scrollTop = scrollTo - (jsonInput.clientHeight / 2);
  }
}

// Beautify Function
function beautifyJSON() {
  clearError();
  const rawValue = jsonInput.value.trim(); // Don't trim for line numbers accuracy? Actually trim is fine for input but might affect position slightly if leading whitespace.
  // Let's use value directly for position accuracy, but trim for check.

  if (!rawValue) {
    showError('Please enter some JSON to beautify.');
    return;
  }

  try {
    const parsed = JSON.parse(jsonInput.value); // Use raw value
    const beautified = JSON.stringify(parsed, null, 2);
    jsonOutput.value = beautified;
    updateLineNumbers(jsonOutput, outputLineNumbers);
    updateStatus(outputStatus, 'Beautified!');
  } catch (err) {
    let position = null;
    // Try to find position in error message
    // Chrome/V8: "Unexpected token 'a', ... " at position 123"
    // Firefox: "JSON.parse: unexpected character at line 1 column 2 of the JSON data" -> tricky to map to index without parsing manually

    const match = err.message.match(/at position (\d+)/);
    if (match) {
      position = parseInt(match[1], 10);
    } else if (err.message.includes("line") && err.message.includes("column")) {
      // Fallback for some browsers if they give line/col directly, but we need index for setSelectionRange
      // We can try to parse it out, but V8 usually gives position.
    }

    showError(`Invalid JSON: ${err.message}`, position);
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
    const parsed = JSON.parse(jsonInput.value);
    const minified = JSON.stringify(parsed);
    jsonOutput.value = minified;
    updateLineNumbers(jsonOutput, outputLineNumbers);
    updateStatus(outputStatus, 'Minified!');
  } catch (err) {
    let position = null;
    const match = err.message.match(/at position (\d+)/);
    if (match) {
      position = parseInt(match[1], 10);
    }
    showError(`Invalid JSON: ${err.message}`, position);
  }
}

// Clear Function
function clearAll() {
  jsonInput.value = '';
  jsonOutput.value = '';
  updateLineNumbers(jsonInput, inputLineNumbers);
  updateLineNumbers(jsonOutput, outputLineNumbers);
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
errorDisplay.addEventListener('dblclick', jumpToError);

// Line Numbers Events
jsonInput.addEventListener('input', () => {
  updateLineNumbers(jsonInput, inputLineNumbers);
});
jsonInput.addEventListener('scroll', () => {
  syncScroll(jsonInput, inputLineNumbers);
});
jsonOutput.addEventListener('scroll', () => {
  syncScroll(jsonOutput, outputLineNumbers);
});

// Initialize line numbers
updateLineNumbers(jsonInput, inputLineNumbers);
updateLineNumbers(jsonOutput, outputLineNumbers);

// Auto-resize textarea (optional enhancement)
// jsonInput.addEventListener('input', () => {
//   clearError();
// });
