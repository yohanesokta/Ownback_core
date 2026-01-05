import { prisma } from '../db/client';
import type { z } from 'zod';
import type { createCommentSchema } from '../validations/post.validation';

export const likeUnlikePostService = async (userId: string, postId: string) => {
  const like = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (like) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return { status: 'unliked' };
  } else {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    return { status: 'liked' };
  }
};

export const createCommentService = async (
  userId: string,
  postId: string,
  body: z.infer<typeof createCommentSchema>
) => {
  const comment = await prisma.comment.create({
    data: {
      text: body.text,
      userId,
      postId,
    },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                profilePictureUrl: true
            }
        }
    }
  });
  return comment;
};

export const getCommentsService = async (postId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            postId
        },
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profilePictureUrl: true
                }
            }
        }
    });
    return comments;
}

export const repostService = async (userId: string, postId: string) => {
    // Simple repost: just create a record.
    // A more complex implementation might create a new post quoting the original.
    const existingRepost = await prisma.repost.findFirst({
        where: {
            userId,
            postId
        }
    });

    if(existingRepost) {
        throw new Error('You have already reposted this.');
    }

    const repost = await prisma.repost.create({
        data: {
            userId,
            postId
        }
    });
    return repost;
}
