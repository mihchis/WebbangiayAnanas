import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from './storage.interface';
import { LocalStorageProvider } from './providers/local-storage.provider';

@Injectable()
export class StorageService implements StorageProvider, OnModuleInit {
  private activeProvider: StorageProvider;

  constructor(
    private configService: ConfigService,
    private localStorageProvider: LocalStorageProvider,
  ) {}

  onModuleInit() {
    const storageType = this.configService.get<string>('STORAGE_TYPE', 'local').toLowerCase();

    if (storageType === 'local') {
      this.activeProvider = this.localStorageProvider;
      console.log('File Storage Service running with provider: LOCAL');
    } else {
      // Fallback or easily extensible to MinIO / AWS S3 S3StorageProvider
      this.activeProvider = this.localStorageProvider;
      console.log(`Provider '${storageType}' not fully configured. Defaulted to LOCAL.`);
    }
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    return this.activeProvider.uploadFile(fileBuffer, originalName, mimeType);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    return this.activeProvider.deleteFile(fileUrl);
  }
}
