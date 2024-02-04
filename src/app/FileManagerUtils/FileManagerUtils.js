import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { operationFailed } from '../../utils/operationFailed.js';
import { FilesService } from '../FilesService/FilesService.js';
import { HashService } from '../HashService/HashService.js';
import { OsService } from '../OsService/OsService.js';
import { sortItemsForLS } from '../../utils/sortItemsForLS.js';
import { printCurrentDirectory } from '../../utils/printCurrentDirectory.js';

export class FileManagerUtils {
  constructor() {
    this.filesService = new FilesService();
    this.osService = new OsService();
    this.hashService = new HashService();
  }
  async listDirectoryContent(currentWorkingDirectory) {
    try {
      const content = await readdir(currentWorkingDirectory);
      const items = await Promise.all(content.map(async item => {
        const fullPath = join(currentWorkingDirectory, item);
        const type = (await stat(fullPath)).isDirectory() ? 'Directory' : 'File';
        return { item, type };
      }));

      sortItemsForLS(items);
      
      console.table(items, ['item', 'type']);
      printCurrentDirectory(currentWorkingDirectory);
    } catch {
      operationFailed();
    }
  }

  executeOsCommand(args) {
    if(args.length < 1) {
      process.stdout.write(`\x1b[31mOperation failed.\x1b[0m\n`);
      return;
    }

    const commands = {
      '--cpus': () => this.osService.getCpuInfo(),
      '--homedir': () => this.osService.getHomeDirectory(),
      '--username': () => this.osService.getUsername(),
      '--architecture': () => this.osService.getArchitecture(),
      '--EOL': () => this.osService.getEndOfLine()
    };
  
    for (let arg of args) {
      const command = commands[arg];
      if (command) {
        command();
      } else {
        process.stdout.write(`\x1b[31mOperation failed for argument "${arg}".\x1b[0m\n`);
      }
    }
  }

  exit(username) {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  }
}