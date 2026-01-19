import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage, registerFont } from 'canvas';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/post');
const OUTPUT_DIR = path.join(__dirname, '../public/og');
const LOGO_PATH = path.join(__dirname, '../public/joe-small.png');

// Canvas dimensions for OG images (516x270 for Twitter)
const WIDTH = 516;
const HEIGHT = 270;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateOgImage(postData, outputPath) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background - black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // White text color
  ctx.fillStyle = '#ffffff';

  // Title - bold monospace font (scaled down for smaller image)
  ctx.font = 'bold 20px Monaco, "Consolas", "Liberation Mono", monospace';
  ctx.textAlign = 'left';

  // Narrower text width
  const textMaxWidth = WIDTH - 120;
  const titleLines = wrapText(ctx, postData.title, textMaxWidth, 20);
  let y = 40;

  titleLines.forEach((line) => {
    ctx.fillText(line, 25, y);
    y += 25;
  });

  // Subtitle - lighter gray
  if (postData.subTitle) {
    ctx.font = '14px Monaco, "Consolas", "Liberation Mono", monospace';
    ctx.fillStyle = '#cccccc';

    const subtitleLines = wrapText(ctx, postData.subTitle, textMaxWidth, 14);
    y += 8;

    subtitleLines.forEach((line) => {
      ctx.fillText(line, 25, y);
      y += 17;
    });
  }

  // Date - right under subtitle, lighter color
  ctx.font = '12px Monaco, "Consolas", "Liberation Mono", monospace';
  ctx.fillStyle = '#999999';
  y += 12; // Add some space after subtitle
  ctx.fillText(formatDate(postData.publishedAt), 25, y);

  // Logo in bottom right - scaled down for smaller image
  try {
    const logo = await loadImage(LOGO_PATH);
    const logoHeight = 35;
    const aspectRatio = logo.width / logo.height;
    const logoWidth = logoHeight * aspectRatio;
    const logoX = WIDTH - logoWidth - 25; // Position from right edge
    const logoY = HEIGHT - logoHeight - 20; // Bottom spacing
    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.warn('Could not load logo:', error.message);
  }

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

function wrapText(ctx, text, maxWidth, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  // Add one day to the date
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function main() {
  console.log('🎨 Generating OG images for blog posts...\n');

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    const slug = file.replace('.mdx', '');
    const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);

    console.log(`Generating: ${slug}.png`);

    await generateOgImage(
      {
        title: data.title || slug,
        subTitle: data.subTitle || '',
        publishedAt: data.publishedAt || new Date().toISOString(),
      },
      outputPath
    );
  }

  console.log(`\n✅ Generated ${files.length} OG images in ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error('Error generating OG images:', error);
  process.exit(1);
});
