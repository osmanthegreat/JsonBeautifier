# JSON Beautifier

A premium, modern web-based tool to format, validate, and minify JSON data. Built with performance and user experience in mind.

## Features

- **Beautify & Minify**: Instantly format messy JSON into a readable structure or compress it for production.
- **Syntax Highlighting**: Color-coded output for keys, strings, numbers, booleans, and null values.
- **Line Numbers**: aligned line numbers for easy reference.
- **Smart Error Handling**:
  - Detailed error messages showing line and column numbers.
  - **Jump-to-Error**: Click on the error message to instantly navigate to the problematic code.
- **Robust Input Handling**: Supports pasting of large JSON files and even HTML/XML without rendering issues.
- **Copy to Clipboard**: One-click copy with visual feedback.
- **Responsive Design**: Works seamlessly on different screen sizes.

## Tech Stack

- **Vite**: Next Generation Frontend Tooling
- **Vanilla JavaScript**: Lightweight and fast execution
- **CSS3**: Custom styling with CSS variables for easy theming
- **HTML5**: Semantic structure

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/osmanthegreat/JsonBeautifier.git
   ```

2. Navigate to the project directory:
   ```bash
   cd JsonBeautifier
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and visit `http://localhost:5173` (or the port shown in your terminal).

## Usage

1. **Input**: Paste your JSON string into the left pane.
2. **Beautify**: Click the "Beautify" button to format the JSON.
3. **Minify**: Click the "Minify" button to compress the JSON.
4. **Clear**: Click "Clear" to reset both input and output.
5. **Copy**: Use the copy icon in the output pane to copy the result.

## License

This project is open source and available under the [MIT License](LICENSE).
