# Backend API Media Sosial

Ini adalah backend API lengkap untuk aplikasi media sosial kloning Instagram, yang dibuat untuk digunakan oleh client mobile Flutter.

## Deskripsi Proyek

API ini menyediakan fungsionalitas inti untuk aplikasi media sosial, termasuk otentikasi pengguna, manajemen profil, pembuatan postingan, feed, dan interaksi sosial seperti suka, komentar, dan repost.

Proyek ini dibangun dengan fokus pada struktur kode yang bersih, scalable, dan maintainable dengan memisahkan concerns ke dalam-dalam direktori `routes`, `handlers`, `services`, dan `middlewares`.

## Tech Stack

- **Runtime**: Bun
- **Framework API**: Hono
- **Database**: Supabase (PostgreSQL)
- **DB Adapter**: node-postgres (`pg`)
- **Migrations**: `node-pg-migrate`
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod

## Setup Environment

1.  **Install dependensi:**
    ```bash
    bun install
    ```

2.  **Buat file `.env`:**
    Salin file `.env.example` menjadi file baru bernama `.env`.

    ```bash
    cp .env.example .env
    ```

3.  **Konfigurasi Environment Variables:**
    Buka file `.env` dan isi variabel berikut:

    -   `DATABASE_URL`: URL koneksi ke database PostgreSQL Anda di Supabase. Anda bisa mendapatkannya dari dashboard Supabase di `Settings` > `Database` > `Connection string`.
    -   `JWT_SECRET`: Kunci rahasia yang kuat dan acak untuk menandatangani token JWT. Anda bisa membuat string acak yang panjang.

4.  **Migrasi Database:**
    Setelah mengkonfigurasi `DATABASE_URL`, jalankan perintah berikut untuk menerapkan migrasi dan membuat tabel database.

    ```bash
    bun run migrate up
    ```
    Perintah ini akan menjalankan semua migrasi yang tertunda yang ada di dalam direktori `/migrations`.

## Menjalankan Proyek

Untuk menjalankan server pengembangan, gunakan perintah:

```bash
bun run src/index.ts
```

Server akan berjalan di `http://localhost:3000`. Semua endpoint API berada di bawah path `/api`.

## Deploy ke Vercel

Proyek ini siap untuk di-deploy ke Vercel.

1.  Push kode Anda ke repositori Git (GitHub, GitLab, etc.).
2.  Impor proyek Anda di dashboard Vercel.
3.  Vercel akan secara otomatis mendeteksi bahwa ini adalah proyek Bun.
4.  **Konfigurasi Environment Variables** di pengaturan proyek Vercel Anda (sama seperti di file `.env`).
5.  Tambahkan `build` command di Vercel: `bun run migrate up`
6.  Deploy!

Vercel akan menangani build process dan deployment.

---

## Dokumentasi API

Semua request dan response menggunakan format JSON.

### Authentication

#### `POST /api/auth/register`

Mendaftarkan pengguna baru.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "profilePictureUrl": "https://example.com/profile.jpg",
  "description": "Hello, I'm new here!"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "clx...",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "profilePictureUrl": "https://example.com/profile.jpg",
    "description": "Hello, I'm new here!",
    "createdAt": "2026-01-05T14:00:00.000Z",
    "updatedAt": "2026-01-05T14:00:00.000Z"
  }
}
```

---

#### `POST /api/auth/login`

Login untuk mendapatkan token JWT.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "ey..."
  }
}
```

---

### Users

*Rute-rute ini memerlukan otentikasi. Kirim token JWT di header `Authorization: Bearer <token>`.*

#### `GET /api/users/me`

