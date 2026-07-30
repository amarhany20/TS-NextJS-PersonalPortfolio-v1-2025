/**
 * CertificateRepository
 *
 * Access layer for certification records.
 */

import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';

export interface DbCertificate {
  id: string;
  name: string;
  issuer: string;
  issuedOn: Date;
  credentialId?: string | null;
  description?: string | null;
  skills: string[];
  image?: string | null;
  verifyUrl?: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateCreateData {
  id?: string;
  name: string;
  issuer: string;
  issuedOn: Date;
  credentialId?: string | null;
  description?: string | null;
  skills?: string[];
  image?: string | null;
  verifyUrl?: string | null;
  displayOrder: number;
}

export type CertificateUpdateData = Partial<CertificateCreateData>;

function mapCertificate(
  record: Awaited<ReturnType<typeof prisma.certificate.findFirst>>,
): DbCertificate | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    issuer: record.issuer,
    issuedOn: record.issuedOn,
    credentialId: record.credentialId,
    description: record.description,
    skills: parseJson<string[]>(record.skills, []),
    image: record.image,
    verifyUrl: record.verifyUrl,
    displayOrder: record.displayOrder,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const CertificateRepository = {
  async findAll(): Promise<DbCertificate[]> {
    const records = await prisma.certificate.findMany({
      orderBy: [{ displayOrder: 'asc' }, { issuedOn: 'desc' }],
    });

    return records.map((record) => mapCertificate(record)!).filter(Boolean);
  },

  async findById(id: string): Promise<DbCertificate | null> {
    const record = await prisma.certificate.findUnique({ where: { id } });
    return mapCertificate(record);
  },

  async getNextDisplayOrder(): Promise<number> {
    const record = await prisma.certificate.findFirst({
      orderBy: [{ displayOrder: 'desc' }],
      select: { displayOrder: true },
    });

    return (record?.displayOrder ?? 0) + 1;
  },

  async create(data: CertificateCreateData): Promise<DbCertificate> {
    const record = await prisma.certificate.create({
      data: toCreateData(data),
    });

    return mapCertificate(record)!;
  },

  async update(id: string, data: CertificateUpdateData): Promise<DbCertificate | null> {
    try {
      const record = await prisma.certificate.update({
        where: { id },
        data: toUpdateData(data),
      });

      return mapCertificate(record)!;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.certificate.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  },
};

function toCreateData(data: CertificateCreateData) {
  return {
    id: data.id,
    name: data.name,
    issuer: data.issuer,
    issuedOn: data.issuedOn,
    credentialId: data.credentialId ?? null,
    description: data.description ?? null,
    skills: data.skills ? JSON.stringify(data.skills) : null,
    image: data.image ?? null,
    verifyUrl: data.verifyUrl ?? null,
    displayOrder: data.displayOrder,
  };
}

function toUpdateData(data: CertificateUpdateData) {
  const update: Record<string, unknown> = {};

  if (data.name !== undefined) update.name = data.name;
  if (data.issuer !== undefined) update.issuer = data.issuer;
  if (data.issuedOn !== undefined) update.issuedOn = data.issuedOn;
  if (data.credentialId !== undefined) update.credentialId = data.credentialId ?? null;
  if (data.description !== undefined) update.description = data.description ?? null;
  if (data.skills !== undefined) update.skills = data.skills ? JSON.stringify(data.skills) : null;
  if (data.image !== undefined) update.image = data.image ?? null;
  if (data.verifyUrl !== undefined) update.verifyUrl = data.verifyUrl ?? null;
  if (data.displayOrder !== undefined) update.displayOrder = data.displayOrder;

  return update;
}
