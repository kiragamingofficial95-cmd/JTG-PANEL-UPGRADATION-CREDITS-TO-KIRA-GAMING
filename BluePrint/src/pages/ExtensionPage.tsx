import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Star, ExternalLink, Copy, Check, Package, Sparkles } from "lucide-react";
import { Extension } from "../types";

export default function ExtensionPage() {
  const { id } = useParams<{ id: string }>();
  const [extension, setExtension] = useState<Extension | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchExtension() {
      try {
        const res = await fetch(`/api/v1/extensions/${id}`);
        const data = await res.json();
        setExtension(data);
      } catch (error) {
        console.error("Failed to fetch extension:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchExtension();
  }, [id]);

  const handleGetKey = async () => {
    if (!extension) return;
    try {
      const res = await fetch("/api/v1/keys/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extensionId: extension.id, version: extension.version }),
      });
      const data = await res.json();
      setKey(data.key);
    } catch (error) {
      console.error("Failed to generate key:", error);
    }
  };

  const handleCopy = () => {
    if (key) {
      navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400">
        Loading extension...
      </div>
    );
  }

  if (!extension) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Extension Not Found</h1>
        <Link to="/" className="text-blue-400 hover:underline">
          ← Back to extensions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to extensions
      </Link>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{extension.name}</h1>
            <p className="text-slate-400 mb-4">{extension.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full">v{extension.version}</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Download className="w-4 h-4" />
                {extension.downloads} downloads
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Star className="w-4 h-4 text-yellow-400" />
                {extension.rating.toFixed(1)} ({extension.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Author</h3>
            <p className="text-white">{extension.author.name}</p>
            {extension.author.url && (
              <a href={extension.author.url} className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                {extension.author.url}
              </a>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Category</h3>
            <p className="text-white capitalize">{extension.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">License</h3>
            <p className="text-white">{extension.license || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Compatibility</h3>
            <p className="text-white">JTG Panel {extension.compatibility.jtg_panel}</p>
          </div>
        </div>

        {extension.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {extension.tags.map((tag) => (
                <span key={tag} className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-700 pt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Install Extension</h3>

          {!key ? (
            <button
              onClick={handleGetKey}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Get Extension Key
            </button>
          ) : (
            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-sm text-slate-400 mb-3">
                Copy this key and paste it in your JTG Panel Admin Settings → Blueprint Extensions:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-200 font-mono break-all">
                  {key}
                </code>
                <button
                  onClick={handleCopy}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                This key expires in 24 hours and can only be used once.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
