import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { BlogService } from '@/server/services/BlogService';
import { createBlogSchema } from '@/server/server-validators/api/blog';

export async function GET() {
  try {
    await requireAuth();
    const posts = await BlogService.listAllPosts();
    return successResponse({ posts });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createBlogSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const post = await BlogService.createPost(result.data);
    return successResponse({ post }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
