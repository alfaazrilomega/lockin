export interface GranolaRecipe {
  id: string
  title: string
  author: string
  category: 'before' | 'during' | 'after' | 'across' | 'enterprise'
  description: string
  promptInstructions: string
  outputSchema: string
  upvotes: number
  installed: boolean
  tags: string[]
}

export const DEFAULT_GRANOLA_RECIPES: GranolaRecipe[] = [
  {
    id: 'rec-lenny-prd',
    title: "Lenny Rachitsky's Product Requirement Document (PRD)",
    author: 'Lenny Rachitsky (Product Leader)',
    category: 'after',
    description: 'Mengubah transkrip meeting produk menjadi PRD standar Silicon Valley lengkap dengan Problem Statement, User Stories, Metrics & Non-Goals.',
    promptInstructions: 'Ekstrak percakapan rapat menjadi PRD terstruktur: 1. Problem Statement 2. Target Audience 3. Core Requirements & User Stories 4. Success Metrics 5. Out of Scope / Non-Goals.',
    outputSchema: '{"prdTitle": "", "problemStatement": "", "userStories": [], "successMetrics": [], "nonGoals": []}',
    upvotes: 1420,
    installed: true,
    tags: ['Product Management', 'PRD', 'Silicon Valley']
  },
  {
    id: 'rec-yc-discovery',
    title: 'YC Founder Discovery & Sales Call Framework',
    author: 'Y Combinator Partner Network',
    category: 'before',
    description: 'Menyiapkan agenda pertanyaan kritis untuk menemukan pain point klien, budget, decision maker, dan timeline sebelum rapat penjualan.',
    promptInstructions: 'Susun Pre-Meeting Prep: 1. Customer Pain Points 2. BANT Qualification (Budget, Authority, Need, Timeline) 3. Top 5 Killer Questions 4. Red Flags.',
    outputSchema: '{"painPoints": [], "bant": {}, "killerQuestions": [], "redFlags": []}',
    upvotes: 980,
    installed: true,
    tags: ['Sales', 'Y Combinator', 'Discovery']
  },
  {
    id: 'rec-1click-invoice',
    title: 'Granola Auto PDF Invoice & Quotation Extractor',
    author: 'LockIn Finance AI',
    category: 'after',
    description: 'Mendeteksi nilai transaksi, item pekerjaan, dan nama klien dari percakapan rapat untuk menghasilkan 1-Click PDF Invoice resmi.',
    promptInstructions: 'Deteksi pembahasan harga & jasa: 1. Nama Klien / Perusahaan 2. Daftar Item Pekerjaan & Harga 3. Total Tagihan 4. Syarat Pembayaran.',
    outputSchema: '{"clientName": "", "items": [{"description": "", "amount": 0}], "totalAmount": 0}',
    upvotes: 2150,
    installed: true,
    tags: ['Finance', 'Invoice', 'Automation']
  },
  {
    id: 'rec-cross-synthesis',
    title: 'Across-Meetings Executive Weekly Digest',
    author: 'Granola Core Team',
    category: 'across',
    description: 'Menyintesiskan riwayat keputusan dari 10+ rapat mingguan menjadi laporan eksekutif 1 halaman untuk C-Level & Stakeholder.',
    promptInstructions: 'Konsolidasikan seluruh rapat 7 hari terakhir: 1. Key Wins & Milestones 2. Bottlenecks & Blockers 3. Task Completion Rate 4. Recommended Action Items.',
    outputSchema: '{"keyWins": [], "bottlenecks": [], "overallProgress": "", "recommendedActions": []}',
    upvotes: 1890,
    installed: false,
    tags: ['Executive', 'Across-Meetings', 'Synthesis']
  },
  {
    id: 'rec-hr-compliance',
    title: 'Enterprise HR & Postgres RLS Audit Checker',
    author: 'LockIn Security Team',
    category: 'enterprise',
    description: 'Menganalisis keputusan rapat HR dan memastikan seluruh mutasi tugas mematuhi kebijakan Row Level Security (RLS) dan aturan privasi karyawan.',
    promptInstructions: 'Evaluasi keputusan HR: 1. Dampak Akses Data 2. Validasi Kebijakan RLS Postgres 3. Mitigasi Celah Privasi Karyawan.',
    outputSchema: '{"securityScore": "100%", "privacyRisks": [], "complianceStatus": "PASS"}',
    upvotes: 740,
    installed: false,
    tags: ['HR Compliance', 'Security', 'RLS']
  }
]

export function formatRecipePromptInjection(recipes: GranolaRecipe[]): string {
  const installedRecipes = recipes.filter(r => r.installed)
  if (installedRecipes.length === 0) return ''

  return `\n\n### 🧠 AUGMENTED KNOWLEDGE & ACTIVE RECIPES:\nGunakan aturan dan format Recipe yang telah diinstal oleh pengguna berikut untuk memandu analisis AI:\n` +
    installedRecipes.map(r => `- **[${r.title}]**: ${r.promptInstructions}`).join('\n')
}
