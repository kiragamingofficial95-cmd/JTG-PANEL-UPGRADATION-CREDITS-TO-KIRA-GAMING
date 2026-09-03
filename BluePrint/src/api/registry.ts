import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import fs from "fs-extra";
import path from "path";
import { Extension, ExtensionKey, KeyValidationResponse, KeyRedeemResponse } from "../types/index.js";

const REGISTRY_DATA_DIR = path.join(process.cwd(), ".registry-data");
const KEYS_EXPIRY_HOURS = 24;

export class RegistryService {
  private static extensions: Extension[] = [];
  private static keys: ExtensionKey[] = [];

  static async initialize() {
    await fs.ensureDir(REGISTRY_DATA_DIR);
    await this.loadData();
  }

  private static async loadData() {
    const extensionsFile = path.join(REGISTRY_DATA_DIR, "extensions.json");
    const keysFile = path.join(REGISTRY_DATA_DIR, "keys.json");

    if (await fs.pathExists(extensionsFile)) {
      this.extensions = await fs.readJSON(extensionsFile);
    } else {
      this.extensions = this.getDefaultExtensions();
      await fs.writeJSON(extensionsFile, this.extensions, { spaces: 2 });
    }

    if (await fs.pathExists(keysFile)) {
      this.keys = await fs.readJSON(keysFile);
    }
  }

  private static async saveData() {
    const extensionsFile = path.join(REGISTRY_DATA_DIR, "extensions.json");
    const keysFile = path.join(REGISTRY_DATA_DIR, "keys.json");
    await fs.writeJSON(extensionsFile, this.extensions, { spaces: 2 });
    await fs.writeJSON(keysFile, this.keys, { spaces: 2 });
  }

  private static getDefaultExtensions(): Extension[] {
    return [
      {
        id: "hello-jtg",
        name: "Hello JTG",
        version: "1.0.0",
        description: "Official example extension demonstrating Blueprint capabilities.",
        author: {
          name: "JTG Team",
          email: "dev@jtgpanel.com",
          url: "https://github.com/kiragamingofficial95-cmd",
        },
        icon: "Sparkles",
        category: "utilities",
        tags: ["example", "demo", "starter"],
        license: "MIT",
        compatibility: {
          jtg_panel: ">=2.0.0",
          blueprint: ">=1.0.0",
        },
        downloads: 1250,
        rating: 4.8,
        reviews: 42,
        homepage: "https://blueprint.jtgpanel.com/extensions/hello-jtg",
        repository: "https://github.com/kiragamingofficial95-cmd/jtg-blueprint-hello",
        releaseDate: new Date().toISOString(),
        status: "published",
      },
    ];
  }

  static async listExtensions(search?: string, category?: string, tag?: string): Promise<Extension[]> {
    let results = this.extensions;

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category) {
      results = results.filter((e) => e.category === category);
    }

    if (tag) {
      results = results.filter((e) => e.tags.includes(tag));
    }

    return results.filter((e) => e.status === "published");
  }

  static async getExtension(id: string): Promise<Extension | null> {
    return this.extensions.find((e) => e.id === id && e.status === "published") || null;
  }

  static generateKey(extensionId: string, version: string): ExtensionKey {
    const ext = this.extensions.find((e) => e.id === extensionId);
    if (!ext) throw new Error(`Extension ${extensionId} not found`);

    const randomHex = crypto.randomBytes(32).toString("hex");
    const key = `jtg_key_${extensionId}_${version}_${randomHex}`;

    const extensionKey: ExtensionKey = {
      id: uuidv4(),
      key,
      extensionId,
      version,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + KEYS_EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
      redeemed: false,
    };

    this.keys.push(extensionKey);
    this.saveData();
    return extensionKey;
  }

  static async validateKey(key: string): Promise<KeyValidationResponse> {
    const extKey = this.keys.find((k) => k.key === key);

    if (!extKey) {
      return { valid: false, message: "Invalid extension key" };
    }

    if (new Date(extKey.expiresAt) < new Date()) {
      return { valid: false, message: "Extension key has expired" };
    }

    const ext = this.extensions.find((e) => e.id === extKey.extensionId);
    if (!ext) {
      return { valid: false, message: "Associated extension not found" };
    }

    return {
      valid: true,
      extension: ext,
      permissions: ["servers.read", "settings.read"],
    };
  }

  static async redeemKey(key: string): Promise<KeyRedeemResponse | null> {
    const extKey = this.keys.find((k) => k.key === key);

    if (!extKey || extKey.redeemed) {
      return null;
    }

    extKey.redeemed = true;
    extKey.redeemedAt = new Date().toISOString();

    const ext = this.extensions.find((e) => e.id === extKey.extensionId);
    if (!ext) return null;

    const sha256 = crypto.randomBytes(32).toString("hex");
    const packageUrl = `https://blueprint.jtgpanel.com/api/v1/packages/${extKey.extensionId}-${extKey.version}.blueprint`;

    await this.saveData();

    return {
      packageUrl,
      sha256,
      expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
  }

  static async publishExtension(extension: Extension): Promise<Extension> {
    const existingIdx = this.extensions.findIndex((e) => e.id === extension.id && e.version === extension.version);

    if (existingIdx >= 0) {
      this.extensions[existingIdx] = extension;
    } else {
      this.extensions.push(extension);
    }

    await this.saveData();
    return extension;
  }

  static async getStats() {
    const published = this.extensions.filter((e) => e.status === "published");
    const totalDownloads = published.reduce((sum, e) => sum + e.downloads, 0);

    return {
      totalExtensions: published.length,
      totalDownloads,
      registeredDevelopers: new Set(published.map((e) => e.author.email)).size,
      lastUpdated: new Date().toISOString(),
    };
  }
}
