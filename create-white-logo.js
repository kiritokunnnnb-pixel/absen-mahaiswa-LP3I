import { Jimp } from 'jimp';

async function processWhiteImage() {
  try {
    const image = await Jimp.read('./public/lp3i-logo.jpg');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // Check if pixel is near white (background)
      if (red > 210 && green > 210 && blue > 210) {
        this.bitmap.data[idx + 3] = 0; // Make transparent
      } else {
        // Keep red dot accent intact (high red, low green/blue)
        const isRedAccent = red > 180 && green < 80 && blue < 80;
        if (!isRedAccent) {
          // Convert navy text & dark elements on the right half or all text to bright white
          // For pixels on the right side of separator (x > 320 out of ~1000px) or all dark elements:
          this.bitmap.data[idx + 0] = 255;
          this.bitmap.data[idx + 1] = 255;
          this.bitmap.data[idx + 2] = 255;
        }
      }
    });

    await image.write('./public/lp3i-logo-white.png');
    console.log('Successfully saved white transparent logo to ./public/lp3i-logo-white.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processWhiteImage();
