import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { RegistryService } from "./api/registry.js";
import { Extension } from "./types/index.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
await RegistryService.initialize();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/v1/stats", async (req, res) => {
  try {
    const stats = await RegistryService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve stats" });
  }
});

app.get("/api/v1/extensions", async (req, res) => {
  try {
    const { search, category, tag } = req.query;
    const extensions = await RegistryService.listExtensions(
      search as string,
      category as string,
      tag as string
    );
    res.json(extensions);
  } catch (error) {
    res.status(500).json({ error: "Failed to list extensions" });
  }
});

app.get("/api/v1/extensions/:id", async (req, res) => {
  try {
    const extension = await RegistryService.getExtension(req.params.id);
    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }
    res.json(extension);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch extension" });
  }
});

app.post("/api/v1/keys/generate", async (req, res) => {
  try {
    const { extensionId, version } = req.body;
    if (!extensionId || !version) {
      return res.status(400).json({ error: "extensionId and version are required" });
    }

    const key = RegistryService.generateKey(extensionId, version);
    res.json(key);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Failed to generate key" });
  }
});

app.post("/api/v1/keys/validate", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: "Key is required" });
    }

    const validation = await RegistryService.validateKey(key);
    res.json(validation);
  } catch (error) {
    res.status(400).json({ error: "Failed to validate key" });
  }
});

app.post("/api/v1/keys/redeem", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: "Key is required" });
    }

    const redeemData = await RegistryService.redeemKey(key);
    if (!redeemData) {
      return res.status(400).json({ error: "Invalid or already redeemed key" });
    }

    res.json(redeemData);
  } catch (error) {
    res.status(400).json({ error: "Failed to redeem key" });
  }
});

app.post("/api/v1/extensions/publish", async (req, res) => {
  try {
    const extension: Extension = req.body;
    const published = await RegistryService.publishExtension(extension);
    res.json(published);
  } catch (error) {
    res.status(500).json({ error: "Failed to publish extension" });
  }
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const server = app.listen(PORT, () => {
  console.log(`JTG Blueprint Registry running on http://localhost:${PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port or stop the conflicting service.`);
    process.exit(1);
  }
  console.error('Server error:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
