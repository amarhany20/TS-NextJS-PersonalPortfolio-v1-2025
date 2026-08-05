import { CertificateRepository } from '@/server/repositories/CertificateRepository';
import { serializeCertificate } from '@/server/serializers/certificate';
import { NotFoundError, ValidationError } from '@/server/http/errors';
import { nullIfEmpty, parseISODate } from '@/server/server-utils/dates';
import type {
  CreateCertificateInput,
  UpdateCertificateInput,
} from '@/server/server-validators/api/certificate';

export const CertificateService = {
  async getCertificates() {
    const records = await CertificateRepository.findAll();
    return records.map(serializeCertificate);
  },

  async getCertificateById(id: string) {
    const record = await CertificateRepository.findById(id);
    return record ? serializeCertificate(record) : null;
  },

  async createCertificate(input: CreateCertificateInput) {
    const issuedOn = parseISODate(input.issuedOn);
    if (!issuedOn) {
      throw new ValidationError('Issued date must be a valid ISO date');
    }

    const record = await CertificateRepository.create({
      name: input.name,
      issuer: input.issuer,
      issuedOn,
      credentialId: nullIfEmpty(input.credentialId),
      description: nullIfEmpty(input.description),
      skills: input.skills,
      image: nullIfEmpty(input.image),
      verifyUrl: nullIfEmpty(input.verifyUrl),
      displayOrder: input.displayOrder ?? (await CertificateRepository.getNextDisplayOrder()),
    });

    return serializeCertificate(record);
  },

  async updateCertificate(id: string, input: UpdateCertificateInput) {
    const existing = await CertificateRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Certificate not found');
    }

    const issuedOn =
      input.issuedOn !== undefined
        ? (parseISODate(input.issuedOn) ?? raiseValidation('Issued date must be a valid ISO date'))
        : undefined;

    const record = await CertificateRepository.update(id, {
      name: input.name,
      issuer: input.issuer,
      issuedOn,
      credentialId: valueOrNull(input.credentialId),
      description: valueOrNull(input.description),
      skills: input.skills,
      image: valueOrNull(input.image),
      verifyUrl: valueOrNull(input.verifyUrl),
      displayOrder: input.displayOrder,
    });

    if (!record) {
      throw new NotFoundError('Certificate not found');
    }

    return serializeCertificate(record);
  },

  async deleteCertificate(id: string) {
    const deleted = await CertificateRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Certificate not found');
    }
  },
};

function valueOrNull(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return nullIfEmpty(value);
}

function raiseValidation(message: string): never {
  throw new ValidationError(message);
}
