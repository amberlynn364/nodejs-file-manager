import { access, readdir, rename, stat, unlink, writeFile } from 'fs/promises';
import path, { basename, join } from 'path';
import { sortItemsForLS } from '../../utils/sortItemsForLS.js';
import { createReadStream, createWriteStream } from 'fs';
import { operationFailed } from '../../utils/operationFailed.js';
import { printCurrentDirectory } from '../../utils/printCurrentDirectory.js';

export class FilesService {
  readFile(currentWorkingDirectory, fileName) {
    const filePath = join(currentWorkingDirectory, fileName);
    const fileStream = createReadStream(filePath, 'utf-8');

    fileStream.on('data', chunk => {
      console.log(chunk);
      printCurrentDirectory(currentWorkingDirectory);
    });

    fileStream.on('error', () => operationFailed());
  }

  async createFile(currentWorkingDirectory, fileName) {
    try {
      const filePath = join(currentWorkingDirectory, fileName);
      await writeFile(filePath, '', { flag: 'wx' });
      printCurrentDirectory(currentWorkingDirectory);
    } catch {
      operationFailed();
    }
  }

  async renameFile(currentWorkingDirectory, oldFile, newFile) {
    try {
      const oldFilePath = join(currentWorkingDirectory, oldFile);
      const newFilePath = join(path.dirname(oldFilePath), newFile);
      await rename(oldFilePath, newFilePath);
      printCurrentDirectory(currentWorkingDirectory);
    } catch {
      operationFailed();
    }
  }

  async copyFile(currentWorkingDirectory, filePath, directoryPath) {
    try {
      const sourceFilePath = join(currentWorkingDirectory, filePath);
      const destinationDirectoryPath = join(currentWorkingDirectory, directoryPath);

      await access(sourceFilePath);
      await access(destinationDirectoryPath);
      
      const fileName = basename(sourceFilePath);
      const sourceStream = createReadStream(sourceFilePath);
      const destinationPath = join(destinationDirectoryPath, fileName);
      const destinationStream = createWriteStream(destinationPath);

      sourceStream.pipe(destinationStream);

      await new Promise((resolve, reject) => {
        sourceStream.on('end', resolve);
        sourceStream.on('error', reject);
      })
      printCurrentDirectory(currentWorkingDirectory);
    } catch {
      operationFailed();
    }
  }

  async moveFile(currentWorkingDirectory, filePath, directoryPath) {
    try {
      await this.copyFile(currentWorkingDirectory, filePath, directoryPath);
      await unlink(filePath);
    } catch {
    }
  }

  async removeFile(currentWorkingDirectory, fileName) {
    try {
      const filePath = join(currentWorkingDirectory, fileName);
      await unlink(filePath);
      printCurrentDirectory();
    } catch {
      operationFailed();
    }
  }
}