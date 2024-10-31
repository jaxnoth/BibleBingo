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
- API keys for:
  - [GROQ](https://console.groq.com/) for content generation
  - [Pixabay](https://pixabay.com/api/docs/) for images

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