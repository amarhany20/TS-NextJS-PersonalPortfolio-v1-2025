import fs from 'node:fs/promises';
import path from 'node:path';
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

export interface MediaStorageDriver {
  saveFile(input: SaveFileInput): Promise<SaveFileResult>;
  deleteFile(relativePathOrUrl: string): Promise<void>;
}

export class LocalMediaStorage implements MediaStorageDriver {
  async saveFile(input: SaveFileInput): Promise<SaveFileResult> {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const relativeDir = path.posix.join('uploads', year, month);
    const targetDir = path.join(process.cwd(), 'public', relativeDir);

    await fs.mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, input.filename);
    await fs.writeFile(filePath, input.buffer);

    let width: number | undefined;
    let height: number | undefined;

    if (input.mimeType.startsWith('image/')) {
      try {
        const dimensions = imageSize(input.buffer);
        width = dimensions.width ?? undefined;
        height = dimensions.height ?? undefined;
      } catch {
        // Ignore dimension extraction errors for non-standard images
      }
    }

    const relativePath = path.posix.join(relativeDir, input.filename);

    return {
      path: relativePath,
      url: `/${relativePath}`,
      width,
      height,
    };
  }

  async deleteFile(relativePath: string): Promise<void> {
    if (!relativePath) {
      return;
    }

    const sanitized = relativePath.replace(/^\/+/, '');
    const absolutePath = path.join(process.cwd(), 'public', sanitized);

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code?: string }).code === 'ENOENT'
      ) {
        return;
      }

      throw error;
    }
  }
}

export class VercelBlobMediaStorage implements MediaStorageDriver {
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

let customDriver: MediaStorageDriver | null = null;

export function getMediaStorageDriver(): MediaStorageDriver {
  if (customDriver) {
    return customDriver;
  }

  const requestedDriver = (process.env.MEDIA_STORAGE_DRIVER || '').toLowerCase();

  if (requestedDriver === 'vercel-blob' || process.env.BLOB_READ_WRITE_TOKEN) {
    return new VercelBlobMediaStorage();
  }

  return new LocalMediaStorage();
}

export function setMediaStorageDriver(driver: MediaStorageDriver | null) {
  customDriver = driver;
}
