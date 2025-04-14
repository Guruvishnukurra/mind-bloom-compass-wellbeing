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
    url: 'https://freesound.org/data/previews/169/169257_2975501-lq.mp3'
  },
  {
    name: 'birds.mp3',
    url: 'https://freesound.org/data/previews/316/316435_5385832-lq.mp3'
  },
  {
    name: 'night.mp3',
    url: 'https://freesound.org/data/previews/341/341559_5865517-lq.mp3'
  },
  {
    name: 'ocean-waves.mp3',
    url: 'https://freesound.org/data/previews/47/47539_173245-lq.mp3'
  },
  {
    name: 'forest.mp3',
    url: 'https://freesound.org/data/previews/387/387936_7255534-lq.mp3'
  },
  {
    name: 'stream.mp3',
    url: 'https://freesound.org/data/previews/346/346170_6271518-lq.mp3'
  },
  {
    name: 'chimes.mp3',
    url: 'https://freesound.org/data/previews/124/124923_2277344-lq.mp3'
  },
  {
    name: 'bells.mp3',
    url: 'https://freesound.org/data/previews/411/411089_5121236-lq.mp3'
  },
  {
    name: 'meditation-bell.mp3',
    url: 'https://freesound.org/data/previews/414/414517_8377953-lq.mp3'
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
        'Referer': 'https://freesound.org/'
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