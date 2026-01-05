/* eslint-disable @typescript-eslint/naming-convention */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: { type: 'varchar(1000)', notNull: true, primaryKey: true },
        email: { type: 'varchar(255)', notNull: true, unique: true },
        name: { type: 'varchar(255)', notNull: true },
        password: { type: 'varchar(255)', notNull: true },
        profilePictureUrl: { type: 'varchar(1000)' },
        description: { type: 'text' },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updatedAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    });

    pgm.createTable('posts', {
        id: { type: 'varchar(1000)', notNull: true, primaryKey: true },
        caption: { type: 'text', notNull: true },
        authorId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updatedAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    });

    pgm.createTable('post_images', {
        id: { type: 'varchar(1000)', notNull: true, primaryKey: true },
        url: { type: 'varchar(1000)', notNull: true },
        postId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"posts"',
            onDelete: 'CASCADE',
        },
    });

    pgm.createTable('likes', {
        userId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        postId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"posts"',
            onDelete: 'CASCADE',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.addConstraint('likes', 'likes_pkey', { primaryKey: ['userId', 'postId'] });

    pgm.createTable('comments', {
        id: { type: 'varchar(1000)', notNull: true, primaryKey: true },
        text: { type: 'text', notNull: true },
        userId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        postId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"posts"',
            onDelete: 'CASCADE',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createTable('reposts', {
        id: { type: 'varchar(1000)', notNull: true, primaryKey: true },
        userId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        postId: {
            type: 'varchar(1000)',
            notNull: true,
            references: '"posts"',
            onDelete: 'CASCADE',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('reposts');
    pgm.dropTable('comments');
    pgm.dropTable('likes');
    pgm.dropTable('post_images');
    pgm.dropTable('posts');
    pgm.dropTable('users');
};
