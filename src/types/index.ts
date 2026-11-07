export interface SystemRequirements {
  os?: string;
  processor?: string;
  memory?: string;
  graphics?: string;
  storage?: string;
  directx?: string;
}

export interface AuthorizedLink {
  platform: 'Steam' | 'Epic Games' | 'GOG' | 'itch.io' | 'PlayStation' | 'Xbox' | 'Nintendo' | 'Official Website' | 'Direct Download';
  url: string;
  label?: string;
  isDirectDownload?: boolean; // ONLY if developer authorized
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  bannerUrl?: string;
  screenshots?: string[];
  developer: string;
  developerSlug?: string;
  publisher?: string;
  releaseDate: string;
  rating?: number;
  categories: string[];
  featured?: boolean;
  platforms?: ('PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'macOS' | 'Linux' | 'Mobile')[];
  gameplayModes?: ('Single-player' | 'Multiplayer' | 'Co-op' | 'Cross-platform' | 'Online PvP')[];
  systemRequirements?: {
    minimum?: SystemRequirements;
    recommended?: SystemRequirements;
  };
  officialWebsite?: string;
  authorizedLinks?: AuthorizedLink[];
  accessibilityFeatures?: string[];
  isRwandanOrAfrican?: boolean;
  editorialCollections?: ('hidden-gems' | 'best-indie' | 'free-to-play' | 'story-driven' | 'multiplayer' | 'low-spec')[];
  verificationStatus: 'verified' | 'community' | 'pending';
  downloadUrl?: string; // Kept for backward compatibility with 1.0 records
  downloadLinks?: { name: string; url: string; size?: string }[]; // Preserved
  createdAt: string;
  updatedAt: string;
}

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  bio: string;
  location: string;
  country: string;
  isAfrican: boolean;
  isRwandan: boolean;
  website?: string;
  socialLinks?: { platform: string; url: string }[];
  gamesCount?: number;
  featured?: boolean;
  verified: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  title: string;
  developer: string;
  developerEmail: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  screenshots?: string[];
  categories: string[];
  platforms: string[];
  releaseDate?: string;
  officialWebsite?: string;
  authorizedLinks?: AuthorizedLink[];
  systemRequirements?: {
    minimum?: SystemRequirements;
    recommended?: SystemRequirements;
  };
  accessibilityFeatures?: string[];
  isAfricanDeveloper?: boolean;
  location?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface UserSession {
  username: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

