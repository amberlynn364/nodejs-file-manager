import { createHash } from 'crypto';
import { join } from 'path';
import { createReadStream } from 'fs';
import { operationFailed } from '../../utils/operationFailed.js';

export class HashService {
  async calculateHash(currentWorkingDirectory, fileName) {
    try {
      const pathToFile = join(currentWorkingDirectory, fileName);
      const hash = createHash('sha256');
      const input = createReadStream(pathToFile);

      return await new Promise((resolve, reject) => {
        input.on('data', (data) => hash.update(data));
        input.on('end', () => resolve(console.log(hash.digest('hex'))));
        input.on('error', () => reject());
      });
    } catch {
      operationFailed();
    }
  }
}