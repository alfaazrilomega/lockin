'use client'

import React, { useState } from 'react'
import { DEFAULT_GRANOLA_RECIPES, GranolaRecipe } from '@/lib/ai/recipe-knowledge'
import { 
  Sparkles, BookOpen, ThumbsUp, Check, Plus, Search, Filter, 
  ArrowRight, ShieldCheck, FileText, Share2, Layers, Cpu 
} from 'lucide-react'

export default function RecipesMarketplacePage() {
  const [recipes, setRecipes] = useState<GranolaRecipe[]>(DEFAULT_GRANOLA_RECIPES)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleToggleInstall = (recipeId: string) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id === recipeId) {
          const nextState = !r.installed
          alert(
            nextState
              ? `Recipe "${r.title}" berhasil di-install ke AI Knowledge Engine!`
              : `Recipe "${r.title}" dihapus dari AI Knowledge Engine.`
          )
          return { ...r, installed: nextState }
        }
        return r
      })
    )
  }

  const handleUpvote = (recipeId: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, upvotes: r.upvotes + 1 } : r))
    )
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6 font-satoshi">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            Granola AI Recipe Marketplace & Knowledge Forum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tingkatkan Kecerdasan AI Rapat Anda
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed font-outfit">
            Jelajahi dan install Recipe AI dari praktisi industri (Lenny Rachitsky, YC Partners, LockIn Team). 
            Setiap Recipe menambahkan prompt khusus & skema keluaran baru langsung ke dalam <strong>Gemini 3.6 Flash Engine</strong>.
          </p>
        </div>

        {/* Ambient background blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -z-0" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1">
          {[
            { id: 'all', label: 'Semua Recipe' },
            { id: 'before', label: '🌅 Before Meeting' },
            { id: 'during', label: '🎙️ During Meeting' },
            { id: 'after', label: '📝 After Meeting' },
            { id: 'across', label: '📊 Across Meetings' },
            { id: 'enterprise', label: '⚖️ Enterprise HR' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Recipe, Prompt, Tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all space-y-4 group"
          >
            <div className="space-y-3">
              {/* Category & Upvotes Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-outfit">
                  {recipe.category}
                </span>

                <button
                  onClick={() => handleUpvote(recipe.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition"
                  title="Upvote Recipe"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono font-semibold">{recipe.upvotes}</span>
                </button>
              </div>

              {/* Title & Author */}
              <div>
                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  by {recipe.author}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recipe.description}
              </p>

              {/* Prompt Rules Snippet */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-[11px] font-mono text-muted-foreground/90 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase font-satoshi">
                  <Cpu className="w-3 h-3" /> Injected AI Rule:
                </div>
                <p className="line-clamp-2">{recipe.promptInstructions}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recipe.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer Button */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {recipe.installed ? '✅ Active Knowledge' : 'Available'}
              </span>

              <button
                onClick={() => handleToggleInstall(recipe.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  recipe.installed
                    ? 'bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20'
                    : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
                }`}
              >
                {recipe.installed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Installed
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Install Recipe
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
