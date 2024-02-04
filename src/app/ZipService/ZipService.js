import { createReadStream, createWriteStream } from 'fs';
import { join, dirname } from 'path'
import { createBrotliCompress, createBrotliDecompress } from 'zlib'
import { operationFailed } from '../../utils/operationFailed.js';

export class ZipService {
  async compressFile(currentWorkingDirectory, oldFile, newFile) {
    try {
      const oldFilePath = join(currentWorkingDirectory, oldFile);
      const newFilePath = join(dirname(oldFilePath), newFile);

      const sourceStream = createReadStream(oldFilePath);
      const destinationStream = createWriteStream(newFilePath);
      const brotliCompressor = createBrotliCompress();

      sourceStream.pipe(brotliCompressor).pipe(destinationStream);

      await new Promise((resolve, reject) => {
        destinationStream.on('finish', resolve);
        destinationStream.on('error', reject);
      })
    } catch {
      operationFailed();
    }
  }

  async decompressFile(currentWorkingDirectory, oldFile, newFile) {
    try {
      const oldFilePath = join(currentWorkingDirectory, oldFile);
      const newFilePath = join(dirname(oldFilePath), newFile);

      const sourceStream = createReadStream(oldFilePath);
      const destinationStream = createWriteStream(newFilePath);
      const brotliDecompressor = createBrotliDecompress();

      sourceStream.pipe(brotliDecompressor).pipe(destinationStream);
    } catch {
      operationFailed();
    }
  }
}