# AI YouTube Automation Pipeline 🤖🎬

> **100% Free** · **Always On** · **Comedy + Education** · **Powered by Google AI**

Sistem otomasi YouTube berbasis AI yang berjalan 24/7 di Oracle Cloud. Setiap hari secara otomatis: riset tren → buat video → validasi genre → upload ke YouTube.

---

## 🏗️ Architecture

```
Cron (08:00 WIB)
  │
  ▼
PHASE 1 — RESEARCH
  Google Trends + YouTube Trending + Reddit
  → Gemini 3.5 Flash (pilih ide terbaik)
  │
  ▼
PHASE 2 — CREATE
  Gemini 3.5 Flash (script) 
  → Kokoro TTS (voiceover)
  → Veo (video generation)
  → Cloudflare R2 (storage)
  │
  ▼
PHASE 3 — VALIDATE
  Gemini 3.5 Flash (genre classifier + quality gate)
  → APPROVED atau NEEDS_REVISION
  │
  ▼
PHASE 4 — PUBLISH
  Gemini 3.5 Flash (SEO copy)
  → Imagen (thumbnail)
  → YouTube Data API v3 (upload)
  → Supabase (log)
```

---

## 🆓 100% Free Stack

| Komponen | Tool | Cost |
|----------|------|------|
| AI Brain | Gemini 3.5 Flash | $0 |
| Video Gen | Veo (via Gemini Pro) | $0 |
| TTS Voice | Kokoro (self-hosted) | $0 |
| Thumbnail | Imagen (via Gemini Pro) | $0 |
| Orchestration | n8n (self-hosted) | $0 |
| Hosting | Oracle Cloud Always Free | $0 |
| Storage | Cloudflare R2 (10GB) | $0 |
| Database | Supabase Free | $0 |
| Dashboard | Vercel Hobby | $0 |
| **TOTAL** | | **$0/bulan** |

---

## 📁 Project Structure

```
AI-Automation-Video-Youtube/
├── .env.example          ← Template API keys
├── n8n/
│   └── docker-compose.yml  ← n8n + PostgreSQL + Kokoro
├── workflows/
│   ├── 01-research.json  ← Phase 1: Research
│   ├── 02-create.json    ← Phase 2: Create
│   ├── 03-validate.json  ← Phase 3: Validate
│   └── 04-publish.json   ← Phase 4: Publish
├── supabase/
│   └── schema.sql        ← Database tables
├── scripts/
│   └── setup-oracle-vm.sh ← Server setup
└── dashboard/            ← Next.js monitoring app
```

---

## 🚀 Quick Setup

### Step 1 — Oracle Cloud VM
```bash
# SSH into your Oracle VM
ssh -i your-key.pem ubuntu@your-vm-ip

# Run setup script
curl -O https://raw.githubusercontent.com/.../setup-oracle-vm.sh
bash setup-oracle-vm.sh
```

### Step 2 — Configure .env
```bash
nano .env
# Fill in your API keys
```

### Step 3 — Deploy n8n
```bash
docker compose up -d
# Access at http://your-vm-ip:5678
```

### Step 4 — Import Workflows
Di n8n UI: Settings → Import Workflow → upload file JSON dari folder `workflows/`

### Step 5 — Setup Supabase
Di Supabase Dashboard → SQL Editor → paste isi `supabase/schema.sql`

### Step 6 — Configure Credentials di n8n
- Gemini API Key
- YouTube OAuth2
- Supabase (URL + Service Role Key)
- Cloudflare R2 (S3-compatible)

---

## 📊 Dashboard

```bash
cd dashboard
npm install
npm run dev
# Deploy: vercel --prod
```

---

## 🔑 Required API Keys

| Service | How to Get | Free? |
|---------|-----------|-------|
| Gemini | [aistudio.google.com](https://aistudio.google.com/app/apikey) | ✅ |
| YouTube | [console.cloud.google.com](https://console.cloud.google.com) | ✅ |
| Supabase | [supabase.com/dashboard](https://supabase.com/dashboard) | ✅ |
| Cloudflare R2 | [dash.cloudflare.com](https://dash.cloudflare.com) | ✅ |
| Oracle Cloud | [cloud.oracle.com](https://cloud.oracle.com) | ✅ |
