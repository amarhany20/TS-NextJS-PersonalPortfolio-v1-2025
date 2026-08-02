import { put, del } from '@vercel/blob';
import { imageSize } from 'image-size';

export interface SaveFileInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export interface SaveFileResult {
  path: string;
  url: string;
  width?: number;
  height?: number;
}

export interface AttachmentStorageDriver {
  saveFile(input: SaveFileInput): Promise<SaveFileResult>;
  deleteFile(relativePathOrUrl: string): Promise<void>;
}

/**
 * Public Vercel Blob storage. This is the only supported attachment driver.
 * Uploads require `BLOB_READ_WRITE_TOKEN` to be configured.
 */
export class VercelBlobAttachmentStorage implements AttachmentStorageDriver {
  async saveFile(input: SaveFileInput): Promise<SaveFileResult> {
    const blob = await put(input.filename, input.buffer, {
      access: 'public',
      contentType: input.mimeType,
    });

    let width: number | undefined;
    let height: number | undefined;

    if (input.mimeType.startsWith('image/')) {
      try {
        const dimensions = imageSize(input.buffer);
        width = dimensions.width ?? undefined;
        height = dimensions.height ?? undefined;
      } catch {
        // Ignore dimension extraction errors
      }
    }

    return {
      path: blob.url,
      url: blob.url,
      width,
      height,
    };
  }

  async deleteFile(url: string): Promise<void> {
    if (!url) {
      return;
    }

    try {
      await del(url);
    } catch {
      // Ignore Vercel Blob deletion errors if blob does not exist
    }
  }
}

let customDriver: AttachmentStorageDriver | null = null;

export function getAttachmentStorageDriver(): AttachmentStorageDriver {
  if (customDriver) {
    return customDriver;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'Vercel Blob is required for attachments. Set the BLOB_READ_WRITE_TOKEN environment variable.',
    );
  }

  return new VercelBlobAttachmentStorage();
}

export function setAttachmentStorageDriver(driver: AttachmentStorageDriver | null) {
  customDriver = driver;
}
