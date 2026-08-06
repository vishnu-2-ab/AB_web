import fs from 'fs';
import { resolve } from 'path';

const filesToCopy = [
  {
    src: 'C:/Users/Admin/Downloads/new_vsm_hero.jpeg',
    dest: 'public/monitor/vsm/new_vsm_hero.jpeg'
  },
  {
    src: 'C:/Users/Admin/Downloads/file_00000000484c8211b1d58e22db1cb523~2.jpg.jpeg',
    dest: 'public/monitor/vsm/vsm-detail-1.jpg'
  },
  {
    src: 'C:/Users/Admin/Downloads/file_0000000064ac7206a496a9a3eac802c3.png_2K_202608061232.jpeg',
    dest: 'public/monitor/vsm/vsm-detail-2.jpg'
  }
];

filesToCopy.forEach(file => {
  try {
    const srcPath = resolve(file.src);
    const destPath = resolve(process.cwd(), file.dest);
    
    // Ensure parent directory exists
    const destDir = resolve(destPath, '..');
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied ${file.src} to ${file.dest}`);
    } else {
      console.warn(`Source file not found at: ${file.src}`);
    }
  } catch (err) {
    console.error(`Error copying ${file.src}:`, err);
  }
});

// Clean up any old large local mp4 files
const oldVideos = [
  'public/monitor/vsm/VN20260804_101114.mp4',
  'public/monitor/vsm/VN20260717_144653.mp4'
];

oldVideos.forEach(file => {
  try {
    const p = resolve(process.cwd(), file);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`Successfully deleted local copy of old video: ${file}`);
    }
  } catch (err) {
    console.error(`Error deleting old video file ${file}:`, err);
  }
});
