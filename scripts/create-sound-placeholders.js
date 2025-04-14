import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// List of sound files needed
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

// Create placeholder files with instructions
function createPlaceholderFiles() {
  console.log('Creating placeholder files...');
  
  for (const soundName of soundFiles) {
    const filePath = path.join(soundsDir, soundName);
    const placeholderContent = `This is a placeholder for ${soundName}.\n\nPlease download a suitable sound file and replace this file with it.\n\nSuggested sources:\n- https://freesound.org/\n- https://mixkit.co/free-sound-effects/\n- https://www.zapsplat.com/\n`;
    
    fs.writeFileSync(filePath, placeholderContent);
    console.log(`✅ Created placeholder for ${soundName}`);
  }
  
  console.log('Placeholder creation complete!');
}

// Run the function
createPlaceholderFiles();