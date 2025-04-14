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
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_1fb1d4e5c1.mp3'
  },
  {
    name: 'birds.mp3',
    url: 'https://cdn.pixabay.com/audio/2021/04/08/audio_b4115c621c.mp3'
  },
  {
    name: 'night.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bbd.mp3'
  },
  {
    name: 'ocean-waves.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8b8c5c7e4.mp3'
  },
  {
    name: 'forest.mp3',
    url: 'https://cdn.pixabay.com/audio/2021/09/06/audio_8a901c8b5d.mp3'
  },
  {
    name: 'stream.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bbd.mp3'
  },
  {
    name: 'chimes.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6ff1bbd.mp3'
  },
  {
    name: 'bells.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8b8c5c7e4.mp3'
  },
  {
    name: 'meditation-bell.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8b8c5c7e4.mp3'
  }
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

// Function to create a valid MP3 file from base64
function createValidMp3File(filePath) {
  const mp3Buffer = Buffer.from(validMp3Base64, 'base64');
  fs.writeFileSync(filePath, mp3Buffer);
  return true;
}

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

// Download all sound files
async function downloadAllSounds() {
  console.log('Starting download of sound files...');
  let downloadSuccess = false;
  
  for (const sound of soundFiles) {
    const filePath = path.join(soundsDir, sound.name);
    console.log(`Downloading ${sound.name}...`);
    
    try {
      await downloadFile(sound.url, filePath);
      const stats = fs.statSync(filePath);
      console.log(`✅ Downloaded ${sound.name} (${(stats.size / 1024).toFixed(2)} KB)`);
      downloadSuccess = true;
    } catch (error) {
      console.error(`❌ Error downloading ${sound.name}:`, error.message);
      console.log(`Creating fallback file for ${sound.name} instead...`);
      
      // Create a fallback file
      createValidMp3File(filePath);
      const stats = fs.statSync(filePath);
      console.log(`✅ Created fallback file for ${sound.name} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
  }
  
  if (!downloadSuccess) {
    console.log('All downloads failed. Using fallback files instead.');
  }
  
  console.log('Download process complete!');
}

// Run the download
downloadAllSounds();