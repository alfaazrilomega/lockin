"use client"

import { useEffect, useState, useRef } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  Download,
  Loader2,
  Paperclip,
} from "lucide-react"

interface StoredFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    size: number
    mimetype: string
  }
}

const BUCKET = "attachments"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ mime }: { mime: string }) {
  if (mime?.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-400" />
  if (mime?.includes("pdf")) return <FileText className="h-5 w-5 text-red-400" />
  return <File className="h-5 w-5 text-muted-foreground" />
}

export default function FilesPage() {
  const { toast } = useToast()
  const [files, setFiles] = useState<StoredFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClientComponentClient()

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(`${user.id}/`, { limit: 100, sortBy: { column: "created_at", order: "desc" } })

      if (error) throw error
      setFiles((data ?? []) as unknown as StoredFile[])
    } catch (err) {
      console.error("Files fetch error:", err)
      toast({ title: "Error", description: "Failed to load files.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFiles() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const path = `${user.id}/${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })
      if (error) throw error
      toast({ title: "File uploaded", description: file.name })
      await fetchFiles()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      toast({ title: "Upload failed", description: msg, variant: "destructive" })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDownload = async (fileName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .download(`${user.id}/${fileName}`)
      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download error:", err)
      toast({ title: "Download failed", variant: "destructive" })
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.storage
        .from(BUCKET)
        .remove([`${user.id}/${fileName}`])
      if (error) throw error

      setFiles(prev => prev.filter(f => f.name !== fileName))
      toast({ title: "File deleted" })
    } catch (err) {
      console.error("Delete error:", err)
      toast({ title: "Delete failed", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
            Files
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload and manage your project attachments.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            id="file-upload-input"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : files.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Paperclip className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground">No files yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Upload attachments, PDFs, images, and documents for your projects.
            </p>
            <Button
              className="mt-6"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload your first file
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {files.map(file => {
            const mime = file.metadata?.mimetype ?? ""
            const size = file.metadata?.size ?? 0
            // Strip timestamp prefix for display
            const displayName = file.name.replace(/^\d+_/, "")

            return (
              <div
                key={file.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors group"
              >
                <FileIcon mime={mime} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                      {mime || "unknown"}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{formatBytes(size)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(file.name)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => handleDelete(file.name)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
