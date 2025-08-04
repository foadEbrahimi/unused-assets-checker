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

  // همه‌ی فایل‌های asset رو می‌گیریم
  const assets = await getFiles(assetsDir, assetExts);

  // همه‌ی فایل‌های سورس که ممکنه asset داخلشون استفاده شده باشه
  const sourceFiles = await getFiles(sourceDir, ['js', 'jsx', 'ts', 'tsx']);

  const allReferences: string[] = [];

  // محتوا رو می‌خونیم و تمام رفرنس‌ها رو استخراج می‌کنیم
  for (const srcFile of sourceFiles) {
    const content = await readFileContent(srcFile);
    const refs = extractReferencesFromSource(content);
    allReferences.push(...refs);
  }

  // حالا بررسی می‌کنیم کدوم asset واقعاً تو سورس استفاده نشده
  const unused = assets.filter(assetPath => {
    const assetFileName = path.basename(assetPath); // فقط اسم فایل
    return !allReferences.some(ref => ref.includes(assetFileName));
  });

  return unused;
}
