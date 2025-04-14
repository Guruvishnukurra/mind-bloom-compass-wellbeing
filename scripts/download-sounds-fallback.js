import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// List of free sound files to download from GitHub
const soundFiles = [
  {
    name: 'rain.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/rain.mp3'
  },
  {
    name: 'birds.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/birds.mp3'
  },
  {
    name: 'night.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/night.mp3'
  },
  {
    name: 'ocean-waves.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/ocean.mp3'
  },
  {
    name: 'forest.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/forest.mp3'
  },
  {
    name: 'stream.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/stream.mp3'
  },
  {
    name: 'chimes.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/chimes.mp3'
  },
  {
    name: 'bells.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/bells.mp3'
  },
  {
    name: 'meditation-bell.mp3',
    url: 'https://github.com/bradtraversy/vanilla-node-rest-api/raw/master/public/meditation-bell.mp3'
  }
];

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Create placeholder files with instructions
function createPlaceholderFiles() {
  console.log('Creating placeholder files...');
  
  for (const sound of soundFiles) {
    const filePath = path.join(soundsDir, sound.name);
    const placeholderContent = `This is a placeholder for ${sound.name}.\n\nPlease download a suitable sound file and replace this file with it.\n\nSuggested sources:\n- https://freesound.org/\n- https://mixkit.co/free-sound-effects/\n- https://www.zapsplat.com/\n`;
    
    fs.writeFileSync(filePath, placeholderContent);
    console.log(`✅ Created placeholder for ${sound.name}`);
  }
  
  console.log('Placeholder creation complete!');
}

// Download all sound files
async function downloadAllSounds() {
  console.log('Starting download of sound files...');
  let anySuccess = false;
  
  for (const sound of soundFiles) {
    const filePath = path.join(soundsDir, sound.name);
    console.log(`Downloading ${sound.name}...`);
    
    try {
      await downloadFile(sound.url, filePath);
      console.log(`✅ Downloaded ${sound.name}`);
      anySuccess = true;
    } catch (error) {
      console.error(`❌ Error downloading ${sound.name}:`, error.message);
    }
  }
  
  if (!anySuccess) {
    console.log('All downloads failed. Creating placeholder files instead...');
    createPlaceholderFiles();
  }
  
  console.log('Download process complete!');
}

// Run the download
downloadAllSounds();