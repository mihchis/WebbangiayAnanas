export interface StorageProvider {
  /**
   * Uploads a file buffer and returns the accessible URL/Path
   * @param fileBuffer The buffer of the file
   * @param originalName The original filename
   * @param mimeType The file mime type
   */
  uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<string>;

  /**
   * Deletes a file from the storage provider
   * @param fileUrl The URL or path of the file to delete
   */
  deleteFile(fileUrl: string): Promise<void>;
}
