import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Download, Star, Package, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { Extension } from "../types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  utilities: <Sparkles className="w-5 h-5" />,
  integrations: <Globe className="w-5 h-5" />,
  monitoring: <Zap className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  gaming: <Package className="w-5 h-5" />,
};

export default function Home() {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalExtensions: 0, totalDownloads: 0, registeredDevelopers: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const [extRes, statsRes] = await Promise.all([
          fetch("/api/v1/extensions"),
          fetch("/api/v1/stats"),
        ]);
        const extData = await extRes.json();
        const statsData = await statsRes.json();
        setExtensions(extData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredExtensions = extensions.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Extend Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">JTG Panel</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Discover, install, and publish extensions for the JTG Game Server Management Panel
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search extensions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-white">{stats.totalExtensions}</div>
              <div className="text-slate-400">Extensions</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</div>
              <div className="text-slate-400">Downloads</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-white">{stats.registeredDevelopers}</div>
              <div className="text-slate-400">Developers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Available Extensions</h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading extensions...</div>
        ) : filteredExtensions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No extensions found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExtensions.map((ext) => (
              <Link
                key={ext.id}
                to={`/extensions/${ext.id}`}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    {CATEGORY_ICONS[ext.category] || <Package className="w-6 h-6" />}
                  </div>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                    v{ext.version}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition">
                  {ext.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{ext.description}</p>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {ext.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {ext.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {ext.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
