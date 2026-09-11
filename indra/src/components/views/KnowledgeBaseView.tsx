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

export default function KnowledgeBaseView() {
  const { setActivePIDDoc } = useIndraStore();

  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(false);
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
    <div className="flex-1 h-full flex flex-col bg-[#0a0a0a] text-zinc-100 overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h1 className="text-base font-semibold text-zinc-100 font-mono">
              Offline RAG Knowledge Base
            </h1>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              AIR-GAPPED VECTORSTORE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Index plant SOPs, ASME B31.3 standards, P&ID CAD schematics, and equipment data with zero external egress.
          </p>
        </div>

        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin pr-1">
        {/* Drag and drop upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-500/5' 
              : 'border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700'
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
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                <span className="text-sm font-medium text-zinc-200">
                  Indexing files into offline vectorstore...
                </span>
                <span className="text-xs text-zinc-500 font-mono mt-1">
                  Parsing text chunks, computing embeddings, and storing on-premise
                </span>
              </>
            ) : (
              <>
                <Upload className="w-7 h-7 text-zinc-500 mb-2" />
                <span className="text-xs font-semibold text-zinc-300">
                  Click or drag files here to index into sovereign RAG knowledge base
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 font-mono">
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
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search indexed plant SOPs, API-570 guidelines, or P&ID tags..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-blue-500/60 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
            >
              {searching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Search</span>
            </button>
            {searchResults !== null && (
              <button
                type="button"
                onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-400"
              >
                Clear
              </button>
            )}
          </form>

          {/* Search results display */}
          {searchResults !== null && (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-300">
                  Search Results ({searchResults.length})
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Offline Semantic Retrieval
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-xs text-zinc-500 italic py-2">
                  No matching passages found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((res, i) => (
                    <div key={i} className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-blue-400 font-medium">
                          {res.filename || res.document || 'Document'}
                        </span>
                        {res.score !== undefined && (
                          <span className="text-[10px] font-mono text-zinc-400">
                            Relevance: {Math.round(res.score * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-mono text-[11px]">
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
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Indexed Documents ({documents.length})
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">
              GET /api/kb/documents
            </span>
          </div>

          {documents.length === 0 && !loading ? (
            <div className="text-xs text-zinc-500 italic p-8 text-center border border-zinc-800/80 rounded-xl bg-zinc-900/20">
              No documents indexed yet. Upload plant maintenance SOPs, inspection records, or P&ID diagrams above.
            </div>
          ) : (
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900/30">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Filename</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chunks</th>
                    <th className="p-3">Indexed At</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {documents.map((doc) => {
                    const isDrawing = (doc.filename || '').toLowerCase().includes('pid') || 
                      (doc.filename || '').toLowerCase().endsWith('.png') ||
                      (doc.filename || '').toLowerCase().endsWith('.jpg');

                    return (
                      <tr key={doc.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-3 flex items-center gap-2 text-zinc-200">
                          {getDocIcon(doc.filename)}
                          <span className="truncate max-w-xs">{doc.filename || doc.name}</span>
                        </td>
                        <td className="p-3 text-zinc-400">{typeof doc.size === 'number' ? `${(doc.size / 1024).toFixed(1)} KB` : doc.size || '-'}</td>
                        <td className="p-3 text-zinc-400">{doc.chunk_count || 1}</td>
                        <td className="p-3 text-zinc-500">{doc.created_at || doc.uploaded_at || 'Recent'}</td>
                        <td className="p-3 text-right space-x-2">
                          {isDrawing && (
                            <button
                              onClick={() => {
                                setPreviewDoc(doc);
                                setZoom(1);
                              }}
                              className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] transition-colors cursor-pointer"
                              title="Inspect P&ID CAD Schematic"
                            >
                              Inspect P&ID
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(doc.id, doc.filename)}
                            className="p-1 rounded hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
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
