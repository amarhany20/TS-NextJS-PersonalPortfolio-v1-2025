import { describe, expect, it } from 'vitest';
import {
  getMediaStorageDriver,
  LocalMediaStorage,
  VercelBlobMediaStorage,
  setMediaStorageDriver,
} from '@/server/services/media/storage';

describe('Media Storage Driver Resolution System', () => {
  it('defaults to LocalMediaStorage when no Vercel Blob token or env driver is set', () => {
    setMediaStorageDriver(null);
    const originalEnv = process.env.BLOB_READ_WRITE_TOKEN;
    const originalDriver = process.env.MEDIA_STORAGE_DRIVER;
    try {
      delete process.env.BLOB_READ_WRITE_TOKEN;
      delete process.env.MEDIA_STORAGE_DRIVER;
      const driver = getMediaStorageDriver();
      expect(driver).toBeInstanceOf(LocalMediaStorage);
    } finally {
      process.env.BLOB_READ_WRITE_TOKEN = originalEnv;
      process.env.MEDIA_STORAGE_DRIVER = originalDriver;
    }
  });

  it('resolves VercelBlobMediaStorage when BLOB_READ_WRITE_TOKEN is set', () => {
    setMediaStorageDriver(null);
    const originalEnv = process.env.BLOB_READ_WRITE_TOKEN;
    try {
      process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_12345';
      const driver = getMediaStorageDriver();
      expect(driver).toBeInstanceOf(VercelBlobMediaStorage);
    } finally {
      process.env.BLOB_READ_WRITE_TOKEN = originalEnv;
      setMediaStorageDriver(null);
    }
  });

  it('resolves VercelBlobMediaStorage when MEDIA_STORAGE_DRIVER is vercel-blob', () => {
    setMediaStorageDriver(null);
    const originalDriver = process.env.MEDIA_STORAGE_DRIVER;
    try {
      process.env.MEDIA_STORAGE_DRIVER = 'vercel-blob';
      const driver = getMediaStorageDriver();
      expect(driver).toBeInstanceOf(VercelBlobMediaStorage);
    } finally {
      process.env.MEDIA_STORAGE_DRIVER = originalDriver;
      setMediaStorageDriver(null);
    }
  });
});
