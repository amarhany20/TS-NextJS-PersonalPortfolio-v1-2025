import type { DbCertificate } from '@/server/repositories/CertificateRepository';
import type { Certificate } from '@/types/certificate';

export function serializeCertificate(record: DbCertificate): Certificate {
  return {
    id: record.id,
    name: record.name,
    issuer: record.issuer,
    date: record.issuedOn.toISOString(),
    credential: record.credentialId ?? undefined,
    description: record.description ?? undefined,
    skills: record.skills,
    image: record.image ?? undefined,
    verifyUrl: record.verifyUrl ?? undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
