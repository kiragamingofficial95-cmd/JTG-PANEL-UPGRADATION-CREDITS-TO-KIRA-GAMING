import React, { useState } from "react";
import { Code2, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Extension } from "../types";

export default function DeveloperPortal() {
  const [manifest, setManifest] = useState("");
  const [status, setStatus] = useState<"idle" | "validating" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleValidate = async () => {
    setStatus("validating");
    try {
      const parsed = JSON.parse(manifest);
      const required = ["id", "name", "version", "description", "author", "compatibility"];
      const missing = required.filter((field) => !parsed[field]);

      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
      }

      setStatus("success");
      setMessage("Manifest is valid! You can now publish your extension.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Invalid JSON format");
    }
  };

  const handlePublish = async () => {
    try {
      const extension: Extension = JSON.parse(manifest);
      extension.downloads = 0;
      extension.rating = 0;
      extension.reviews = 0;
      extension.releaseDate = new Date().toISOString();
      extension.status = "published";

      const res = await fetch("/api/v1/extensions/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extension),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Extension published successfully!");
      } else {
        throw new Error("Failed to publish extension");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Publishing failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Code2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-4">Developer Portal</h1>
        <p className="text-slate-400 text-lg">
          Publish and manage your JTG Blueprint extensions
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Publish Extension</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-400 mb-2">
            Manifest (blueprint.json)
          </label>
          <textarea
            value={manifest}
            onChange={(e) => setManifest(e.target.value)}
            placeholder='{"id": "my-extension", "name": "My Extension", ...}'
            className="w-full h-64 bg-slate-900 border border-slate-600 rounded-xl p-4 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-xl mb-6 ${
              status === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleValidate}
            disabled={!manifest || status === "validating"}
            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Validate Manifest
          </button>
          <button
            onClick={handlePublish}
            disabled={status !== "success"}
            className="bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Publish Extension
          </button>
        </div>
      </div>

      <div className="mt-12 bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Start Guide</h2>

        <ol className="space-y-4 text-slate-300">
          <li className="flex gap-3">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </span>
            <div>
              <strong className="text-white">Create your extension:</strong>
              <code className="block mt-1 bg-slate-900 px-3 py-2 rounded text-sm">
                npx jtg-blueprint create my-extension
              </code>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </span>
            <div>
              <strong className="text-white">Develop your extension:</strong>
              <p className="mt-1 text-slate-400">
                Edit the backend and frontend files in the generated structure.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </span>
            <div>
              <strong className="text-white">Build and publish:</strong>
              <code className="block mt-1 bg-slate-900 px-3 py-2 rounded text-sm">
                npx jtg-blueprint build && npx jtg-blueprint publish
              </code>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
