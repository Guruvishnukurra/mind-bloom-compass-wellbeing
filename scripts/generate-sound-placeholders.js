import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sound files directory
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// List of required sound files
const soundFiles = [
  'rain.mp3',
  'birds.mp3',
  'night.mp3',
  'ocean-waves.mp3',
  'forest.mp3',
  'stream.mp3',
  'chimes.mp3',
  'bells.mp3',
  'meditation-bell.mp3'
];

// Sample MP3 file content (a minimal valid MP3 file)
// This is a 1-second silent MP3 file
const sampleMp3Content = Buffer.from([
  0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // ID3v2 header
  0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // MP3 frame header
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // MP3 frame data (silence)
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

// Create placeholder MP3 files
function createPlaceholderMp3Files() {
  console.log('Creating placeholder MP3 files...');
  
  for (const soundFile of soundFiles) {
    const filePath = path.join(soundsDir, soundFile);
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        console.log(`✅ ${soundFile} already exists (${Math.round(stats.size / 1024)} KB)`);
        continue;
      }
    }
    
    // Write the sample MP3 content to the file
    fs.writeFileSync(filePath, sampleMp3Content);
    console.log(`✅ Created placeholder for ${soundFile}`);
  }
  
  console.log('Placeholder creation complete!');
}

// Run the function
createPlaceholderMp3Files();