Mendapatkan profil pengguna yang sedang login.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "id": "clx...",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "profilePictureUrl": "https://example.com/profile.jpg",
    "description": "Hello, I'm new here!",
    "createdAt": "2026-01-05T14:00:00.000Z",
    "posts": "10"
  }
}
```

---

#### `GET /api/users/:id`

Mendapatkan profil publik pengguna lain berdasarkan ID.

**Success Response (200):**

```json
{
    "success": true,
    "message": "Profil user berhasil diambil",
    "data": {
        "id": "clx-user-2",
        "name": "Jane Smith",
        "profilePictureUrl": "https://example.com/jane.jpg",
        "description": "Photographer",
        "createdAt": "2026-01-04T10:00:00.000Z",
        "posts": "25"
    }
}
```

---

#### `PATCH /api/users/me`

Memperbarui profil pengguna yang sedang login.

**Request Body:** (kirim hanya field yang ingin diubah)

```json
{
  "name": "Johnathan Doe",
  "description": "Updated bio."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "id": "clx...",
    "email": "john.doe@example.com",
    "name": "Johnathan Doe",
    "profilePictureUrl": "https://example.com/profile.jpg",
    "description": "Updated bio.",
    "createdAt": "2026-01-05T14:00:00.000Z",
    "updatedAt": "2026-01-05T14:15:00.000Z"
  }
}
```

---

### Posts

*Rute-rute ini memerlukan otentikasi.*

#### `POST /api/posts`

Membuat postingan baru.

**Request Body:**

```json
{
  "caption": "My new post!",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Postingan berhasil dibuat",
  "data": {
    "id": "clx-post-1",
    "caption": "My new post!",
    "authorId": "clx...",
    "createdAt": "2026-01-05T15:00:00.000Z",
    "updatedAt": "2026-01-05T15:00:00.000Z",
    "images": [
      { "url": "https://example.com/image1.jpg" },
      { "url": "https://example.com/image2.jpg" }
    ]
  }
}
```

---

#### `GET /api/posts/feed`

Mendapatkan feed postingan (dari semua pengguna, diurutkan dari yang terbaru).

**Success Response (200):**

```json
{
  "success": true,
  "message": "Feed berhasil diambil",
  "data": [
    {
      "id": "clx-post-2",
      "caption": "From another user",
      "createdAt": "2026-01-05T15:05:00.000Z",
      "author": {
        "id": "clx-user-2",
        "name": "Jane Smith",
        "profilePictureUrl": "https://example.com/jane.jpg"
      },
      "images": [{ "url": "https://example.com/jane-post.jpg" }],
      "likesCount": "15",
      "commentsCount": "3",
      "repostsCount": "2",
      "isLiked": false
    },
    {
      "id": "clx-post-1",
      "caption": "My new post!",
      "createdAt": "2026-01-05T15:00:00.000Z",
      "author": {
        "id": "clx...",
        "name": "Johnathan Doe",
        "profilePictureUrl": "https://example.com/profile.jpg"
      },
      "images": [
        { "url": "https://example.com/image1.jpg" },
        { "url": "https://example.com/image2.jpg" }
      ],
      "likesCount": "1",
      "commentsCount": "0",
      "repostsCount": "0",
      "isLiked": true
    }
  ]
}
```

---

#### `GET /api/posts/user/:userId`

Mendapatkan semua postingan dari pengguna tertentu.

**Success Response (200):** (Struktur mirip dengan `/feed`)

---

### Interactions

*Rute-rute ini memerlukan otentikasi.*

#### `POST /api/posts/:postId/like`

Memberikan "suka" atau menarik "suka" (toggle).

**Success Response (200):**

```json
{
  "success": true,
  "message": "Post liked", // atau "Post unliked"
  "data": {
    "status": "liked" // atau "unliked"
  }
}
```

---

#### `POST /api/posts/:postId/repost`

Melakukan "repost" pada sebuah postingan.

**Success Response (201):**

```json
{
    "success": true,
    "message": "Post berhasil di-repost",
    "data": {
        "id": "clx-repost-1",
        "userId": "clx...",
        "postId": "clx-post-2",
        "createdAt": "2026-01-05T16:00:00.000Z"
    }
}
```

---

#### `POST /api/posts/:postId/comment`

Menambahkan komentar baru pada sebuah postingan.

**Request Body:**

```json
{
  "text": "This is a great post!"
}
```

**Success Response (201):**

```json
{
    "success": true,
    "message": "Komentar berhasil ditambahkan",
    "data": {
        "id": "clx-comment-1",
        "text": "This is a great post!",
        "createdAt": "2026-01-05T16:05:00.000Z",
        "user": {
            "id": "clx...",
            "name": "Johnathan Doe",
            "profilePictureUrl": "https://example.com/profile.jpg"
        }
    }
}
```

---

#### `GET /api/posts/:postId/comments`

Mendapatkan semua komentar dari sebuah postingan.

**Success Response (200):**

```json
{
    "success": true,
    "message": "Komentar berhasil diambil",
    "data": [
        {
            "id": "clx-comment-1",
            "text": "This is a great post!",
            "createdAt": "2026-01-05T16:05:00.000Z",
            "user": {
                "id": "clx...",
                "name": "Johnathan Doe",
                "profilePictureUrl": "https://example.com/profile.jpg"
            }
        },
        {
            "id": "clx-comment-2",
            "text": "I agree!",
            "createdAt": "2026-01-05T16:10:00.000Z",
            "user": {
                "id": "clx-user-3",
                "name": "Peter Pan",
                "profilePictureUrl": null
            }
        }
    ]
}
```