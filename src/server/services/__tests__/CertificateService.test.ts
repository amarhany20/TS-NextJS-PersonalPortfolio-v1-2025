import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/CertificateRepository', () => ({
  CertificateRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    getNextDisplayOrder: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/serializers/certificate', () => ({
  serializeCertificate: vi.fn((record: any) => ({
    id: record.id ?? 'cert-1',
    name: record.name ?? 'Cert',
    issuer: record.issuer ?? 'Issuer',
    date: '2024-01-01T00:00:00.000Z',
    credential: record.credentialId ?? undefined,
    description: record.description ?? undefined,
    skills: record.skills ?? [],
    image: record.image ?? undefined,
    verifyUrl: record.verifyUrl ?? undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  })),
}));

import { NotFoundError, ValidationError } from '@/server/http/errors';
import { CertificateRepository } from '@/server/repositories/CertificateRepository';
import { serializeCertificate } from '@/server/serializers/certificate';
import { CertificateService } from '../CertificateService';
import type { CreateCertificateInput } from '@/server/server-validators/api/certificate';

const buildCertificate = (overrides: Partial<CreateCertificateInput> = {}): CreateCertificateInput => ({
  id: overrides.id,
  name: overrides.name ?? 'Deep Learning Specialization',
  issuer: overrides.issuer ?? 'Coursera',
  issuedOn: overrides.issuedOn ?? '2024-01-01',
  credentialId: overrides.credentialId,
  description: overrides.description,
  skills: overrides.skills ?? ['ML'],
  image: overrides.image,
  verifyUrl: overrides.verifyUrl,
  displayOrder: overrides.displayOrder,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CertificateService', () => {
  it('maps certificates through serializer', async () => {
    const records = [{ id: 'cert-1', name: 'Cert' }] as unknown as Parameters<typeof serializeCertificate>[0][];
    vi.mocked(CertificateRepository.findAll).mockResolvedValue(records);

    const result = await CertificateService.getCertificates();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ name: 'Cert' });
  });

  it('validates issuedOn during creation', async () => {
    await expect(
      CertificateService.createCertificate(buildCertificate({ issuedOn: 'invalid-date' })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('deletes certificate or throws when missing', async () => {
    vi.mocked(CertificateRepository.delete).mockResolvedValue(false);

    await expect(CertificateService.deleteCertificate('missing')).rejects.toBeInstanceOf(NotFoundError);
  });
});
