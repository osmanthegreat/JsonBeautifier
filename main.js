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

const inputHighlight = document.getElementById('inputHighlight');
const outputHighlight = document.getElementById('outputHighlight');

// Event Listeners
// We need to listen to the scroll of the parent container (.code-container)
// Structure: textarea -> code-content -> code-container
const inputContainer = jsonInput.closest('.code-container');
const outputContainer = jsonOutput.closest('.code-container');

if (inputContainer && outputContainer) {
  inputContainer.addEventListener('scroll', () => {
    inputLineNumbers.scrollTop = inputContainer.scrollTop;
  });

  outputContainer.addEventListener('scroll', () => {
    outputLineNumbers.scrollTop = outputContainer.scrollTop;
  });
}

jsonInput.addEventListener('input', () => {
  updateLineNumbers(jsonInput, inputLineNumbers);
  updateHighlighting(jsonInput, inputHighlight);
});

// Window resize to recalculate line heights
window.addEventListener('resize', () => {
  updateLineNumbers(jsonInput, inputLineNumbers);
  updateLineNumbers(jsonOutput, outputLineNumbers);
});

// ResizeObserver for textareas (handles container resize)
const resizeObserver = new ResizeObserver(() => {
  updateLineNumbers(jsonInput, inputLineNumbers);
  updateLineNumbers(jsonOutput, outputLineNumbers);
});
resizeObserver.observe(jsonInput);
resizeObserver.observe(jsonOutput);

// Wait for fonts to load
document.fonts.ready.then(() => {
  updateLineNumbers(jsonInput, inputLineNumbers);
  updateLineNumbers(jsonOutput, outputLineNumbers);
});

// Initialize
updateLineNumbers(jsonInput, inputLineNumbers);
updateLineNumbers(jsonOutput, outputLineNumbers);
updateHighlighting(jsonInput, inputHighlight);
updateHighlighting(jsonOutput, outputHighlight);

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
    errorDisplay.title = "Click to jump to error";
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
  const text = textarea.value;
  const lines = text.split('\n');

  // Create a temporary element to measure line heights
  const measureDiv = document.createElement('div');
  measureDiv.style.visibility = 'hidden';
  measureDiv.style.position = 'absolute';
  measureDiv.style.whiteSpace = 'pre-wrap';
  measureDiv.style.wordWrap = 'break-word';
  measureDiv.style.width = textarea.clientWidth + 'px'; // Match textarea width

  // Copy all relevant font styles
  const computedStyle = getComputedStyle(textarea);
  measureDiv.style.fontFamily = computedStyle.fontFamily;
  measureDiv.style.fontSize = computedStyle.fontSize;
  measureDiv.style.lineHeight = computedStyle.lineHeight;
  // Only copy horizontal padding to ensure correct wrapping width
  measureDiv.style.paddingLeft = computedStyle.paddingLeft;
  measureDiv.style.paddingRight = computedStyle.paddingRight;
  measureDiv.style.paddingTop = '0';
  measureDiv.style.paddingBottom = '0';
  measureDiv.style.border = 'none'; // Ensure no border adds to height

  measureDiv.style.boxSizing = 'border-box';
  measureDiv.style.letterSpacing = computedStyle.letterSpacing;
  measureDiv.style.fontWeight = computedStyle.fontWeight;
  measureDiv.style.textRendering = computedStyle.textRendering;
  measureDiv.style.tabSize = computedStyle.tabSize;
  measureDiv.style.overflowWrap = computedStyle.overflowWrap; // Important
  measureDiv.style.wordBreak = computedStyle.wordBreak; // Important

  document.body.appendChild(measureDiv);

  let lineNumbersHtml = '';

  lines.forEach((line, index) => {
    // For empty lines, we need a non-breaking space to get height
    // Also handle lines with only spaces
    measureDiv.textContent = line || '\u200B';
    const height = measureDiv.offsetHeight;
    lineNumbersHtml += `<div style="height: ${height}px">${index + 1}</div>`;
  });

  document.body.removeChild(measureDiv);
  lineNumbersEle.innerHTML = lineNumbersHtml;
}

