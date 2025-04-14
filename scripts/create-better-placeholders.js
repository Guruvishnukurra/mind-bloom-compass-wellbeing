import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

// Create a better silent MP3 file using ffmpeg if available
function createSilentMp3(outputPath, durationSec = 10) {
  try {
    // Try to use ffmpeg if available
    console.log(`Generating ${durationSec}s silent MP3 file using ffmpeg...`);
    execSync(`ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t ${durationSec} -q:a 2 "${outputPath}" -y`);
    return true;
  } catch (error) {
    console.log('ffmpeg not available or failed, using fallback method...');
    return false;
  }
}

// Fallback method: Create a larger placeholder MP3 file
function createFallbackMp3(outputPath) {
  // This is a larger silent MP3 file (about 3KB)
  const silentMp3 = Buffer.from([
    0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFB, 0x50, 0xC4, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    // Repeat many zero bytes to make the file larger
    ...Array(3000).fill(0)
  ]);
  
  fs.writeFileSync(outputPath, silentMp3);
  return true;
}

// Create better placeholder MP3 files
function createBetterPlaceholders() {
  console.log('Creating better placeholder MP3 files...');
  
  for (const soundFile of soundFiles) {
    const filePath = path.join(soundsDir, soundFile);
    
    // Check if file exists and is large enough
    let needsReplacement = true;
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 3000) {
        console.log(`✅ ${soundFile} already exists (${(stats.size / 1024).toFixed(2)} KB)`);
        needsReplacement = false;
      } else {
        console.log(`⚠️ ${soundFile} exists but is too small (${stats.size} bytes), replacing...`);
      }
    }
    
    if (needsReplacement) {
      // Try ffmpeg first, fall back to our basic method
      const success = createSilentMp3(filePath) || createFallbackMp3(filePath);
      
      if (success) {
        const stats = fs.statSync(filePath);
        console.log(`✅ Created placeholder for ${soundFile} (${(stats.size / 1024).toFixed(2)} KB)`);
      } else {
        console.error(`❌ Failed to create placeholder for ${soundFile}`);
      }
    }
  }
  
  console.log('Placeholder creation complete!');
}

// Run the function
createBetterPlaceholders();