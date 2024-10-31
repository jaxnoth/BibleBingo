const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, '..', 'images', 'icon.svg');
const outputDir = path.join(__dirname, '..', 'images', 'icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate each size
async function generateIcons() {
    for (const size of sizes) {
        const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
        await sharp(sourceIcon)
            .resize(size, size)
            .png()
            .toFile(outputFile);
        console.log(`Generated ${size}x${size} icon`);
    }
}

generateIcons().catch(console.error);

// Read the SVG file
const svgBuffer = fs.readFileSync('favicon.svg');

// Generate favicon.png
sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('favicon.png')
    .then(() => console.log('Generated favicon.png'))
    .catch(err => console.error('Error generating favicon:', err));