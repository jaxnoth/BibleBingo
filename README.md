# Bible Bingo

A dynamic bingo game generator that creates boards based on biblical references. Players can enter a Bible verse or passage, and the game will generate a themed bingo board with relevant words and images.

## Features

- Generate bingo boards from Bible references
- Automatic image selection for each topic
- Mobile-responsive design
- Celebration effects for winning combinations
- Works offline with fallback content
- Accessible design

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript (ES6+)
- GROQ API for content generation
- Pixabay API for images

## Installation

### Prerequisites

- A modern web browser
- [Node.js](https://nodejs.org/) (LTS) — for running the local server and setup script (optional if you use another server)
- API keys for:
  - [GROQ](https://console.groq.com/) for content generation
  - [Pixabay](https://pixabay.com/api/docs/) for images

### Testing environment (Windows)

1. **Install Node.js** (if you don’t have it):
   - Download the LTS installer from [nodejs.org](https://nodejs.org/).
   - Run it and accept the defaults (including “Add to PATH”).
   - Restart PowerShell or Command Prompt, then run: `node -v` and `npm -v` to confirm.

2. **Create your env file** (so the app can call GROQ and Pixabay):
   - From the project root in PowerShell or Command Prompt:
     ```powershell
     npm run setup-env
     ```
   - Open `web\js\env.js` and replace the placeholder values with your real API keys:
     - [GROQ API key](https://console.groq.com/)
     - [Pixabay API key](https://pixabay.com/api/docs/)

3. **Start the local server and open the app**:
   - From the project root:
     ```powershell
     npm start
     ```
   - In the terminal you’ll see a URL (e.g. `http://localhost:3000`). Open it in your browser.
   - You can leave the server running while you test; press `Ctrl+C` to stop it.

4. **Test the app**: Enter a Bible reference (or leave it blank), click **Generate Board**, and play. The same `web` folder is what Azure deploys.

### Basic Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bible-bingo.git
cd bible-bingo
```
2. Create an `env.js` file with your API keys:
```javascript
window.env = {
    GROQ_API_KEY: 'your-groq-api-key',
    PIXABAY_API_KEY: 'your-pixabay-api-key'
};
```
3. Open `index.html` in a modern web browser

### Development Setup

1. Install a local development server (optional):
```bash
npm install -g http-server
```
2. Run the server:
```bash
http-server
```
3. Visit `http://localhost:8080` in your browser

### Preview before committing (Azure)

To preview the site locally before you push to Azure (so the same content deploys to Azure Static Web Apps):

1. From the project root, serve the **`web`** folder (the app lives in `web/`; Azure deploys from `app_location: "/web"`).
2. Run a local server from `web` so paths like `css/`, `js/`, and `images/` resolve correctly. For example:

   **Using npx (no install):**
   ```bash
   cd web
   npx -y serve
   ```
   Then open the URL shown (e.g. `http://localhost:3000`).

   **Or using http-server:**
   ```bash
   cd web
   npx -y http-server -p 8080
   ```
   Then open `http://localhost:8080`.

3. Ensure `web/js/env.js` exists (copy from `env.js.template` and add your API keys, or create it as in Basic Setup with the file at `web/js/env.js`).
4. Check the layout, new logo, and theme; when satisfied, commit and push to trigger the Azure deploy.

### Troubleshooting: "Default word list" when you expect AI topics

If the board always shows **Default word list** even after entering a Bible reference, the app is using the fallback word list. Use these steps to find and fix the cause:

1. **Open DevTools** (F12 or right‑click → Inspect) and go to the **Console** tab.
2. **Generate a board** with a reference (e.g. `John 3:16`) and click **Generate Board**.
3. **Check the console** for a line starting with `[Bible Bingo]`. You’ll see the exact reason, for example:
   - **"GROQ API key not found"** → `web/js/env.js` is missing, not loaded, or doesn’t set `window.env.GROQ_API_KEY`. Create or fix `web/js/env.js` (see Basic Setup). If you use Azure, set the secret in Static Web App configuration.
   - **"No Bible reference entered"** → The reference field was empty. Type a reference (e.g. `Genesis 1:1`) before generating.
   - **"GROQ request failed: ..."** → Network or API error. Look at the rest of the message (e.g. timeout, 401, CORS). Ensure the GROQ API key is valid at [console.groq.com](https://console.groq.com/) and that you’re not blocking the request (e.g. firewall, ad blocker).
   - **"API response 401"** or **"403"** → Invalid or expired API key. Get a new key from GROQ and update `web/js/env.js` (or Azure secrets).
   - **"API did not return a topics array"** / **"Could not parse API response"** → GROQ returned an unexpected format; the console may show the raw response for debugging.
4. **Hover over "Default word list"** on the page; the tooltip shows the same reason as the console.

**Quick checks:**

- On first load, the console should log `Environment check: { envExists: true, groqKey: 'exists', ... }`. If `groqKey: 'missing'`, fix `env.js` and reload.
- Run the app from a **local server** (e.g. `npm start`), not by opening `index.html` as a file, so `js/env.js` loads correctly.

### Development Tools

- Browser DevTools for debugging
- [VS Code](https://code.visualstudio.com/) recommended extensions:
  - Live Server
  - HTML CSS Support
  - JavaScript (ES6) code snippets
  - ESLint

### Project Structure
bible-bingo/
├── css/
│ ├── normalize.css
│ ├── styles.css
│ └── bingo.css
├── js/
│ ├── board.js
│ ├── bingo.js
│ ├── celebration.js
│ ├── imageUtils.js
│ └── utils.js
├── index.html
├── env.js
├── config.js
├── LICENSE
└── README.md

## Usage

1. Enter a Bible reference (e.g., "Genesis 1:1" or "John 3:16")
2. Click "Generate Board" or press Enter
3. Click cells to mark them
4. Get Bingo by completing a row, column, or diagonal

## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes:
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the branch:
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure mobile responsiveness
- Maintain accessibility features

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Author

Stephen Swan

## Acknowledgments

- GROQ API for content generation
- Pixabay for image content
- All contributors and testers

## Support

For support, please open an issue in the GitHub repository.