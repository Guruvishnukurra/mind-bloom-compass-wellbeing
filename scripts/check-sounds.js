import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sound files directory
const soundsDir = path.join(__dirname, '../public/sounds');

// List of required sound files
const requiredSounds = [
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

// Check if all required sound files exist
function checkSoundFiles() {
  console.log('Checking sound files...');
  
  let allFilesExist = true;
  const missingFiles = [];
  
  for (const soundFile of requiredSounds) {
    const filePath = path.join(soundsDir, soundFile);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileSizeKB = Math.round(stats.size / 1024);
      console.log(`✅ ${soundFile} (${fileSizeKB} KB)`);
    } else {
      console.log(`❌ ${soundFile} (missing)`);
      allFilesExist = false;
      missingFiles.push(soundFile);
    }
  }
  
  if (allFilesExist) {
    console.log('\n✅ All required sound files are present.');
  } else {
    console.log('\n❌ Missing sound files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    console.log('\nPlease run one of the following commands to download the missing files:');
    console.log('npm run download-sounds');
    console.log('npm run download-sounds-fallback');
    console.log('npm run create-sound-placeholders');
  }
}

// Run the check
checkSoundFiles();