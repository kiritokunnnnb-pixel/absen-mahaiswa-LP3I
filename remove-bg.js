import { Jimp } from 'jimp';

async function processImage() {
  try {
    const image = await Jimp.read('./public/lp3i-logo.jpg');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // Check if pixel is near white
      if (red > 210 && green > 210 && blue > 210) {
        this.bitmap.data[idx + 3] = 0; // Make transparent
      }
    });

    await image.write('./public/lp3i-logo.png');
    console.log('Successfully saved transparent logo to ./public/lp3i-logo.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
