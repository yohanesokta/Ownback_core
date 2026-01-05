import { prisma } from '../db/client';
import type { z } from 'zod';
import type { createPostSchema } from '../validations/post.validation';

export const createPostService = async (
  userId: string,
  body: z.infer<typeof createPostSchema>
) => {
  const { caption, images } = body;

  const post = await prisma.post.create({
    data: {
      caption,
      authorId: userId,
      images: {
        create: images.map((url) => ({ url })),
      },
    },
    include: {
      images: true,
    },
  });

  return post;
};

export const getFeedService = async (userId: string) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePictureUrl: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            reposts: true,
          },
        },
        likes: {
            where: {
                userId: userId
            },
            select: {
                userId: true
            }
        }
      },
    });
  
    // Map posts to include isLiked status
    const postsWithLikeStatus = posts.map(post => {
        const { likes, ...rest } = post;
        return {
            ...rest,
            isLiked: likes.length > 0,
        };
    });

    return postsWithLikeStatus;
  };

  export const getPostsByUserService = async (userId: string, currentUserId: string) => {
    const posts = await prisma.post.findMany({
        where: {
            authorId: userId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profilePictureUrl: true
                }
            },
            images: {
                select: {
                    url: true
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                    reposts: true
                }
            },
            likes: {
                where: {
                    userId: currentUserId
                },
                select: {
                    userId: true
                }
            }
        }
    });

    // Map posts to include isLiked status
    const postsWithLikeStatus = posts.map(post => {
        const { likes, ...rest } = post;
        return {
            ...rest,
            isLiked: likes.length > 0
        };
    });

    return postsWithLikeStatus;
  }
