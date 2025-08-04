import { readFile, stat } from 'fs/promises';
import { glob } from 'glob';

export async function globPromise(pattern: string): Promise<string[]> {
  return await glob(pattern);
}

export async function getFiles(dir: string, exts: string[]): Promise<string[]> {
  const pattern = `${dir.replace(/\\/g, '/')}/**/*.{${exts
    .map(e => e.replace('.', ''))
    .join(',')}}`;
  return globPromise(pattern);
}

export async function readFileContent(filePath: string): Promise<string> {
  return readFile(filePath, 'utf8');
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}
