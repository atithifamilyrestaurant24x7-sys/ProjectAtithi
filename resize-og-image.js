const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'og-image.png');
const outputPath = path.join(__dirname, 'public', 'og-image-new.png');

sharp(inputPath)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(outputPath.replace('.png', '.jpg'))
    .then(info => {
        console.log('Image resized successfully:', info);
    })
    .catch(err => {
        console.error('Error resizing image:', err);
    });
