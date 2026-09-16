import { Jimp } from 'jimp';

async function processFloodFill() {
  try {
    const image = await Jimp.read('./public/lp3i-logo.jpg');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const data = image.bitmap.data;

    const visited = new Uint8Array(width * height);
    const queue = [];

    // Helper to check if pixel is near white
    function isNearWhite(x, y) {
      const idx = (y * width + x) * 4;
      const r = data[idx + 0];
      const g = data[idx + 1];
      const b = data[idx + 2];
      return r > 215 && g > 215 && b > 215;
    }

    // Add all border pixels to queue if they are white
    for (let x = 0; x < width; x++) {
      if (isNearWhite(x, 0)) { queue.push(x, 0); visited[0 * width + x] = 1; }
      if (isNearWhite(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
    }
    for (let y = 0; y < height; y++) {
      if (isNearWhite(0, y)) { queue.push(0, y); visited[y * width + 0] = 1; }
      if (isNearWhite(width - 1, y)) { queue.push(width - 1, y); visited[y * width + (width - 1)] = 1; }
    }

    // BFS Flood Fill from edges
    let head = 0;
    while (head < queue.length) {
      const x = queue[head++];
      const y = queue[head++];

      const idx = (y * width + x) * 4;
      data[idx + 3] = 0; // Set alpha to 0 (transparent)

      const neighbors = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const npos = ny * width + nx;
          if (!visited[npos] && isNearWhite(nx, ny)) {
            visited[npos] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }

    await image.write('./public/lp3i-logo.png');
    console.log('Successfully saved high-precision flood-fill transparent logo to ./public/lp3i-logo.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processFloodFill();
