#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { findUnusedAssets } from './index';

const program = new Command();

program
  .name('unused-assets-checker')
  .description('Find unused assets (images, svgs) in your React project')
  .requiredOption('-a, --assets-dir <dir>', 'Directory of assets to check')
  .requiredOption('-s, --source-dir <dir>', 'Directory of source files')
  .option(
    '-e, --exts <exts>',
    'Comma separated list of asset extensions',
    '.png,.jpg,.jpeg,.svg'
  )
  .action(async options => {
    const assetsDir = path.resolve(process.cwd(), options.assetsDir);
    const sourceDir = path.resolve(process.cwd(), options.sourceDir);
    const exts = options.exts
      .split(',')
      .map((exat: string) => exat.trim().replace(/^\./, ''));

    console.log(`Checking assets in: ${assetsDir}`);
    console.log(`Checking source files in: ${sourceDir}`);
    console.log(`Looking for extensions: ${exts.join(', ')}`);

    try {
      const unused = await findUnusedAssets({
        assetsDir,
        sourceDir,
        assetExts: exts,
      });
      if (unused.length === 0) {
        console.log('🎉 No unused assets found!');
      } else {
        console.log('🚨 Unused assets:');
        unused.forEach(file => console.log(file));
      }
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
