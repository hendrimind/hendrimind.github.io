# Hendrimind Backend API

Backend untuk website portfolio fotografer **hendrimind.my.id** — dibangun dengan **Node.js + Express**.

## Fitur

- **API Galeri (CRUD)** — tambah, edit, hapus foto dari dashboard admin
- **API Contact/Subscribe** — simpan email & pesan dari form subscribe
- **Auth Admin (JWT)** — login aman dengan JWT token
- **Upload Gambar** — upload foto langsung dari dashboard (Multer)
- **Dashboard Admin** — UI untuk mengelola galeri & melihat pesan

## Cara Menjalankan

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
npm install

# 3. Jalankan server
npm start
# atau mode development (auto-reload)
npm run dev
```

Server berjalan di `http://localhost:3000`

## URL Penting

| Halaman | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Dashboard Admin | http://localhost:3000/admin |
| API Health | http://localhost:3000/api/health |
| API Gallery | http://localhost:3000/api/gallery |
| API Contact | http://localhost:3000/api/contact |
| API Auth | http://localhost:3000/api/auth/login |

## Login Admin (Default)

- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Penting:** Ganti password default di file `.env` sebelum deploy ke production!

## API Endpoints

### Auth
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login admin | ❌ |
| GET | `/api/auth/verify` | Verifikasi token | ✅ |

### Gallery
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/gallery` | Ambil semua foto | ❌ |
| GET | `/api/gallery/:id` | Ambil 1 foto | ❌ |
| POST | `/api/gallery` | Tambah foto + upload | ✅ |
| PUT | `/api/gallery/:id` | Edit foto | ✅ |
| DELETE | `/api/gallery/:id` | Hapus foto | ✅ |

### Contact
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/contact` | Kirim subscribe/pesan | ❌ |
| GET | `/api/contact` | Lihat semua pesan | ✅ |
| PUT | `/api/contact/:id` | Tandai sudah dibaca | ✅ |
| DELETE | `/api/contact/:id` | Hapus pesan | ✅ |

## Struktur Project

```
backend/
├── server.js          # Entry point Express server
├── package.json
├── .env               # Konfigurasi (JANGAN di-commit!)
├── .gitignore
├── routes/
│   ├── auth.js        # API login & verify
│   ├── contact.js     # API subscribe & pesan
│   └── gallery.js     # API galeri (CRUD + upload)
├── middleware/
│   └── auth.js        # JWT verification middleware
├── data/
│   ├── contacts.json  # Database pesan (JSON)
│   └── gallery.json   # Database galeri (JSON)
├── uploads/           # Folder upload gambar
└── public/
    └── admin.html     # Dashboard admin
```

## Konfigurasi (.env)

Edit file `.env`:

```env
PORT=3000
JWT_SECRET=your_super_secret_key_change_me_12345
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

## Deploy ke Production

Backend ini bisa di-deploy ke:
- **Render** (gratis, mudah) — https://render.com
- **Railway** — https://railway.app
- **Vercel** — https://vercel.com
- **Fly.io** — https://fly.io

Setelah deploy, update `API_URL` di `js/scripts.js`:
```js
const API_URL = "https://your-backend-url.onrender.com/api";
```

## Teknologi

- **Node.js** — Runtime JavaScript
- **Express** — Web framework
- **JWT** — Autentikasi token
- **Multer** — Upload file
- **JSON File** — Database sederhana (mudah di-upgrade ke PostgreSQL/MongoDB)
