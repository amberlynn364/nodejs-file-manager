import { FileManagerUtils } from './FileManagerUtils/FileManagerUtils.js';
import { printCurrentDirectory } from '../utils/printCurrentDirectory.js';
import { stat } from 'fs/promises';
import path, { resolve } from 'path';
import { operationFailed } from '../utils/operationFailed.js';
import { FilesService } from './FilesService/FilesService.js';
import { HashService } from './HashService/HashService.js';
import { ZipService } from './ZipService/ZipService.js';

export class App {
  constructor(username) {
    this.username = username;
    this.currentWorkingDirectory = process.cwd();
    this.rootDirectory = this.currentWorkingDirectory;
    this.fileManagerUtils = new FileManagerUtils();
    this.filesService = new FilesService();
    this.hashService = new HashService();
    this.zipService = new ZipService();

    console.log(`Welcome to the File Manager, ${username}!`);
    printCurrentDirectory(this.currentWorkingDirectory);

    process.stdin.on('data', async (data) => {
      const userInput = data.toString().trim();
      const [command, ...args] = userInput.split(' ');

      await this.handleCommand(command, args);
    })

    process.on('SIGINT', () => {
      this.fileManagerUtils.exit();
    });
  }

  async handleCommand(command, args) {
    const commandHandlers = {
      'up': () => this.goUpDirectory(),
      'cd': () => this.changeDirectory(args.join(' ')),
      'cat': () => this.filesService.readFile(this.currentWorkingDirectory, args.join(' ')),
      'add': () => this.filesService.createFile(this.currentWorkingDirectory, args.join(' ')),
      'rn': () => this.filesService.renameFile(this.currentWorkingDirectory, args[0], args[1]),
      'cp': () => this.filesService.copyFile(this.currentWorkingDirectory, args[0], args[1]),
      'mv': () => this.filesService.moveFile(this.currentWorkingDirectory, args[0], args[1]),
      'rm': () => this.filesService.removeFile(this.currentWorkingDirectory, args.join(' ')),
      'hash': () => this.hashService.calculateHash(this.currentWorkingDirectory, args.join(' ')),
      'compress': () => this.zipService.compressFile(this.currentWorkingDirectory, args[0], args[1]),
      'decompress': () => this.zipService.decompressFile(this.currentWorkingDirectory, args[0], args[1]),
      'os': () => this.fileManagerUtils.executeOsCommand(args),
      'ls': () => this.fileManagerUtils.listDirectoryContent(this.currentWorkingDirectory),
      '.exit': () => this.fileManagerUtils.exit(this.username),
    };
  
    const commandHandler = commandHandlers[command];
    if (commandHandler) {
      await commandHandler();
    } else {
      process.stdout.write('\x1b[31mInvalid input. Please enter a valid command.\x1b[0m\n');
    }
  }

  async changeDirectory(directoryPath) {
    const targetPath = resolve(this.currentWorkingDirectory, directoryPath);
    try {
      const stats = await stat(targetPath);
      const isSubDirectory = targetPath.startsWith(this.rootDirectory);
      if (stats.isDirectory() && isSubDirectory) {
        this.currentWorkingDirectory = targetPath;
        printCurrentDirectory(this.currentWorkingDirectory);
      } else {
        console.log('\x1b[31mCannot go upper than root directory.\x1b[0m');
      }
    } catch {
      operationFailed();
    }
  }

  async goUpDirectory() {
    const targetPath = path.resolve(this.currentWorkingDirectory, '..');
    if (this.rootDirectory !== this.currentWorkingDirectory) {
      this.currentWorkingDirectory = targetPath;
      printCurrentDirectory(this.currentWorkingDirectory);
    } else {
      console.log('\x1b[31mCannot go upper than root directory.\x1b[0m');
    }
  }
}