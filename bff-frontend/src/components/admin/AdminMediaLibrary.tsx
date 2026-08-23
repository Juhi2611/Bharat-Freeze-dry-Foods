import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  UploadCloud,
  Search,
  Image as ImageIcon,
  Trash2,
  Copy,
  Eye,
  FileCheck2,
  X,
  Sparkles,
} from "lucide-react";
import { type MediaFileItem } from "./adminData";
import { api } from "@/services/api";

export function AdminMediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFileItem[]>([]);
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<MediaFileItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void api.getMediaFiles().then((files) => {
      setMediaFiles(files.map((file) => ({
        id: file.id,
        name: file.file_name,
        size: `${file.file_size_mb} MB`,
        dimensions: file.dimensions,
        category: file.category,
        url: file.file_url,
        uploadedAt: file.uploaded_at,
      })));
    }).catch((error) => setLoadError(error instanceof Error ? error.message : "Unable to load media files."));
  }, []);

  const filtered = mediaFiles.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard!");
  };

  const handleDelete = (id: string) => {
    void api.deleteMediaFile(id).then(() => {
      setMediaFiles((prev) => prev.filter((m) => m.id !== id));
      toast.success("File removed from media library");
      setPreviewFile(null);
    }).catch((error) => setLoadError(error instanceof Error ? error.message : "Unable to delete media file."));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER & UPLOAD CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-frost-white">Media & Asset Library</h2>
          <p className="text-xs text-steel-silver">
            Upload and manage 4K pack renders, high-res photos & compliance documents
          </p>
        </div>

        <button
          onClick={() => toast.info("Drag and drop files below to upload")}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <UploadCloud className="h-4 w-4" /> Upload New Asset
        </button>
      </div>

      {loadError && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{loadError}</div>}

      {/* UPLOAD DROPZONE */}
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-card/40 p-8 text-center backdrop-blur-xl hover:border-ice-blue/50 transition-all cursor-pointer">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-ice-blue/30 bg-ice-blue/10 text-ice-blue">
          <UploadCloud className="h-7 w-7 animate-bounce" />
        </div>
        <h4 className="text-sm font-bold text-frost-white">
          Drag & Drop Assets Here, or <span className="text-ice-blue underline">Browse Files</span>
        </h4>
        <p className="mt-1 text-xs text-steel-silver">
          Supports PNG, WEBP, JPG, MP4, and PDF (Max 50MB per file)
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media files by filename or tag..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-frost-white placeholder-white/30 focus:border-ice-blue focus:outline-none"
        />
      </div>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-3 backdrop-blur-xl transition-all"
          >
            <div className="relative h-44 w-full overflow-hidden rounded-xl bg-deep-navy">
              <img
                src={m.url}
                alt={m.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <button
                  onClick={() => setPreviewFile(m)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-deep-navy/80 text-frost-white hover:text-ice-blue"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopyLink(m.url)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-deep-navy/80 text-frost-white hover:text-ice-blue"
                  title="Copy Link"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/80 text-white"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 px-1">
              <p className="truncate text-xs font-bold text-frost-white">{m.name}</p>
              <p className="text-[0.65rem] text-steel-silver">
                {m.size} · {m.dimensions}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-frost-white">{previewFile.name}</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="text-steel-silver hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="h-80 w-full overflow-hidden rounded-xl border border-white/10 bg-black flex items-center justify-center">
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-steel-silver">Uploaded: {previewFile.uploadedAt}</span>
                <button
                  onClick={() => handleCopyLink(previewFile.url)}
                  className="flex items-center gap-1.5 rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-4 py-2 text-xs font-semibold text-ice-blue"
                >
                  <Copy className="h-4 w-4" /> Copy Direct URL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
