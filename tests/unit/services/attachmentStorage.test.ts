import { describe, expect, it } from 'vitest';
import {
  getAttachmentStorageDriver,
  VercelBlobAttachmentStorage,
  setAttachmentStorageDriver,
} from '@/server/services/attachments/storage';

describe('Attachment Storage Driver', () => {
  it('resolves VercelBlobAttachmentStorage when BLOB_READ_WRITE_TOKEN is set', () => {
    setAttachmentStorageDriver(null);
    const originalEnv = process.env.BLOB_READ_WRITE_TOKEN;
    try {
      process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_12345';
      const driver = getAttachmentStorageDriver();
      expect(driver).toBeInstanceOf(VercelBlobAttachmentStorage);
    } finally {
      process.env.BLOB_READ_WRITE_TOKEN = originalEnv;
      setAttachmentStorageDriver(null);
    }
  });

  it('throws a clear error when BLOB_READ_WRITE_TOKEN is missing', () => {
    setAttachmentStorageDriver(null);
    const originalEnv = process.env.BLOB_READ_WRITE_TOKEN;
    try {
      delete process.env.BLOB_READ_WRITE_TOKEN;
      expect(() => getAttachmentStorageDriver()).toThrow(/BLOB_READ_WRITE_TOKEN/);
    } finally {
      process.env.BLOB_READ_WRITE_TOKEN = originalEnv;
      setAttachmentStorageDriver(null);
    }
  });
});
