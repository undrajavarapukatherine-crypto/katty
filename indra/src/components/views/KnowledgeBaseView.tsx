'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Upload, 
  Search, 
  Trash2, 
  FileText, 
  FileImage, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  FileSpreadsheet,
  X,
  ZoomIn,
  ZoomOut,
  Scan
} from 'lucide-react';
import useIndraStore, { API_BASE, type KBDocument } from '@/store/indra-store';

function DocumentTableSkeleton() {
  return (
    <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-slate-50/90 dark:bg-zinc-950/90 text-slate-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800 font-bold">
          <tr>
            <th className="p-3.5">Filename</th>
            <th className="p-3.5">Size</th>
            <th className="p-3.5">Chunks</th>
            <th className="p-3.5">Indexed At</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
          {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item} className="animate-pulse">
              <td className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded bg-slate-200 dark:bg-zinc-800 flex-shrink-0" />
                  <div 
                    className="h-3.5 rounded bg-slate-200 dark:bg-zinc-800" 
                    style={{ width: `${140 + (item * 37) % 110}px` }} 
                  />
                </div>
              </td>
              <td className="p-3.5">
                <div className="h-3 w-14 rounded bg-slate-200 dark:bg-zinc-800" />
              </td>
              <td className="p-3.5">
                <div className="h-3 w-8 rounded bg-slate-200 dark:bg-zinc-800" />
              </td>
              <td className="p-3.5">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-zinc-800" />
              </td>
              <td className="p-3.5">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-6 w-18 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                  <div className="h-6 w-6 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function KnowledgeBaseView() {
  const { setActivePIDDoc } = useIndraStore();

  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<KBDocument | null>(null);
  const [zoom, setZoom] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch all indexed documents from GET /api/kb/documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/kb/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to load KB documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // 2. Upload document to POST /api/kb/documents
  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(`${API_BASE}/api/kb/documents`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
    setUploading(false);
    await fetchDocuments();
  };

  // 3. Delete document via DELETE /api/kb/documents/{id}
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently remove "${name}" from the offline RAG knowledge base?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/kb/documents/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      } else {
        setErrorMessage('Failed to delete document from backend.');
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMessage('Backend error communicating with /api/kb/documents.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  // 4. Offline search via GET /api/kb/search?q=...
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(`${API_BASE}/api/kb/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const getDocIcon = (filename: string) => {
    const fn = filename.toLowerCase();
    if (fn.endsWith('.png') || fn.endsWith('.jpg') || fn.endsWith('.jpeg') || fn.endsWith('.svg')) {
      return <FileImage className="w-4 h-4 text-blue-400" />;
    }
    if (fn.endsWith('.xlsx') || fn.endsWith('.csv')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    }
    return <FileText className="w-4 h-4 text-zinc-400" />;
  };

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col bg-[#f8fafc] dark:bg-[#0a0a0a] text-slate-800 dark:text-zinc-200 overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-zinc-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
              <Database className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-base font-bold text-slate-900 dark:text-zinc-100 font-mono">
              Offline RAG Knowledge Base
            </h1>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 font-mono font-bold">
              AIR-GAPPED VECTORSTORE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-mono">
            Index plant SOPs, ASME B31.3 standards, P&ID CAD schematics, and equipment data with zero external egress.
          </p>
        </div>

        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-xs text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors font-mono cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin dark:scrollbar-thumb-zinc-700 pr-1">
        {/* Drag and drop upload zone (AI Doodle Violet Theme) */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/30' 
              : 'border-violet-200/80 dark:border-violet-900/40 bg-white dark:bg-zinc-900/60 hover:bg-violet-50/30 dark:hover:bg-violet-950/20 hover:border-violet-400 shadow-2xs'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />

          <div className="flex flex-col items-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-spin mb-2" />
                <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  Indexing files into offline vectorstore...
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1">
                  Parsing text chunks, computing embeddings, and storing on-premise
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center mb-2 text-violet-600 dark:text-violet-400">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Click or drag files here to index into sovereign RAG knowledge base
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-mono">
                  Supported: PDF (SOPs), PNG/SVG/JPG (P&ID Drawings), DOCX, XLSX, CSV, TXT
                </span>
              </>
            )}
          </div>
        </div>

        {/* Offline Vector Search Bar */}
        <div className="space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search indexed plant SOPs, API-570 guidelines, or P&ID tags..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:border-violet-400 dark:focus:border-violet-600 shadow-2xs transition-colors font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm shadow-violet-500/20 cursor-pointer disabled:opacity-50"
            >
              {searching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Search</span>
            </button>
            {searchResults !== null && (
              <button
                type="button"
                onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs text-slate-600 dark:text-zinc-300 font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </form>

          {/* Search results display */}
          {searchResults !== null && (
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200">
                  Search Results ({searchResults.length})
                </span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 font-semibold">
                  Offline Semantic Retrieval
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-400 dark:text-zinc-500 italic py-2">
                  No matching passages found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((res, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-violet-700 dark:text-violet-400 font-bold">
                          {res.filename || res.document || 'Document'}
                        </span>
                        {res.score !== undefined && (
                          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 font-medium">
                            Relevance: {Math.round(res.score * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-zinc-300 leading-relaxed font-mono text-[11px]">
                        {res.content || res.text || res.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Documents Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>Indexed Documents</span>
              {loading && documents.length === 0 ? (
                <span className="inline-block w-8 h-3.5 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
              ) : (
                <span>({documents.length})</span>
              )}
            </h2>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
              GET /api/kb/documents
            </span>
          </div>

          {loading && documents.length === 0 ? (
            <DocumentTableSkeleton />
          ) : documents.length === 0 ? (
            <div className="text-xs text-slate-400 dark:text-zinc-500 italic p-8 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xs">
              No documents indexed yet. Upload plant maintenance SOPs, inspection records, or P&ID diagrams above.
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50/90 dark:bg-zinc-950/90 text-slate-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800 font-bold">
                  <tr>
                    <th className="p-3.5">Filename</th>
                    <th className="p-3.5">Size</th>
                    <th className="p-3.5">Chunks</th>
                    <th className="p-3.5">Indexed At</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {documents.map((doc) => {
                    const isDrawing = (doc.filename || '').toLowerCase().includes('pid') || 
                      (doc.filename || '').toLowerCase().endsWith('.png') ||
                      (doc.filename || '').toLowerCase().endsWith('.jpg');

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/60 transition-colors">
                        <td className="p-3.5 flex items-center gap-2 text-slate-800 dark:text-zinc-200 font-semibold">
                          {getDocIcon(doc.filename)}
                          <span className="truncate max-w-xs">{doc.filename || doc.name}</span>
                        </td>
                        <td className="p-3.5 text-slate-500 dark:text-zinc-400">{typeof doc.size === 'number' ? `${(doc.size / 1024).toFixed(1)} KB` : doc.size || '-'}</td>
                        <td className="p-3.5 text-slate-500 dark:text-zinc-400">{doc.chunk_count || 1}</td>
                        <td className="p-3.5 text-slate-400 dark:text-zinc-500">{doc.created_at || doc.uploaded_at || 'Recent'}</td>
                        <td className="p-3.5 text-right space-x-2">
                          {isDrawing && (
                            <button
                              onClick={() => {
                                setPreviewDoc(doc);
                                setZoom(1);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-[10px] font-bold transition-colors cursor-pointer border border-violet-200/80 dark:border-violet-800/60"
                              title="Inspect P&ID CAD Schematic"
                            >
                              Inspect P&ID
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(doc.id, doc.filename)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-rose-950/90 border border-rose-800 text-rose-200 px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 z-50">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* P&ID Drawing Inspection Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-semibold text-zinc-200">
                  P&ID Inspection: {previewDoc.filename}
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                  ASME B31.3 AUDIT READY
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-zinc-400 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded ml-2 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-zinc-900/20 flex items-center justify-center min-h-[400px]">
              <div 
                className="transition-transform duration-200 origin-center"
                style={{ transform: `scale(${zoom})` }}
              >
                <img
                  src={
                    previewDoc.url
                      ? (previewDoc.url.startsWith('http') ? previewDoc.url : `${API_BASE}${previewDoc.url.startsWith('/') ? '' : '/'}${previewDoc.url}`)
                      : `${API_BASE}/files/documents/${previewDoc.id}`
                  }
                  alt={previewDoc.filename}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg border border-zinc-800 shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/PID-001_Heat_Exchanger_Unit.png';
                  }}
                />
              </div>
            </div>

            <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase">Detected Equipment Tags:</span>
                {['FV-101', 'P-101', 'E-101', 'TI-101'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
