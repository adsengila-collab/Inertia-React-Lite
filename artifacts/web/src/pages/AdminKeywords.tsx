import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListKeywords,
  useAddKeywords,
  useDeleteKeywords,
  useGetKeywordsStats,
  getListKeywordsQueryKey,
  getGetKeywordsStatsQueryKey,
} from "@workspace/api-client-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Trash2, Search, ChevronLeft, ChevronRight, FileText, Plus, Download } from "lucide-react";

export default function AdminKeywords() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [selectedKws, setSelectedKws] = useState<Set<string>>(new Set());
  const [addResult, setAddResult] = useState<{ added: number; duplicates: number; total: number } | null>(null);
  const [tab, setTab] = useState<"list" | "add">("list");

  const limit = 50;

  const { data: stats, isLoading: loadingStats } = useGetKeywordsStats();
  const { data, isLoading } = useListKeywords(
    { page, limit, search: search || undefined },
  );

  const addMut = useAddKeywords({
    mutation: {
      onSuccess: (res) => {
        setAddResult(res);
        setBulkText("");
        qc.invalidateQueries({ queryKey: getListKeywordsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetKeywordsStatsQueryKey() });
        setPage(1);
      },
    },
  });

  const deleteMut = useDeleteKeywords({
    mutation: {
      onSuccess: () => {
        setSelectedKws(new Set());
        qc.invalidateQueries({ queryKey: getListKeywordsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetKeywordsStatsQueryKey() });
      },
    },
  });

  const keywords = data?.keywords ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const toggleSelect = (name: string) => {
    setSelectedKws(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedKws.size === keywords.length) {
      setSelectedKws(new Set());
    } else {
      setSelectedKws(new Set(keywords.map(k => k.name)));
    }
  };

  const handleDelete = () => {
    if (selectedKws.size === 0) return;
    if (!confirm(`Delete ${selectedKws.size} keyword(s)?`)) return;
    deleteMut.mutate({ keywords: Array.from(selectedKws) });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    setAddResult(null);
    addMut.mutate({ text: bulkText });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBulkText((prev) => (prev ? prev + "\n" : "") + (ev.target?.result as string));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const lineCount = bulkText ? bulkText.split("\n").filter(l => l.trim()).length : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Keyword Manager</h1>
              <p className="text-gray-500 text-sm mt-1">
                {loadingStats ? "Loading..." : `${stats?.total?.toLocaleString() ?? 0} keywords total`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setTab("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "list" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400"}`}
              >
                <FileText className="w-4 h-4 inline mr-1.5" />
                Keyword List
              </button>
              <button
                onClick={() => setTab("add")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "add" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400"}`}
              >
                <Plus className="w-4 h-4 inline mr-1.5" />
                Add Keywords
              </button>
            </div>
          </div>

          {tab === "add" && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Add Keywords in Bulk</h2>
              <p className="text-sm text-gray-500 mb-4">Enter one keyword per line. Supports millions of keywords. You can also upload a .txt file.</p>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={bulkText}
                    onChange={e => setBulkText(e.target.value)}
                    placeholder={"Sunset Wallpaper\nNature Photography\nAbstract Art\n..."}
                    className="w-full border border-gray-200 rounded-lg p-4 text-sm font-mono h-64 resize-y outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  {lineCount > 0 && (
                    <span className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-1">
                      {lineCount.toLocaleString()} keywords
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-400 cursor-pointer transition-colors bg-white">
                    <Upload className="w-4 h-4" />
                    Upload .txt File
                    <input type="file" accept=".txt,text/plain" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    type="submit"
                    disabled={!bulkText.trim() || addMut.isPending}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {addMut.isPending ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><Plus className="w-4 h-4" /> Add Keywords</>
                    )}
                  </button>

                  {bulkText && (
                    <button
                      type="button"
                      onClick={() => { setBulkText(""); setAddResult(null); }}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              {addResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium text-sm">
                    Added {addResult.added.toLocaleString()} keywords
                    {addResult.duplicates > 0 && ` (${addResult.duplicates.toLocaleString()} duplicates skipped)`}.
                    Total: {addResult.total.toLocaleString()} keywords.
                  </p>
                </div>
              )}

              {addMut.isError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">Failed to add keywords. Please try again.</p>
                </div>
              )}
            </div>
          )}

          {tab === "list" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-sm border border-gray-200 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search keywords..."
                    className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                  />
                </form>

                {selectedKws.size > 0 && (
                  <button
                    onClick={handleDelete}
                    disabled={deleteMut.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete {selectedKws.size} selected
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : keywords.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No keywords found</p>
                  <p className="text-sm mt-1">Add some keywords using the "Add Keywords" tab</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-4 py-3 w-10">
                            <input
                              type="checkbox"
                              checked={selectedKws.size === keywords.length && keywords.length > 0}
                              onChange={selectAll}
                              className="rounded"
                            />
                          </th>
                          <th className="px-4 py-3">Keyword</th>
                          <th className="px-4 py-3">Slug</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {keywords.map((kw) => (
                          <tr
                            key={kw.slug}
                            className={`hover:bg-gray-50 transition-colors ${selectedKws.has(kw.name) ? "bg-blue-50" : ""}`}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedKws.has(kw.name)}
                                onChange={() => toggleSelect(kw.name)}
                                className="rounded"
                              />
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800">{kw.name}</td>
                            <td className="px-4 py-3 text-gray-400 font-mono text-xs">/{kw.slug}</td>
                            <td className="px-4 py-3 text-right">
                              <a
                                href={`/${kw.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 rounded border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-2">Page {page} / {totalPages.toLocaleString()}</span>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1.5 rounded border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
