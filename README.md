# Bible Bingo

A dynamic bingo game generator that creates custom bingo cards based on Bible verses. The game uses AI to generate relevant words and themes from any Bible reference, making it perfect for Bible study groups, Sunday school, or family game nights.

## Features

- Generate custom bingo cards from any Bible reference
- AI-powered topic generation using Groq API
- Dynamic image matching for topics
- Automatic win detection
- Mobile-friendly design
- Celebration animation on winning

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bible-bingo.git
   ```

2. Create a `config.js` file in the root directory:
   ```javascript
   const config = {
       GROQ_API_KEY: 'your-groq-api-key',
       PIXABAY_API_KEY: 'your-pixabay-api-key'
   };
   ```

3. Add your API keys to the config file:
   - Get a Groq API key from [Groq](https://console.groq.com)
   - Get a Pixabay API key from [Pixabay](https://pixabay.com/api/docs/)

## Usage

1. Open `index.html` in your browser
2. Enter a Bible reference (e.g., "John 3:16")
3. Click "Generate Bingo Card"
4. Click on squares as topics are mentioned
5. Win by completing a row, column, or diagonal

## Development

The project is structured as follows:
```plaintext
bible-bingo/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml
├── js/
│   ├── board.js       # Board generation logic
│   ├── bingo.js       # Game mechanics
│   ├── celebration.js # Win animations
│   ├── gameConfig.js  # Game settings
│   ├── imageUtils.js  # Image handling
│   └── utils.js       # Utility functions
├── images/           # Default images
├── config.js         # API configuration
└── index.html        # Main game page
```

## Deployment

The game is deployed using Azure Static Web Apps. The deployment process is automated through GitHub Actions.

### Environment Variables Required:
- `GROQ_API_KEY`
- `PIXABAY_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Groq API for text generation
- Pixabay for image resources
- Azure for hosting

## Support

For support, please open an issue in the GitHub repository.