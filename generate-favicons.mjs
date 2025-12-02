import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
];

async function generateFavicons() {
  const svgPath = './public/favicon.svg';
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // Convertir SVG en data URL
  const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');
  
  for (const { name, size } of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    const img = await loadImage(svgDataUrl);
    ctx.drawImage(img, 0, 0, size, size);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./public/${name}`, buffer);
    console.log(`✅ Generated ${name}`);
  }
  
  console.log('🎉 All favicons generated successfully!');
}

generateFavicons().catch(console.error);
