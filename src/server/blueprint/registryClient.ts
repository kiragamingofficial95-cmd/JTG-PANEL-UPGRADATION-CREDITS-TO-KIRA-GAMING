import crypto from "crypto";
import fs from "fs-extra";
import path from "path";
import axios from "axios";
import { BlueprintManifest } from "./types.js";

export interface KeyValidationResult {
  valid: boolean;
  key: string;
  extensionId?: string;
  extensionName?: string;
  version?: string;
  description?: string;
  author?: {
    name: string;
    url?: string;
  };
  icon?: string;
  compatibility?: {
    jtg_panel: string;
    blueprint: string;
  };
  permissions?: string[];
  packageUrl?: string;
  checksum?: string;
  error?: string;
}

export class RegistryClient {
  private registryUrl: string;

  constructor(registryUrl = process.env.BLUEPRINT_REGISTRY_URL || "https://blueprint.jtgpanel.com") {
    this.registryUrl = registryUrl.replace(/\/$/, "");
  }

  setRegistryUrl(url: string) {
    this.registryUrl = url.replace(/\/$/, "");
  }

  getRegistryUrl(): string {
    return this.registryUrl;
  }

  /**
   * Validate an extension key with the Registry without downloading the package yet.
   */
  async validateKey(key: string): Promise<KeyValidationResult> {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      return { valid: false, key, error: "Extension key cannot be empty." };
    }

    try {
      // Call registry endpoint
      const response = await axios.post(
        `${this.registryUrl}/api/v1/keys/validate`,
        { key: trimmedKey },
        { timeout: 15000 }
      );

      if (response.data && response.data.valid) {
        return {
          valid: true,
          key: trimmedKey,
          extensionId: response.data.extensionId,
          extensionName: response.data.extensionName || response.data.name,
          version: response.data.version,
          description: response.data.description,
          author: response.data.author,
          icon: response.data.icon,
          compatibility: response.data.compatibility,
          permissions: response.data.permissions || [],
          packageUrl: response.data.packageUrl,
          checksum: response.data.checksum,
        };
      }

      return {
        valid: false,
        key: trimmedKey,
        error: response.data?.error || "Invalid extension key.",
      };
    } catch (err: any) {
      // If offline/fallback simulation mode for test keys
      if (trimmedKey.startsWith("jtg_key_demo_") || trimmedKey.startsWith("jtg_key_hello_")) {
        return {
          valid: true,
          key: trimmedKey,
          extensionId: "hello-jtg",
          extensionName: "Hello JTG",
          version: "1.0.0",
          description: "Official example extension demonstrating JTG Blueprint capabilities.",
          author: { name: "JTG Team", url: "https://github.com/kiragamingofficial95-cmd" },
          icon: "Sparkles",
          compatibility: { jtg_panel: ">=2.0.0", blueprint: ">=1.0.0" },
          permissions: ["servers.read", "settings.read"],
        };
      }

      return {
        valid: false,
        key: trimmedKey,
        error: err.response?.data?.error || err.message || "Failed to reach Blueprint Registry.",
      };
    }
  }

  /**
   * Redeem the key and download package archive to a temporary file.
   */
  async downloadPackage(key: string, targetPath: string): Promise<{ checksum: string; manifest?: BlueprintManifest }> {
    const trimmedKey = key.trim();

    const response = await axios.post(
      `${this.registryUrl}/api/v1/keys/redeem`,
      { key: trimmedKey },
      { responseType: "arraybuffer", timeout: 30000 }
    );

    const buffer = Buffer.from(response.data);
    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

    await fs.ensureDir(path.dirname(targetPath));
    await fs.writeFile(targetPath, buffer);

    return { checksum };
  }

  /**
   * Verify SHA-256 integrity of a file.
   */
  static verifyChecksum(filePath: string, expectedChecksum: string): boolean {
    if (!expectedChecksum) return true;
    const fileBuffer = fs.readFileSync(filePath);
    const actualChecksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");
    return actualChecksum.toLowerCase() === expectedChecksum.toLowerCase();
  }
}
