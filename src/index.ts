import path from 'path';
import { getFiles, readFileContent } from './fileUtils';
import { extractReferencesFromSource, isReferenced } from './searchUtils';

interface Options {
  assetsDir: string;
  sourceDir: string;
  assetExts: string[];
}

export async function findUnusedAssets(options: Options): Promise<string[]> {
  const { assetsDir, sourceDir, assetExts } = options;

  const assets = await getFiles(assetsDir, assetExts);

  const sourceFiles = await getFiles(sourceDir, ['js', 'jsx', 'ts', 'tsx']);

  const allReferences: string[] = [];

  for (const srcFile of sourceFiles) {
    const content = await readFileContent(srcFile);
    const refs = extractReferencesFromSource(content);
    allReferences.push(...refs);
  }

  const unused = assets.filter(assetPath => {
    const assetFileName = path.basename(assetPath); // فقط اسم فایل
    return !allReferences.some(ref => ref.includes(assetFileName));
  });

  return unused;
}
