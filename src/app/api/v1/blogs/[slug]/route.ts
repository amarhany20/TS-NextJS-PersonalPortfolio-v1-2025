import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { BlogService } from '@/server/services/BlogService';
import { updateBlogSchema } from '@/server/server-validators/api/blog';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const blogs = await BlogService.listAllPosts();
    const blog = blogs.find(b => b.slug === slug);

    if (!blog) {
      return notFoundResponse('Blog post not found');
    }

    return successResponse({ blog });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const body = await request.json();
    const result = updateBlogSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const blog = await BlogService.updatePost(slug, result.data);
    return successResponse({ blog });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    await BlogService.deletePost(slug);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}