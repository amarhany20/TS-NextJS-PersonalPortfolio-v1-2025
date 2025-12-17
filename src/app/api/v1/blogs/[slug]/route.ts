import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { BlogService } from '@/server/services/BlogService';
import { updateBlogSchema } from '@/server/server-validators/api/blog';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const post = await BlogService.getPostBySlug(params.slug);

    if (!post) {
      return notFoundResponse('Blog post not found');
    }

    return successResponse({ post });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateBlogSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const post = await BlogService.updatePost(params.slug, result.data);
    return successResponse({ post });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await BlogService.deletePost(params.slug);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
