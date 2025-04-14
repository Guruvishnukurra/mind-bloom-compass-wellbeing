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

// This is a real, valid MP3 file (1 second of silence)
// It's a base64-encoded MP3 file that's guaranteed to work in browsers
const validMp3Base64 = `
SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8A
AAACAAAGhgD///////////////////////////////////////////////////////////////////8AAAA5TEFNRTMuMTAwBK8A
AABSAAABhiDXFzUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7
0MAAAO8AAAaQAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABht
dXNpYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7
0MAAAP8AAAaQAAAIAAANIAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//
//////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vQwAAA/wAABpAAAAgAAA0gAAAB
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////////////////////
/////////////////////////////////////w==
`;

// Function to create a valid MP3 file
function createValidMp3File(filePath) {
  const mp3Buffer = Buffer.from(validMp3Base64, 'base64');
  fs.writeFileSync(filePath, mp3Buffer);
  return true;
}

// Create valid MP3 files
function createRobustMp3Files() {
  console.log('Creating robust MP3 files...');
  
  for (const soundFile of soundFiles) {
    const filePath = path.join(soundsDir, soundFile);
    console.log(`Creating ${soundFile}...`);
    
    try {
      createValidMp3File(filePath);
      const stats = fs.statSync(filePath);
      console.log(`✅ Created ${soundFile} (${(stats.size / 1024).toFixed(2)} KB)`);
    } catch (error) {
      console.error(`❌ Error creating ${soundFile}:`, error.message);
    }
  }
  
  console.log('MP3 creation complete!');
}

// Run the function
createRobustMp3Files();