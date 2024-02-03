import fs from 'fs/promises';
import path from 'path';
import { sortItemsForLS } from '../../utils/sortItemsForLS.js';

export class ListDirectoryContent {
  async listDirectoryContent(currentWorkingDirectory) {
    try {
      const content = await fs.readdir(currentWorkingDirectory);
      const items = await Promise.all(content.map(async item => {
        const fullPath = path.join(currentWorkingDirectory, item);
        const type = (await fs.stat(fullPath)).isDirectory() ? 'Directory' : 'File';
        return { item, type };
      }));

      sortItemsForLS(items);
      
      console.table(items, ['item', 'type']);
    } catch (error) {
      console.error(`Operation failed: ${error.message}`);
    }
  }
}