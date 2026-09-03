import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Package, Home, Code2, Search, Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">JTG Blueprint</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link to="/developer" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                <Code2 className="w-4 h-4" />
                Developer Portal
              </Link>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  to="/developer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Code2 className="w-4 h-4" />
                  Developer Portal
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-slate-900 border-t border-slate-700 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>JTG Blueprint Registry v1.0.0 — © 2026 JTG Gaming</p>
        </div>
      </footer>
    </div>
  );
}
