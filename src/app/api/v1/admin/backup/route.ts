import { NextResponse } from 'next/server';

import { requireAuth } from '@/server/security/session';
import { verifyPassword } from '@/server/security/password';
import prisma from '@/server/db/prisma';
import { BackupService } from '@/server/services/BackupService';
import { errorResponse, successResponse } from '@/server/http/responses';
import { BadRequestError, ForbiddenError } from '@/server/http/errors';
import { logger } from '@/utils/logger';

const MAX_RESTORE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function GET() {
  try {
    await requireAuth();
    const backup = await BackupService.exportBackup();
    const filename = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    logger.error('[API Backup Export] Failed to export backup', error);
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    const contentType = request.headers.get('content-type') || '';
    let payload: unknown;
    let submittedPassword: unknown;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      submittedPassword = formData.get('password');

      if (!file) {
        return errorResponse(new BadRequestError('No backup file uploaded.'));
      }

      if (file.size > MAX_RESTORE_BYTES) {
        return errorResponse(new BadRequestError('Backup file is too large (max 10 MB).'));
      }

      const text = await file.text();

      try {
        payload = JSON.parse(text);
      } catch {
        return errorResponse(new BadRequestError('Invalid JSON in backup file.'));
      }
    } else {
      try {
        payload = await request.json();
      } catch {
        return errorResponse(new BadRequestError('Invalid JSON request body.'));
      }

      const body = payload as { password?: unknown };
      submittedPassword = body?.password;
    }

    // Restore is a destructive full-database overwrite. Like the purge flow,
    // require the admin to re-enter their password before the transaction runs.
    const password = submittedPassword;

    if (!password || typeof password !== 'string') {
      return errorResponse(new BadRequestError('Password is required to restore a backup.'));
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user!.id },
    });

    if (!user) {
      return errorResponse(new ForbiddenError('User not found.'));
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return errorResponse(new ForbiddenError('Incorrect password. Restore aborted.'));
    }

    const result = await BackupService.importBackup(payload);
    return successResponse(result);
  } catch (error) {
    logger.error('[API Backup Import] Failed to restore backup', error);
    return errorResponse(error);
  }
}
