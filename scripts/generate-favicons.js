const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/icons/atithi-logo.png');
const outputDir = path.join(__dirname, '../public/icons');
const publicDir = path.join(__dirname, '../public');

// Favicon sizes needed
const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

async function generateFavicons() {
    console.log('Generating favicons from:', sourceImage);

    // Check if source exists
    if (!fs.existsSync(sourceImage)) {
        console.error('Source image not found:', sourceImage);
        process.exit(1);
    }

    // Generate PNG icons in various sizes
    for (const size of sizes) {
        const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
        await sharp(sourceImage)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 169, g: 119, b: 54, alpha: 1 } // #a97736
            })
            .png({ quality: 90 })
            .toFile(outputPath);
        console.log(`Generated: icon-${size}x${size}.png`);
    }

    // Generate favicon.ico (32x32 PNG as ICO replacement)
    // Most modern browsers accept PNG for favicon
    const favicon32 = path.join(publicDir, 'favicon.png');
    await sharp(sourceImage)
        .resize(32, 32, {
            fit: 'contain',
            background: { r: 169, g: 119, b: 54, alpha: 1 }
        })
        .png({ quality: 100 })
        .toFile(favicon32);
    console.log('Generated: favicon.png (32x32)');

    // Also create a 16x16 for browsers that need it
    const favicon16 = path.join(publicDir, 'favicon-16x16.png');
    await sharp(sourceImage)
        .resize(16, 16, {
            fit: 'contain',
            background: { r: 169, g: 119, b: 54, alpha: 1 }
        })
        .png({ quality: 100 })
        .toFile(favicon16);
    console.log('Generated: favicon-16x16.png');

    // Create apple-touch-icon
    const appleTouchIcon = path.join(publicDir, 'apple-touch-icon.png');
    await sharp(sourceImage)
        .resize(180, 180, {
            fit: 'contain',
            background: { r: 169, g: 119, b: 54, alpha: 1 }
        })
        .png({ quality: 90 })
        .toFile(appleTouchIcon);
    console.log('Generated: apple-touch-icon.png (180x180)');

    console.log('\n✅ All favicons generated successfully!');
}

generateFavicons().catch(console.error);
