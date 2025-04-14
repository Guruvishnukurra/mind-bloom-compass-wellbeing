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

// List of free sound files to download
const soundFiles = [
  {
    name: 'rain.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3'
  },
  {
    name: 'birds.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-morning-birds-singing-2472.mp3'
  },
  {
    name: 'night.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-night-crickets-loop-1773.mp3'
  },
  {
    name: 'ocean-waves.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3'
  },
  {
    name: 'forest.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3'
  },
  {
    name: 'stream.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-flowing-river-water-loop-1181.mp3'
  },
  {
    name: 'chimes.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-chimes-2014.mp3'
  },
  {
    name: 'bells.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-tibetan-bell-gong-hit-2293.mp3'
  },
  {
    name: 'meditation-bell.mp3',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-595.mp3'
  }
];

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    // Add options with headers to avoid being blocked
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
        'Referer': 'https://www.soundjay.com/'
      }
    };
    
    https.get(url, options, (response) => {
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

// Download all sound files
async function downloadAllSounds() {
  console.log('Starting download of sound files...');
  
  for (const sound of soundFiles) {
    const filePath = path.join(soundsDir, sound.name);
    console.log(`Downloading ${sound.name}...`);
    
    try {
      await downloadFile(sound.url, filePath);
      console.log(`✅ Downloaded ${sound.name}`);
    } catch (error) {
      console.error(`❌ Error downloading ${sound.name}:`, error.message);
    }
  }
  
  console.log('Download complete!');
}

// Run the download
downloadAllSounds();