import { NextResponse } from 'next/server';

import { requireAuth } from '@/server/security/session';
import { BackupService } from '@/server/services/BackupService';
import { errorResponse, successResponse } from '@/server/http/responses';
import { logger } from '@/utils/logger';

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
    await requireAuth();
    const contentType = request.headers.get('content-type') || '';
    let payload: unknown;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        throw new Error('No backup file uploaded.');
      }

      const text = await file.text();
      payload = JSON.parse(text);
    } else {
      payload = await request.json();
    }

    const result = await BackupService.importBackup(payload);
    return successResponse(result);
  } catch (error) {
    logger.error('[API Backup Import] Failed to restore backup', error);
    return errorResponse(error);
  }
}
