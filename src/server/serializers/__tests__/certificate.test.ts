import { describe, expect, it } from 'vitest';

import type { DbCertificate } from '@/server/repositories/CertificateRepository';
import { serializeCertificate } from '../certificate';

describe('serializeCertificate', () => {
  it('converts database record to certificate', () => {
    const record: DbCertificate = {
      id: 'cert-1',
      name: 'AWS SA Associate',
      issuer: 'AWS',
      issuedOn: new Date('2024-01-01T00:00:00Z'),
      credentialId: 'ABC123',
      description: 'Cloud',
      skills: ['AWS'],
      image: null,
      verifyUrl: null,
      displayOrder: 1,
      createdAt: new Date('2024-02-01T00:00:00Z'),
      updatedAt: new Date('2024-02-02T00:00:00Z'),
    };

    const result = serializeCertificate(record);

    expect(result).toEqual({
      id: 'cert-1',
      name: 'AWS SA Associate',
      issuer: 'AWS',
      date: '2024-01-01T00:00:00.000Z',
      credential: 'ABC123',
      description: 'Cloud',
      skills: ['AWS'],
      image: undefined,
      verifyUrl: undefined,
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-02T00:00:00.000Z',
    });
  });
});
