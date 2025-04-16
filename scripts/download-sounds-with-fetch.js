import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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
    url: 'https://cdn.freesound.org/previews/346/346170_984096-lq.mp3'
  },
  {
    name: 'birds.mp3',
    url: 'https://cdn.freesound.org/previews/316/316435_5385832-lq.mp3'
  },
  {
    name: 'night.mp3',
    url: 'https://cdn.freesound.org/previews/341/341652_5865517-lq.mp3'
  },
  {
    name: 'ocean-waves.mp3',
    url: 'https://cdn.freesound.org/previews/328/328142_5865517-lq.mp3'
  },
  {
    name: 'forest.mp3',
    url: 'https://cdn.freesound.org/previews/369/369460_5865517-lq.mp3'
  },
  {
    name: 'stream.mp3',
    url: 'https://cdn.freesound.org/previews/168/168651_3120044-lq.mp3'
  },
  {
    name: 'chimes.mp3',
    url: 'https://cdn.freesound.org/previews/339/339816_5865517-lq.mp3'
  },
  {
    name: 'bells.mp3',
    url: 'https://cdn.freesound.org/previews/411/411089_5865517-lq.mp3'
  },
  {
    name: 'meditation-bell.mp3',
    url: 'https://cdn.freesound.org/previews/414/414511_5865517-lq.mp3'
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

// Function to download a file using curl
function downloadFileWithCurl(url, filePath) {
  try {
    console.log(`Downloading ${url} to ${filePath}...`);
    
    // Use curl with user agent and referer to download the file
    execSync(`curl -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" -e "https://freesound.org/" -o "${filePath}" "${url}"`, {
      stdio: 'inherit'
    });
    
    // Check if file was downloaded successfully
    const stats = fs.statSync(filePath);
    if (stats.size > 1000) { // If file size is reasonable
      console.log(`✅ Downloaded ${path.basename(filePath)} (${(stats.size / 1024).toFixed(2)} KB)`);
      return true;
    } else {
      console.error(`❌ Downloaded file is too small: ${(stats.size / 1024).toFixed(2)} KB`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error downloading with curl: ${error.message}`);
    return false;
  }
}

// Download all sound files
async function downloadAllSounds() {
  console.log('Starting download of sound files...');
  let downloadSuccess = false;
  
  for (const sound of soundFiles) {
    const filePath = path.join(soundsDir, sound.name);
    console.log(`Processing ${sound.name}...`);
    
    const success = downloadFileWithCurl(sound.url, filePath);
    
    if (success) {
      downloadSuccess = true;
    } else {
      console.log(`Creating fallback file for ${sound.name} instead...`);
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