// Syntax Highlighting Logic
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateHighlighting(textarea, highlightEle) {
  let text = textarea.value;

  // If text is empty, clear highlight
  if (!text) {
    highlightEle.innerHTML = '';
    return;
  }

  // Simple JSON syntax highlighting regex
  const jsonRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

  const highlighted = text.replace(jsonRegex, function (match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + escapeHtml(match) + '</span>';
  });

  // Preserve newlines and ensure content exists
  highlightEle.innerHTML = highlighted + '<br>';
}

function syncScroll(textarea, lineNumbersEle, highlightEle) {
  // Sync vertical scroll only, as horizontal is handled by container/wrap
  // Actually, textarea is now absolute and container scrolls.
  // Wait, if textarea is absolute, it doesn't scroll itself?
  // The container scrolls. So we need to listen to container scroll?
  // Let's check the CSS again. .code-container has overflow-y: auto.
  // So the scroll event will be on .code-container.

  // We need to find the container
  const container = textarea.parentElement;
  lineNumbersEle.scrollTop = container.scrollTop;

  // Highlight layer is absolute top:0 left:0 in container, so it moves with container scroll?
  // No, if container scrolls, its content moves up.
  // Both textarea and highlight are absolute top:0.
  // If container scrolls, they stay at top:0 relative to container?
  // Unless container is relative. Yes it is.
  // Actually, if children are absolute, they don't contribute to scroll height unless specified.
  // We need at least one child to have height to force scroll.
  // Or we set min-height on them.

  // Actually, better approach:
  // Textarea should be relative/static to push height?
  // In CSS I set textarea position: absolute. This removes it from flow.
  // Highlight is also absolute.
  // So container has 0 height content?
  // I need to make one of them relative or use JS to set container height?
  // Or make highlight relative and textarea absolute overlay?
  // Let's make highlight relative (it has the content height) and textarea absolute on top.
  // But textarea needs to be on top for interaction.
  // If textarea is absolute, it won't expand container.

  // Let's modify CSS in next step if needed, but for now let's assume one is relative.
  // If I change highlight to relative, it will expand container.
  // Textarea absolute on top.
  // Then container scrolls, and both move up?
  // If highlight is relative, it scrolls naturally.
  // Textarea absolute top:0 will scroll with it? Yes, if it's inside container.

  // So syncScroll might not be needed for highlight/textarea sync if they are in same scrolling container!
  // We just need to sync lineNumbersEle.scrollTop with container.scrollTop.
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
    // We need to find the line element to get exact position
    const lineElement = inputLineNumbers.children[lineNum - 1];
    if (lineElement) {
      const container = jsonInput.closest('.code-container');
      container.scrollTop = lineElement.offsetTop - (container.clientHeight / 2);
    }
  }
}

// Beautify Function
function beautifyJSON() {
  clearError();
  const rawValue = jsonInput.value;

  if (!rawValue.trim()) {
    showError('Please enter some JSON to beautify.');
    return;
  }

  try {
    const parsed = JSON.parse(rawValue);
    const beautified = JSON.stringify(parsed, null, 2);
    jsonOutput.value = beautified;
    updateLineNumbers(jsonOutput, outputLineNumbers);
    updateHighlighting(jsonOutput, outputHighlight);
    updateStatus(outputStatus, 'Beautified!');
  } catch (err) {
    let position = null;
    const match = err.message.match(/at position (\d+)/);
    if (match) {
      position = parseInt(match[1], 10);
    }
    showError(`Invalid JSON: ${err.message}`, position);
  }
}

// Minify Function
function minifyJSON() {
  clearError();
  const rawValue = jsonInput.value;

  if (!rawValue.trim()) {
    showError('Please enter some JSON to minify.');
    return;
  }

  try {
    const parsed = JSON.parse(rawValue);
    const minified = JSON.stringify(parsed);
    jsonOutput.value = minified;
    updateLineNumbers(jsonOutput, outputLineNumbers);
    updateHighlighting(jsonOutput, outputHighlight);
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
  updateHighlighting(jsonInput, inputHighlight);
  updateHighlighting(jsonOutput, outputHighlight);
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
errorDisplay.addEventListener('click', jumpToError);
