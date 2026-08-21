// Storage abstraction so we're not locked into a specific provider.
// V1 implementation is local-disk for development; swap the export below
// for an S3/R2/GCS-backed implementation later without touching callers.

export interface StoredFileMeta {
  fileName: string;
  storageKey: string;
  fileType: string;
  fileSize: number;
}

export interface StorageService {
  upload(file: {
    buffer: Buffer;
    fileName: string;
    fileType: string;
  }): Promise<StoredFileMeta>;
  delete(storageKey: string): Promise<void>;
  getDownloadUrl(storageKey: string): Promise<string>;
}

// NOTE: no real provider is wired up yet — this is intentionally a stub so
// the assignment module's API contract (fileName/storageKey/fileType/fileSize)
// is correct today, without inventing upload infrastructure that isn't
// configured in this project. Swap this for a real implementation
// (S3, R2, Supabase Storage, etc.) when file upload is prioritized.
export const storageService: StorageService = {
  async upload() {
    throw new Error(
      "StorageService not yet configured — wire up a real provider before enabling file uploads."
    );
  },
  async delete() {
    throw new Error("StorageService not yet configured.");
  },
  async getDownloadUrl(storageKey: string) {
    throw new Error("StorageService not yet configured.");
  },
};
