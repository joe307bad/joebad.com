import * as fs from 'fs';
import * as path from 'path';

interface MoveOptions {
  publicDir?: string;
  distDir?: string;
  overwrite?: boolean;
  createDistDir?: boolean;
}

/**
 * Copies contents from public folder to dist folder
 * @param options Configuration options for the copy operation
 * @returns Promise<void>
 */
export async function copyPublicToDist(options: MoveOptions = {}): Promise<void> {
  const {
    publicDir = 'public',
    distDir = 'dist',
    overwrite = true,
    createDistDir = true
  } = options;

  const publicPath = path.resolve(publicDir);
  const distPath = path.resolve(distDir);

  try {
    // Check if public directory exists
    if (!fs.existsSync(publicPath)) {
      throw new Error(`Public directory does not exist: ${publicPath}`);
    }

    // Create dist directory if it doesn't exist and createDistDir is true
    if (!fs.existsSync(distPath)) {
      if (createDistDir) {
        await fs.promises.mkdir(distPath, { recursive: true });
        console.log(`Created dist directory: ${distPath}`);
      } else {
        throw new Error(`Dist directory does not exist: ${distPath}`);
      }
    }

    // Get all items in public directory
    const items = await fs.promises.readdir(publicPath);

    for (const item of items) {
      const sourcePath = path.join(publicPath, item);
      const destPath = path.join(distPath, item);

      // Get stats to check if it's a file or directory
      const stats = await fs.promises.stat(sourcePath);

      if (stats.isDirectory()) {
        // Recursively copy directory
        await copyDirectory(sourcePath, destPath, overwrite);
      } else {
        // Copy file
        await copyFile(sourcePath, destPath, overwrite);
      }
    }

    console.log(`Successfully copied contents from ${publicDir} to ${distDir}`);
  } catch (error) {
    console.error('Error copying public folder contents:', error);
    throw error;
  }
}

/**
 * Recursively copies a directory and its contents
 */
async function copyDirectory(source: string, dest: string, overwrite: boolean): Promise<void> {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    await fs.promises.mkdir(dest, { recursive: true });
  }

  const items = await fs.promises.readdir(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(dest, item);
    const stats = await fs.promises.stat(sourcePath);

    if (stats.isDirectory()) {
      await copyDirectory(sourcePath, destPath, overwrite);
    } else {
      await copyFile(sourcePath, destPath, overwrite);
    }
  }
  
  console.log(`Copied directory: ${source} → ${dest}`);
}

/**
 * Copies a single file
 */
async function copyFile(source: string, dest: string, overwrite: boolean): Promise<void> {
  // Check if destination file exists
  if (fs.existsSync(dest) && !overwrite) {
    console.warn(`File already exists and overwrite is false: ${dest}`);
    return;
  }

  // Copy file
  await fs.promises.copyFile(source, dest);
  console.log(`Copied: ${source} → ${dest}`);
}