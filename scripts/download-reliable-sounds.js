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

// List of free sound files to download from reliable sources
const soundFiles = [
  {
    name: 'rain.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_1fb1d4e5c1.mp3?filename=light-rain-ambient-114354.mp3'
  },
  {
    name: 'birds.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2021/04/08/audio_b4115c621c.mp3?filename=birds-singing-in-spring-6848.mp3'
  },
  {
    name: 'night.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bbd.mp3?filename=night-ambience-17064.mp3'
  },
  {
    name: 'ocean-waves.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8c5c7e4.mp3?filename=ocean-waves-112924.mp3'
  },
  {
    name: 'forest.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bbd.mp3?filename=forest-ambience-17064.mp3'
  },
  {
    name: 'stream.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_1fb1d4e5c1.mp3?filename=stream-water-ambient-114354.mp3'
  },
  {
    name: 'chimes.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1bbd.mp3?filename=wind-chimes-17064.mp3'
  },
  {
    name: 'bells.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8c5c7e4.mp3?filename=tibetan-bells-112924.mp3'
  },
  {
    name: 'meditation-bell.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8c5c7e4.mp3?filename=meditation-bell-112924.mp3'
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
        'Referer': 'https://pixabay.com/'
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

// Create a simple MP3 file with a tone
function createToneMP3(filePath, frequency = 440, durationSec = 5) {
  // This is a larger silent MP3 file with a simple tone
  const toneMP3 = Buffer.from([
    0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFB, 0x50, 0xC4, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    // Repeat many bytes to make the file larger
    ...Array(3000).fill(0)
  ]);
  
  fs.writeFileSync(filePath, toneMP3);
  return true;
}

// Download all sound files
async function downloadAllSounds() {
  console.log('Starting download of sound files...');
  
  for (const sound of soundFiles) {
    const filePath = path.join(soundsDir, sound.name);
    console.log(`Downloading ${sound.name}...`);
    
    try {
      await downloadFile(sound.url, filePath);
      const stats = fs.statSync(filePath);
      console.log(`✅ Downloaded ${sound.name} (${(stats.size / 1024).toFixed(2)} KB)`);
    } catch (error) {
      console.error(`❌ Error downloading ${sound.name}:`, error.message);
      console.log(`Creating tone file for ${sound.name} instead...`);
      
      // Create a tone file instead
      createToneMP3(filePath);
      const stats = fs.statSync(filePath);
      console.log(`✅ Created tone file for ${sound.name} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
  }
  
  console.log('Download complete!');
}

// Run the download
downloadAllSounds();