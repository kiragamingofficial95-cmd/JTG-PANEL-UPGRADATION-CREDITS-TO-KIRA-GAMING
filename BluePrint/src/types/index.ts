export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: {
    name: string;
    email: string;
    url?: string;
  };
  icon?: string;
  category: string;
  tags: string[];
  license?: string;
  compatibility: {
    jtg_panel: string;
    blueprint: string;
  };
  downloads: number;
  rating: number;
  reviews: number;
  homepage?: string;
  repository?: string;
  packageUrl?: string;
  sha256?: string;
  releaseDate: string;
  status: "published" | "draft" | "deprecated";
}

export interface ExtensionKey {
  id: string;
  key: string;
  extensionId: string;
  version: string;
  generatedAt: string;
  expiresAt: string;
  redeemed: boolean;
  redeemedAt?: string;
  redeemedBy?: string;
}

export interface RegistryStats {
  totalExtensions: number;
  totalDownloads: number;
  registeredDevelopers: number;
  lastUpdated: string;
}

export interface KeyValidationResponse {
  valid: boolean;
  extension?: Extension;
  permissions?: string[];
  message?: string;
}

export interface KeyRedeemResponse {
  packageUrl: string;
  sha256: string;
  expires: string;
}
