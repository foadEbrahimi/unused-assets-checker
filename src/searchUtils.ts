import path from 'path';

const importRegex =
  /(?:import\s.*?from\s+['"]([^'"]+)['"])|(?:require\(['"]([^'"]+)['"]\))|url\(['"]?([^'")]+)['"]?\)/g;

export function extractReferencesFromSource(content: string): string[] {
  const matches: string[] = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const ref = match[1] || match[2] || match[3];
    if (ref) matches.push(ref);
  }
  return matches;
}

export function isReferenced(
  filePath: string,
  references: string[],
  rootDir: string
): boolean {
  const normalizedFilePath = path.normalize(filePath);
  for (const ref of references) {
    if (ref.startsWith('.')) {
      const absoluteRef = path.resolve(rootDir, ref);
      if (absoluteRef === normalizedFilePath) return true;
      const possibleExts = [
        '',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
        '.svg',
        '.png',
        '.jpg',
        '.jpeg',
      ];
      for (const ext of possibleExts) {
        if (absoluteRef + ext === normalizedFilePath) return true;
      }
    }
  }
  return false;
}
