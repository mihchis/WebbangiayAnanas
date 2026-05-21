import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from '../storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private uploadRootDir: string;

  constructor(private configService: ConfigService) {
    this.uploadRootDir = this.configService.get<string>('STORAGE_LOCAL_DIR', './uploads');
    
    // Ensure root directory exists
    if (!fs.existsSync(this.uploadRootDir)) {
      fs.mkdirSync(this.uploadRootDir, { recursive: true });
    }
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    try {
      // 1. Organize files dynamically by Year and Month (e.g., ./uploads/2026/05/)
      const now = new Date();
      const relativeSubDir = path.join(
        now.getFullYear().toString(),
        (now.getMonth() + 1).toString().padStart(2, '0'),
      );
      
      const targetDir = path.join(this.uploadRootDir, relativeSubDir);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 2. Generate secure unique filename to prevent collisions and sanitize original extension
      const fileExt = path.extname(originalName).toLowerCase();
      const uniqueName = `${randomBytes(16).toString('hex')}${fileExt}`;
      const fullPath = path.join(targetDir, uniqueName);

      // 3. Write file synchronously / asynchronously
      await fs.promises.writeFile(fullPath, fileBuffer);

      // 4. Return serving URL/relative path
      // e.g., "uploads/2026/05/unique_name.jpg" using forward slashes for cross-platform compatibility
      return path.join(relativeSubDir, uniqueName).replace(/\\/g, '/');
    } catch (err) {
      throw new InternalServerErrorException(`Local file upload failed: ${err.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadRootDir, fileUrl);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (err) {
      throw new InternalServerErrorException(`Failed to delete local file: ${err.message}`);
    }
  }
}
